import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, MapPin, Calendar, Clock, Loader2, Sparkles } from 'lucide-react';
import API from '../services/api';

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Mocking for development
        setTimeout(() => {
          setWeatherData({
            city: 'Paris',
            temp: 22,
            condition: 'Partly Cloudy',
            humidity: 45,
            wind: 12,
            forecast: [
              { day: 'Mon', temp: 21, condition: 'Sun' },
              { day: 'Tue', temp: 19, condition: 'Rain' },
              { day: 'Wed', temp: 23, condition: 'Cloud' },
              { day: 'Thu', temp: 25, condition: 'Sun' },
              { day: 'Fri', temp: 22, condition: 'CloudSun' }
            ]
          });
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error('Weather error:', err);
      }
    };
    fetchWeather();
  }, []);

  if (isLoading) return (
    <div className="h-full flex flex-col items-center justify-center p-20">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
      <p className="text-slate-500 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Syncing with satellites...</p>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Weather Forecast</h1>
        <p className="text-slate-500 mt-1 font-medium">Real-time conditions for your upcoming destinations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* MAIN CARD */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
           <div className="absolute top-0 right-0 p-10 opacity-10">
              <Sun size={200} />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md w-fit px-4 py-1.5 rounded-xl border border-white/10 mb-8">
                <MapPin size={16} />
                <span className="text-sm font-bold tracking-tight">{weatherData.city}, France</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-8xl font-black">{weatherData.temp}°</h2>
                  <p className="text-2xl font-bold mt-2 opacity-90">{weatherData.condition}</p>
                </div>
                <div className="text-right">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="flex flex-col items-center">
                        <Wind className="opacity-60 mb-2" />
                        <span className="text-lg font-bold">{weatherData.wind} <span className="text-xs opacity-60">km/h</span></span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Thermometer className="opacity-60 mb-2" />
                        <span className="text-lg font-bold">{weatherData.humidity}<span className="text-xs opacity-60">%</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* SIDE TIPS */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
             <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <Sparkles size={20} />
             </div>
             <h3 className="text-lg font-bold text-slate-900 tracking-tight">Travel Guide</h3>
           </div>
           
           <div className="space-y-6">
              {[
                { title: 'Packing Tip', text: 'Light layers recommended for the mild Paris evening breeze.' },
                { title: 'Activity Alert', text: 'Perfect conditions for a Seine river cruise or terrace dining.' },
                { title: 'Photo Tip', text: 'Soft diffused light today is great for monument photography.' }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4">
                   <div className="w-1.5 h-auto bg-slate-100 rounded-full" />
                   <div>
                     <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">{tip.title}</h4>
                     <p className="text-sm text-slate-600 font-medium leading-relaxed">{tip.text}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* FORECAST */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-8 px-2">5-Day Forecast</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {weatherData.forecast.map((f, i) => (
            <div key={i} className="flex flex-col items-center p-6 rounded-[24px] hover:bg-slate-50 transition-all cursor-pointer group border border-transparent hover:border-slate-100">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 group-hover:text-slate-600 transition-colors">{f.day}</span>
               <div className="mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  {f.condition === 'Sun' ? <Sun size={32} /> : f.condition === 'Rain' ? <CloudRain size={32} /> : <Cloud size={32} />}
               </div>
               <span className="text-xl font-black text-slate-800">{f.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
