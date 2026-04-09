import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';
import '../styles/Dashboard.css';

export default function StudentHome() {
  const navigate = useNavigate();
  
  const reports = [
    { id: '#REQ-4092', title: 'Leaking tap in Block A bathroom', status: 'Overdue', time: '3 days ago', type: 'Plumbing', color: '#ff4d4d', bg: 'rgba(220, 38, 38, 0.2)' },
    { id: '#REQ-4105', title: 'Broken window latch in Room 204', status: 'Queued', time: 'Just now', type: 'Structural', color: '#4ddbff', bg: 'rgba(8, 145, 178, 0.2)' },
    { id: '#REQ-4088', title: 'AC unit making loud noises', status: 'In Progress', time: '1 week ago', type: 'Electrical', color: '#ffb347', bg: 'rgba(217, 119, 6, 0.2)' }
  ];

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.05)', 
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s ease'
  };

  return (
    <StudentLayout>
      <div className="main-content">
        <header className="d-flex justify-content-between align-items-center p-4">
          <div className="d-flex align-items-center gap-3">
            <img 
              src="https://ui-avatars.com/api/?name=Student&background=3d7a77&color=fff" 
              className="rounded-circle" 
              width="45" 
              alt="profile" 
            />
            <div className="text-white">
              <h6 className="mb-0 fw-bold">Hello, Student!</h6>
              <small className="opacity-75">Block A, Room 102</small>
            </div>
          </div>
          <button className="btn text-white opacity-75 p-0" onClick={() => navigate('/student/settings')}>
            <span className="material-symbols-rounded">settings</span>
          </button>
        </header>

        <div className="container-fluid px-4 pb-5">
          {/* Top Row Cards */}
          <div className="row mb-4">
            <div className="col-12 col-md-6 mb-3 mb-md-0">
              <button className="report-main-card shadow-lg h-100 w-100 border-0" onClick={() => navigate('/student/report')}>
                <div className="icon-circle"><span className="material-symbols-rounded">add</span></div>
                <div className="text-start">
                  <h5 className="mb-0 fw-bold">Report New Issue</h5>
                  <p className="mb-0 small opacity-75">Log a maintenance request</p>
                </div>
              </button>
            </div>
            <div className="col-12 col-md-6">
              <button className="my-issues-card shadow-sm h-100 w-100 border-0 d-flex align-items-center gap-3 px-4 rounded-4" onClick={() => navigate('/student/issues')}>
                <span className="material-symbols-rounded fs-5" style={{color: '#3d7a77'}}>assignment</span>
                <div className="text-start text-dark">
                  <h6 className="mb-0 fw-bold">My Issues</h6>
                  <small className="text-muted">View history and track status</small>
                </div>
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-white fw-bold mb-0">Recent Reports</h6>
            <button className="btn btn-link text-decoration-none p-0 fw-semibold" style={{color: '#3d7a77'}}>See All</button>
          </div>

          {/* RECENT REPORTS GRID */}
          <div className="row g-3">
            {reports.map((item, index) => (
              <div key={index} className="col-12 col-lg-4">
                <div style={glassStyle}>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-white opacity-50 small fw-bold">{item.id}</span>
                    <span 
                      className="badge rounded-pill px-3 py-1" 
                      style={{ backgroundColor: item.bg, color: item.color, border: `1px solid ${item.color}44` }}
                    >
                      {item.status}
                    </span>
                  </div>
                  
                  <h6 className="fw-bold text-white mb-4">{item.title}</h6>
                  
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <small className="text-white opacity-50">{item.time}</small>
                    <span 
                      className="badge px-3 py-1 rounded-pill"
                      style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                    >
                      {item.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}