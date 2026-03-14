import React, { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { replaceTrip } from '../../store/tripSlice';
import API from '../../services/api';

const CustomiseTripModal = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleRefine = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await API.post('/ai/refine', { instruction: input });
      dispatch(replaceTrip(res.data));
      onClose();
    } catch (err) {
      console.error('Refine error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-50 p-2.5 rounded-2xl">
          <Sparkles className="text-blue-600" size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customise your trip</h2>
      </div>
      
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">
        Tell me what you'd like to change. You can say things like "Make it more budget friendly", "Add more museums", or "I want a more relaxed pace".
      </p>

      <form onSubmit={handleRefine} className="space-y-4">
        <textarea 
          placeholder="e.g. Add more vegan food spots in Day 2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
        />

        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-2xl text-sm font-bold transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <Send size={18} />
                Refine with AI
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomiseTripModal;
