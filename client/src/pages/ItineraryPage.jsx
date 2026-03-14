import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Plane, Hotel, Clock, MapPin, Plus, Settings, 
  Trash2, ChevronDown, Download, Share2, 
  Sparkles, DollarSign, CloudSun
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentTrip, addActivity, removeActivity } from '../store/tripSlice';
import { openModal } from '../store/uiSlice';
import API from '../services/api';

const ItineraryPage = () => {
  const { tripId } = useParams();
  const [activeDay, setActiveDay] = useState(1);
  const [activeTab, setActiveTab ] = useState('plan'); // plan, map, summary
  const [isCreatorMode, setIsCreatorMode] = useState(false); // Should ideally come from shared state
  
  const { currentTrip, isLoading } = useSelector(state => state.trip);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  // Sync isCreatorMode with user profile initially
  useEffect(() => {
    if (user?.creatorMode) {
      setIsCreatorMode(true);
    }
  }, [user]);

  const fetchTrip = async () => {
    try {
      const res = await API.get(`/trips/${tripId}`);
      dispatch(setCurrentTrip(res.data));
    } catch (err) {
      console.error('Fetch trip error:', err);
    }
  };

  const currentDayData = currentTrip?.days?.find(d => d.dayNumber === activeDay);
  
  // Calculate dynamic budget
  const totalSpent = currentTrip?.days?.reduce((sum, day) => {
    return sum + (day.items?.reduce((itemSum, item) => itemSum + (item.price || 0), 0) || 0);
  }, 0) || 0;
  
  const budgetLimit = currentTrip?.budget || 1000;
  const budgetPercentage = Math.min(Math.round((totalSpent / budgetLimit) * 100), 100);
  const budgetStatusColor = budgetPercentage > 90 ? 'bg-red-500' : budgetPercentage > 70 ? 'bg-amber-500' : 'bg-blue-600';

  if (!currentTrip && !isLoading) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
        <Plane className="text-blue-600" size={32} />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">No Itinerary Yet</h1>
      <p className="text-slate-500 text-lg max-w-md mx-auto mb-10 leading-relaxed font-medium">
        Start by telling our AI where you want to go. We'll build a perfect itinerary just for you.
      </p>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-56px-48px)] bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-2xl shadow-blue-900/5">
      
      {/* LEFT PANEL: DAY NAVIGATOR (240px) */}
      <div className="w-[240px] border-r border-slate-100 flex flex-col pt-8 bg-slate-50/50">
        <div className="px-6 mb-6">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Day Plan</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar space-y-2">
          {currentTrip?.days?.map((day) => (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.dayNumber)}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 group flex items-center justify-between
                ${activeDay === day.dayNumber 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1' 
                  : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'}
              `}
            >
              <span>Day {day.dayNumber}</span>
              {activeDay === day.dayNumber && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
            </button>
          ))}
        </div>
        <div className="p-6 mt-auto space-y-3">
          {/* Creator Mode Toggle in Sidebar functionality */}
          <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-2xl border border-indigo-100 mb-2">
               <span className="text-[10px] font-black text-indigo-900 uppercase tracking-tighter">Creator Tools</span>
               <button 
                onClick={() => setIsCreatorMode(!isCreatorMode)}
                className={`w-8 h-4 rounded-full relative transition-all ${isCreatorMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
               >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isCreatorMode ? 'left-4.5' : 'left-0.5'}`} />
               </button>
          </div>
          <button 
            onClick={() => dispatch(openModal({ name: 'customiseTrip' }))}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 shadow-sm hover:shadow-md hover:border-blue-200 transition-all active:scale-[0.98]"
          >
            <Sparkles size={16} className="text-blue-600" />
            Customise
          </button>
        </div>
      </div>

      {/* CENTER PANEL: CONTENT AREA (FLEX-1) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* SUB HEADER - TABS */}
        <div className="px-8 flex items-center justify-between border-b border-slate-100 py-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
             {['plan', 'map', 'summary'].map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                  ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}
                `}
               >
                 {tab}
               </button>
             ))}
          </div>
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 p-2 px-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg text-xs font-semibold">
               <CloudSun size={14} /> Local Weather
             </button>
          </div>
        </div>

        {/* WEATHER ALERT BANNER */}
        {currentTrip?.weatherAlerts?.some(a => a.dayId === currentDayData?.id) && (
          <div className="m-8 mb-0 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-amber-100 p-2 rounded-xl text-amber-600 shrink-0">
              <CloudSun size={20} />
            </div>
            <div className="flex-1">
              <h5 className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Weather Warning: Day {activeDay}</h5>
              <p className="text-xs text-amber-900 font-medium">
                {currentTrip.weatherAlerts.find(a => a.dayId === currentDayData.id).message}
              </p>
            </div>
            <button className="bg-white text-amber-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-amber-100 transition-colors">
              Reschedule AI
            </button>
          </div>
        )}

        {/* DAY ITINERARY ITEMS */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Day {activeDay}: {currentDayData?.theme}</h3>
               <button 
                onClick={() => dispatch(openModal({ name: 'addActivity', data: { dayId: currentDayData?.id } }))}
                className="bg-blue-50 text-blue-600 p-2 px-4 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
               >
                 <Plus size={16} /> Add Activity
               </button>
            </div>

            <div className="space-y-6 relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-100" />

              {currentDayData?.items?.map((item, idx) => (
                <div key={item.id} className="relative pl-12 group">
                  {/* Timeline Dot */}
                  <div className={`absolute left-[20px] top-6 w-3 h-3 rounded-full border-2 border-white z-10 
                    ${item.type === 'flight' ? 'bg-blue-500' : item.type === 'hotel' ? 'bg-purple-500' : 'bg-green-500'}
                  `} />
                  
                  <div className="bg-white border border-slate-200 p-6 rounded-3xl hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl shadow-sm ${
                          item.type === 'flight' ? 'bg-blue-50 text-blue-600' : item.type === 'hotel' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {item.type === 'flight' ? <Plane size={24} /> : item.type === 'hotel' ? <Hotel size={24} /> : <Clock size={24} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.startTime} — {item.endTime}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">{item.type}</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 leading-tight mb-1">{item.name}</h4>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-slate-400">
                              <MapPin size={12} />
                              <span className="text-xs font-medium">{item.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500 font-bold text-xs bg-slate-50 px-2 rounded">
                              <DollarSign size={10} /> {item.price}
                            </div>
                          </div>

                          {/* CREATOR MODE TOOLS */}
                          {isCreatorMode && (
                            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                               <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100">
                                  <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Caption Starter</label>
                                  <p className="text-xs text-indigo-900 font-medium italic">"Lost in the magic of {item.location}..."</p>
                               </div>
                               <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-slate-50 p-2 rounded-xl border border-slate-200">
                                     <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Recommended Hashtags</label>
                                     <p className="text-[10px] text-slate-600 line-clamp-1">#travel #{item.location.replace(/\s/g, '')} #instatravel</p>
                                  </div>
                                  <button className="h-full px-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all">
                                     Affiliate Link
                                  </button>
                               </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg"><Settings size={18} /></button>
                         <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: SUMMARY & BUDGET (320px) */}
      <div className="w-[320px] bg-slate-50/30 border-l border-slate-100 flex flex-col p-8">
         <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Trip Summary</h2>
         
         {/* Budget Card */}
         <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm mb-6 relative overflow-hidden group">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Total Budget</h4>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-slate-900">${currentTrip?.budget}</span>
              <span className="text-sm font-bold text-slate-400">USD</span>
            </div>
            
            <div className="flex items-center justify-between text-[11px] font-bold mb-4">
              <span className="text-slate-400">TOTAL SPENT</span>
              <span className={totalSpent > budgetLimit ? 'text-red-600' : 'text-slate-900'}>${totalSpent}</span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
               <div className={`${budgetStatusColor} h-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.1)]`} style={{ width: `${budgetPercentage}%` }} />
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-[10px] font-bold text-slate-400">0</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${budgetPercentage > 90 ? 'text-red-600' : 'text-blue-600'}`}>
                {budgetPercentage}% EXHAUSTED
              </span>
              <span className="text-[10px] font-bold text-slate-400">100</span>
            </div>

            <button 
              onClick={() => dispatch(openModal({ name: 'addExpense' }))}
              className="w-full mt-6 py-3 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 hover:bg-white hover:border-blue-200 hover:text-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Log Extra Expense
            </button>
         </div>

         {/* Share / Download actions */}
         <div className="grid grid-cols-2 gap-3 mt-auto">
            <button className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm active:scale-[0.98]">
              <Download size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Download PDF</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm active:scale-[0.98]">
              <Share2 size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Share Link</span>
            </button>
         </div>
      </div>

    </div>
  );
};

export default ItineraryPage;
