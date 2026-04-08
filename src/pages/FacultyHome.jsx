import React from 'react';
import { useNavigate } from 'react-router-dom';
import FacultyLayout from '../components/FacultyLayout';

const assignedReports = [
  { id: 'REQ-4092', title: 'Massive leak in communal bathroom', location: 'Block B, 2nd Floor East Wing', desc: 'Water is flooding the corridor. Urgent attention required before it reaches the rooms.', type: 'Plumbing', time: '30 min ago', status: 'active', color: '#16a34a', bg: '#dcfce7' },
  { id: 'REQ-4101', title: 'Faulty wall socket sparking', location: 'Block C, Room 104', desc: 'Student reported sparks when plugging in a laptop charger. Socket is currently unusable.', type: 'Electrical', time: '2 hours ago', status: 'active', color: '#f97316', bg: '#fff7ed' },
  { id: 'REQ-4078', title: 'Broken door hinge', location: 'Block A, Room 302', desc: 'Main door to the dorm room is sagging and won\'t lock properly.', type: 'Structural', time: '1 day ago', status: 'resolved', color: '#6b7280', bg: '#f3f4f6' },
];

export default function FacultyHome() {
  const navigate = useNavigate();

  return (
    <FacultyLayout>
      <div className="no-scrollbar" style={{ height: '100vh', overflowY: 'auto', paddingBottom: '100px' }}>
        
        {/* Header Section */}
        <div className="p-4 shadow-sm" style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <img src="https://ui-avatars.com/api/?name=Kagiso&background=3d7a77&color=fff" className="rounded-circle shadow-sm" width={50} alt="profile" />
              <div>
                <h6 className="fw-bold mb-0 text-white" style={{ fontSize: '15px' }}>Hello, Kagiso</h6>
                <small style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Maintenance Operator</small>
              </div>
            </div>
            <button className="btn border-0 p-2 text-white opacity-75">
              <span className="material-symbols-rounded">notifications</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="d-flex gap-3 mt-4">
            <div className="flex-fill rounded-4 p-3 text-center shadow-sm" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="h3 fw-bold text-white mb-0">9</div>
              <div className="fw-bold opacity-50 text-white" style={{ fontSize: '10px', letterSpacing: '1px' }}>ASSIGNED</div>
            </div>
            <div className="flex-fill rounded-4 p-3 text-center shadow-sm" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="h3 fw-bold text-white mb-0">12</div>
              <div className="fw-bold opacity-50 text-white" style={{ fontSize: '10px', letterSpacing: '1px' }}>RESOLVED</div>
            </div>
          </div>
        </div>

        {/* Reports Content */}
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold text-white mb-0">Assigned Reports</h6>
            <button className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-1 fw-bold" style={{ color: '#3d7a77', fontSize: '12px' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>filter_list</span> Filter
            </button>
          </div>

          <div className="d-flex flex-column gap-3">
            {assignedReports.map((report) => (
              <div key={report.id} className="rounded-4 p-3 shadow-lg" style={{ 
                background: 'rgba(255,255,255,0.92)', 
                border: '1px solid rgba(255,255,255,0.4)',
                backdropFilter: 'blur(5px)'
              }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge rounded-pill" style={{ backgroundColor: report.bg, color: report.color, fontSize: '10px' }}>
                    {report.type}
                  </span>
                  <span className="small opacity-75" style={{ color: '#6b7280', fontSize: '11px' }}>{report.time}</span>
                </div>
                
                <h6 className="fw-bold mb-1" style={{ color: '#1f2937', fontSize: '14px' }}>{report.title}</h6>
                
                <p className="small mb-1 d-flex align-items-center gap-1" style={{ color: '#4b5563', fontSize: '12px' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: '14px' }}>location_on</span>
                  {report.location}
                </p>
                
                <p className="mb-3" style={{ color: '#6b7280', fontSize: '12px', lineHeight: '1.4' }}>
                  {report.desc}
                </p>

                {report.status === 'active' ? (
                  <button className="btn w-100 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" 
                          style={{ background: '#3d7a77', color: 'white', fontSize: '13px', border: 'none' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>check_circle</span> 
                    Mark as Resolved
                  </button>
                ) : (
                  <button className="btn btn-outline-secondary w-100 py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2" 
                          style={{ fontSize: '13px', border: '1px solid #dee2e6' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>undo</span> 
                    Undo Resolution
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </FacultyLayout>
  );
}