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
      // FIX: Swapping the logic so 'senior' goes to the existing dashboard
      // and 'operator' goes to the upcoming Loveable page.
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
      {/* Back Button */}
      <button 
        className="back-btn" 
        onClick={() => navigate('/')} 
        style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: '40px' }}>arrow_back</span>
      </button>

      <div className="glass-card text-center shadow-lg" style={{ 
        width: '90%', 
        maxWidth: '450px', 
        padding: '40px', 
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <img src={logo} alt="BIUST" className="mb-3" style={{ width: '80px', backgroundColor: 'white', padding: '10px', borderRadius: '15px' }} />
        
        <h2 className="text-white fw-bold display-6 mb-2">Faculty Sign In</h2>
        <p className="text-white-50 fs-5 mb-4">Management Access</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-3 text-start">
            <label className="text-white-50 fw-bold ms-2 mb-1 d-block fs-6">Staff ID</label>
            <input 
              type="text" 
              className="form-control bg-transparent text-white border-secondary py-3 fs-5 shadow-none" 
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
              className="form-control bg-transparent text-white border-secondary py-3 fs-5 shadow-none" 
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
            className="btn w-100 py-3 fw-bold text-white mb-3 shadow-sm border-0 transition-all" 
            style={{ backgroundColor: '#003366', borderRadius: '12px', fontSize: '1.1rem' }}
          >
            LOGIN
          </button>

          {/* Senior Faculty Login */}
          <button 
            type="button"
            onClick={() => handleLogin('senior')}
            className="btn w-100 py-3 fw-bold text-white rounded-4 shadow-sm border-0 transition-all" 
            style={{ 
              background: '#3d7a77', 
              fontSize: '1.1rem',
              letterSpacing: '1px'
            }}
          >
            SENIOR LOGIN
          </button>
          
          <style>{`
            .btn:hover { opacity: 0.9; transform: translateY(-1px); }
            .btn:active { transform: translateY(0); }
            .forgot-link:hover { color: orange !important; }
            input::placeholder { color: rgba(255,255,255,0.3) !important; }
            input:focus { border-color: #3d7a77 !important; }
          `}</style>

          <div className="mt-4">
            <a href="#" className="forgot-link text-white-50 fw-bold text-decoration-none fs-6">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}