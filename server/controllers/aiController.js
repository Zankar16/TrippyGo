import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from '../index.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chat = async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Save user message
    const userMsg = await prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content: message
      }
    });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // Save assistant message
    const assistantMsg = await prisma.message.create({
      data: {
        conversationId,
        role: 'assistant',
        content: text
      }
    });

    res.status(200).json([userMsg, assistantMsg]);
  } catch (err) {
    console.error('AI Chat Error:', err);
    res.status(500).json({ error: 'AI failed to respond' });
  }
};

export const generateTrip = async (req, res) => {
  try {
    const { destination, days, budget, preferences } = req.body;
    
    const prompt = `Generate a travel itinerary for ${destination} for ${days} days with a budget of ${budget}. 
    Preferences: ${preferences}. 
    Return ONLY a JSON object matching this structure:
    {
      "title": "Trip to ${destination}",
      "destination": "${destination}",
      "budget": ${budget},
      "days": [
        {
          "dayNumber": 1,
          "theme": "Theme name",
          "items": [
            { "type": "activity", "name": "Activity Name", "startTime": "09:00", "endTime": "11:00", "price": 0, "location": "...", "instaScore": 85 }
          ]
        }
      ]
    }`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '');
    const tripData = JSON.parse(text);

    // Create trip in DB
    const trip = await prisma.trip.create({
      data: {
        userId: req.userId,
        title: tripData.title,
        destination: tripData.destination,
        budget: tripData.budget,
        days: {
          create: tripData.days.map(day => ({
            dayNumber: day.dayNumber,
            theme: day.theme,
            items: {
              create: day.items.map(item => ({
                type: item.type,
                name: item.name,
                startTime: item.startTime,
                endTime: item.endTime,
                price: item.price,
                location: item.location,
                instaScore: item.instaScore
              }))
            }
          }))
        }
      },
      include: {
        days: {
          include: { items: true }
        }
      }
    });

    res.status(201).json(trip);
  } catch (err) {
    console.error('Generate Trip Error:', err);
    res.status(500).json({ error: 'Failed to generate trip' });
  }
};

export const refineTrip = async (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
};
