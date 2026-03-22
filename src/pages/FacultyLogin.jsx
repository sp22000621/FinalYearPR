import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';
import logo from '../assets/icons/logo.svg';

export default function FacultyLogin() {
  const navigate = useNavigate();

  return (
    <div className="main-app-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        <span className="material-symbols-rounded" style={{fontSize: '32px'}}>arrow_back</span>
      </button>

      <div className="glass-card text-center">
        <div className="d-flex justify-content-center mb-3">
          <img src={logo} alt="BIUST" style={{ width: '60px', backgroundColor: 'white', padding: '10px', borderRadius: '12px' }} />
        </div>
        <h2 className="text-white fw-bold">Faculty Login</h2>
        <p className="text-white-50 small mb-4">Management Access</p>

        <div className="mb-3 text-start">
          <label className="text-white-50 small ms-2">Staff ID</label>
          <input type="text" className="form-control bg-transparent text-white border-secondary shadow-none" placeholder="Staff Number" />
        </div>

        <div className="mb-4 text-start">
          <label className="text-white-50 small ms-2">Password</label>
          <input type="password" className="form-control bg-transparent text-white border-secondary shadow-none" placeholder="Enter Password" />
        </div>

        <button className="btn w-100 py-2 fw-bold text-white shadow-sm" style={{ backgroundColor: '#003366', borderRadius: '12px' }}>
          Login
        </button>
        
        <div className="mt-3">
          <a href="#" className="forgot-link text-white-50 small text-decoration-none">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
