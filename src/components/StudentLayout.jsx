import React from 'react';
import StudentSidebar from './StudentSidebar';
import StudentBottomNav from './StudentBottomNav';
import wallpaper from '../assets/images/wallpaper.png';

/* Standardized layout for student dashboard pages */
export default function StudentLayout({ children }) {
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
      {/* Desktop Navigation */}
      <StudentSidebar />

      {/* Main Content Area */}
      <main className="flex-grow-1 overflow-auto pb-5 pb-md-0">
        {children}
      </main>

      {/* Mobile Navigation */}
      <StudentBottomNav />
    </div>
  );
}