import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';

const categories = [
  { label: 'All', value: 'All' },
  { label: 'Official', value: 'Official' }, // Added for SCR
  { label: 'Cores', value: 'Cores' },
  { label: 'Sciences', value: 'Sciences' },
  { label: 'Engineering', value: 'Engineering' },
];

const modules = [
  // NEW: SRC Group added as an 'Official' category
  { id: 'scr-official', name: 'SCR Campus Reps', desc: 'Official Student Representative Council', category: 'Official', following: false, members: 'All Students', isOfficial: true },
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
      <div className="no-scrollbar" style={{ height: 'calc(100vh - 70px)', overflowY: 'auto', paddingBottom: '100px' }}>
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

        <div className="container-fluid px-3 py-4">
          <div className="w-100 mx-auto" style={{ maxWidth: '800px' }}>
            
            <div className="mb-3">
              <h4 className="text-white fw-bold mb-1">Communities</h4>
              <p className="text-white-50 small mb-0">Join groups and share resources.</p>
            </div>

            {/* Search and Filters remain the same */}
            <div className="position-relative mb-3">
              <span className="material-symbols-rounded position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: '#3d7a77', fontSize: '20px' }}>search</span>
              <input
                type="text"
                placeholder="Search modules or groups..."
                className="form-control py-2 ps-5 border-0 text-white"
                style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', borderRadius: '12px', fontSize: '14px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setActiveFilter(c.value)}
                  className="btn px-3 py-1 rounded-pill fw-semibold border-0"
                  style={activeFilter === c.value
                    ? { background: '#3d7a77', color: 'white', fontSize: '12px' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="d-flex flex-column gap-2">
              {filtered.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-4 d-flex align-items-center justify-content-between"
                  style={{
                    background: m.isOfficial ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: m.isOfficial ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/student-communities/${m.id}`)}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ background: m.isOfficial ? '#f59e0b' : '#3d7a77', width: '40px', height: '40px' }}
                    >
                      <span className="material-symbols-rounded text-white fs-4">
                        {m.isOfficial ? 'verified_user' : 'school'}
                      </span>
                    </div>
                    <div>
                      <h6 className="fw-bold text-white mb-0" style={{ fontSize: '14px' }}>
                        {m.name} {m.isOfficial && <span style={{fontSize: '10px', color: '#f59e0b', marginLeft: '5px'}}>● Official</span>}
                      </h6>
                      <p className="mb-0 text-white-50" style={{ fontSize: '11px' }}>{m.desc}</p>
                      <small className="text-white-50 opacity-50" style={{ fontSize: '10px' }}>{m.members} Members</small>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFollowState(prev => ({ ...prev, [m.id]: !prev[m.id] }));
                    }}
                    className="btn px-3 py-1 rounded-pill fw-bold border-0"
                    style={followState[m.id]
                      ? { background: 'rgba(255, 255, 255, 0.1)', color: '#fff', fontSize: '12px' }
                      : { background: m.isOfficial ? '#f59e0b' : '#3d7a77', color: 'white', fontSize: '12px' }
                    }
                  >
                    {followState[m.id] ? 'Following' : 'Join'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}