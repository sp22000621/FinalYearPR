import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/icons/logo.svg';

const navItems = [
  { icon: 'home', label: 'Issues', path: '/student-home' },
  { icon: 'notifications', label: 'Alerts', path: '/student-alerts' },
  { icon: 'groups', label: 'Communities', path: '/student-communities' },
  { icon: 'account_circle', label: 'Profile', path: '/student-profile' },
];

/* Sidebar component for desktop view with glassmorphism effects */
export default function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className="sidebar d-none d-md-flex flex-column"
      style={{
        width: '260px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(15px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        height: '100vh',
        position: 'sticky',
        top: 0
      }}
    >
      <div className="p-4 text-center">
        {/**  my logo */}
        <img 
          src={logo} 
          width={40} 
          alt="logo" 
          className="rounded-lg mx-auto" 
        />
      </div>
      <nav className="flex-grow-1 px-3">
        {navItems.map((item) => (
          <div
            key={item.path}
            className={`nav-link-custom ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="material-symbols-rounded">{item.icon}</span> {item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}