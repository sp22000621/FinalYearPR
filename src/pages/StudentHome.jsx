import React from 'react';
import '../styles/Dashboard.css';

export default function StudentHome() {
  const reports = [
    { id: '#REQ-4092', title: 'Leaking tap in Block A', status: 'Overdue', time: '3 days ago', type: 'Plumbing', color: '#dc2626', bg: '#fee2e2' },
    { id: '#REQ-4105', title: 'Broken window latch', status: 'Queued', time: 'Just now', type: 'Structural', color: '#0891b2', bg: '#ecfeff' },
    { id: '#REQ-4088', title: 'AC unit making noises', status: 'In Progress', time: '1 week ago', type: 'Electrical', color: '#d97706', bg: '#fef3c7' }
  ];

  return (
    <div className="dashboard-wrapper d-flex">
      {/* Sidebar for Desktop/Tablet */}
      <aside className="d-none d-md-flex flex-column sidebar">
        <div className="p-4 text-center">
          <img src="/favicon.ico" width="40" alt="logo" />
        </div>
        <nav className="flex-grow-1 px-3">
          <div className="nav-link-custom active"><span className="material-symbols-rounded">home</span> Issues</div>
          <div className="nav-link-custom"><span className="material-symbols-rounded">notifications</span> Alerts</div>
          <div className="nav-link-custom"><span className="material-symbols-rounded">group</span> Communities</div>
          <div className="nav-link-custom"><span className="material-symbols-rounded">account_circle</span> Profile</div>
        </nav>
      </aside>

      <main className="flex-grow-1 main-content">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center p-4">
          <div className="d-flex align-items-center gap-3">
            <img src="https://ui-avatars.com/api/?name=Student&background=3d7a77&color=fff" className="rounded-circle" width="45" alt="profile" />
            <div className="text-white">
              <h6 className="mb-0 fw-bold">Hello, Student!</h6>
              <small className="opacity-75">Block A, Room 102</small>
            </div>
          </div>
          <button className="btn text-white opacity-75 hover-orange p-0">
            <span className="material-symbols-rounded">settings</span>
          </button>
        </header>

        <div className="container-fluid px-4">
          {/* Action Cards */}
          <div className="row mb-4">
            <div className="col-12 col-lg-6">
              <div className="report-main-card shadow-lg">
                <div className="icon-circle"><span className="material-symbols-rounded">add</span></div>
                <div>
                  <h5 className="mb-0 fw-bold">Report New Issue</h5>
                  <p className="mb-0 small opacity-75">Log a maintenance request</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 d-none d-lg-block">
               <div className="my-issues-card shadow-sm h-100 d-flex align-items-center gap-3 px-4 rounded-4 bg-white">
                  <span className="material-symbols-rounded text-teal">assignment</span>
                  <div className="text-dark">
                    <h6 className="mb-0 fw-bold">My Issues</h6>
                    <small className="text-muted">Track your status</small>
                  </div>
               </div>
            </div>
          </div>

          {/* Grid for Reports */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-white fw-bold mb-0">Recent Reports</h6>
            <button className="btn btn-link text-decoration-none p-0 hover-orange" style={{color: '#3d7a77'}}>See All</button>
          </div>

          <div className="row g-3">
            {reports.map((item, index) => (
              <div key={index} className="col-12 col-md-12 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small fw-bold">{item.id}</span>
                    <span className="badge rounded-pill" style={{backgroundColor: item.bg, color: item.color}}>{item.status}</span>
                  </div>
                  <h6 className="fw-bold text-dark mb-3">{item.title}</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{item.time}</small>
                    <span className="badge bg-light text-dark border px-3">{item.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="d-md-none fixed-bottom bg-white d-flex justify-content-around py-2 border-top">
          <div className="text-center text-teal"><span className="material-symbols-rounded">home</span><div style={{fontSize:'10px'}}>Issues</div></div>
          <div className="text-center text-muted"><span className="material-symbols-rounded">notifications</span><div style={{fontSize:'10px'}}>Alerts</div></div>
          <div className="text-center text-muted"><span className="material-symbols-rounded">group</span><div style={{fontSize:'10px'}}>Groups</div></div>
          <div className="text-center text-muted"><span className="material-symbols-rounded">account_circle</span><div style={{fontSize:'10px'}}>Profile</div></div>
        </nav>
      </main>
    </div>
  );
}
