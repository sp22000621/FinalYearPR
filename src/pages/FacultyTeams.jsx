import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacultyLayout from '../components/FacultyLayout';

const teamMembers = [
  { id: 'dave', name: 'Dave', role: 'Plumbing Specialist', lastMsg: 'Did you check for clogs on all floors?', time: '10:45 AM', unread: 2 },
  { id: 'lumbiel', name: 'Lumbiel', role: 'General Maintenance', lastMsg: 'The door hinge has been replaced.', time: '9:30 AM', unread: 0 },
  { id: 'mr-peo', name: 'Mr Peo', role: 'Electrical Technician', lastMsg: 'Socket in Block C is fixed now.', time: 'Yesterday', unread: 0 },
  { id: 'thato', name: 'Thato', role: 'HVAC Technician', lastMsg: 'AC unit in Room 204 needs a new filter.', time: 'Yesterday', unread: 1 },
];

export default function FacultyTeams() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = teamMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FacultyLayout>
      <div className="container py-4" style={{ maxWidth: '800px' }}>
        <h2 className="fw-bold mb-4 text-white">Teams</h2>

        {/* Search Bar */}
        <div className="position-relative mb-4">
          <span className="material-symbols-rounded position-absolute top-50 translate-middle-y ms-3" 
                style={{ color: 'rgba(255,255,255,0.4)', fontSize: '20px' }}>search</span>
          <input 
            className="form-control border-0 ps-5 py-3 shadow-sm" 
            style={{ 
              background: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(10px)', 
              color: 'white',
              borderRadius: '15px'
            }}
            placeholder="Search team members..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        {/* Members List */}
        <div className="d-flex flex-column gap-2">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="d-flex align-items-center gap-3 p-3 transition-all cursor-pointer shadow-sm"
              style={{ 
                background: 'rgba(255,255,255,0.07)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                transition: '0.3s'
              }}
              onClick={() => navigate(`/faculty-teams/chat/${member.id}`)}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            >
              <img 
                src={`https://ui-avatars.com/api/?name=${member.name}&background=3d7a77&color=fff&size=48`} 
                className="rounded-circle shadow-sm" 
                width={48} 
                height={48} 
                alt={member.name} 
              />
              
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold mb-0 text-white" style={{ fontSize: '15px' }}>{member.name}</h6>
                  <small className="opacity-50 text-white" style={{ fontSize: '11px' }}>{member.time}</small>
                </div>
                <p className="mb-0 opacity-50 text-white" style={{ fontSize: '12px' }}>{member.role}</p>
                <p className="mb-0 text-white text-truncate opacity-75 mt-1" style={{ fontSize: '13px' }}>
                  {member.lastMsg}
                </p>
              </div>

              {member.unread > 0 && (
                <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" 
                     style={{ 
                       background: '#3d7a77', 
                       color: 'white', 
                       fontSize: '10px',
                       width: '22px',
                       height: '22px',
                       minWidth: '22px'
                     }}>
                  {member.unread}
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-5 opacity-50 text-white">
              <span className="material-symbols-rounded display-4 mb-2">person_search</span>
              <p>No team members found.</p>
            </div>
          )}
        </div>
      </div>
    </FacultyLayout>
  );
}