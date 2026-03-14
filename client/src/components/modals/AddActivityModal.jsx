import React, { useState } from 'react';
import { Search, Loader2, Plus, MapPin, DollarSign } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addActivity } from '../../store/tripSlice';
import API from '../../services/api';

const AddActivityModal = ({ data, onClose }) => {
  const { dayId } = data; // from openModal data
  const { currentTrip } = useSelector(state => state.trip);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    try {
      // Mocking search for now
      const res = [
        { id: 'm1', name: 'Sushi Dinner', type: 'meal', location: 'Tokyo Central', price: 40, instaScore: 92 },
        { id: 'm2', name: 'Observatory Deck', type: 'activity', location: 'Shibuya Sky', price: 20, instaScore: 98 }
      ];
      setResults(res);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = async (item) => {
    try {
      const res = await API.post(`/trips/${currentTrip.id}/days/${dayId}/activities`, item);
      dispatch(addActivity({ dayId, activity: res.data }));
      onClose();
    } catch (err) {
      console.error('Add activity error:', err);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Add to Day 1</h2>
      
      <form onSubmit={handleSearch} className="relative mb-6">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Search places, restaurants, activities..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-[14px_16px_14px_48px] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium"
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="animate-spin text-blue-600" size={18} />
          </div>
        )}
      </form>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {results.map((res) => (
          <div key={res.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all group">
            <div className="flex items-center gap-4">
               <div className="bg-slate-100 p-2 rounded-xl text-slate-500 group-hover:bg-white group-hover:text-blue-600 transition-all">
                 <MapPin size={20} />
               </div>
               <div>
                 <h4 className="text-sm font-bold text-slate-800">{res.name}</h4>
                 <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.type}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-slate-500">
                       <DollarSign size={10} /> {res.price}
                    </div>
                 </div>
               </div>
            </div>
            <button 
              onClick={() => handleAdd(res)}
              className="bg-blue-600 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-md shadow-blue-100"
            >
              <Plus size={18} />
            </button>
          </div>
        ))}
        {results.length === 0 && !isSearching && (
          <p className="text-center text-slate-400 text-sm py-10">Search for something to add to your plan</p>
        )}
      </div>

      <button 
        onClick={onClose}
        className="w-full mt-6 bg-slate-900 text-white font-bold py-3 rounded-2xl text-sm transition-all hover:bg-slate-800 active:scale-[0.98]"
      >
        Done
      </button>
    </div>
  );
};

export default AddActivityModal;
