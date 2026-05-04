import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import logo from '../assets/icons/logo.svg';
import wallpaper from '../assets/images/wallpaper.png'; 

export default function FacultyLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // password state
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setStatusMsg('');

    try {
      // Direct sign-in using credentials created in Admin Panel
      await signInWithEmailAndPassword(auth, email, password);
      
      // Navigate to the Faculty side of the app
      navigate('/dashboard-redirector'); 
    } catch (error) {
      console.error(error);
      // Specific feedback for faculty users
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setStatusMsg("Invalid staff credentials.");
      } else {
        setStatusMsg("Login failed. Please check your connection.");
      }
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
        <p className="text-white-50 small mb-4">Management Access Portal</p>

        {statusMsg && (
          <div className="mb-3 small p-2 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3 text-start">
            <label className="text-white-50 small ms-2 mb-1 d-block">BIUST Staff Email</label>
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

          <div className="mb-4 text-start">
            <label className="text-white-50 small ms-2 mb-1 d-block">Password</label>
            <input 
              type="password" 
              className="form-control bg-transparent text-white border-secondary shadow-none" 
              placeholder="••••••••" 
              style={{ borderRadius: '12px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {isLoggingIn ? 'VERIFYING...' : 'LOGIN'}
          </button>
          
          <div className="mt-2">
            <p className="text-white-50 small">
              Secure access for authorized BIUST faculty only.
            </p>
          </div>
        </form>
      </div>

      <style>{`
        .btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); background-color: #3d7a77 !important; }
        input::placeholder { color: rgba(255,255,255,0.3) !important; font-size: 0.9rem; }
        input:focus { border-color: #3d7a77 !important; outline: none; background-color: rgba(255,255,255,0.05) !important; color: white !important; }
      `}</style>
    </div>
  );
}