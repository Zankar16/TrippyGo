import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, Plus, Heart, MapPin, 
  ChevronLeft, ChevronRight, Loader2, Sparkles 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToast } from '../store/uiSlice';
import API from '../services/api';

const RecommendationsPage = () => {
  const { destination } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await API.get(`/explore/${destination}/recommendations`);
        setRecommendations(res.data);
      } catch (err) {
        console.error('Recs error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecs();
  }, [destination]);

  const handleAddToTrip = (rec) => {
    // Logic to add to currentTrip in Redux then post to DB
    dispatch(addToast({ type: 'success', message: `${rec.name} added to your trip!` }));
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
      <p className="text-slate-500 font-medium animate-pulse">Curating the best of {destination}...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Recommendations for {destination}</h1>
          <p className="text-slate-500 mt-1 font-medium">Handpicked spots tailored to your travel DNA</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Navigation Dots */}
          <div className="flex gap-1.5 mr-4">
            {recommendations.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-200'}`}
              />
            ))}
          </div>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft size={20} /></button>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((rec) => (
          <div key={rec.id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-1">
            {/* IMAGE AREA */}
            <div className="relative h-[240px] overflow-hidden">
              <img 
                src={rec.image} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={rec.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm">
                  <Heart size={18} />
                </button>
              </div>

              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-lg px-2.5 py-1 flex items-center gap-1 shadow-sm">
                <Star className="text-yellow-500 fill-yellow-500" size={14} />
                <span className="text-xs font-bold text-slate-800">{rec.rating}</span>
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{rec.name}</h3>
                  <div className="flex items-center gap-1 text-slate-400 mt-1">
                    <MapPin size={14} />
                    <span className="text-xs font-medium">{destination}, {rec.type}</span>
                  </div>
                </div>
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                  <span className="text-xs font-bold">${rec.price}</span>
                </div>
              </div>

              <p className="text-sm text-slate-500 line-clamp-2 mt-3 leading-relaxed">
                Experience the magic of {rec.name}, a must-visit spot known for its incredible atmosphere and {rec.type.toLowerCase()} significance.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button 
                  onClick={() => handleAddToTrip(rec)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add to Trip
                </button>
                <button className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all">
                  <Sparkles size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {recommendations.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
           <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-200">
            <Sparkles className="text-blue-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">No recommendations found</h2>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">Try searching for a different destination or refine your Travel DNA.</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
