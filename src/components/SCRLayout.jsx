import React from 'react';
import SCRSidebar from './SCRSidebar';
import SCRBottomNav from './SCRBottomNav';
import wallpaper from '../assets/images/wallpaper.png'; 

export default function SCRLayout({ children }) {
  return (
    <div
      className="d-flex"
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: `linear-gradient(rgba(0,30,60,0.88), rgba(0,30,60,0.88)), url(${wallpaper})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflowX: 'hidden'
      }}
    >
      {/* Desktop Navigation */}
      <SCRSidebar />

      {/* Main Page Content */}
      <main className="flex-grow-1 overflow-auto" style={{ height: '100vh' }}>
        {children}
        
        {/* Mobile Spacer: Prevents BottomNav from covering page content */}
        <div className="d-md-none" style={{ height: '85px' }}></div>
      </main>

      {/* Mobile Navigation */}
      <SCRBottomNav />
    </div>
  );
}