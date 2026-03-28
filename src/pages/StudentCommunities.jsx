import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';

const categories = [
  { label: 'All', value: 'All' },
  { label: 'Cores', value: 'Cores' },
  { label: 'Sciences', value: 'Sciences' },
  { label: 'Engineering', value: 'Engineering' },
];

const modules = [
  { id: 'math101', name: 'MATH 101', desc: 'Calculus & Linear Algebra', category: 'Cores', following: true, members: 245 },
  { id: 'comp201', name: 'COMP 201', desc: 'Data Structures & Algorithms', category: 'Sciences', following: false, members: 180 },
  { id: 'infs303', name: 'INFS 303', desc: 'Database Management Systems', category: 'Sciences', following: false, members: 120 },
  { id: 'chem102', name: 'CHEM 102', desc: 'General Chemistry', category: 'Sciences', following: false, members: 310 },
  { id: 'eng210', name: 'ENG 210', desc: 'Electrical Engineering Fundamentals', category: 'Engineering', following: false, members: 95 },
  { id: 'phys101', name: 'PHYS 101', desc: 'Mechanics & Thermodynamics', category: 'Cores', following: true, members: 278 },
];

export default function StudentCommunities() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [followState, setFollowState] = useState(
    Object.fromEntries(modules.map(m => [m.id, m.following]))
  );

  const filtered = modules.filter((m) => {
    const matchCat = activeFilter === 'All' || m.category === activeFilter;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <StudentLayout>
      <div className="container-fluid p-4 p-md-5">
        <div className="w-100 mx-auto" style={{ maxWidth: '1000px' }}>
          
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-white fw-bold mb-1 fs-3">Communities</h2>
            <p className="text-white-50 small mb-0">Join module groups to discuss coursework and share resources.</p>
          </div>

          {/* Search Bar - High Visibility Glass */}
          <div className="position-relative mb-4">
            <span className="material-symbols-rounded position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: '#3d7a77', fontSize: '24px' }}>search</span>
            <input
              type="text"
              placeholder="Search modules, courses..."
              className="form-control py-3 ps-5 fs-5 shadow-sm border-0"
              style={{ 
                background: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                color: '#333'
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter chips */}
          <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveFilter(c.value)}
                className="btn px-4 py-2 rounded-pill fw-semibold border-0 transition-all"
                style={activeFilter === c.value
                  ? { background: '#3d7a77', color: 'white' }
                  : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }
                }
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Module List */}
          <div className="d-flex flex-column gap-3">
            {filtered.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-4 d-flex align-items-center justify-content-between transition-all shadow-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
                onClick={() => navigate(`/student-communities/${m.id}`)}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ background: '#3d7a77', width: '50px', height: '50px' }}
                  >
                    <span className="material-symbols-rounded text-white fs-3">school</span>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0" style={{ color: '#333' }}>{m.name}</h5>
                    <p className="mb-0 text-muted small">{m.desc}</p>
                    <small className="text-muted fw-bold">{m.members} Members</small>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFollowState(prev => ({ ...prev, [m.id]: !prev[m.id] }));
                  }}
                  className="btn px-4 py-2 rounded-pill fw-bold border-0 transition-all"
                  style={followState[m.id]
                    ? { background: 'rgba(61, 122, 119, 0.15)', color: '#3d7a77' }
                    : { background: '#3d7a77', color: 'white' }
                  }
                >
                  {followState[m.id] ? 'Following' : 'Join'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}