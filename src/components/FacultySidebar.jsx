import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../assets/icons/logo.svg';

export default function FacultySidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    };
    fetchRole();
  }, []);

  // Dynamically determine the "Issues" path based on the user's role[Junior/Senior]
  const getIssuesPath = () => {
    if (role === 'Senior Faculty') return '/faculty-home'; // The Senior Dashboard
    return '/operator-home'; // The Junior/Operator Dashboard
  };

  const navItems = [
    { icon: 'assignment', label: 'Issues', path: getIssuesPath() },
    { icon: 'document_scanner', label: 'Scan', path: '/faculty-scan' },
    { icon: 'groups', label: 'Teams', path: '/faculty-teams' },
    { icon: 'bar_chart', label: 'Performance', path: '/faculty-performance' },
    { icon: 'notifications', label: 'Alerts', path: '/faculty-alerts' },
    { icon: 'account_circle', label: 'Profile', path: '/faculty-profile' },
  ];

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
      {/* ... Style Tag stays the same ... */}
      
      <div className="p-4 text-center">
        <img src={logo} width={40} alt="logo" className="rounded-lg mx-auto" />  
      </div>

      <nav className="flex-grow-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.label} // Changed key to label since path might change
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