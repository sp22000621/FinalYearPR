import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const scrItems = [
  { label: 'Home', icon: 'home', path: '/scr-home' },
  { label: 'Feed', icon: 'explore', path: '/scr-feed' },
  { label: 'Groups', icon: 'groups', path: '/scr-communities' }, 
  { label: 'Scan', icon: 'document_scanner', path: '/scr-scan' },
  { label: 'Teams', icon: 'diversity_3', path: '/scr-teams' }, 
  { label: 'Stats', icon: 'leaderboard', path: '/scr-performance' },
  { label: 'Me', icon: 'account_circle', path: '/scr-profile' },
];

export default function SCRBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed-bottom d-md-none" 
         style={{ 
           background: 'rgba(255, 255, 255, 0.03)', 
           borderTop: '1px solid rgba(255, 255, 255, 0.1)',
           paddingBottom: 'env(safe-area-inset-bottom)' 
         }}>
      <div className="d-flex justify-content-around align-items-center py-2">
        {scrItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="btn border-0 d-flex flex-column align-items-center p-1"
              style={{ 
                color: isActive ? '#fff' : 'rgba(255,255,255,0.5)', 
                transition: '0.3s',
                width: '14%', 
                background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderRadius: '8px'
              }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>
                {item.icon}
              </span>
              <span style={{ fontSize: '7px', fontWeight: isActive ? 'bold' : 'normal', textTransform: 'uppercase' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}