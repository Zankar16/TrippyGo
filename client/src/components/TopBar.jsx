import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Share2, Link, MoreHorizontal, Bell, Check, Clock } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, markAllAsRead } from '../store/notificationSlice';

const TopBar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(state => state.notifications);
  const [showNotifications, setShowNotifications] = useState(false);
  
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
  };

  return (
    <header className="h-[56px] bg-white border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between shadow-sm shadow-slate-100/50">
      {/* LEFT: BREADCRUMBS */}
      <div className="flex items-center">
        {getBreadcrumbs()}
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-lg transition-all relative ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                <button 
                  onClick={() => dispatch(markAllAsRead())}
                  className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline"
                >
                  Mark all as read
                </button>
              </div>
              
              <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => dispatch(markAsRead(n.id))}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${!n.isRead ? 'bg-blue-50/50 border border-blue-100' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.isRead ? 'bg-blue-600' : 'bg-slate-200'}`} />
                        <div>
                          <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-medium">
                            <Clock size={10} />
                            <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
      {showNotifications && <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />}
    </header>
  );
};

export default TopBar;
