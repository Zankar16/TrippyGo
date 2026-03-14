import React from 'react';
import { useLocation } from 'react-router-dom';
import { Share2, Link, MoreHorizontal } from 'lucide-react';

const TopBar = () => {
  const location = useLocation();
  
  // Simple breadcrumb logic
  const getBreadcrumbs = () => {
    const path = location.pathname === '/' ? 'Home' : location.pathname.substring(1);
    const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);
    return (
      <div className="flex items-center text-sm">
        <span className="text-slate-500 hover:text-blue-600 cursor-pointer transition-colors">Home</span>
        {location.pathname !== '/' && (
          <>
            <span className="text-slate-400 mx-2">/</span>
            <span className="font-semibold text-slate-800">{formattedPath}</span>
          </>
        )}
      </div>
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // showToast('Link copied to clipboard'); // To be implemented with toast system
  };

  return (
    <header className="h-[56px] bg-white border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm shadow-slate-100/50">
      {/* LEFT: BREADCRUMBS */}
      <div className="flex items-center">
        {getBreadcrumbs()}
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
          <MoreHorizontal size={18} />
        </button>

        <button 
          onClick={handleCopyLink}
          className="border border-slate-200 rounded-lg py-1.5 px-4 flex items-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
        >
          <Link size={16} />
          <span>Copy link</span>
        </button>

        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1.5 px-5 rounded-lg transition-all shadow-md shadow-blue-100 hover:shadow-blue-200 active:scale-[0.98]">
          Share
        </button>
      </div>
    </header>
  );
};

export default TopBar;
