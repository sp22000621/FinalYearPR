import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import FacultyLayout from '../components/FacultyLayout';

export default function FacultyScan() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Track which report IDs are "expanded" to show full text
  const [expandedReports, setExpandedReports] = useState({});

  const currentUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const q = query(collection(db, "reports"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllReports(reports);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleExpand = (id) => {
    setExpandedReports(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getNameFromEmail = (email) => {
    if (!email) return "Unassigned";
    const mapping = {
      'hxhtakeover@biust.ac.bw': 'Meruem Hunter',
      'swarthyn10@gmail.com': 'John Wick'
    };
    return mapping[email] || email.split('@')[0];
  };

  const filtered = allReports.filter((r) => {
    const assignedEmail = r.assignedTo || "";
    const assignedName = getNameFromEmail(assignedEmail);
    const category = r.category || r.issue || "";
    const searchTerm = search.toLowerCase();
    
    const matchSearch = assignedName.toLowerCase().includes(searchTerm) || category.toLowerCase().includes(searchTerm);

    if (activeFilter === 'Me') return matchSearch && assignedEmail === currentUserEmail;
    return matchSearch;
  });

  return (
    <FacultyLayout>
      <div className="container py-4 pb-5" style={{ maxWidth: '800px' }}>
        
        {/* Search */}
        <div className="position-relative mb-4">
          <span className="material-symbols-rounded position-absolute top-50 translate-middle-y ms-3" 
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: '22px' }}>person_search</span>
          <input 
            className="form-control rounded-pill border-0 ps-5 py-3 shadow-lg" 
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(15px)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            placeholder="Search assigned person or issue..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        {/* Filters */}
        <div className="d-flex gap-2 mb-4 overflow-auto pb-2 no-scrollbar">
          {['All', 'This Week', 'Me', 'Last Week'].map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className="btn rounded-pill px-4 py-2 text-nowrap fw-bold transition-all"
              style={activeFilter === f 
                ? { background: '#3d7a77', color: 'white', fontSize: '13px', border: 'none' } 
                : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '13px', border: '1px solid rgba(255,255,255,0.1)' }
              }>{f}</button>
          ))}
        </div>

        {/* Reports List */}
        <div className="d-flex flex-column gap-3">
          {loading ? (
            <div className="text-center py-5 text-white opacity-50">Fetching reports...</div>
          ) : filtered.map((report) => {
            const assignedEmail = report.assignedTo;
            const isMe = assignedEmail === currentUserEmail;
            const isExpanded = expandedReports[report.id];
            
            // Logic to check if text is long enough to need "See more"
            // Using a rough character count (180 chars for 3 lines on mobile/tablet)
            const isLongReport = report.description?.length > 180;

            return (
              <div key={report.id} className="rounded-4 p-4 shadow-lg" 
                   style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)' }}>
                
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-bold mb-1 text-white">{report.issue || report.category}</h6>
                    <p className="small mb-0 fw-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Assigned to: <span className={isMe ? "text-warning" : "text-info"}>{isMe ? 'You' : getNameFromEmail(assignedEmail)}</span>
                    </p>
                  </div>
                  <span className="badge rounded-pill px-3 py-2 fw-bold" style={{ background: 'rgba(8, 145, 178, 0.15)', color: '#22d3ee', fontSize: '10px' }}>
                    {report.status || 'ACTIVE'}
                  </span>
                </div>

                {/* Clamped Text Area */}
                <div className="my-3">
                  <p className="small text-white opacity-75 mb-1" 
                     style={isExpanded ? {} : {
                       display: '-webkit-box',
                       WebkitLineClamp: '3',
                       WebkitBoxOrient: 'vertical',
                       overflow: 'hidden'
                     }}>
                    "{report.description}"
                  </p>
                  
                  {isLongReport && (
                    <button 
                      onClick={() => toggleExpand(report.id)}
                      className="btn btn-link p-0 text-info fw-bold text-decoration-none" 
                      style={{ fontSize: '12px' }}
                    >
                      {isExpanded ? 'See less' : 'See more'}
                    </button>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-white border-opacity-10">
                  <div className="text-white opacity-25 small" style={{ fontSize: '10px' }}>
                    ID: {report.id.substring(0, 8)}...
                  </div>
                  
                  {!isMe && assignedEmail && (
                    <button
                      onClick={() => navigate(`/faculty-teams/chat/${assignedEmail}?report=${report.id}`)}
                      className="btn border-0 p-2 text-white opacity-50 hover-opacity-100"
                    >
                      <span className="material-symbols-rounded">chat</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FacultyLayout>
  );
}