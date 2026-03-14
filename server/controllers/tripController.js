import { prisma } from '../index.js';

export const getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: { days: { include: { items: true } } }
    });
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id, userId: req.userId },
      include: { 
        days: { 
          orderBy: { dayNumber: 'asc' },
          include: { items: { orderBy: { sortOrder: 'asc' } } } 
        },
        collaborators: true
      }
    });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
};

export const createTrip = async (req, res) => {
  try {
    const { title, destination, budget, tripType, days } = req.body;
    const trip = await prisma.trip.create({
      data: {
        userId: req.userId,
        title,
        destination,
        budget: parseFloat(budget) || 0,
        tripType,
        days: {
          create: days?.map(day => ({
            dayNumber: day.dayNumber,
            theme: day.theme,
            items: {
              create: day.items?.map(item => ({
                type: item.type,
                name: item.name,
                startTime: item.startTime,
                endTime: item.endTime,
                price: parseFloat(item.price) || 0,
                location: item.location,
                instaScore: item.instaScore
              }))
            }
          }))
        }
      },
      include: { days: { include: { items: true } } }
    });
    res.status(201).json(trip);
  } catch (err) {
    console.error('Create trip error:', err);
    res.status(500).json({ error: 'Failed to create trip' });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { budget, title, status } = req.body;
    const trip = await prisma.trip.update({
      where: { id: req.params.id, userId: req.userId },
      data: { budget, title, status }
    });
    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update trip' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    await prisma.trip.delete({ where: { id: req.params.id, userId: req.userId } });
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete trip' });
  }
};

// --- ACTIVITY MANAGEMENT (STEP 4) ---

export const addActivity = async (req, res) => {
  try {
    const { tripId, dayId } = req.params;
    const activityData = req.body;
    const activity = await prisma.itineraryItem.create({
      data: {
        dayId,
        ...activityData,
        price: parseFloat(activityData.price) || 0
      }
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add activity' });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const activityData = req.body;
    const activity = await prisma.itineraryItem.update({
      where: { id: activityId },
      data: {
        ...activityData,
        price: parseFloat(activityData.price) || 0
      }
    });
    res.status(200).json(activity);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update activity' });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    await prisma.itineraryItem.delete({ where: { id: req.params.activityId } });
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
};
