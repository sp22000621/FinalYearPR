import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, orderBy } from 'firebase/firestore';
import FacultyLayout from '../components/FacultyLayout';
import '../styles/Dashboard.css';

export default function SeniorFacultyHome() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);
  
  // State to track which report IDs are "expanded"
  const [expandedReports, setExpandedReports] = useState({});

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) { navigate('/'); return; }

    getDoc(doc(db, "faculty", user.uid)).then(s => {
      if (s.exists()) setUserData(s.data());
    });

    const qReports = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsubReports = onSnapshot(qReports, (snapshot) => {
      setAllReports(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    const qTeam = query(collection(db, "faculty"), where("isSRC", "==", false));
    const unsubTeam = onSnapshot(qTeam, (snapshot) => {
      setTeamMembers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubReports(); unsubTeam(); };
  }, [navigate]);

  const handleAction = async (reportId, facultyEmail, isSelf = false) => {
    const targetEmail = isSelf ? auth.currentUser.email : facultyEmail;
    if (!targetEmail) return;

    try {
      await updateDoc(doc(db, "reports", reportId), {
        status: 'In Progress',
        assignedTo: targetEmail,
        assignedAt: new Date(),
        managedBy: auth.currentUser.email
      });
      setSuccessMsg(isSelf ? "Report claimed!" : "Assigned successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const toggleStatus = async (reportId, currentStatus) => {
    const newStatus = currentStatus === 'Resolved' ? 'In Progress' : 'Resolved';
    try {
      await updateDoc(doc(db, "reports", reportId), {
        status: newStatus,
        resolvedAt: newStatus === 'Resolved' ? new Date() : null,
        lastUpdatedBy: auth.currentUser.email
      });
      setSuccessMsg(`Task marked as ${newStatus}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Helper to toggle "See More"
  const toggleExpand = (id) => {
    setExpandedReports(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const freshUnassigned = allReports.filter(r => r.status === 'Open');
  const myClaimedReports = allReports.filter(r => r.assignedTo === auth.currentUser?.email && r.status !== 'Open');
  
  const stats = {
    new: freshUnassigned.length,
    active: allReports.filter(r => r.status === 'In Progress').length,
    done: allReports.filter(r => r.status === 'Resolved').length
  };

  const filteredTeam = teamMembers.map(m => ({
    ...m,
    pending: allReports.filter(r => r.assignedTo === m.email && r.status === 'In Progress').length
  })).filter(m => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;
    const isNumberSearch = !isNaN(search) && search !== "";
    if (isNumberSearch) return m.pending.toString() === search;
    return m.firstName?.toLowerCase().includes(search) || m.lastName?.toLowerCase().includes(search);
  });

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1.5rem',
    padding: '1.5rem'
  };

  return (
    <FacultyLayout>
      <div className="main-content no-scrollbar" style={{ height: '100vh', overflowY: 'auto', padding: '20px', paddingBottom: '120px' }}>
        
        {successMsg && (
          <div className="position-fixed top-0 start-50 translate-middle-x mt-3 shadow-lg" 
               style={{ zIndex: 1050, background: '#10b981', color: 'white', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold' }}>
            {successMsg}
          </div>
        )}

        <header className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle bg-info d-flex align-items-center justify-content-center text-dark fw-bold shadow-sm" style={{ width: '50px', height: '50px' }}>
              {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
            </div>
            <div className="text-white">
              <h5 className="mb-0 fw-bold">{userData ? `${userData.firstName} ${userData.lastName}` : "Loading..."}</h5>
              <small className="opacity-75 text-info">{userData?.rank || "Senior Faculty"}</small>
            </div>
          </div>
        </header>

        {/* Stats Row */}
        <div className="row g-3 mb-5">
          <div className="col-4">
            <div className="bg-white rounded-4 p-4 text-center">
              <h2 className="fw-bold mb-0 text-danger">{stats.new}</h2>
              <small className="text-muted fw-bold">NEW</small>
            </div>
          </div>
          <div className="col-4">
            <div className="bg-white rounded-4 p-4 text-center">
              <h2 className="fw-bold mb-0 text-primary">{stats.active}</h2>
              <small className="text-muted fw-bold">ACTIVE</small>
            </div>
          </div>
          <div className="col-4">
            <div className="bg-white rounded-4 p-4 text-center">
              <h2 className="fw-bold mb-0 text-success">{stats.done}</h2>
              <small className="text-muted fw-bold">DONE</small>
            </div>
          </div>
        </div>

        {/* 1. Live Reports Queue */}
        <div className="mb-5">
          <h6 className="text-white fw-bold mb-3">Live Reports Queue</h6>
          <div className="row g-4">
            {freshUnassigned.length === 0 ? <p className="text-white-50 ms-2">No new reports.</p> : 
              freshUnassigned.map((item) => (
              <div key={item.id} className="col-12 col-lg-6">
                <div style={glassStyle}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white opacity-25 small">#{item.id.slice(0, 6).toUpperCase()}</span>
                    <span className="badge bg-danger rounded-pill px-3">Open</span>
                  </div>
                  <h5 className="fw-bold text-white mb-1">{item.category || item.issue}</h5>
                  <p className="text-info small mb-3">📍 {item.location}</p>
                  <p className="text-white-50 small mb-4">{item.description}</p>
                  
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-light px-3 fw-bold" onClick={() => handleAction(item.id, null, true)}>Take</button>
                    <select className="form-select form-select-sm bg-dark text-white border-0 flex-grow-1" style={{ background: 'rgba(0,0,0,0.5)', height: '38px' }} onChange={(e) => handleAction(item.id, e.target.value)} value="">
                      <option value="" disabled>Assign to Team Member...</option>
                      {teamMembers.map(m => (
                        <option key={m.id} value={m.email}>{m.firstName} {m.lastName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. My Claimed Reports (with See More) */}
        <div className="mb-5">
          <h6 className="text-white fw-bold mb-3">My Claimed Reports</h6>
          <div className="row g-4">
            {myClaimedReports.length === 0 ? <p className="text-white-50 ms-2">You haven't claimed any tasks yet.</p> : 
              myClaimedReports.map((report) => {
                const isExpanded = expandedReports[report.id];
                return (
                  <div key={report.id} className="col-12 col-lg-6">
                    <div className="rounded-4 p-4 shadow-lg transition-all" style={{ 
                      background: report.status === 'Resolved' ? 'rgba(255,255,255,0.65)' : 'white', 
                      opacity: report.status === 'Resolved' ? 0.8 : 1,
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="badge rounded-pill" style={{ 
                            backgroundColor: report.category === 'Security' ? '#fee2e2' : '#dcfce7', 
                            color: report.category === 'Security' ? '#dc2626' : '#16a34a', 
                            fontSize: '10px' 
                        }}>{report.category}</span>
                        <span className="small opacity-50 fw-bold" style={{ color: '#1f2937', fontSize: '10px' }}>#{report.id.substring(0,6).toUpperCase()}</span>
                      </div>
                      
                      <h6 className="fw-bold mb-2" style={{ color: '#111827', fontSize: '1.1rem' }}>{report.issue}</h6>
                      <p className="text-info small mb-2 fw-bold" style={{ fontSize: '11px' }}>📍 {report.location}</p>

                      {/* Description Area with Toggle */}
                      <p className={`mb-2 ${isExpanded ? '' : 'text-truncate'}`} 
                         style={{ 
                           color: '#4b5563', 
                           fontSize: '14px', 
                           lineHeight: '1.5',
                           whiteSpace: isExpanded ? 'pre-wrap' : 'nowrap'
                         }}>
                        {report.description}
                      </p>
                      
                      {report.description?.length > 40 && (
                        <button 
                          onClick={() => toggleExpand(report.id)}
                          className="btn btn-link p-0 mb-3 text-decoration-none fw-bold"
                          style={{ fontSize: '12px', color: '#3d7a77' }}
                        >
                          {isExpanded ? 'Show less' : 'See more detail...'}
                        </button>
                      )}
                      
                      <button 
                        onClick={() => toggleStatus(report.id, report.status)}
                        className="btn w-100 py-2 rounded-3 fw-bold shadow-sm" 
                        style={{ background: report.status === 'Resolved' ? '#1f2937' : '#3d7a77', color: 'white', border: 'none' }}
                      >
                        {report.status === 'Resolved' ? 'Re-open Task' : 'Confirm Resolution'}
                      </button>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>

        {/* 3. Team Workload Monitor */}
        <div className="mt-5 pt-4 border-top border-white-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6 className="text-white fw-bold m-0">Team Workload Monitor</h6>
            <div className="d-flex gap-2 w-50">
              <input type="text" placeholder="Search team..." className="form-control form-control-sm bg-dark text-white border-secondary rounded-3" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button className="btn btn-sm btn-secondary rounded-3 px-3" onClick={() => setSearchTerm("")}>Reset</button>
            </div>
          </div>
          <div className="row g-3">
            {filteredTeam.map(member => (
              <div key={member.id} className="col-12 col-md-4">
                <div style={{ ...glassStyle, padding: '1.5rem' }} className="text-center shadow-sm">
                  <div className="text-white fw-bold">{member.firstName} {member.lastName}</div>
                  <div className={`badge rounded-pill mt-3 px-3 py-2 ${member.pending === 0 ? 'bg-secondary opacity-50' : 'bg-primary'}`}>
                    Assigned: {member.pending}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </FacultyLayout>
  );
}