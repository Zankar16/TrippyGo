import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ChevronRight, MoreVertical, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/trips'); // Trips act as booking containers
        setBookings(res.data);
      } catch (err) {
        console.error('Bookings error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Bookings</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your upcoming and past adventures</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="bg-white border border-slate-200 rounded-xl py-2 px-10 text-sm focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trip / Destination</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => (
              <tr 
                key={booking.id} 
                className="group hover:bg-blue-50/30 transition-all cursor-pointer"
                onClick={() => navigate(`/itinerary/${booking.id}`)}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">
                      {booking.flagEmoji || '🌍'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{booking.title}</p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <MapPin size={10} />
                        <span>{booking.destination}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <Calendar size={14} className="text-slate-400" />
                    <span>Jun 12, 2026</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider
                    ${booking.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}
                  `}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-bold text-slate-800">${booking.budget}</p>
                </td>
                <td className="px-6 py-5 text-right">
                   <button className="p-2 text-slate-400 hover:bg-white hover:text-slate-900 rounded-lg transition-all group-hover:shadow-sm group-hover:border group-hover:border-slate-100">
                    <MoreVertical size={16} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && !isLoading && (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-sm font-medium">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
