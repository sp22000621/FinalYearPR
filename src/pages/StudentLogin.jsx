import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../styles/Landing.css';
import logo from '../assets/icons/logo.svg';

export default function StudentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setStatusMsg('');

    try {
      // Direct Sign-in using the credentials created in the Admin Panel
      await signInWithEmailAndPassword(auth, email, password);
      
      //  App.jsx or Protected Route will handle the redirect
      //  for immediate feedback
      navigate('/student-home'); 
    } catch (error) {
      console.error(error);
      // Friendly error messages based on Firebase codes
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setStatusMsg("Invalid email or password.");
      } else if (error.code === 'auth/too-many-requests') {
        setStatusMsg("Too many failed attempts. Try again later.");
      } else {
        setStatusMsg("Login failed. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="main-app-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        <span className="material-symbols-rounded" style={{fontSize: '32px'}}>arrow_back</span>
      </button>

      <div className="glass-card text-center">
        <div className="d-flex justify-content-center mb-3">
          <img src={logo} alt="BIUST" style={{ width: '60px', backgroundColor: 'white', padding: '10px', borderRadius: '12px' }} />
        </div>
        <h2 className="text-white fw-bold">Student Portal</h2>
        <p className="text-white-50 small mb-4">Secure Sign In</p>

        {statusMsg && (
          <div className="alert py-2 small mb-3" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3 text-start">
            <label className="text-white-50 small ms-2">University Email</label>
            <input 
              type="email" 
              className="form-control bg-transparent text-white border-secondary shadow-none" 
              placeholder="id-number@student.biust.ac.bw"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 text-start">
            <label className="text-white-50 small ms-2">Password</label>
            <input 
              type="password" 
              className="form-control bg-transparent text-white border-secondary shadow-none" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="btn w-100 py-3 fw-bold text-white shadow-sm" 
            style={{ 
              backgroundColor: isLoggingIn ? '#2c3e50' : '#003366', 
              borderRadius: '12px',
              transition: 'all 0.3s'
            }}
          >
            {isLoggingIn ? 'SIGNING IN...' : 'LOGIN'}
          </button>

          <div className="mt-4">
            <style>{`.forgot-link:hover { color: orange !important; transition: 0.3s; }`}</style>
            <a 
              href="#" 
              className="forgot-link text-white-50 small text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                // willAdd password reset logic here later
                alert("Password reset feature coming soon.");
              }}
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}