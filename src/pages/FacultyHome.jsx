import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import FacultyLayout from '../components/FacultyLayout';

export default function FacultyHome() {
  const [userProfile, setUserProfile] = useState({ name: 'Operator', role: 'Junior Faculty' });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // 1. Fetch Profile Data (Using the UID link we established in the Admin panel)
    const getProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserProfile({ 
            name: data.firstName || 'Operator', 
            role: data.role || 'Junior Faculty' 
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    getProfile();

    // 2. Real-time Reports Listener (Filters for reports assigned to this user's email)
    const q = query(
      collection(db, "reports"), 
      where("assignedTo", "==", user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort: Unresolved first, then by newest
      const sortedDocs = docs.sort((a, b) => (a.status === 'Resolved') - (b.status === 'Resolved'));
      setReports(sortedDocs);
      setLoading(false);
    }, (err) => {
      console.error("Snapshot error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const stats = {
    assigned: reports.filter(r => r.status !== 'Resolved').length,
    resolved: reports.filter(r => r.status === 'Resolved').length
  };

  const toggleStatus = async (reportId, currentStatus) => {
    const newStatus = currentStatus === 'Resolved' ? 'In Progress' : 'Resolved';
    try {
      await updateDoc(doc(db, "reports", reportId), {
        status: newStatus,
        resolvedAt: newStatus === 'Resolved' ? new Date() : null,
        lastUpdatedBy: auth.currentUser.email
      });
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update status. Check permissions.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-white" style={{ background: '#1a1a1a' }}>
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <span>Loading Assigned Tasks...</span>
      </div>
    );
  }

  return (
    <FacultyLayout>
      <div className="no-scrollbar" style={{ height: '100vh', overflowY: 'auto', paddingBottom: '120px' }}>
        
        {/* Header Section */}
        <div className="p-4 shadow-sm" style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <img 
                src={`https://ui-avatars.com/api/?name=${userProfile.name}&background=3d7a77&color=fff`} 
                className="rounded-circle shadow-sm border border-2 border-opacity-10 border-white" 
                width={55} 
                alt="profile" 
              />
              <div>
                <h6 className="fw-bold mb-0 text-white" style={{ fontSize: '16px' }}>Hello, {userProfile.name}</h6>
                <small style={{ color: '#3d7a77', fontSize: '12px', fontWeight: 'bold' }}>{userProfile.role}</small>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 mt-4">
            <div className="flex-fill rounded-4 p-3 text-center shadow-sm" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="h3 fw-bold text-white mb-0">{stats.assigned}</div>
              <div className="fw-bold opacity-50 text-white" style={{ fontSize: '10px', letterSpacing: '1px' }}>PENDING</div>
            </div>
            <div className="flex-fill rounded-4 p-3 text-center shadow-sm" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="h3 fw-bold text-white mb-0">{stats.resolved}</div>
              <div className="fw-bold opacity-50 text-white" style={{ fontSize: '10px', letterSpacing: '1px' }}>COMPLETED</div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold text-white mb-0">Assigned Tasks</h6>
            <span className="badge bg-dark text-white-50" style={{ fontSize: '10px' }}>Total: {reports.length}</span>
          </div>

          <div className="d-flex flex-column gap-3">
            {reports.length === 0 ? (
              <div className="text-center mt-5 p-5 rounded-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="material-symbols-rounded fs-1 text-white-50 mb-2">task_alt</span>
                <p className="text-white-50">All caught up! No tasks assigned.</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="rounded-4 p-3 shadow-lg" style={{ 
                  background: report.status === 'Resolved' ? 'rgba(255,255,255,0.65)' : 'white', 
                  border: '1px solid rgba(255,255,255,0.4)',
                  transition: '0.3s',
                  opacity: report.status === 'Resolved' ? 0.8 : 1
                }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge rounded-pill" style={{ 
                        backgroundColor: report.category === 'Security' ? '#fee2e2' : '#dcfce7', 
                        color: report.category === 'Security' ? '#dc2626' : '#16a34a', 
                        fontSize: '10px' 
                    }}>
                      {report.category}
                    </span>
                    <span className="small opacity-50 fw-bold" style={{ color: '#1f2937', fontSize: '10px' }}>#{report.id.substring(0,6).toUpperCase()}</span>
                  </div>
                  
                  <h6 className="fw-bold mb-1" style={{ color: '#111827', fontSize: '15px' }}>{report.issue}</h6>
                  
                  <div className="d-flex align-items-center gap-1 mb-2" style={{ color: '#4b5563', fontSize: '12px' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: '16px', color: '#3d7a77' }}>location_on</span>
                    {report.location}
                  </div>
                  
                  <p className="mb-3" style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.4' }}>
                    {report.description || "No additional details provided by student."}
                  </p>

                  <button 
                    onClick={() => toggleStatus(report.id, report.status)}
                    className="btn w-100 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" 
                    style={{ 
                      background: report.status === 'Resolved' ? '#1f2937' : '#3d7a77', 
                      color: 'white', 
                      fontSize: '13px', 
                      border: 'none' 
                    }}
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>
                      {report.status === 'Resolved' ? 'history' : 'done_all'}
                    </span> 
                    {report.status === 'Resolved' ? 'Re-open Task' : 'Confirm Resolution'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </FacultyLayout>
  );
}