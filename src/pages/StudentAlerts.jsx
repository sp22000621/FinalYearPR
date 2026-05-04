import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';

export default function StudentAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  //......... Helper to fix the "Objects are not valid as a React child" error(ai/gemini helped section)
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    }
    return String(timestamp);
  };
//............................section end here
  useEffect(() => {
    // Fetching Emergency Alerts from all users
    const q = query(collection(db, "reports"), where("category", "==", "Emergency Alert"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by newest first
      reportsData.sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds : new Date(a.createdAt).getTime();
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds : new Date(b.createdAt).getTime();
        return timeB - timeA;
      });
      
      setAlerts(reportsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Mark single alert as read on click
  const markAsRead = async (id, currentStatus) => {
    if (currentStatus === false) return; // Don't run if already read
    try {
      const alertRef = doc(db, "reports", id);
      await updateDoc(alertRef, { unread: false });
    } catch (e) { console.error("Error marking read:", e); }
  };

  // Mark all currently visible emergencies as read
  const markAllAsRead = async () => {
    try {
      const batch = writeBatch(db);
      alerts.forEach((alert) => {
        if (alert.unread !== false) {
          const ref = doc(db, "reports", alert.id);
          batch.update(ref, { unread: false });
        }
      });
      await batch.commit();
    } catch (e) { console.error("Batch Error:", e); }
  };

  return (
    <StudentLayout>
      <div className="no-scrollbar" style={{ 
        height: 'calc(100vh - 70px)', 
        overflowY: 'auto', 
        paddingBottom: '120px',
        scrollbarWidth: 'none'
      }}>
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .alert-card { transition: all 0.3s ease; cursor: pointer; }
          .unread-style { 
            background: rgba(220, 38, 38, 0.2) !important; 
            border: 1px solid rgba(220, 38, 38, 0.5) !important;
          }
          .read-style { 
            background: rgba(255, 255, 255, 0.03) !important; 
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            opacity: 0.8;
          }
        `}</style>

        <div className="container-fluid px-3 py-4">
          <div className="w-100 mx-auto" style={{ maxWidth: '800px' }}>
            
            {/* Header with Mark All Button */}
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                <h4 className="text-white fw-bold mb-1">Emergency Broadcasts</h4>
                <p className="text-danger small mb-0 fw-semibold">CAMPUS-WIDE ALERTS</p>
              </div>
              <button 
                onClick={markAllAsRead}
                className="btn btn-sm text-white-50 border-0 d-flex align-items-center gap-1"
                style={{ fontSize: '12px', background: 'rgba(255,255,255,0.05)' }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>done_all</span>
                Mark all read
              </button>
            </div>

            <div className="d-flex flex-column gap-3">
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-5 text-white-50">No emergencies reported.</div>
              ) : (
                alerts.map((alert) => {
                  const isUnread = alert.unread !== false;
                  return (
                    <div 
                      key={alert.id} 
                      onClick={() => markAsRead(alert.id, alert.unread)}
                      className={`p-3 rounded-4 alert-card ${isUnread ? 'unread-style' : 'read-style'}`}
                    >
                      <div className="d-flex gap-3">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0`}
                             style={{ 
                               width: '42px', height: '42px', 
                               background: isUnread ? '#dc2626' : 'rgba(255,255,255,0.1)' 
                             }}>
                          <span className="material-symbols-rounded text-white">campaign</span>
                        </div>
                        
                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className={`fw-bold mb-0 ${isUnread ? 'text-white' : 'text-white-50'}`}>
                              {alert.issue || "Emergency Alert"}
                            </h6>
                            {isUnread && (
                              <div className="bg-info rounded-circle shadow-sm" 
                                   style={{ width: '8px', height: '8px', boxShadow: '0 0 10px #0dcaf0' }} />
                            )}
                          </div>
                          
                          <p className={`${isUnread ? 'text-white' : 'text-white-50'} mb-2`} 
                             style={{ fontSize: '13px', lineHeight: '1.4', opacity: isUnread ? 0.9 : 0.6 }}>
                            {alert.description}
                          </p>

                          <div className="d-flex gap-3 pt-2 border-top border-white border-opacity-10">
                            <small className="text-white-50 d-flex align-items-center" style={{ fontSize: '10px' }}>
                              <span className="material-symbols-rounded me-1" style={{ fontSize: '12px' }}>location_on</span>
                              {alert.location || "Campus"}
                            </small>
                            <small className="text-white-50 d-flex align-items-center" style={{ fontSize: '10px' }}>
                              <span className="material-symbols-rounded me-1" style={{ fontSize: '12px' }}>schedule</span>
                              {formatTime(alert.createdAt)}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}