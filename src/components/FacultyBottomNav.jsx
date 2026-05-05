import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Issues', icon: 'description', path: '/faculty-home' },
  { label: 'Scan', icon: 'document_scanner', path: '/faculty-scan' }, 
  { label: 'Teams', icon: 'groups', path: '/faculty-teams' },
  { label: 'Performance', icon: 'leaderboard', path: '/faculty-performance' }, 
  { label: 'Alerts', icon: 'notifications', path: '/faculty-alerts' },
  { label: 'Profile', icon: 'account_circle', path: '/faculty-profile' },
];

export default function FacultyBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav 
      className="d-md-none fixed-bottom d-flex justify-content-around py-2" 
      style={{ 
        /* MATCHING THE SIDEBAR COLORS */
        background: 'rgba(255,255,255,0.05)', 
        backdropFilter: 'blur(20px)', 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        zIndex: 1000
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className="text-center px-3 py-1 rounded-3"
            style={{ 
              color: isActive ? '#3d7a77' : 'rgba(255,255,255,0.5)', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>
              {item.icon}
            </span>
            <div style={{ 
              fontSize: '10px', 
              fontWeight: isActive ? 'bold' : 'normal',
              marginTop: '-2px'
            }}>
              {item.label}
            </div>
          </div>
        );
      })}
    </nav>
  );
}