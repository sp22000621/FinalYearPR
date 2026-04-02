import React from 'react';
import FacultySidebar from './FacultySidebar';
import FacultyBottomNav from './FacultyBottomNav';
import wallpaper from '../assets/images/wallpaper.png'; 

export default function FacultyLayout({ children }) {
  return (
    <div
      className="d-flex"
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: `linear-gradient(rgba(0,51,102,0.85), rgba(0,51,102,0.85)), url(${wallpaper})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflowX: 'hidden'
      }}
    >
      {/* Desktop Sidebar */}
      <FacultySidebar />

      {/* Main Content Area */}
      <main className="flex-grow-1 overflow-auto pb-5 pb-md-0" style={{ height: '100vh' }}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <FacultyBottomNav />
    </div>
  );
}