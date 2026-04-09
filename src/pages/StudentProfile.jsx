import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';

export default function StudentProfile() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/student-login');
  };

  return (
    <StudentLayout>
      <div className="container-fluid px-4 py-3">
        <div className="w-100 mx-auto" style={{ maxWidth: '600px' }}>
          
          {/* Profile Header: Scaled down to fit screen */}
          <div className="d-flex flex-column align-items-center mb-4 pt-2 text-center">
            <div className="mb-2">
              <img
                src="src/assets/icons/Sigma.png"
                className="rounded-circle border border-2 border-white shadow-sm"
                width={90} // Reduced from 120
                alt="profile"
              />
            </div>
            <h4 className="text-white fw-bold mb-1">Student User</h4>
            <p className="small text-white mb-0 opacity-75">student@biust.ac.bw</p>
            <p className="small text-white-50">Block A, Room 102</p>
          </div>

          <div className="d-flex flex-column gap-3">
            
            {/* App Preferences */}
            <section>
              <p className="text-white-50 fw-bold text-uppercase mb-2 px-2" style={{ fontSize: '12px', letterSpacing: '1px' }}>
                App Preferences
              </p>
              <div className="d-flex flex-column gap-2">
                <SettingRow 
                  icon="notifications" 
                  label="Push Notifications" 
                  toggle 
                  checked={notifications} 
                  onChange={() => setNotifications(!notifications)} 
                />
                <SettingRow 
                  icon="dark_mode" 
                  label="Dark Mode" 
                  toggle 
                  checked={darkMode} 
                  onChange={() => setDarkMode(!darkMode)} 
                />
                <SettingRow 
                  icon="language" 
                  label="Language" 
                  value="English" 
                />
              </div>
            </section>

            {/* Support Section */}
            <section>
              <p className="text-white-50 fw-bold text-uppercase mb-2 px-2" style={{ fontSize: '12px', letterSpacing: '1px' }}>
                Support & About
              </p>
              <div className="d-flex flex-column gap-2">
                <SettingRow icon="help" label="Help & FAQ" arrow />
                <SettingRow icon="bug_report" label="Report a Bug" arrow />
              </div>
            </section>

            {/* Logout Button: Reduced size and padding */}
            <section className="mt-2 pb-5">
              <button 
                onClick={handleLogout}
                className="btn w-100 py-3 rounded-4 fw-bold border-0" 
                style={{ 
                  background: '#dc2626', 
                  color: 'white',
                  fontSize: '16px'
                }}
              >
                LOGOUT
              </button>
            </section>

          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

function SettingRow({ icon, label, sublabel, toggle, checked, onChange, value, arrow }) {
  return (
    <div 
      className="rounded-4 px-3 py-2 d-flex align-items-center justify-content-between" 
      style={{ 
        /* FIXED: Using your preferred transparent glass style */
        background: 'rgba(255, 255, 255, 0.05)', 
        backdropFilter: 'blur(20px)', 
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)' 
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <span className="material-symbols-rounded fs-4" style={{ color: '#3d7a77' }}>{icon}</span>
        <div>
          <span className="fw-bold text-white d-block" style={{ fontSize: '14px' }}>{label}</span>
          {sublabel && <p className="mb-0 text-white-50" style={{ fontSize: '12px' }}>{sublabel}</p>}
        </div>
      </div>
      
      {toggle && (
        <div
          onClick={onChange}
          className="position-relative"
          style={{ 
            width: '44px', 
            height: '24px', 
            background: checked ? '#3d7a77' : 'rgba(255,255,255,0.2)', 
            borderRadius: '12px', 
            cursor: 'pointer',
            transition: '0.3s'
          }}
        >
          <div 
            className="position-absolute bg-white rounded-circle" 
            style={{ 
              width: '18px', 
              height: '18px', 
              top: '3px', 
              left: checked ? '23px' : '3px',
              transition: '0.3s' 
            }} 
          />
        </div>
      )}
      
      {value && <span className="text-white-50 fw-bold" style={{ fontSize: '13px' }}>{value}</span>}
      {arrow && <span className="material-symbols-rounded text-white-50 fs-4">chevron_right</span>}
    </div>
  );
}