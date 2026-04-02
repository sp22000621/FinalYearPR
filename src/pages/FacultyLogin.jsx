import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/icons/logo.svg';
import wallpaper from '../assets/images/wallpaper.png'; 

export default function FacultyLogin() {
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role) => {
    if (staffId === '12345' && password === '12345') {
      navigate(role === 'senior' ? '/senior-faculty-home' : '/faculty-home');
    } else {
      alert('Invalid Credentials');
    }
  };

  return (
    <div className="app-container" style={{ 
      backgroundImage: `linear-gradient(rgba(0,51,102,0.7), rgba(0,51,102,0.7)), url(${wallpaper})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center'
    }}>
      <button className="back-btn" onClick={() => navigate('/')} style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
        <span className="material-symbols-rounded" style={{ fontSize: '40px' }}>arrow_back</span>
      </button>

      <div className="glass-card text-center" style={{ width: '90%', maxWidth: '450px', padding: '40px', borderRadius: '24px' }}>
        <img src={logo} alt="BIUST" className="mb-3" style={{ width: '80px', backgroundColor: 'white', padding: '10px', borderRadius: '15px' }} />
        
        {/* Same styling as Student Login */}
        <h2 className="text-white fw-bold display-6 mb-2">Faculty Sign In</h2>
        <p className="text-white-50 fs-5 mb-4">Management Access</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3 text-start">
            <label className="text-white-50 fw-bold ms-2 mb-1 d-block fs-6">Staff ID</label>
            <input 
              type="text" 
              className="form-control bg-transparent text-white border-secondary py-3 fs-5" 
              placeholder="Enter ID" 
              style={{ borderRadius: '12px' }}
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            />
          </div>

          <div className="mb-4 text-start">
            <label className="text-white-50 fw-bold ms-2 mb-1 d-block fs-6">Password</label>
            <input 
              type="password" 
              className="form-control bg-transparent text-white border-secondary py-3 fs-5" 
              placeholder="••••••••" 
              style={{ borderRadius: '12px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Solid Blue Button */}
          <button 
            type="button"
            onClick={() => handleLogin('operator')}
            className="btn w-100 py-3 fw-bold text-white mb-3 shadow-sm border-0" 
            style={{ backgroundColor: '#003366', borderRadius: '12px', fontSize: '1.2rem' }}
          >
            Login
          </button>

          <button 
                  type="button"
                  onClick={() => handleLogin('senior')}
                  className="btn w-100 py-3 fw-bold rounded-4 fs-5 border-0 shadow-sm transition-all" 
                  style={{ 
                    background: '#3d7a77', // BIUST Teal
                    color: 'white',
                    letterSpacing: '1px'
                  }}
                >
                      SENIOR LOGIN
          </button>
          
          <style>{`
            .forgot-link:hover { color: orange !important; }
            input::placeholder { color: rgba(255,255,255,0.3) !important; }
          `}</style>

          <div className="mt-4">
            <a href="#" className="forgot-link text-white-50 fw-bold text-decoration-none fs-6">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}