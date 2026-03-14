import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Star, ChevronRight, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const ExplorePage = () => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await API.get('/explore');
        setDestinations(res.data);
      } catch (err) {
        console.error('Explore error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  if (isLoading) return (
     <div className="h-full flex items-center justify-center p-20">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Explore the World</h1>
        <p className="text-slate-500 text-lg font-medium">Trending destinations personally curated for your vibe</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((dest) => (
          <div 
            key={dest.id} 
            onClick={() => navigate(`/explore/${dest.name}`)}
            className="group cursor-pointer relative h-[400px] rounded-[40px] overflow-hidden shadow-2xl shadow-blue-900/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-blue-900/20"
          >
            <img 
              src={dest.image} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              alt={dest.name} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="flex items-center gap-2 mb-2 bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/10">
                <MapPin size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{dest.country}</span>
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-4">{dest.name}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-blue-600 px-3 py-1 rounded-xl">
                   <Star className="fill-white" size={12} />
                   <span className="text-xs font-black">{dest.rating}</span>
                </div>
                <button className="bg-white text-slate-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
