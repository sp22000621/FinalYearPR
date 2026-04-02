import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: 'assignment', label: 'Issues', path: '/faculty-home' },
  { icon: 'document_scanner', label: 'Scan', path: '/faculty-scan' },
  { icon: 'groups', label: 'Teams', path: '/faculty-teams' },
  { icon: 'bar_chart', label: 'Performance', path: '/faculty-performance' },
  { icon: 'notifications', label: 'Alerts', path: '/faculty-alerts' },
  { icon: 'account_circle', label: 'Profile', path: '/faculty-profile' },
];

export default function FacultySidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="d-none d-md-flex flex-column shadow-lg" style={{
      width: '280px',
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <style>{`
        .nav-link-custom {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 14px 20px;
          margin: 8px 15px;
          border-radius: 15px;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: 0.3s;
          text-decoration: none;
        }
        .nav-link-custom:hover { background: rgba(255,255,255,0.1); color: white; }
        .nav-link-custom.active { 
          background: rgba(61, 122, 119, 0.25); 
          color: #3d7a77; 
          border: 1px solid rgba(61, 122, 119, 0.3);
        }
      `}</style>

      <div className="p-4 mb-3">
        <div className="d-flex align-items-center gap-2">
          <div style={{ background: '#3d7a77', padding: '8px', borderRadius: '12px' }}>
             <span className="material-symbols-rounded text-white">shield_person</span>
          </div>
          <h5 className="text-white fw-bold mb-0">BIUST Ops</h5>
        </div>
      </div>

      <nav className="flex-grow-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              className={`nav-link-custom ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="material-symbols-rounded">{item.icon}</span>
              <span className="fw-medium">{item.label}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}