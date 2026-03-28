import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';

/**
 * StudentProfile Component
 */
export default function StudentProfile() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/student-login');
  };

  return (
    <StudentLayout>
      <div className="container-fluid p-4 p-md-5">
        <div className="w-100 mx-auto" style={{ maxWidth: '900px' }}>
          
          {/* Profile Header: Centered layout with increased font scaling */}
          <div className="d-flex flex-column align-items-center mb-5 pt-4 text-center">
            <div className="position-relative mb-3">
              <img
                src="src\assets\icons\Sigma.png"
                className="rounded-circle border border-4 border-white shadow-lg"
                width={120}
                alt="profile"
              />
            </div>
            <h2 className="text-white fw-bold mb-1 display-5">Student User</h2>
            <p className="fs-4 fw-bold text-white mb-0">student@biust.ac.bw</p>
            <p className="fs-5 text-white-50">Block A, Room 102</p>
          </div>

          <div className="d-flex flex-column gap-4">
            
            {/* App Preferences Section */}
            <section>
              <p className="text-white fw-bold text-uppercase mb-3 px-2 fs-5" style={{ letterSpacing: '1px' }}>
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
              <p className="text-white fw-bold text-uppercase mb-3 px-2 fs-5" style={{ letterSpacing: '1px' }}>
                Support & About
              </p>
              <div className="d-flex flex-column gap-2">
                <SettingRow icon="help" label="Help & FAQ" arrow />
                <SettingRow icon="bug_report" label="Report a Bug" arrow />
              </div>
            </section>

            {/* Solid background for visibility against  wallpaper */}
            <section className="mt-4">
              <button 
                onClick={handleLogout}
                className="btn w-100 py-3 rounded-4 fw-bold fs-4 border-0 shadow-lg" 
                style={{ 
                  background: '#dc2626', 
                  color: 'white',
                  letterSpacing: '1px'
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

/**
 * SettingRow Sub-component
 
 */
function SettingRow({ icon, label, sublabel, toggle, checked, onChange, value, arrow }) {
  return (
    <div 
      className="rounded-4 px-4 py-3 d-flex align-items-center justify-content-between shadow-sm" 
      style={{ 
        background: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(10px)', 
        border: '1px solid rgba(255,255,255,0.3)' 
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <span className="material-symbols-rounded fs-2" style={{ color: '#3d7a77' }}>{icon}</span>
        <div>
          <span className="fw-bold fs-5 text-dark d-block">{label}</span>
          {sublabel && <p className="mb-0 fs-6 text-muted">{sublabel}</p>}
        </div>
      </div>
      
      {toggle && (
        <div
          onClick={onChange}
          className="position-relative"
          style={{ 
            width: '54px', 
            height: '28px', 
            background: checked ? '#3d7a77' : '#adb5bd', 
            borderRadius: '14px', 
            cursor: 'pointer',
            transition: '0.3s'
          }}
        >
          <div 
            className="position-absolute bg-white rounded-circle shadow-sm" 
            style={{ 
              width: '22px', 
              height: '22px', 
              top: '3px', 
              left: checked ? '29px' : '3px',
              transition: '0.3s' 
            }} 
          />
        </div>
      )}
      
      {value && <span className="fw-bold text-muted fs-5">{value}</span>}
      {arrow && <span className="material-symbols-rounded text-muted fs-2">chevron_right</span>}
    </div>
  );
}