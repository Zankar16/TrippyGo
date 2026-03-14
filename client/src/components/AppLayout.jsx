import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ModalContainer from './ModalContainer';
import ToastContainer from './ToastContainer';

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Fixed 260px */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* TopBar - Header inside main area */}
        <TopBar />

        {/* Page Content - Scrolls independently */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlays */}
      <ModalContainer />
      <ToastContainer />
    </div>
  );
};

export default AppLayout;
