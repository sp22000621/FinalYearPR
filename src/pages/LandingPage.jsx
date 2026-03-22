import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';
import logo from '../assets/icons/logo.svg';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="main-app-container">
      <div className="glass-card">
        <div className="mb-4 text-center">
          <div className="d-flex justify-content-center">
            <img src={logo} alt="BIUST" style={{ width: '80px', backgroundColor: 'white', padding: '10px', borderRadius: '15px' }} />
          </div>
          <h1 className="fw-bold mt-3 text-white">Welcome</h1>
          <p className="text-white opacity-75 small">Facility management and issue reporting platform.</p>
        </div>

        <p className="small fw-bold mb-4 text-white-50 text-center" style={{ letterSpacing: '1px' }}>CLICK TO PROCEED TO SIGN IN PAGE</p>
        
        <div className="role-box shadow-sm" onClick={() => navigate('/student-login')}>
          <div className="d-flex align-items-center text-start">
            <div className="icon-circle bg-light">
              <span className="material-symbols-rounded">person</span>
            </div>
            <div>
              <div className="fw-bold">Student</div>
              <div className="small text-muted">Report & Track</div>
            </div>
          </div>
          <span className="text-muted material-symbols-rounded" style={{fontSize: '18px'}}>arrow_forward_ios</span>
        </div>

        <div className="role-box shadow-sm" onClick={() => navigate('/faculty-login')}>
          <div className="d-flex align-items-center text-start">
            <div className="icon-circle bg-dark">
              <span className="material-symbols-rounded text-white">work</span>
            </div>
            <div>
              <div className="fw-bold">Faculty Manager</div>
              <div className="small text-muted">Manage Workloads</div>
            </div>
          </div>
          <span className="text-muted material-symbols-rounded" style={{fontSize: '18px'}}>arrow_forward_ios</span>
        </div>
      </div>
    </div>
  );
}
