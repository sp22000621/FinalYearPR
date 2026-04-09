import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/icons/logo.svg';

const scrItems = [
  { label: 'Home', icon: 'home', path: '/scr-home' },
  { label: 'Feed', icon: 'explore', path: '/scr-feed' },
  { label: 'Communities', icon: 'groups', path: '/scr-communities' }, 
  { label: 'Scan', icon: 'document_scanner', path: '/scr-scan' },
  { label: 'Teams', icon: 'diversity_3', path: '/scr-teams' }, 
  { label: 'Performance', icon: 'leaderboard', path: '/scr-performance' },
  { label: 'Profile', icon: 'account_circle', path: '/scr-profile' },
];

export default function SCRSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="d-none d-md-flex flex-column" style={{
      width: '260px',
      background: 'rgba(255, 255, 255, 0.03)', // Matched Student Sidebar
      backdropFilter: 'blur(15px)', // Matched Student Sidebar
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <div className="p-4 text-center">
        <img src={logo} width={40} alt="logo" className="rounded-lg mx-auto" />
      </div>

      <nav className="flex-grow-1 px-3">
        {scrItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`d-flex align-items-center gap-3 px-3 py-2 my-1 rounded-3 transition-all`}
              style={{
                cursor: 'pointer',
                background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent'
              }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>{item.icon}</span>
              <span className="fw-bold" style={{ fontSize: '13px' }}>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}