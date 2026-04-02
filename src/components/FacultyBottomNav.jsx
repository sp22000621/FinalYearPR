import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: 'assignment', label: 'Issues', path: '/faculty-home' },
  { icon: 'groups', label: 'Teams', path: '/faculty-teams' },
  { icon: 'notifications', label: 'Alerts', path: '/faculty-alerts' },
  { icon: 'account_circle', label: 'Profile', path: '/faculty-profile' },
];

export default function FacultyBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="d-md-none fixed-bottom d-flex justify-content-around py-2 shadow-lg" 
         style={{ background: 'rgba(255,255,255,0.98)', borderTop: '1px solid #eee' }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className="text-center px-3 py-1 rounded-3"
            style={{ color: isActive ? '#3d7a77' : '#999', cursor: 'pointer' }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '26px' }}>{item.icon}</span>
            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>{item.label}</div>
          </div>
        );
      })}
    </nav>
  );
}