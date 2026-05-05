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

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) { navigate('/'); return; }

    // Fetch Senior Profile from faculty collection
    getDoc(doc(db, "faculty", user.uid)).then(s => {
      if (s.exists()) setUserData(s.data());
    });

    // Global Reports Listener
    const qReports = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsubReports = onSnapshot(qReports, (snapshot) => {
      setAllReports(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    // Underlings Listener
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

  // Logic for filtered sections
  const freshUnassigned = allReports.filter(r => r.status === 'Open');
  
  const stats = {
    new: freshUnassigned.length,
    active: allReports.filter(r => r.status === 'In Progress').length,
    done: allReports.filter(r => r.status === 'Resolved').length
  };

  // Filter Team by Name or Assigned Number
  const filteredTeam = teamMembers.map(m => ({
    ...m,
    pending: allReports.filter(r => r.assignedTo === m.email && r.status === 'In Progress').length
  })).filter(m => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;
    
    // Check if search is a number matching the task count
    const isNumberSearch = !isNaN(search) && search !== "";
    if (isNumberSearch) return m.pending.toString() === search;

    // Otherwise check names
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
      <div className="main-content no-scrollbar" style={{ height: '100vh', overflowY: 'auto', padding: '20px' }}>
        
        {successMsg && (
          <div className="position-fixed top-0 start-50 translate-middle-x mt-3 shadow-lg" 
               style={{ zIndex: 1050, background: '#10b981', color: 'white', padding: '10px 20px', borderRadius: '50px', fontWeight: 'bold' }}>
            {successMsg}
          </div>
        )}

        <header className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle bg-info d-flex align-items-center justify-content-center text-dark fw-bold" style={{ width: '50px', height: '50px' }}>
              {userData?.firstName?.charAt(0)}{userData?.lastName?.charAt(0)}
            </div>
            <div className="text-white">
              <h5 className="mb-0 fw-bold">{userData ? `${userData.firstName} ${userData.lastName}` : "Loading..."}</h5>
              <small className="opacity-75 text-info">{userData?.rank || "Senior Faculty"}</small>
            </div>
          </div>
        </header>

        {/* New / Active / Done Stats */}
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

        {/* Unassigned Reports Section */}
        <div className="mb-5">
          <h6 className="text-white fw-bold mb-3">Live Reports Queue</h6>
          <div className="row g-4">
            {freshUnassigned.map((item) => (
              <div key={item.id} className="col-12 col-lg-6">
                <div style={glassStyle}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-white opacity-25 small">#{item.id.slice(0, 6).toUpperCase()}</span>
                    <span className="badge bg-danger rounded-pill px-3">Open</span>
                  </div>
                  <h5 className="fw-bold text-white mb-1">{item.category || item.issue}</h5>
                  <p className="text-info small mb-3">📍 {item.location}</p>
                  <p className="text-white-50 small mb-4" style={{ minHeight: '50px' }}>{item.description}</p>
                  
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-sm btn-outline-light px-3 fw-bold"
                      onClick={() => handleAction(item.id, null, true)}
                    >Take</button>
                    <select 
                      className="form-select form-select-sm bg-dark text-white border-0 flex-grow-1"
                      style={{ background: 'rgba(0,0,0,0.5)', height: '38px' }}
                      onChange={(e) => handleAction(item.id, e.target.value)}
                      value=""
                    >
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

        {/* Team Workload Monitor with Numeric Search */}
        <div className="mt-5 pt-4 border-top border-white-10">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-white fw-bold m-0">Team Workload Monitor</h6>
            <div className="d-flex gap-2 w-50">
              <input 
                type="text" 
                placeholder="Search name or task count (0, 1...)" 
                className="form-control form-control-sm bg-dark text-white border-secondary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className="btn btn-sm btn-secondary" 
                onClick={() => setSearchTerm("")}
              >Reset</button>
            </div>
          </div>
          <div className="row g-3">
            {filteredTeam.map(member => (
              <div key={member.id} className="col-12 col-md-4">
                <div style={{ ...glassStyle, padding: '1.5rem' }} className="text-center">
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