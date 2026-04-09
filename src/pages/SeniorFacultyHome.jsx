import React, { useState } from 'react';
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

export default function SeniorFacultyHome() {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ 
    newReceived: 42, 
    assigned: 28, 
    resolvedToday: 14,
    completedByMe: 5 // New Stat requested
  });

  const [myReports, setMyReports] = useState([
    { id: 'MY-901', title: 'Network Rack Inspection', location: 'Server Room' },
    { id: 'MY-905', title: 'Backup Generator Test', location: 'Utility Block' }
  ]);

  const resolveReport = (id) => {
    setMyReports(myReports.filter(report => report.id !== id));
    setStats(prev => ({ ...prev, completedByMe: prev.completedByMe + 1 }));
  };

  return (
    <FacultyLayout>
      {/* Admin Header: Solid White */}
      <div className="p-4 bg-white shadow-sm border-bottom">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <img 
              src="https://ui-avatars.com/api/?name=Sir+Keapotse&background=3d7a77&color=fff&size=50" 
              className="rounded-circle border border-2 border-white shadow-sm" 
              width={50} 
              alt="profile" 
            />
            <div>
              <p className="mb-0 fw-bold text-muted small text-uppercase" style={{ letterSpacing: '1px', fontSize: '10px' }}>Senior Maintenance Operator</p>
              <h5 className="fw-bold mb-0 text-dark">Sir Keapotse</h5>
            </div>
          </div>
          <button className="btn btn-light rounded-circle p-2 shadow-sm border">
            <span className="material-symbols-rounded text-dark" style={{ fontSize: '20px' }}>search</span>
          </button>
        </div>
      </div>

      <div className="container-fluid p-4 p-md-5">
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>
          
          {/* RESTORED: Operational Overview with "Completed By Me" */}
          <h6 className="fw-bold mb-4 text-white text-uppercase" style={{ letterSpacing: '1.5px', fontSize: '13px' }}>Operational Overview</h6>
          <div className="row g-4 mb-5">
            <StatCard value={stats.newReceived} label="New Received" color="#3d7a77" />
            <StatCard value={stats.assigned} label="Assigned" color="#4ea1ff" />
            <StatCard value={stats.resolvedToday} label="Team Resolved" color="#4ade80" />
            <StatCard value={stats.completedByMe} label="Completed By Me" color="#f59e0b" />
          </div>

          <div className="row g-5">
            {/* Left Column: Team & Personal Tasks */}
            <div className="col-lg-7">
              <h6 className="fw-bold mb-4 text-white text-uppercase" style={{ letterSpacing: '1.5px', fontSize: '13px' }}>Team Workload</h6>
              <div className="d-flex flex-column gap-3 mb-5">
                {teamWorkload.map((member) => (
                  <div key={member.name} className="rounded-4 p-3 d-flex align-items-center justify-content-between shadow-lg" 
                       style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(15px)' }}>
                    <div className="d-flex align-items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${member.avatar}&background=3d7a77&color=fff&size=40`} className="rounded-circle shadow-sm" width={40} alt={member.name} />
                      <div>
                        <h6 className="fw-bold text-white mb-0" style={{ fontSize: '14px' }}>{member.name}</h6>
                        <p className="text-white-50 mb-0 small" style={{ fontSize: '11px' }}>{member.role}</p>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <span className="badge rounded-pill px-3 py-2" style={{ background: 'rgba(61,122,119,0.2)', color: '#fff', fontSize: '11px' }}>{member.assigned}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h6 className="fw-bold mb-4 text-white text-uppercase" style={{ letterSpacing: '1.5px', fontSize: '13px' }}>My Pending Reports</h6>
              <div className="d-flex flex-column gap-3">
                {myReports.map((report) => (
                  <div key={report.id} className="rounded-4 p-3 d-flex align-items-center justify-content-between shadow-lg" 
                       style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(15px)' }}>
                    <div>
                       <span className="badge bg-primary mb-1" style={{ fontSize: '9px' }}>{report.id}</span>
                       <h6 className="fw-bold text-white mb-0" style={{ fontSize: '14px' }}>{report.title}</h6>
                       <p className="text-white-50 mb-0 small" style={{ fontSize: '11px' }}>📍 {report.location}</p>
                    </div>
                    <button onClick={() => resolveReport(report.id)} className="btn btn-sm px-3 fw-bold" style={{ background: '#16a34a', color: 'white', fontSize: '11px' }}>Mark Resolved</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: General Assignments */}
            <div className="col-lg-5">
              <h6 className="fw-bold mb-4 text-white text-uppercase" style={{ letterSpacing: '1.5px', fontSize: '13px' }}>Pending Assignment</h6>
              <div className="d-flex flex-column gap-3">
                {pendingAssignments.map((item) => (
                  <div key={item.id} className="rounded-4 p-3 shadow-lg" 
                       style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(15px)' }}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className="badge bg-dark mb-2" style={{ fontSize: '10px' }}>{item.id}</span>
                        <h6 className="fw-bold text-white mb-1" style={{ fontSize: '15px' }}>{item.title}</h6>
                        <p className="text-white-50 mb-0 small" style={{ fontSize: '12px' }}>📍 {item.location}</p>
                      </div>
                      <span className="badge bg-white text-dark small" style={{ opacity: 0.8, fontSize: '10px' }}>{item.time}</span>
                    </div>
                    <div className="d-flex gap-2 pt-2">
                      <button className="btn flex-grow-1 py-2 fw-bold" style={{ color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', fontSize: '12px', background: 'rgba(255,255,255,0.05)' }}>Take</button>
                      <button className="btn flex-grow-1 py-2 fw-bold text-white shadow-sm" style={{ background: '#3d7a77', fontSize: '12px' }}>Assign</button>
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
    <div className="col-md-3">
      <div className="rounded-4 p-4 text-center shadow-lg h-100" 
           style={{ background: 'rgba(255,255,255,0.95)', borderTop: `5px solid ${color}` }}>
        <div className="h2 fw-bold mb-1" style={{ color: color }}>{value}</div>
        <div className="small fw-bold text-muted text-uppercase" style={{ fontSize: '10px' }}>{label}</div>
      </div>
    </div>
  );
}