import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import FacultyLayout from '../components/FacultyLayout';

export default function FacultyHome() {
  const [userProfile, setUserProfile] = useState({ name: 'Operator' });
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Fetch Profile
    getDoc(doc(db, "users", user.uid)).then(d => {
      if (d.exists()) setUserProfile({ name: d.data().firstName });
    });

    // Real-time listener for assigned tasks
    const q = query(collection(db, "reports"), where("assignedTo", "==", user.email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReports(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, []);

  // DASHBOARD  (always in sync with the reports list)
  const stats = {
    assigned: reports.filter(r => r.status !== 'Resolved').length,
    resolved: reports.filter(r => r.status === 'Resolved').length
  };

  const toggleStatus = async (reportId, currentStatus) => {
    const newStatus = currentStatus === 'Resolved' ? 'In Progress' : 'Resolved';
    await updateDoc(doc(db, "reports", reportId), {
      status: newStatus,
      resolvedAt: newStatus === 'Resolved' ? new Date() : null
    });
  };

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
              <img src={`https://ui-avatars.com/api/?name=${userProfile.name}&background=3d7a77&color=fff`} className="rounded-circle shadow-sm" width={50} alt="profile" />
              <div>
                <h6 className="fw-bold mb-0 text-white" style={{ fontSize: '15px' }}>Hello, {userProfile.name}</h6>
                <small style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Maintenance Operator</small>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4">
            <div className="flex-fill rounded-4 p-3 text-center shadow-sm" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="h3 fw-bold text-white mb-0">{stats.assigned}</div>
              <div className="fw-bold opacity-50 text-white" style={{ fontSize: '10px', letterSpacing: '1px' }}>TO-DO</div>
            </div>
            <div className="flex-fill rounded-4 p-3 text-center shadow-sm" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="h3 fw-bold text-white mb-0">{stats.resolved}</div>
              <div className="fw-bold opacity-50 text-white" style={{ fontSize: '10px', letterSpacing: '1px' }}>DONE</div>
            </div>
          </div>
        </div>

        {/* Reports Content  */}
        <div className="p-4">
          <h6 className="fw-bold text-white mb-3">My Tasks</h6>
          <div className="d-flex flex-column gap-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-4 p-3 shadow-lg" style={{ 
                background: report.status === 'Resolved' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.95)', 
                border: '1px solid rgba(255,255,255,0.4)',
                backdropFilter: 'blur(5px)',
                transition: '0.3s'
              }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge rounded-pill" style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '10px' }}>
                    {report.category}
                  </span>
                  <span className="small opacity-75" style={{ color: '#6b7280', fontSize: '11px' }}>ID: {report.id.substring(0,6)}</span>
                </div>
                
                <h6 className="fw-bold mb-1" style={{ color: '#1f2937', fontSize: '14px' }}>{report.issue}</h6>
                <p className="small mb-1 d-flex align-items-center gap-1" style={{ color: '#4b5563', fontSize: '12px' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: '14px' }}>location_on</span>
                  {report.location}
                </p>
                
                <p className="mb-3" style={{ color: '#6b7280', fontSize: '12px', lineHeight: '1.4' }}>
                  {report.description || "No additional details provided."}
                </p>

                <button 
                  onClick={() => toggleStatus(report.id, report.status)}
                  className="btn w-100 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" 
                  style={{ 
                    background: report.status === 'Resolved' ? '#6b7280' : '#3d7a77', 
                    color: 'white', 
                    fontSize: '13px', 
                    border: 'none' 
                  }}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>
                    {report.status === 'Resolved' ? 'undo' : 'check_circle'}
                  </span> 
                  {report.status === 'Resolved' ? 'Undo Resolution' : 'Mark as Resolved'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </FacultyLayout>
  );
}