import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, onSnapshot, doc, getDoc, where, updateDoc } from 'firebase/firestore';
import FacultyLayout from '../components/FacultyLayout';

export default function SeniorFacultyHome() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({ name: 'Loading...', role: 'Senior Faculty' });
  const [stats, setStats] = useState({ newReceived: 0, assigned: 0, resolvedToday: 0, escalated: 0 });
  const [teamWorkload, setTeamWorkload] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserProfile({ name: `${data.firstName} ${data.lastName}`, role: data.role });
        }
      }
    };
    fetchProfile();

    const qReports = collection(db, "reports");
    const unsubscribeReports = onSnapshot(qReports, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      setStats({
        newReceived: docs.filter(d => d.status === 'Open').length,
        assigned: docs.filter(d => d.status === 'In Progress').length,
        resolvedToday: docs.filter(d => d.status === 'Resolved').length,
        escalated: docs.filter(d => d.isEscalated === true).length
      });

      setPendingAssignments(docs.filter(d => d.status === 'Open'));
    });

    // Fetches all Faculty members to populate the assignment list
    const qTeam = query(collection(db, "users"), where("role", "in", ["Junior Faculty", "Senior Faculty"]));
    const unsubscribeTeam = onSnapshot(qTeam, (snapshot) => {
      const team = snapshot.docs.map(d => ({
        name: d.data().firstName + " " + d.data().lastName,
        email: d.data().email, // Use email as the link for assignedTo
        role: d.data().role,
        id: d.id
      }));
      setTeamWorkload(team);
    });

    return () => { unsubscribeReports(); unsubscribeTeam(); };
  }, []);

  const handleQuickAssign = async (reportId, workerEmail) => {
    if (!workerEmail) return;
    try {
      await updateDoc(doc(db, "reports", reportId), {
        status: 'In Progress',
        assignedTo: workerEmail,
        assignedAt: new Date(),
        managedBy: auth.currentUser.email
      });
    } catch (err) {
      console.error("Assignment error:", err);
      alert("Failed to assign task.");
    }
  };

  return (
    <FacultyLayout>
      <div className="no-scrollbar" style={{ height: '100vh', overflowY: 'auto', paddingBottom: '100px' }}>
        
        {/* Modern Header */}
        <div className="p-4 bg-white shadow-sm border-bottom sticky-top" style={{ zIndex: 1020 }}>
          <div className="container-fluid d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <img 
                src={`https://ui-avatars.com/api/?name=${userProfile.name}&background=3d7a77&color=fff&size=50`} 
                className="rounded-circle border border-2 border-white shadow-sm" 
                width={50} 
                alt="profile" 
              />
              <div>
                <p className="mb-0 fw-bold text-muted small text-uppercase" style={{ letterSpacing: '1px', fontSize: '10px' }}>{userProfile.role}</p>
                <h5 className="fw-bold mb-0 text-dark">{userProfile.name}</h5>
              </div>
            </div>
            <button className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-2" onClick={() => auth.signOut()}>
              <span className="material-symbols-rounded fs-6">logout</span> Logout
            </button>
          </div>
        </div>

        <div className="container-fluid p-4 p-md-5">
          <div className="mx-auto" style={{ maxWidth: '1400px' }}>
            
            {/* Stats Grid */}
            <h6 className="fw-bold mb-4 text-white text-uppercase opacity-75" style={{ letterSpacing: '1.5px', fontSize: '12px' }}>Operational Overview</h6>
            <div className="row g-4 mb-5">
              <StatCard value={stats.newReceived} label="Unassigned" color="#ff4e4e" />
              <StatCard value={stats.assigned} label="In Progress" color="#4ea1ff" />
              <StatCard value={stats.resolvedToday} label="Resolved" color="#4ade80" />
              <StatCard value={stats.escalated} label="Escalated" color="#f59e0b" />
            </div>

            <div className="row g-5">
              {/* Left: Pending Reports (Higher Priority for Seniors) */}
              <div className="col-lg-6">
                <h6 className="fw-bold mb-4 text-white text-uppercase opacity-75" style={{ letterSpacing: '1.5px', fontSize: '12px' }}>Awaiting Assignment</h6>
                <div className="d-flex flex-column gap-3">
                  {pendingAssignments.length > 0 ? pendingAssignments.map((item) => (
                    <div key={item.id} className="rounded-4 p-3 shadow-lg" 
                         style={{ background: 'white', borderLeft: '6px solid #3d7a77' }}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-light text-dark border">{item.category}</span>
                        <small className="text-muted">#{item.id.substring(0,6).toUpperCase()}</small>
                      </div>
                      <h6 className="fw-bold text-dark mb-1">{item.issue}</h6>
                      <p className="text-muted mb-3 small">📍 {item.location}</p>
                      
                      <div className="pt-3 border-top">
                        <label className="small fw-bold text-muted mb-1 d-block">Assign to Faculty:</label>
                        <select 
                          className="form-select form-select-sm border-0 bg-light rounded-3"
                          onChange={(e) => handleQuickAssign(item.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Select member...</option>
                          {teamWorkload.map(m => (
                            <option key={m.id} value={m.email}>{m.name} ({m.role.split(' ')[0]})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-5 rounded-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <p className="text-white-50">All reports have been assigned. Good job!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Team Overview */}
              <div className="col-lg-6">
                <h6 className="fw-bold mb-4 text-white text-uppercase opacity-75" style={{ letterSpacing: '1.5px', fontSize: '12px' }}>Live Team Status</h6>
                <div className="d-flex flex-column gap-2">
                  {teamWorkload.map((member) => (
                    <div key={member.id} className="rounded-4 p-3 d-flex align-items-center justify-content-between shadow-sm" 
                         style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="position-relative">
                          <img src={`https://ui-avatars.com/api/?name=${member.name}&background=3d7a77&color=fff&size=40`} className="rounded-circle" width={40} />
                          <span className="position-absolute bottom-0 end-0 bg-success border border-2 border-dark rounded-circle" style={{ width: '10px', height: '10px' }}></span>
                        </div>
                        <div>
                          <h6 className="fw-bold text-white mb-0" style={{ fontSize: '14px' }}>{member.name}</h6>
                          <p className="text-white-50 mb-0 small" style={{ fontSize: '11px' }}>{member.role}</p>
                        </div>
                      </div>
                      <span className="small text-white-50">Online</span>
                    </div>
                  ))}
                </div>
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
    <div className="col-6 col-md-3">
      <div className="rounded-4 p-4 text-center shadow-lg h-100 border-0" 
           style={{ background: 'white' }}>
        <div className="h1 fw-bold mb-0" style={{ color: color }}>{value}</div>
        <div className="small fw-bold text-muted text-uppercase" style={{ fontSize: '10px', letterSpacing: '1px' }}>{label}</div>
      </div>
    </div>
  );
}