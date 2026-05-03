import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import logo from '../assets/icons/logo.svg';
import wallpaper from '../assets/images/wallpaper.png'; 

export default function FacultyLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // CONFIG: Magic Link settings
  const actionCodeSettings = {
    url: window.location.href, // Returns user back to this exact page
    handleCodeInApp: true,
  };

  // EFFECT: Catch the user when they click the link in their email
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      setIsLoggingIn(true);
      let savedEmail = window.localStorage.getItem('emailForSignIn');
      
      // If user opened link on a different device/browser, ask for email
      if (!savedEmail) {
        savedEmail = window.prompt('Please provide your BIUST email for confirmation');
      }

      signInWithEmailLink(auth, savedEmail, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
          navigate('/dashboard-redirector'); // App.jsx handle the role routing
        })
        .catch((error) => {
          console.error(error);
          setStatusMsg("Link expired or invalid. Please request a new one.");
          setIsLoggingIn(false);
        });
    }
  }, [navigate]);

  const handleMagicLinkRequest = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setStatusMsg('');

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setStatusMsg("Success! Check your email for the login link.");
    } catch (error) {
      console.error(error);
      setStatusMsg("Failed to send link. Check your connection.");
    } finally {
      setIsLoggingIn(false);
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
        className="back-btn border-0 bg-transparent text-white" 
        onClick={() => navigate('/')} 
        style={{ position: 'absolute', top: '20px', left: '20px', cursor: 'pointer' }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: '32px' }}>arrow_back</span>
      </button>

      <div className="glass-card text-center shadow-lg" style={{ 
        width: '90%', 
        maxWidth: '400px', 
        padding: '30px', 
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Logo */}
        <div className="d-flex justify-content-center mb-3">
          <img src={logo} alt="BIUST" style={{ width: '60px', backgroundColor: 'white', padding: '10px', borderRadius: '12px' }} />
        </div>
        
        <h2 className="text-white fw-bold h4 mb-1">Faculty Sign In</h2>
        <p className="text-white-50 small mb-4">Passwordless Management Access</p>

        {statusMsg && (
          <div className="mb-3 small p-2 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: '#3d7a77', border: '1px solid #3d7a77' }}>
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleMagicLinkRequest}>
          <div className="mb-4 text-start">
            <label className="text-white-50 small ms-2 mb-1 d-block">BIUST Email</label>
            <input 
              type="email" 
              className="form-control bg-transparent text-white border-secondary shadow-none" 
              placeholder="staff@biust.ac.bw" 
              style={{ borderRadius: '12px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoggingIn}
            className="btn w-100 py-3 fw-bold text-white mb-3 shadow-sm border-0" 
            style={{ 
              backgroundColor: isLoggingIn ? '#2c3e50' : '#003366', 
              borderRadius: '12px',
              transition: 'all 0.3s'
            }}
          >
            {isLoggingIn ? 'SENDING LINK...' : 'SEND MAGIC LINK'}
          </button>
          
          <div className="mt-2">
            <p className="text-white-50 small">
              We'll email you a secure link to sign in instantly.
            </p>
          </div>
        </form>
      </div>

      <style>{`
        .btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); background-color: #3d7a77 !important; }
        input::placeholder { color: rgba(255,255,255,0.3) !important; font-size: 0.9rem; }
        input:focus { border-color: #3d7a77 !important; outline: none; }
      `}</style>
    </div>
  );
}