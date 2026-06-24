import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../store/uiSlice';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContainer = () => {
  const { toasts } = useSelector(state => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toasts[0].id));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts, dispatch]);

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className="pointer-events-auto min-w-[320px] max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 flex items-start gap-4 animate-in slide-in-from-right-8 fade-in duration-300"
        >
          <div className={`p-2 rounded-xl shrink-0 ${
            toast.type === 'success' ? 'bg-green-50 text-green-600' :
            toast.type === 'error' ? 'bg-red-50 text-red-600' :
            toast.type === 'warning' ? 'bg-yellow-50 text-yellow-600' :
            'bg-blue-50 text-blue-600'
          }`}>
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'warning' && <AlertTriangle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
          </div>
          
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm font-bold text-slate-800 leading-tight">{toast.message}</p>
            {toast.action && (
              <button 
                onClick={toast.action.onClick}
                className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
              >
                {toast.action.label}
              </button>
            )}
          </div>

          <button 
            onClick={() => dispatch(removeToast(toast.id))}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
