import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import StudentLayout from '../components/StudentLayout';
import '../styles/Dashboard.css';

export default function StudentHome() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Open': return { color: '#4ddbff', bg: 'rgba(8, 145, 178, 0.2)' };
      case 'In Progress': return { color: '#ffb347', bg: 'rgba(217, 119, 6, 0.2)' };
      case 'Resolved': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' };
      default: return { color: '#ff4d4d', bg: 'rgba(220, 38, 38, 0.2)' };
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        // Pointing to the 'students' collection verified in Firestore
        const studentRef = doc(db, "students", user.uid);
        const studentSnap = await getDoc(studentRef);
        
        if (studentSnap.exists()) {
          setUserData(studentSnap.data());
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    
    fetchProfile();

    const q = query(
      collection(db, "reports"),
      where("studentId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id.slice(0, 5).toUpperCase(),
        ...doc.data()
      }));
      setReports(reportsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reports:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.05)', 
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s ease'
  };

  return (
    <StudentLayout>
      <div className="main-content">
        <header className="d-flex justify-content-between align-items-center p-4">
          <div className="d-flex align-items-center gap-3">
            <img 
              src={`https://ui-avatars.com/api/?name=${userData?.firstName || 'User'}&background=3d7a77&color=fff`} 
              className="rounded-circle" 
              width="45" 
              alt="profile" 
            />
            <div className="text-white">
              <h6 className="mb-0 fw-bold">Hello, {userData?.firstName || 'Student'}!</h6>
              <small className="opacity-75">{userData?.department || 'BIUST Student'}</small>
            </div>
          </div>

        </header>

        <div className="container-fluid px-4 pb-5">
          <div className="row mb-4">
            <div className="col-12 col-md-6 mb-3 mb-md-0">
              <button className="report-main-card shadow-lg h-100 w-100 border-0" onClick={() => navigate('/student-report')}>
                <div className="icon-circle"><span className="material-symbols-rounded">add</span></div>
                <div className="text-start">
                  <h5 className="mb-0 fw-bold">Report New Issue</h5>
                  <p className="mb-0 small opacity-75">Log a maintenance request</p>
                </div>
              </button>
            </div>
            <div className="col-12 col-md-6">
              <div className="my-issues-card shadow-sm h-100 w-100 border-0 d-flex align-items-center gap-3 px-4 rounded-4 bg-white">
                <span className="material-symbols-rounded fs-5" style={{color: '#3d7a77'}}>assignment</span>
                <div className="text-start text-dark">
                  <h6 className="mb-0 fw-bold">Total Issues: {reports.length}</h6>
                  <small className="text-muted">Tracking your history</small>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-white fw-bold mb-0">Recent Reports</h6>
            <button className="btn btn-link text-decoration-none p-0 fw-semibold" style={{color: '#3d7a77'}}>See All</button>
          </div>

          <div className="row g-3">
            {loading ? (
              <div className="text-white opacity-50 p-4 text-center">Loading reports...</div>
            ) : reports.length === 0 ? (
              <div className="text-white opacity-50 p-4 text-center">No reports found. Create one above!</div>
            ) : (
              reports.map((item, index) => {
                const styles = getStatusStyles(item.status);
                return (
                  <div key={index} className="col-12 col-lg-4">
                    <div style={glassStyle}>
                      <div className="d-flex justify-content-between mb-3">
                        <span className="text-white opacity-50 small fw-bold">#{item.id}</span>
                        <span 
                          className="badge rounded-pill px-3 py-1" 
                          style={{ backgroundColor: styles.bg, color: styles.color, border: `1px solid ${styles.color}44` }}
                        >
                          {item.status}
                        </span>
                      </div>
                      
                      <h6 className="fw-bold text-white mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description || item.category}
                      </h6>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <small className="text-white opacity-50">
                          {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </small>
                        <span 
                          className="badge px-3 py-1 rounded-pill"
                          style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}
                        >
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}