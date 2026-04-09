import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: 'home', label: 'Issues', path: '/student-home' },
  { icon: 'notifications', label: 'Alerts', path: '/student-alerts' },
  { icon: 'groups', label: 'Communities', path: '/student-communities' },
  { icon: 'account_circle', label: 'Profile', path: '/student-profile' },
];

export default function StudentBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="d-md-none fixed-bottom"
      style={{ 
        // MATCHED: rgba(255, 255, 255, 0.03) and blur(15px) from your Sidebar
        background: 'rgba(255, 255, 255, 0.03)', 
        backdropFilter: 'blur(15px)', 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1050,
        paddingBottom: 'env(safe-area-inset-bottom)' 
      }}
    >
      <div className="d-flex justify-content-around align-items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="btn border-0 d-flex flex-column align-items-center p-1"
              style={{ 
                // Color matches the subtle white-50 feel unless active
                color: isActive ? '#fff' : 'rgba(255,255,255,0.5)', 
                transition: '0.3s',
                flex: 1,
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderRadius: '12px',
                margin: '0 5px'
              }}
            >
              <span className="material-symbols-rounded" style={{ 
                fontSize: '24px',
                // Subtle glow for active state
                textShadow: isActive ? '0 0 8px rgba(255,255,255,0.4)' : 'none' 
              }}>
                {item.icon}
              </span>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: isActive ? 'bold' : 'normal',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
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