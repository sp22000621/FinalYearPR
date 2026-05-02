import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import logo from '../assets/icons/logo.svg';
import wallpaper from '../assets/images/wallpaper.png'; 

export default function FacultyLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); // Firebase Auth
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      // 1. Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Database Role Check
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const role = userData.role;

        // 3. Smart Redirect
        if (role === "Senior Faculty") {
          navigate('/faculty-home'); 
        } else if (role === "Junior Faculty") {
          navigate('/operator-home');
        } else {
          alert("Access Denied: Role not recognized.");
          await auth.signOut();
        }
      } else {
        alert("No faculty record found for this account.");
        await auth.signOut();
      }
    } catch (error) {
      console.error(error);
      alert("Invalid Credentials or Network Error");
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
        <p className="text-white-50 small mb-4">Management Access</p>

        <form onSubmit={handleLogin}>
          <div className="mb-3 text-start">
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
            className="btn w-100 py-2 fw-bold text-white mb-3 shadow-sm border-0" 
            style={{ 
              backgroundColor: isLoggingIn ? '#2c3e50' : '#003366', 
              borderRadius: '12px',
              transition: 'all 0.3s'
            }}
          >
            {isLoggingIn ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
          
          <div className="mt-2">
            <a href="#" className="forgot-link text-white-50 small text-decoration-none">Forgot Password?</a>
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