import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import '../styles/Landing.css';
import logo from '../assets/icons/logo.svg';

export default function StudentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const actionCodeSettings = {
    url: window.location.href, 
    handleCodeInApp: true,
  };

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      setIsLoggingIn(true);
      let savedEmail = window.localStorage.getItem('emailForSignIn');
      
      if (!savedEmail) {
        savedEmail = window.prompt('Please confirm your student email:');
      }

      signInWithEmailLink(auth, savedEmail, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
          // No need to specify where to go—App.jsx redirector handles it
          navigate('/student-home'); 
        })
        .catch((error) => {
          console.error(error);
          setStatusMsg("Link expired. Please try again.");
          setIsLoggingIn(false);
        });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setStatusMsg('');

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setStatusMsg("Magic link sent! Check your student inbox.");
    } catch (error) {
      console.error(error);
      setStatusMsg("Error sending link. Try again later.");
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
          <div className="mb-4 text-start">
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
            {isLoggingIn ? 'SENDING...' : 'GET MAGIC LINK'}
          </button>

          <div className="mt-4">
            <p className="text-white-50 small" style={{ lineHeight: '1.4' }}>
              One link for all access levels.<br/>
              Check your inbox to continue.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}