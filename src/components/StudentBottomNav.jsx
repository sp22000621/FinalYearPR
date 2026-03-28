import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: 'home', label: 'Issues', path: '/student-home' },
  { icon: 'notifications', label: 'Alerts', path: '/student-alerts' },
  { icon: 'groups', label: 'Communities', path: '/student-communities' },
  { icon: 'account_circle', label: 'Profile', path: '/student-profile' },
];

/* Sticky bottom navigation for mobile view */
export default function StudentBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="mobile-bottom-nav d-md-none fixed-bottom d-flex justify-content-around py-2"
      style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(15px)', 
        borderTop: '1px solid #e5e7eb',
        zIndex: 1050 
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className="text-center cursor-pointer px-3 py-1 rounded-xl transition-all"
            style={isActive
              ? { background: 'rgba(61, 122, 119, 0.2)', color: '#3d7a77' }
              : { color: '#6b7280' }
            }
          >
            <span className="material-symbols-rounded">{item.icon}</span>
            <div style={{ fontSize: '10px' }}>{item.label}</div>
          </div>
        );
      })}
    </nav>
  );
}