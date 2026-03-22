import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';
import logo from '../assets/icons/logo.svg';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="phone-wrapper">
        <button className="back-btn" onClick={() => navigate('/')}>?</button>
        
        <div className="glass-card text-center">
          <img src={logo} alt="BIUST" className="mb-3" style={{ width: '60px' }} />
          <h2 className="text-white fw-bold mb-4">Sign In</h2>

          <div className="mb-3 text-start">
            <label className="text-white-50 small ms-2">ID Number</label>
            <input type="text" className="form-control bg-transparent text-white border-secondary" placeholder="Enter ID" />
          </div>

          <div className="mb-4 text-start">
            <label className="text-white-50 small ms-2">Password</label>
            <input type="password" className="form-control bg-transparent text-white border-secondary" placeholder="••••••••" />
          </div>

          <button className="btn w-100 py-2 fw-bold text-white" style={{ backgroundColor: '#003366', borderRadius: '10px' }}>
            Login
          </button>
          
          {/* orange on hover link */}
          <style>{.forgot-link:hover { color: orange !important; }}</style>
          <div className="mt-3">
            <a href="#" className="forgot-link text-white-50 small text-decoration-none">Forgot Password?</a>
          </div>
        </div>
      </div>
    </div>
  );
}
