import React from 'react';
import { useNavigate } from 'react-router-dom';
import FacultyLayout from '../components/FacultyLayout';

const teamWorkload = [
  { name: 'Dave', role: 'Plumbing Specialist', assigned: 5, resolved: 3, avatar: 'Dave' },
  { name: 'Mr Peo', role: 'Electrical Technician', assigned: 2, resolved: 6, avatar: 'Peo' },
  { name: 'Lumbiel', role: 'General Maintenance', assigned: 4, resolved: 8, avatar: 'Lumbiel' },
];

const pendingAssignments = [
  { id: 'REQ-4110', title: 'Leaking Pipe', location: 'Block C, Room 204', time: '10m ago' },
  { id: 'REQ-4112', title: 'Power Outage', location: 'Study Hall A', time: '25m ago' },
];

const stats = { newReceived: 42, assigned: 28, resolvedToday: 14 };

export default function SeniorFacultyHome() {
  const navigate = useNavigate();

  return (
    <FacultyLayout>
      {/* Admin Header: Solid background for hierarchy */}
      <div className="p-4 bg-white shadow-sm border-bottom">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <img 
              src="https://ui-avatars.com/api/?name=Sir+Keapotse&background=3d7a77&color=fff&size=60" 
              className="rounded-circle border border-2 border-white shadow-sm" 
              width={60} 
              alt="profile" 
            />
            <div>
              <p className="mb-0 fw-bold text-muted small text-uppercase" style={{ letterSpacing: '1px' }}>Senior Maintenance Operator</p>
              <h4 className="fw-bold mb-0 text-dark">Sir Keapotse</h4>
            </div>
          </div>
          <button className="btn btn-light rounded-circle p-2 shadow-sm border">
            <span className="material-symbols-rounded text-dark">search</span>
          </button>
        </div>
      </div>

      <div className="container-fluid p-4 p-md-5">
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>
          
          {/* Overview Section: Large Stats */}
          <h5 className="fw-bold mb-4 text-white text-uppercase" style={{ letterSpacing: '1.5px' }}>Operational Overview</h5>
          <div className="row g-4 mb-5">
            <StatCard value={stats.newReceived} label="New Received" color="#3d7a77" />
            <StatCard value={stats.assigned} label="Currently Assigned" color="#003366" />
            <StatCard value={stats.resolvedToday} label="Resolved Today" color="#16a34a" />
          </div>

          <div className="row g-5">
            {/* Team Management Column */}
            <div className="col-lg-7">
              <h5 className="fw-bold mb-4 text-white text-uppercase" style={{ letterSpacing: '1.5px' }}>Team Workload</h5>
              <div className="d-flex flex-column gap-3">
                {teamWorkload.map((member) => (
                  <div key={member.name} className="glass-card rounded-4 p-4 d-flex align-items-center justify-content-between shadow-sm" 
                       style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <div className="d-flex align-items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${member.avatar}&background=3d7a77&color=fff&size=50`} className="rounded-circle shadow-sm" width={50} alt={member.name} />
                      <div>
                        <h5 className="fw-bold text-dark mb-0">{member.name}</h5>
                        <p className="text-muted mb-0 fw-medium">{member.role}</p>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <span className="badge rounded-pill px-3 py-2 fs-6" style={{ background: 'rgba(61,122,119,0.1)', color: '#3d7a77', border: '1px solid rgba(61,122,119,0.2)' }}>
                        {member.assigned}
                      </span>
                      <span className="badge rounded-pill px-3 py-2 fs-6" style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', border: '1px solid rgba(22,163,74,0.2)' }}>
                        {member.resolved}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments Column: Added privilege work */}
            <div className="col-lg-5">
              <h5 className="fw-bold mb-4 text-white text-uppercase" style={{ letterSpacing: '1.5px' }}>Pending Assignment</h5>
              <div className="d-flex flex-column gap-3">
                {pendingAssignments.map((item) => (
                  <div key={item.id} className="glass-card rounded-4 p-4 shadow-sm" 
                       style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className="badge bg-dark mb-2">{item.id}</span>
                        <h5 className="fw-bold text-dark mb-1 fs-4">{item.title}</h5>
                        <p className="text-muted mb-0 fs-6 fw-medium">📍 {item.location}</p>
                      </div>
                      <span className="badge bg-light text-dark border">{item.time}</span>
                    </div>
                    <div className="d-flex gap-2 pt-2">
                      <button className="btn flex-grow-1 py-2 fw-bold fs-6" style={{ color: '#3d7a77', border: '2px solid #3d7a77' }}>
                        Take
                      </button>
                      <button className="btn flex-grow-1 py-2 fw-bold fs-6 text-white shadow-sm" style={{ background: '#003366' }}>
                        Assign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FacultyLayout>
  );
}

function StatCard({ value, label, color }) {
  return (
    <div className="col-md-4">
      <div className="glass-card rounded-4 p-4 text-center shadow-lg h-100" 
           style={{ background: 'rgba(255,255,255,0.95)', borderTop: `5px solid ${color}` }}>
        <div className="display-4 fw-bold mb-1" style={{ color: color }}>{value}</div>
        <div className="fs-5 fw-bold text-muted text-uppercase">{label}</div>
      </div>
    </div>
  );
}