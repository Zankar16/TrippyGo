import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Plane, Hotel, Clock, MapPin, Plus, Settings, 
  Trash2, ChevronDown, Download, Share2, 
  Sparkles, DollarSign, CloudSun, Camera, 
  TrendingUp, Info, ChevronUp
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentTrip, addActivity, removeActivity } from '../store/tripSlice';
import { openModal } from '../store/uiSlice';
import API from '../services/api';

const ItineraryPage = () => {
  const { tripId } = useParams();
  const [activeDay, setActiveDay] = useState(1);
  const [activeTab, setActiveTab ] = useState('plan'); // plan, map, summary
  const [expandedItems, setExpandedItems] = useState({}); // To track photo tip expansion
  const [selectedBadgeItem, setSelectedBadgeItem] = useState(null); // For the badge detail panel
  const [isCreatorMode, setIsCreatorMode] = useState(false); // Should ideally come from shared state
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  
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

  const handleRefinePlan = async () => {
    if (!refinePrompt.trim() || isRefining) return;
    setIsRefining(true);
    try {
      const res = await API.post('/ai/refine-trip', { tripId, prompt: refinePrompt });
      dispatch(setCurrentTrip(res.data));
      setRefinePrompt('');
      // Show success toast or notification if available
      alert('Plan updated successfully!');
    } catch (err) {
      console.error('Refine plan error:', err);
      alert('Failed to update plan. Please try again.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleDownloadPDF = () => {
    window.print();
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
            {activeTab === 'plan' && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Day {activeDay}: {currentDayData?.theme}</h3>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => dispatch(openModal({ name: 'addActivity', data: { dayId: currentDayData?.id } }))}
                      className="bg-blue-50 text-blue-600 p-2 px-4 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                    >
                      <Plus size={16} /> Add Activity
                    </button>
                  </div>
                </div>

                <div className="space-y-6 relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-100" />

                  {currentDayData?.items?.map((item, idx) => {
                    const isExpanded = expandedItems[item.id];
                    const score = item.instaScore || 0;
                    const badgeColor = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';
                    const badgeLabel = score >= 80 ? 'Iconic' : score >= 60 ? 'Great Shot' : 'Average';

                    return (
                      <div key={item.id} className="relative pl-12 group">
                        {/* Timeline Dot */}
                        <div className={`absolute left-[20px] top-8 w-3 h-3 rounded-full border-2 border-white z-10 
                          ${item.type === 'flight' ? 'bg-blue-500' : item.type === 'hotel' ? 'bg-purple-500' : 'bg-green-500'}
                        `} />
                        
                        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-5">
                              <div className={`p-4 rounded-2xl shadow-sm shrink-0 ${
                                item.type === 'flight' ? 'bg-blue-50 text-blue-600' : item.type === 'hotel' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'
                              }`}>
                                {item.type === 'flight' ? <Plane size={24} /> : item.type === 'hotel' ? <Hotel size={24} /> : <Clock size={24} />}
                              </div>
                              
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.startTime} — {item.endTime}</span>
                                  <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase font-black tracking-tighter">{item.type}</span>
                                </div>
                                
                                <h4 className="text-xl font-bold text-slate-900 leading-tight mb-2">{item.name}</h4>
                                
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                  <div className="flex items-center gap-1.5 text-slate-500">
                                    <MapPin size={14} className="text-slate-400" />
                                    <span className="text-xs font-semibold">{item.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs bg-slate-50 px-2.5 py-1 rounded-lg">
                                    <DollarSign size={12} className="text-slate-400" /> {item.price}
                                  </div>
                                  
                                  {/* INSTAWORTHY BADGE */}
                                  <button 
                                    onClick={() => setSelectedBadgeItem(item)}
                                    className={`${badgeColor} text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-current/20 hover:scale-105 transition-transform`}
                                  >
                                    <Camera size={12} /> {score} • {badgeLabel}
                                  </button>
                                </div>

                                {/* PHOTO TIP EXPANDABLE */}
                                {item.photoTip && (
                                  <div className="mt-2">
                                    <button 
                                      onClick={() => setExpandedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                      className="text-[11px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
                                    >
                                      {isExpanded ? <ChevronUp size={14} /> : <Info size={14} />} 
                                      {isExpanded ? 'Hide Photo Tip' : 'View Photo Tip'}
                                    </button>
                                    {isExpanded && (
                                      <div className="mt-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                                        <p className="text-xs text-blue-900 font-medium leading-relaxed">
                                          <Sparkles size={12} className="inline mr-2 text-blue-500" />
                                          {item.photoTip}
                                        </p>
                                      </div>
                                    )}
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
                    );
                  })}
                </div>
              </>
            )}

            {activeTab === 'map' && (
              <div className="animate-in fade-in zoom-in-95 duration-500 h-[600px] relative rounded-[3rem] overflow-hidden border border-slate-200">
                <img src="/src/assets/map_placeholder.png" className="w-full h-full object-cover" alt="Map View" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
                
                {/* Simulated Pins */}
                {currentDayData?.items?.filter(i => i.instaScore).map((item, id) => (
                  <div key={item.id} className="absolute flex flex-col items-center gap-1 group cursor-pointer" style={{ top: `${20 + id * 15}%`, left: `${30 + id * 20}%` }}>
                     <div className="bg-white p-1 rounded-full shadow-xl shadow-blue-900/40 border-2 border-blue-600 group-hover:scale-125 transition-transform">
                        <Camera size={18} className="text-blue-600" />
                     </div>
                     <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[9px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.name} • {item.instaScore}%
                     </div>
                  </div>
                ))}

                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-white/50 shadow-2xl">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <Navigation size={14} className="text-blue-600" /> Optimized Route
                   </h4>
                   <p className="text-[10px] text-slate-500 font-bold max-w-[200px]">
                      Your Day {activeDay} route is optimized to minimize travel time between spots.
                   </p>
                </div>
              </div>
            )}
          </div>
          
          {/* NLP REFINEMENT INPUT (FLOATING) */}
          <div className="max-w-3xl mt-12 mb-8">
             <div className="bg-slate-50 border border-slate-200 p-2 rounded-2xl flex items-center gap-3 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                   <Bot size={20} />
                </div>
                <input 
                  type="text" 
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRefinePlan()}
                  placeholder={isRefining ? "AI is rewriting your plan..." : "Need a change? Try 'Replace Day 2 lunch with sushi'..."}
                  disabled={isRefining}
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
                />
                <button 
                  onClick={handleRefinePlan}
                  disabled={isRefining || !refinePrompt.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2"
                >
                  {isRefining ? 'Updating...' : 'Refine Plan'}
                </button>
             </div>
          </div>
        </div>

        {/* INSTAWORTHY DETAIL PANEL (MODAL OVERLAY) */}
        {selectedBadgeItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="relative h-48 bg-slate-100">
                <img src={selectedBadgeItem.image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'} className="w-full h-full object-cover" alt="" />
                <button 
                  onClick={() => setSelectedBadgeItem(null)}
                  className="absolute top-4 right-4 bg-black/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/40 transition-all"
                >
                  <Plus className="rotate-45" size={20} />
                </button>
                <div className="absolute bottom-4 left-6">
                  <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                    InstaWorthy Score {selectedBadgeItem.instaScore}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">{selectedBadgeItem.name}</h4>
                  {selectedBadgeItem.instaScore > 85 && (
                    <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                      <TrendingUp size={12} /> Trending
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-3xl">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Best Time</label>
                    <span className="text-sm font-bold text-slate-700">17:30 - Golden Hour</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-3xl">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Lighting</label>
                    <span className="text-sm font-bold text-slate-700">Soft backlight</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Composition Tip</label>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed bg-blue-50/50 p-4 rounded-2xl border border-blue-100 italic">
                      "{selectedBadgeItem.photoTip || 'No specific tip available.'}"
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">AI Suggested Caption</label>
                    <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl relative group">
                      <p className="text-sm font-medium italic">"Chasing sunsets and temple vibes at {selectedBadgeItem.name}. ✨ #TrippyGo #BaliBound"</p>
                      <button className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedBadgeItem(null)}
                  className="w-full mt-10 bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-[0.98]"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: SUMMARY & BUDGET (320px) */}
      <div className="w-[320px] bg-slate-50/30 border-l border-slate-100 flex flex-col p-8">
         <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Trip Summary</h2>
         
         {/* Budget Card with SVG Dial */}
         <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm mb-6 relative overflow-hidden group">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Budget Monitoring</h4>
            
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="96" cy="96" r="88" 
                  className="stroke-slate-100 fill-none" 
                  strokeWidth="12" 
                />
                <circle 
                  cx="96" cy="96" r="88" 
                  className={`${budgetStatusColor.replace('bg-', 'stroke-')} fill-none transition-all duration-1000 ease-out`} 
                  strokeWidth="12" 
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - budgetPercentage / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900">{budgetPercentage}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spent</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Total Budget</span>
                  <span className="text-sm font-black text-slate-900">${budgetLimit}</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Current Spend</span>
                  <span className={`text-sm font-black ${totalSpent > budgetLimit ? 'text-red-600' : 'text-slate-900'}`}>${totalSpent}</span>
               </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-3 pt-6 border-t border-slate-50">
               {[
                 { label: 'Flights', value: 450, color: 'bg-blue-500' },
                 { label: 'Stays', value: 320, color: 'bg-purple-500' },
                 { label: 'Fun', value: 120, color: 'bg-green-500' }
               ].map((cat, i) => (
                 <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                    <span className="text-[11px] font-bold text-slate-600 flex-1">{cat.label}</span>
                    <span className="text-[11px] font-black text-slate-900">${cat.value}</span>
                 </div>
               ))}
            </div>

            <button 
              onClick={() => dispatch(openModal({ name: 'addExpense' }))}
              className="w-full mt-8 py-4 px-4 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-bold hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
            >
              <Plus size={14} /> Log Extra Expense
            </button>
         </div>

         {/* Share / Download actions */}
         <div className="grid grid-cols-2 gap-3 mt-auto">
            <button 
              onClick={handleDownloadPDF}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm active:scale-[0.98]"
            >
              <Download size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Download PDF</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm active:scale-[0.98]"
            >
              <Share2 size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Share Link</span>
            </button>
         </div>
      </div>

    </div>
  );
};

export default ItineraryPage;
