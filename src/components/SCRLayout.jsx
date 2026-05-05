import React from 'react';
import SCRSidebar from './SCRSidebar';
import SCRBottomNav from './SCRBottomNav';
import wallpaper from '../assets/images/wallpaper.png';

export default function SCRLayout({ children }) {
  return (
    <div
      className="d-flex h-100 w-100 position-relative overflow-hidden"
      style={{
        background: `linear-gradient(rgba(0, 51, 102, 0.75), rgba(0, 51, 102, 0.75)), url(${wallpaper})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '1344px 768px',
        backgroundPosition: 'center',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      {/* Desktop Sidebar */}
      <SCRSidebar />

      {/* Main Content */}
       <main className="flex-grow-1 position-relative" style={{ zIndex: 1 }}>
        <div className="pb-5 pb-md-0">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <SCRBottomNav />
    </div>
  );
}