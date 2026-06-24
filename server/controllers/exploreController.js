import { prisma } from '../index.js';
import axios from 'axios';

export const getPopularDestinations = async (req, res) => {
  try {
    // In production, this might come from a curated list or trending DB
    const destinations = [
      { id: '1', name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', rating: 4.8 },
      { id: '2', name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf', rating: 4.9 },
      { id: '3', name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4', rating: 4.7 }
    ];
    res.status(200).json(destinations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
};

export const getDestinationDetail = async (req, res) => {
  try {
    const { id } = req.params;
    // Mocking detail logic
    res.status(200).json({ id, name: 'Paris', description: 'The city of light' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch destination detail' });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const { destination } = req.params;
    
    // Fetch from Unsplash helper (to be implemented) or mock
    const recommendations = [
      { id: '1', name: 'Eiffel Tower', type: 'Sights', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', rating: 4.9, price: 25 },
      { id: '2', name: 'Louvre Museum', type: 'Culture', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', rating: 4.8, price: 20 },
      { id: '3', name: 'Seine River Cruise', type: 'Experience', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', rating: 4.7, price: 15 }
    ];
    
    res.status(200).json(recommendations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};
