import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Star, TrendingUp, Clock, Plus, Filter } from 'lucide-react';
import API from '../services/api';

const NewSpotsPage = () => {
  const [spots, setSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        // In reality, this would be a dedicated endpoint
        const mockSpots = [
          { id: 's1', name: 'Shibuya Crossing Balcony', city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf', instaScore: 98, photoTip: 'Shoot higher for better traffic trails' },
          { id: 's2', name: 'Pink Cafe', city: 'Seoul', country: 'South Korea', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24', instaScore: 95, photoTip: 'Go during the golden hour' },
          { id: 's3', name: 'Cliff Edge Pool', city: 'Uluwatu', country: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4', instaScore: 99, photoTip: 'Wide angle lens works best' }
        ];
        setSpots(mockSpots);
      } catch (err) {
        console.error('Spots error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpots();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New & Trending Spots</h1>
          <p className="text-slate-500 mt-1 font-medium">Discover the most instagrammable places right now</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-200 hover:bg-white transition-all">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {spots.map((spot) => (
          <div key={spot.id} className="group bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500">
            <div className="relative h-[280px]">
              <img src={spot.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={spot.name} />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm border border-white/20">
                <Star className="text-yellow-500 fill-yellow-500" size={16} />
                <span className="text-sm font-black text-slate-800">{spot.instaScore}</span>
              </div>
              <div className="absolute bottom-4 left-4 flex gap-2">
                 <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                   <TrendingUp size={10} /> Trending
                 </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{spot.name}</h3>
                  <div className="flex items-center gap-1 text-slate-400 mt-1">
                    <MapPin size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">{spot.city}, {spot.country}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                 <div className="flex items-center gap-2 text-blue-600 mb-1">
                   <Camera size={14} />
                   <span className="text-[10px] font-black uppercase tracking-[0.1em]">Pro Photo Tip</span>
                 </div>
                 <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{spot.photoTip}"</p>
              </div>

              <button className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-slate-200 hover:shadow-blue-200">
                <Plus size={18} />
                Add to Trip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewSpotsPage;
