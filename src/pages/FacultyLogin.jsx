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
      if (role === 'senior') {
        navigate('/faculty-home'); 
      } else {
        navigate('/operator-home');
      }
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
      placeItems: 'center',
      position: 'relative'
    }}>
      {/* Back Button - Matched to 32px */}
      <button 
        className="back-btn border-0 bg-transparent text-white" 
        onClick={() => navigate('/')} 
        style={{ position: 'absolute', top: '20px', left: '20px', cursor: 'pointer' }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: '32px' }}>arrow_back</span>
      </button>

      <div className="glass-card text-center shadow-lg" style={{ 
        width: '90%', 
        maxWidth: '400px', // Slightly narrower to match student card
        padding: '30px', // Reduced padding
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Logo - Matched to 60px */}
        <div className="d-flex justify-content-center mb-3">
          <img src={logo} alt="BIUST" style={{ width: '60px', backgroundColor: 'white', padding: '10px', borderRadius: '12px' }} />
        </div>
        
        <h2 className="text-white fw-bold h4 mb-1">Faculty Sign In</h2>
        <p className="text-white-50 small mb-4">Management Access</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3 text-start">
            <label className="text-white-50 small ms-2 mb-1 d-block">Staff ID</label>
            <input 
              type="text" 
              className="form-control bg-transparent text-white border-secondary shadow-none" 
              placeholder="Enter ID" 
              style={{ borderRadius: '12px' }}
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            />
          </div>

          <div className="mb-4 text-start">
            <label className="text-white-50 small ms-2 mb-1 d-block">Password</label>
            <input 
              type="password" 
              className="form-control bg-transparent text-white border-secondary shadow-none" 
              placeholder="••••••••" 
              style={{ borderRadius: '12px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Standard Operator Login */}
          <button 
            type="button"
            onClick={() => handleLogin('operator')}
            className="btn w-100 py-2 fw-bold text-white mb-3 shadow-sm border-0" 
            style={{ backgroundColor: '#003366', borderRadius: '12px' }}
          >
            LOGIN
          </button>

          {/* Senior Faculty Login - Matches the secondary button style */}
          <button 
            type="button"
            onClick={() => handleLogin('senior')}
            className="btn w-100 py-2 fw-bold shadow-sm border-0" 
            style={{ 
              background: '#3d7a77', 
              color: 'white',
              borderRadius: '12px'
            }}
          >
            SENIOR LOGIN
          </button>
          
          <div className="mt-3">
            <a href="#" className="forgot-link text-white-50 small text-decoration-none">Forgot Password?</a>
          </div>
        </form>
      </div>

      <style>{`
        .btn:hover { opacity: 0.9; transform: translateY(-1px); transition: 0.2s; }
        input::placeholder { color: rgba(255,255,255,0.3) !important; font-size: 0.9rem; }
        input:focus { border-color: #3d7a77 !important; }
      `}</style>
    </div>
  );
}