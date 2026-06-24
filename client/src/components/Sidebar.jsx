import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Plane, Home, Compass, Calendar, FileText, Star, Cloud, 
  Plus, Search, MoreVertical, LogOut, User, Zap, LayoutGrid 
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { addToast } from '../store/uiSlice';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { conversations } = useSelector(state => state.conversations);
  
  const [isCreator, setIsCreator] = useState(false);

  const menuItems = [
    { name: 'Home', icon: <Home size={18} />, path: '/' },
    { name: 'Explore', icon: <Compass size={18} />, path: '/explore' },
    { name: 'Bookings', icon: <Calendar size={18} />, path: '/bookings' },
    { name: 'Documents', icon: <FileText size={18} />, path: '/documents' },
    { name: 'NewSpots', icon: <Star size={18} />, path: '/newspots' },
    { name: 'Weather', icon: <Cloud size={18} />, path: '/weather', badge: 3 },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-slate-200 flex flex-col overflow-hidden shrink-0">
      {/* LOGO SECTION */}
      <div className="p-[20px_16px_16px_16px] flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm shadow-blue-200">
          <Plane className="text-white fill-white" size={20} />
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">TrippyGo</span>
      </div>

      {/* SEARCH BAR */}
      <div className="px-4 mt-4">
        <div className="bg-slate-100 rounded-lg p-[8px_12px] flex items-center gap-2 group focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={16} className="text-slate-400 group-focus-within:text-blue-500" />
          <input 
            type="text" 
            placeholder="Search anything" 
            className="bg-transparent border-none outline-none text-sm text-slate-600 flex-1 placeholder:text-slate-400"
          />
          <span className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400 font-medium">⌘K</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        {/* MENU SECTION */}
        <div className="mt-8">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em] mb-2 px-2">Menu</h3>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <span className="group-hover:scale-105 transition-transform">{item.icon}</span>
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* YOUR CHATS SECTION */}
        <div className="mt-8 mb-4">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em] mb-2 px-2">Your Chats</h3>
          <div className="space-y-1">
            {conversations.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => navigate('/')}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-all"
              >
                <img src={chat.thumbnail || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&h=100&fit=crop'} alt="" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{chat.title}</p>
                  <p className="text-[11px] text-slate-400 truncate tracking-tight">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
            {conversations.length === 0 && (
              <p className="text-[10px] text-slate-400 text-center py-4 font-bold uppercase tracking-widest">No chats yet</p>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-4 mt-auto border-t border-slate-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.02)] space-y-4">
        
        {/* Creator Mode Toggle */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-2xl border border-blue-100">
             <div className="flex items-center gap-2">
                <LayoutGrid size={16} className="text-blue-600" />
                <span className="text-xs font-bold text-blue-900">Creator Mode</span>
             </div>
             <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsCreator(!isCreator);
                dispatch(addToast({ type: 'info', message: `Creator Mode ${!isCreator ? 'Enabled' : 'Disabled'}` }));
              }}
              className={`w-10 h-5 rounded-full relative transition-all duration-300 shadow-inner ${isCreator ? 'bg-blue-600' : 'bg-slate-300'}`}
             >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isCreator ? 'left-6' : 'left-1'}`} />
             </button>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 rounded-2xl transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
        >
          <Plus size={18} />
          New Chat
        </button>

        {/* User Profile */}
        <div className="flex items-center justify-between group cursor-pointer p-1" onClick={handleLogout}>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200 group-hover:bg-red-50 group-hover:text-red-600 transition-all uppercase">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                 <p className="text-xs font-black text-slate-800 tracking-tight truncate">{user?.name || 'Guest User'}</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Free Explorer</p>
              </div>
           </div>
           <LogOut size={16} className="text-slate-300 group-hover:text-red-500 transition-colors shrink-0" />
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
