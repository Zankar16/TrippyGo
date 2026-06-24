import React from 'react';
import { 
  Plane, MapPin, Calendar, Clock, Lock, 
  Download, Share2, ShieldCheck 
} from 'lucide-react';

const ShareTripPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 selection:bg-blue-100">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md">
               <Plane size={24} />
             </div>
             <span className="text-2xl font-black text-slate-900 tracking-tight">TrippyGo</span>
          </div>
          <div className="flex items-center gap-2 py-1.5 px-3 bg-green-50 text-green-600 rounded-full border border-green-100">
             <ShieldCheck size={16} />
             <span className="text-xs font-black uppercase tracking-widest">Verified Trip</span>
          </div>
        </div>

        {/* HERO */}
        <div className="bg-white rounded-[48px] p-10 border border-slate-200 shadow-2xl shadow-blue-900/5 mb-12">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-4">Trip to Paris</h1>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-500 font-bold">
                    <Calendar size={18} className="text-blue-600" />
                    <span>Jun 12 - Jun 17</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-bold">
                    <MapPin size={18} className="text-blue-600" />
                    <span>Paris, France</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                 <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98]">
                    <Download size={20} />
                    Export PDF
                 </button>
              </div>
           </div>
        </div>

        {/* CONTENT SKELETON (READ ONLY) */}
        <div className="space-y-8">
           {[1, 2, 3].map(i => (
             <div key={i} className="bg-white border border-slate-200 rounded-[32px] p-8 opacity-80 filter blur-[0px]">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400">0{i}</div>
                   <h3 className="text-2xl font-bold text-slate-800">Day {i}</h3>
                </div>
                <div className="h-24 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
                   <p className="text-slate-400 text-sm font-medium">Itinerary content is read-only</p>
                </div>
             </div>
           ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center pb-20">
           <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-6">Inspired by this journey?</p>
           <button className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black text-xl shadow-2xl shadow-blue-300 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-[0.98]">
              Join TrippyGo for Free
           </button>
        </div>
      </div>
    </div>
  );
};

export default ShareTripPage;
