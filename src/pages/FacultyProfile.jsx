import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacultyLayout from '../components/FacultyLayout';

export default function FacultyProfile() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);

  return (
    <FacultyLayout>
      <div className="container py-4 no-scrollbar" style={{ maxWidth: '600px', height: '100vh', overflowY: 'auto' }}>
        
        {/* Profile Header */}
        <div className="d-flex flex-column align-items-center mb-5 pt-4">
          <div className="position-relative">
            <img 
              src="https://ui-avatars.com/api/?name=Kagiso&background=3d7a77&color=fff&size=90" 
              className="rounded-circle border border-2 border-opacity-25 border-white shadow-lg" 
              width={90} 
              alt="profile" 
            />
            <div className="position-absolute bottom-0 end-0 p-1 bg-success rounded-circle border border-2 border-dark" style={{ width: '15px', height: '15px' }}></div>
          </div>
          <h4 className="fw-bold text-white mt-3 mb-0">Kagiso Moeng</h4>
          <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.5)' }}>Maintenance Operator</p>
          <p className="opacity-50 text-white" style={{ fontSize: '12px' }}>kagiso@biust.ac.bw</p>
        </div>

        {/* Settings Groups */}
        <div className="d-flex flex-column gap-2 pb-5">
          <p className="text-uppercase fw-bold mb-2 px-2" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '1px' }}>
            App Preferences
          </p>
          
          <SettingRow 
            icon="notifications" 
            label="Push Notifications" 
            toggle 
            checked={notifications} 
            onChange={() => setNotifications(!notifications)} 
          />
          <SettingRow icon="language" label="Language" value="English" />

          <p className="text-uppercase fw-bold mb-2 mt-4 px-2" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '1px' }}>
            Support & About
          </p>
          
          <SettingRow icon="help" label="Help & FAQ" arrow />
          <SettingRow icon="bug_report" label="Report a Bug" arrow />
          <SettingRow icon="privacy_tip" label="Privacy Policy" arrow />

          {/* Sign Out Button */}
          <button 
            onClick={() => navigate('/')} 
            className="btn w-100 mt-5 py-3 rounded-4 fw-bold shadow-sm" 
            style={{ 
              background: 'rgba(220, 38, 38, 0.15)', 
              color: '#ff4d4d', 
              border: '1px solid rgba(220, 38, 38, 0.3)',
              fontSize: '14px'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </FacultyLayout>
  );
}

// Internal Helper Component for Setting Rows
function SettingRow({ icon, label, toggle, checked, onChange, value, arrow }) {
  return (
    <div 
      className="d-flex align-items-center justify-content-between px-3 py-3" 
      style={{ 
        background: 'rgba(255,255,255,0.07)', 
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '18px',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <span className="material-symbols-rounded" style={{ color: '#3d7a77', fontSize: '22px' }}>{icon}</span>
        <span className="text-white small fw-semibold">{label}</span>
      </div>

      <div className="d-flex align-items-center">
        {toggle && (
          <div 
            onClick={onChange} 
            className="position-relative cursor-pointer transition-all" 
            style={{ 
              width: '42px', 
              height: '22px', 
              background: checked ? '#3d7a77' : 'rgba(255,255,255,0.2)', 
              borderRadius: '20px',
              transition: '0.3s'
            }}
          >
            <div 
              className="position-absolute bg-white rounded-circle shadow-sm" 
              style={{ 
                width: '18px', 
                height: '18px', 
                top: '2px',
                left: checked ? '22px' : '2px',
                transition: '0.3s'
              }} 
            />
          </div>
        )}
        
        {value && <span className="small opacity-50 text-white">{value}</span>}
        
        {arrow && (
          <span className="material-symbols-rounded opacity-25 text-white" style={{ fontSize: '20px' }}>
            chevron_right
          </span>
        )}
      </div>
    </div>
  );
}