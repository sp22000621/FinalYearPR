import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Use the exact same paths as the sidebar!
const scrItems = [
  { label: 'Home', icon: 'home', path: '/scr-home' },
   { label: 'Groups', icon: 'groups', path: '/student-communities' }, 
  { label: 'Scan', icon: 'document_scanner', path: '/faculty-scan' },
  { label: 'Teams', icon: 'diversity_3', path: '/faculty-teams' }, 
  { label: 'Stats', icon: 'leaderboard', path: '/faculty-performance' },
  { label: 'Me', icon: 'account_circle', path: '/student-profile' },
];

export default function SCRBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="d-md-none fixed-bottom" style={{
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(15px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 1050,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      <div className="d-flex justify-content-around align-items-center py-2">
        {scrItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="btn border-0 d-flex flex-column align-items-center p-1"
              style={{
                color: isActive ? '#4ddbff' : 'rgba(255,255,255,0.5)', // Match Sidebar Cyan
                transition: '0.3s',
                flex: 1,
                background: 'transparent'
              }}
            >
              <span className="material-symbols-rounded" style={{ 
                fontSize: '24px',
                textShadow: isActive ? '0 0 10px rgba(77, 219, 255, 0.4)' : 'none' 
              }}>
                {item.icon}
              </span>
              <span style={{ 
                fontSize: '9px', 
                fontWeight: isActive ? 'bold' : 'normal',
                textTransform: 'uppercase' 
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}