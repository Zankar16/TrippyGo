import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Star, MapPin, Search, 
  Sparkles, Plus, Image as ImageIcon, Loader2 
} from 'lucide-react';
import API from '../services/api';

const ExploreDetailPage = () => {
  const { destination } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await API.get(`/explore/${destination}`);
        setData(res.data);
      } catch (err) {
        console.error('Detail error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [destination]);

  if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto py-4">
      <button 
        onClick={() => navigate('/explore')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
      >
        <div className="bg-slate-100 p-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
          <ChevronLeft size={16} />
        </div>
        <span className="text-sm font-bold uppercase tracking-widest">Back to Explore</span>
      </button>

      <div className="relative h-[400px] rounded-[40px] overflow-hidden mb-12 shadow-2xl">
         <img 
          src="https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=1600" 
          className="w-full h-full object-cover" 
          alt={destination}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
         <div className="absolute bottom-12 left-12 right-12 text-white">
            <h1 className="text-6xl font-black tracking-tighter mb-4">{destination}</h1>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                 <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                   <Star className="text-yellow-400 fill-yellow-400" size={20} />
                 </div>
                 <span className="text-xl font-black">4.9 / 5</span>
               </div>
               <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-300" />
                  <span className="text-sm font-bold uppercase tracking-widest">Trending #1</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
           <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About {destination}</h2>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                Paris, France’s capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.
              </p>
           </section>

           <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Recommended Itineraries</h2>
                <button className="text-blue-600 font-bold text-sm hover:underline">View all</button>
              </div>
              <div className="space-y-4">
                 {[1, 2].map((i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-500 transition-all cursor-pointer shadow-sm group">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                           <ImageIcon size={32} />
                         </div>
                         <div>
                            <h4 className="text-lg font-bold text-slate-900">4-Day Cultural Experience</h4>
                            <p className="text-slate-400 text-sm font-medium">By TrippyGo AI • 1.2k saves</p>
                         </div>
                      </div>
                      <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm opacity-0 group-hover:opacity-100 transition-all">
                        Clone Path
                      </button>
                   </div>
                 ))}
              </div>
           </section>
        </div>

        <div className="space-y-8">
           <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-2xl shadow-blue-200">
              <h3 className="text-2xl font-bold mb-4">Ready for {destination}?</h3>
              <p className="text-blue-100 text-sm font-medium leading-relaxed mb-8">
                Let our AI build you a personalized itinerary in seconds.
              </p>
              <button 
                onClick={() => navigate(`/recommendations/${destination}`)}
                className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl shadow-lg hover:shadow-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                 <Sparkles size={18} />
                 Start Planning
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreDetailPage;
