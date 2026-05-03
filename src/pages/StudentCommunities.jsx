import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // Ensure this path is correct for your project
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import StudentLayout from '../components/StudentLayout';

const categories = [
  { label: 'All', value: 'All' },
  { label: 'Official', value: 'Official' },
  { label: 'Cores', value: 'Cores' },
  { label: 'Sciences', value: 'Sciences' },
  { label: 'Engineering', value: 'Engineering' },
];

export default function StudentCommunities() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followState, setFollowState] = useState({});

  // 1. Listen to Firestore for LIVE groups
  useEffect(() => {
    // NOTE: This query requires an index. Click the link in your console if it errors!
    const q = query(collection(db, "communities"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCommunities(docs);
      setLoading(false);
      
      // Initialize follow state for new items
      setFollowState(prev => {
        const newState = { ...prev };
        docs.forEach(d => {
          if (newState[d.id] === undefined) newState[d.id] = false;
        });
        return newState;
      });
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Filter logic with "Undefined" protection
  const filtered = (communities || []).filter((m) => {
    if (!m) return false;

    const name = (m.name || "").toLowerCase();
    const description = (m.description || "").toLowerCase();
    const searchTerm = (search || "").toLowerCase();

    const matchCat = activeFilter === 'All' || m.category === activeFilter;
    const matchSearch = name.includes(searchTerm) || description.includes(searchTerm);
    
    return matchCat && matchSearch;
  });

  return (
    <StudentLayout>
      <div className="no-scrollbar" style={{ height: 'calc(100vh - 70px)', overflowY: 'auto', paddingBottom: '100px' }}>
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

        <div className="container-fluid px-3 py-4">
          <div className="w-100 mx-auto" style={{ maxWidth: '800px' }}>
            
            <div className="mb-3 text-start">
              <h4 className="text-white fw-bold mb-1">Communities</h4>
              <p className="text-white-50 small mb-0">Join groups and share resources.</p>
            </div>

            {/* Search Bar */}
            <div className="position-relative mb-3">
              <span className="material-symbols-rounded position-absolute top-50 start-0 translate-middle-y ms-3" style={{ color: '#3d7a77', fontSize: '20px' }}>search</span>
              <input
                type="text"
                placeholder="Search modules or groups..."
                className="form-control py-2 ps-5 border-0 text-white shadow-none"
                style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', borderRadius: '12px', fontSize: '14px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setActiveFilter(c.value)}
                  className="btn px-3 py-1 rounded-pill fw-semibold border-0 whitespace-nowrap"
                  style={activeFilter === c.value
                    ? { background: '#3d7a77', color: 'white', fontSize: '12px' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Communities List */}
            <div className="d-flex flex-column gap-2">
              {loading ? (
                <div className="text-center py-5">
                   <div className="spinner-border text-info opacity-50" role="status"></div>
                   <div className="text-white-50 mt-2 small">Syncing with campus...</div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-5 text-white-50">
                  <span className="material-symbols-rounded d-block fs-1 mb-2">search_off</span>
                  No groups found.
                </div>
              ) : (
                filtered.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-4 d-flex align-items-center justify-content-between border"
                    style={{
                      background: m.category === 'Official' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      borderColor: m.category === 'Official' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/student-communities/${m.id}`)}
                  >
                    <div className="d-flex align-items-center gap-3 text-start">
                      <div
                        className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ background: m.category === 'Official' ? '#f59e0b' : '#3d7a77', width: '40px', height: '40px' }}
                      >
                        <span className="material-symbols-rounded text-white fs-4">
                          {m.category === 'Official' ? 'verified_user' : 'groups'}
                        </span>
                      </div>
                      <div>
                        <h6 className="fw-bold text-white mb-0" style={{ fontSize: '14px' }}>
                          {m.name} 
                          {m.category === 'Official' && <span className="ms-2 badge bg-warning text-dark px-2" style={{fontSize: '9px'}}>OFFICIAL</span>}
                        </h6>
                        <p className="mb-0 text-white-50 text-truncate" style={{ fontSize: '11px', maxWidth: '250px' }}>{m.description}</p>
                        <small className="text-white-50 opacity-50" style={{ fontSize: '10px' }}>Active Community</small>
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
                        : { background: m.category === 'Official' ? '#f59e0b' : '#3d7a77', color: 'white', fontSize: '12px' }
                      }
                    >
                      {followState[m.id] ? 'Following' : 'Join'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}