import { prisma } from '../index.js';
import fs from 'fs/promises';
import path from 'path';
import { ItinerarySchema } from '../utils/schemas.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const callOpenRouter = async (messages, model = "google/gemini-2.0-flash-001") => {
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === "YOUR_OPENROUTER_API_KEY_HERE") {
    throw new Error("OPENROUTER_API_KEY is not defined or is a placeholder");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://trippygo.com", // Optional, for OpenRouter rankings
      "X-Title": "TrippyGo", // Optional, for OpenRouter rankings
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      messages: messages
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

export const chat = async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    await prisma.message.create({
      data: { conversationId, role: 'user', content: message }
    });

    const text = await callOpenRouter([{ role: "user", content: message }]);

    const assistantMsg = await prisma.message.create({
      data: { conversationId, role: 'assistant', content: text }
    });

    res.status(200).json(assistantMsg);
  } catch (err) {
    console.error('AI Chat Error:', err);
    res.status(500).json({ error: 'AI failed to respond', details: err.message });
  }
};

export const extractIntent = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const prompt = `Analyze: "${message}". JSON extract: { "destination": "City, Country", "duration_days": number, "start_date": "YYYY-MM-DD or null", "group_size": number, "interests": [], "budget_total": number, "budget_currency": "USD", "travel_style": "mid-range", "is_ambiguous": boolean, "clarification_question": "string" }. If missing critical info (destination/duration), set is_ambiguous: true. ONLY JSON.`;

    const text = await callOpenRouter([{ role: "user", content: prompt }]);
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON found in AI response');
    
    const intent = JSON.parse(jsonMatch[0]);
    res.status(200).json(intent);
  } catch (err) {
    console.error('Extract Intent Error:', err.message);
    res.status(500).json({ error: 'Failed to parse travel intent', details: err.message });
  }
};

export const generateTrip = async (req, res) => {
  try {
    const { intent } = req.body;
    const catalogPath = path.join(__dirname, '../data/catalog.json');
    const catalogData = JSON.parse(await fs.readFile(catalogPath, 'utf8'));
    const destinationData = catalogData.destinations.find(d => d.city.toLowerCase() === intent.destination.split(',')[0].trim().toLowerCase());

    if (!destinationData) return res.status(404).json({ error: `Destination ${intent.destination} not supported.` });

    const itemsToUse = destinationData.items;

    const prompt = `Create a ${intent.duration_days}-day travel itinerary for ${intent.destination} using ONLY these catalog items: ${JSON.stringify(itemsToUse)}. Constraints: Max 4 activities per day. Return ONLY a JSON array matching This structure: [ { "day": number, "theme": "string", "items": [{ "name": "string", "type": "string", "start_time": "HH:MM", "end_time": "HH:MM", "instaworthy_score": number, "photoTip": "string", "price": number, "location": "string" }] } ]`;

    const text = await callOpenRouter([{ role: "user", content: prompt }]);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No valid JSON array found for itinerary');

    let itinerary = ItinerarySchema.parse(JSON.parse(jsonMatch[0]));

    const trip = await prisma.trip.create({
      data: {
        userId: req.userId,
        title: `Trip to ${intent.destination}`,
        destination: intent.destination,
        budget: intent.budget_total || 0,
        days: {
          create: itinerary.map(day => ({
            dayNumber: day.day, theme: day.theme,
            items: { create: day.items.map(item => ({ type: item.type, name: item.name, startTime: item.start_time, endTime: item.end_time, price: item.price || 0, location: item.location, instaScore: item.instaworthy_score, photoTip: item.photoTip })) }
          }))
        }
      },
      include: { days: { include: { items: true } } }
    });

    res.status(201).json(trip);
  } catch (err) {
    console.error('Generate Trip Error:', err);
    res.status(500).json({ error: 'Failed to generate trip', details: err.message });
  }
};

export const refineTrip = async (req, res) => {
  try {
    const { tripId, prompt: userPrompt } = req.body;
    const trip = await prisma.trip.findUnique({ where: { id: tripId }, include: { days: { include: { items: true } } } });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const catalogPath = path.join(__dirname, '../data/catalog.json');
    const catalogData = JSON.parse(await fs.readFile(catalogPath, 'utf8'));
    const destinationData = catalogData.destinations.find(d => d.city.toLowerCase() === trip.destination.split(',')[0].trim().toLowerCase());
    const catalogItems = destinationData ? destinationData.items : [];

    const prompt = `Update this itinerary for ${trip.destination}: ${JSON.stringify(trip.days)}. User request: "${userPrompt}". Available items: ${JSON.stringify(catalogItems)}. Return ONLY updated JSON matching ItinerarySchema array.`;

    const text = await callOpenRouter([{ role: "user", content: prompt }]);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No valid JSON found for refinement');

    let updatedItinerary = ItinerarySchema.parse(JSON.parse(jsonMatch[0]));

    const updatedTrip = await prisma.$transaction(async (tx) => {
      await tx.tripDay.deleteMany({ where: { tripId: trip.id } });
      return await tx.trip.update({
        where: { id: trip.id },
        data: {
          days: {
            create: updatedItinerary.map(day => ({
              dayNumber: day.day, theme: day.theme,
              items: { create: day.items.map(item => ({ type: item.type, name: item.name, startTime: item.start_time, endTime: item.end_time, price: item.price || 0, location: item.location, instaScore: item.instaworthy_score, photoTip: item.photoTip })) }
            }))
          }
        },
        include: { days: { include: { items: true } } }
      });
    });

    res.status(200).json(updatedTrip);
  } catch (err) {
    console.error('Refine Trip Error:', err);
    res.status(500).json({ error: 'Failed to refine trip', details: err.message });
  }
};
