import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';
import '../styles/Dashboard.css';

/* Student Dashboard: Displays summary and active maintenance requests */
export default function StudentHome() {
  const navigate = useNavigate();
  
  /* MockFAKE data for the issue tracking list */
  const reports = [
    { id: '#REQ-4092', title: 'Leaking tap in Block A bathroom', status: 'Overdue', time: '3 days ago', type: 'Plumbing', color: '#dc2626', bg: '#fee2e2' },
    { id: '#REQ-4105', title: 'Broken window latch in Room 204', status: 'Queued', time: 'Just now', type: 'Structural', color: '#0891b2', bg: '#ecfeff' },
    { id: '#REQ-4088', title: 'AC unit making loud noises', status: 'In Progress', time: '1 week ago', type: 'Electrical', color: '#d97706', bg: '#fef3c7' }
  ];

  return (
    <StudentLayout>
      <div className="main-content">
        {/* Dashboard Header */}
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
          <button className="btn text-white opacity-75 hover-orange p-0" onClick={() => navigate('/student/settings')}>
            <span className="material-symbols-rounded">settings</span>
          </button>
        </header>

        <div className="container-fluid px-4">
          {/* Main Action Cards */}
          <div className="row mb-4">
            <div className="col-12 col-md-6 mb-3 mb-md-0">
              {/* This button now navigates to your new report page */}
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

          {/* Recent Reports List */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-white fw-bold mb-0">Recent Reports</h6>
            <button className="btn btn-link text-decoration-none p-0 fw-semibold" style={{color: '#3d7a77'}}>See All</button>
          </div>

          <div className="row g-3">
            {reports.map((item, index) => (
              <div key={index} className="col-12 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small fw-bold">{item.id}</span>
                    <span className="badge rounded-pill px-3 py-1" style={{backgroundColor: item.bg, color: item.color}}>
                      {item.status}
                    </span>
                  </div>
                  <h6 className="fw-bold text-dark mb-3">{item.title}</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{item.time}</small>
                    <span className="badge bg-light text-dark border px-3 py-1 rounded-pill">{item.type}</span>
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