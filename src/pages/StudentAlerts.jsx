import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, writeBatch, or } from 'firebase/firestore';

export default function StudentAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Fetch all Emergencies OR reports belonging to current user
    const q = query(
      collection(db, "reports"),
      or(
        where("category", "==", "Emergency Alert"),
        where("studentEmail", "==", user.email)
      )
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let combinedData = [];
      const userEmail = auth.currentUser?.email;

      snapshot.docs.forEach(docSnap => {
        const data = { id: docSnap.id, ...docSnap.data() };
        
        // 1. Always add the original report if it's an Emergency
        if (data.category === "Emergency Alert") {
          combinedData.push({ ...data, type: 'original_report' });
        }

        // 2. If it's the user's report and it's being processed, add a separate notification entry
        if (data.studentEmail === userEmail && data.status === "In Progress") {
          combinedData.push({ 
            ...data, 
            id: `${data.id}_status`, // unique ID for the notification entry
            type: 'status_update', 
            displayMsg: `Your ${data.category.toLowerCase()} report (#${data.id.slice(-4)}) is being processed.`
          });
        }
      });

      // Sort by newest first
      combinedData.sort((a, b) => {
        const timeA = a.createdAt?.seconds ? a.createdAt.seconds : new Date(a.createdAt).getTime();
        const timeB = b.createdAt?.seconds ? b.createdAt.seconds : new Date(b.createdAt).getTime();
        return timeB - timeA;
      });

      setAlerts(combinedData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id, currentUnread) => {
    if (currentUnread === false) return;
    try {
      // Note: we use the actual report ID, removing the '_status' suffix if present
      const actualId = id.replace('_status', '');
      await updateDoc(doc(db, "reports", actualId), { unread: false });
    } catch (e) { console.error("Error marking read:", e); }
  };

  const markAllAsRead = async () => {
    try {
      const batch = writeBatch(db);
      alerts.forEach((alert) => {
        if (alert.unread !== false) {
          const actualId = alert.id.replace('_status', '');
          batch.update(doc(db, "reports", actualId), { unread: false });
        }
      });
      await batch.commit();
    } catch (e) { console.error(e); }
  };

  return (
    <StudentLayout>
      <div className="no-scrollbar" style={{ height: 'calc(100vh - 70px)', overflowY: 'auto', paddingBottom: '120px' }}>
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .alert-card { transition: 0.3s; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); }
          .unread-style { 
            background: rgba(220, 38, 38, 0.2) !important; 
            border: 1px solid rgba(220, 38, 38, 0.5) !important;
          }
          .status-notif {
            background: rgba(13, 202, 240, 0.05) !important;
            border: 1px solid rgba(13, 202, 240, 0.2) !important;
            margin-top: -10px; /* Pull it closer to the report card if they appear together */
          }
        `}</style>

        <div className="container-fluid px-3 py-4">
          <div className="w-100 mx-auto" style={{ maxWidth: '800px' }}>
            
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-white fw-bold m-0">Alert Center</h4>
              <button onClick={markAllAsRead} className="btn btn-sm text-white-50 border-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                Mark all read
              </button>
            </div>

            <div className="d-flex flex-column gap-3">
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>
              ) : (
                alerts.map((item) => {
                  const isUnread = item.unread !== false;

                  // RENDER ORIGINAL REPORT (EMERGENCY ONLY)
                  if (item.type === 'original_report') {
                    return (
                      <div key={item.id} onClick={() => markAsRead(item.id, item.unread)}
                           className={`p-3 rounded-4 alert-card ${isUnread ? 'unread-style' : ''}`}
                           style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="d-flex gap-3">
                          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                               style={{ width: '42px', height: '42px', background: isUnread ? '#dc2626' : 'rgba(255,255,255,0.1)' }}>
                            <span className="material-symbols-rounded text-white">campaign</span>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="fw-bold text-white mb-1">{item.issue || "Emergency Alert"}</h6>
                            <p className="text-white-50 small mb-2">{item.description}</p>
                            <div className="d-flex gap-3 opacity-50">
                              <small className="text-white" style={{ fontSize: '10px' }}>📍 {item.location}</small>
                              <small className="text-white" style={{ fontSize: '10px' }}>🕒 {formatTime(item.createdAt)}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // RENDER SEPARATE PROCESSING NOTIFICATION (NO ICON)
                  return (
                    <div key={item.id} onClick={() => markAsRead(item.id, item.unread)}
                         className={`p-3 rounded-4 alert-card status-notif ${isUnread ? 'opacity-100' : 'opacity-50'}`}>
                      <div className="ps-2">
                        <div className="d-flex justify-content-between">
                          <p className="text-info small fw-bold mb-1" style={{ letterSpacing: '0.5px' }}>STATUS UPDATE</p>
                          {isUnread && <div className="bg-info rounded-circle" style={{ width: '6px', height: '6px' }} />}
                        </div>
                        <p className="text-white mb-2" style={{ fontSize: '14px' }}>{item.displayMsg}</p>
                        <small className="text-white-50" style={{ fontSize: '10px' }}>🕒 {formatTime(item.createdAt)}</small>
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