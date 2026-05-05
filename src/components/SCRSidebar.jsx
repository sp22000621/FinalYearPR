import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import logo from '../assets/icons/logo.svg';
const scrItems = [
  { label: 'Home', icon: 'home', path: '/scr-home' },
  { label: 'Communities', icon: 'groups', path: '/student-communities' }, 
  { label: 'Scan', icon: 'document_scanner', path: '/faculty-scan' },
  { label: 'Teams', icon: 'diversity_3', path: '/faculty-teams' }, 
  { label: 'Performance', icon: 'leaderboard', path: '/faculty-performance' },
  { label: 'Profile', icon: 'account_circle', path: '/student-profile' },
];

export default function SCRSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

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
      {/* Logo ONLY (matches student) */}
      <div className="p-4 text-center">
        <img src={logo} width={40} alt="logo" />
      </div>

      {/* Nav */}
      <nav className="flex-grow-1 px-3">
        {scrItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className="nav-link-custom"
              style={{
                background: isActive ? '#4ddbff' : 'transparent',
                color: isActive ? '#000' : 'rgba(255,255,255,0.6)',
                fontWeight: isActive ? 'bold' : 'normal'
              }}
            >
              <span className="material-symbols-rounded">
                {item.icon}
              </span>
              {item.label}
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-3">
        {/* Profile (ICON FIXED SAME STYLE) */}
        <div
          onClick={() => navigate('/scr-profile')}
          className="nav-link-custom"
          style={{
            background: location.pathname === '/scr-profile' ? '#4ddbff' : 'transparent',
            color: location.pathname === '/scr-profile' ? '#000' : 'rgba(255,255,255,0.6)',
            fontWeight: location.pathname === '/scr-profile' ? 'bold' : 'normal'
          }}
        >
          <span className="material-symbols-rounded">
            account_circle
          </span>
          Profile
        </div>

        {/* Logout */}
        <div
          onClick={handleLogout}
          className="nav-link-custom"
          style={{
            color: '#ff4d4d'
          }}
        >
          <span className="material-symbols-rounded">
            logout
          </span>
          Logout
        </div>
      </div>
    </aside>
  );
}