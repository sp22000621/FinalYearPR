import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import FacultyLayout from '../components/FacultyLayout';

export default function FacultyHome() {
  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeReports = null;

    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        // Fetch profile
        const docRef = doc(db, "faculty", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching faculty profile:", error);
      }

      // Reports listener (ONLY after user is ready)
      const q = query(
        collection(db, "reports"),
        where("assignedTo", "==", user.email)
      );

      unsubscribeReports = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const sortedDocs = docs.sort((a, b) => (a.status === 'Resolved') - (b.status === 'Resolved'));
        setReports(sortedDocs);
        setLoading(false);
      }, (err) => {
        console.error("Snapshot error:", err);
        setLoading(false);
      });
    });

    return () => {
      if (unsubscribeReports) unsubscribeReports();
      unsubscribeAuth();
    };
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
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
        <div className="spinner-border text-info" role="status"></div>
      </div>
    );
  }

  return (
    <FacultyLayout>
      <div className="no-scrollbar" style={{ height: '100vh', overflowY: 'auto', paddingBottom: '120px' }}>
        
        {/* Header */}
        <div className="p-4 shadow-sm" style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <header className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">

              <div className="rounded-circle bg-info d-flex align-items-center justify-content-center text-dark fw-bold shadow-sm" 
                   style={{ width: '50px', height: '50px', minWidth: '50px' }}>
                {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
              </div>
              
              <div className="text-white">
                <h5 className="mb-0 fw-bold">
                  {profile ? `${profile.firstName} ${profile.lastName}` : "Loading..."}
                </h5>
                <small className="opacity-75 text-info" style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>
                  {profile?.rank || "Faculty"}
                </small>
              </div>
            </div>
          </header>

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

        {/* Reports */}
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold text-white mb-0">Assigned Tasks</h6>
            <span className="badge bg-dark text-white-50" style={{ fontSize: '10px' }}>
              Total: {reports.length}
            </span>
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
                  opacity: report.status === 'Resolved' ? 0.8 : 1
                }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge rounded-pill" style={{ 
                      backgroundColor: report.category === 'Security' ? '#fee2e2' : '#dcfce7', 
                      color: report.category === 'Security' ? '#dc2626' : '#16a34a', 
                      fontSize: '10px' 
                    }}>
                      {report.category}
                    </span>
                    <span className="small opacity-50 fw-bold" style={{ color: '#1f2937', fontSize: '10px' }}>
                      #{report.id.substring(0,6).toUpperCase()}
                    </span>
                  </div>

                  <h6 className="fw-bold mb-1" style={{ color: '#111827' }}>
                    {report.issue}
                  </h6>

                  <p className="mb-3" style={{ color: '#6b7280', fontSize: '13px' }}>
                    {report.description}
                  </p>

                  <button 
                    onClick={() => toggleStatus(report.id, report.status)}
                    className="btn w-100 py-2 rounded-3 fw-bold" 
                    style={{ background: report.status === 'Resolved' ? '#1f2937' : '#3d7a77', color: 'white' }}
                  >
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