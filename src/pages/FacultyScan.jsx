import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacultyLayout from '../components/FacultyLayout';

const allReports = [
  { id: 'REQ-4092', title: 'Leaking Toilet', location: 'Block B, Room 102', assignedTo: 'Dave', status: 'Assigned', category: 'Plumbing', time: 'Assigned Today', desc: 'The toilet in our en-suite bathroom has been leaking from the base since yesterday.' },
  { id: 'REQ-4088', title: 'No Hot Water', location: 'Block A, Room 305', assignedTo: 'Lumbiel', status: 'Assigned', category: 'Plumbing', time: 'Assigned Yesterday', desc: 'The shower is not dispensing any hot water. Only freezing cold water is coming out.' },
  { id: 'REQ-4075', title: 'Clogged Sink', location: 'Block C, Kitchen', assignedTo: 'Dave', status: 'Resolved', category: 'Plumbing', time: 'Resolved 2 days ago', desc: 'The communal kitchen sink on the second floor is completely blocked.' },
  { id: 'REQ-4101', title: 'Faulty Socket', location: 'Block C, Room 104', assignedTo: 'Mr Peo', status: 'Assigned', category: 'Electrical', time: 'Assigned Today', desc: 'Socket sparks when plugging in devices.' },
  { id: 'REQ-4078', title: 'Broken Door Hinge', location: 'Block A, Room 302', assignedTo: 'Lumbiel', status: 'Resolved', category: 'Structural', time: 'Resolved 3 days ago', desc: 'Main door to the dorm room is sagging.' },
];

const filters = ['This Week', 'Dave', 'Me', 'Last Week'];

export default function FacultyScan() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('This Week');
  const [search, setSearch] = useState('');

  const filtered = allReports.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === 'Dave') return matchSearch && r.assignedTo === 'Dave';
    if (activeFilter === 'Me') return matchSearch && r.assignedTo === 'Kagiso';
    return matchSearch;
  });

  return (
    <FacultyLayout>
      <div className="container py-4 pb-5" style={{ maxWidth: '800px' }}>
        
        {/* Transparent Search Bar */}
        <div className="position-relative mb-4">
          <span className="material-symbols-rounded position-absolute top-50 translate-middle-y ms-3" 
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: '22px' }}>search</span>
          <input 
            className="form-control rounded-pill border-0 ps-5 py-3 shadow-lg" 
            style={{ 
              background: 'rgba(255,255,255,0.12)', 
              backdropFilter: 'blur(15px)', 
              color: 'white',
              border: '1px solid rgba(255,255,255,0.1)' 
            }}
            placeholder="Search reports by ID or Title..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        {/* Filters Row */}
        <div className="d-flex gap-2 mb-4 overflow-auto pb-2 no-scrollbar">
          {filters.map((f) => (
            <button 
              key={f} 
              onClick={() => setActiveFilter(f)}
              className="btn rounded-pill px-4 py-2 text-nowrap fw-bold shadow-sm"
              style={activeFilter === f 
                ? { background: '#3d7a77', color: 'white', fontSize: '13px', border: 'none' } 
                : { 
                    background: 'rgba(255,255,255,0.08)', 
                    color: 'rgba(255,255,255,0.6)', 
                    fontSize: '13px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(5px)'
                  }
              }
            >{f}</button>
          ))}
        </div>

        {/* Reports List */}
        <div className="d-flex flex-column gap-3">
          {filtered.map((report) => (
            <div key={report.id} className="rounded-4 p-4 shadow-lg border-0" 
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.1)', 
                   border: '1px solid rgba(255, 255, 255, 0.1)',
                   backdropFilter: 'blur(20px)',
                   WebkitBackdropFilter: 'blur(20px)' 
                 }}>
              
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="fw-bold mb-1 text-white">{report.title}</h6>
                  <p className="small mb-0 fw-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {report.location} <span className="mx-1">•</span> {report.time}
                  </p>
                </div>
                <span className="badge rounded-pill px-3 py-2 fw-bold shadow-sm" 
                      style={{ 
                        background: report.status === 'Resolved' ? 'rgba(22, 163, 74, 0.15)' : 'rgba(8, 145, 178, 0.15)', 
                        color: report.status === 'Resolved' ? '#4ade80' : '#22d3ee',
                        border: report.status === 'Resolved' ? '1px solid rgba(22, 163, 74, 0.2)' : '1px solid rgba(8, 145, 178, 0.2)',
                        fontSize: '10px' 
                      }}>
                  {report.status.toUpperCase()}
                </span>
              </div>

              <p className="small my-3 fst-italic" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: '1.5' }}>
                "{report.desc}"
              </p>

              <div className="d-flex justify-content-between align-items-center mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                  onClick={() => navigate(`/faculty-scan/${report.id}`)}
                  className="btn px-4 py-2 rounded-3 fw-bold shadow-sm"
                  style={{ background: '#3d7a77', color: 'white', fontSize: '12px', border: 'none' }}
                >
                  View Details
                </button>
                
                <button
                  onClick={() => navigate(`/faculty-teams/chat/${report.assignedTo.toLowerCase().replace(' ', '-')}?report=${report.id}`)}
                  className="btn border-0 p-2 text-white opacity-50"
                  style={{ transition: '0.3s' }}
                >
                  <span className="material-symbols-rounded">chat</span>
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-5 text-white opacity-50">
              <span className="material-symbols-rounded display-1 mb-3">search_off</span>
              <p className="fs-5">No reports found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </FacultyLayout>
  );
}