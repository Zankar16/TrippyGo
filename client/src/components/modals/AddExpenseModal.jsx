import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DollarSign, Tag, Calendar, X } from 'lucide-react';
import { addActivity } from '../../store/tripSlice'; // Reuse activity addition for demo or create expense action
import API from '../../services/api';

const AddExpenseModal = ({ onClose }) => {
  const { currentTrip } = useSelector(state => state.trip);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'transport',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'transport', label: 'Transport', icon: '🚗' },
    { id: 'food', label: 'Food & Drink', icon: '🍱' },
    { id: 'sightseeing', label: 'Sightseeing', icon: '🏛️' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'other', label: 'Other', icon: '✨' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // In a real app, this would hit /trips/:id/expenses
      // For this UI demo, we'll mock success or add it to a specific day if needed
      await new Promise(resolve => setTimeout(resolve, 800));
      onClose();
    } catch (err) {
      console.error('Add expense error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Log Expense</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Miscellaneous costs</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">What did you spend on?</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
               <Tag size={18} />
            </div>
            <input 
              type="text" 
              placeholder="e.g. Souvenirs, Local Train"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-[14px_16px_14px_48px] text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Amount (USD)</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                 <DollarSign size={18} />
              </div>
              <input 
                type="number" 
                placeholder="0.00"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-[14px_16px_14px_48px] text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-bold"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Date</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                 <Calendar size={18} />
              </div>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-[14px_16px_14px_48px] text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Category</label>
          <div className="grid grid-cols-5 gap-2">
             {categories.map(cat => (
               <button
                key={cat.id}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.id })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${
                  formData.category === cat.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'
                }`}
               >
                 <span className="text-lg">{cat.icon}</span>
                 <span className="text-[9px] font-black uppercase">{cat.label}</span>
               </button>
             ))}
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl transition-all hover:bg-slate-800 active:scale-[0.98] shadow-xl shadow-slate-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Logging...' : 'Save Expense'}
        </button>
      </form>
    </div>
  );
};

export default AddExpenseModal;
