import React, { useState, useEffect } from 'react';
import FacultyLayout from '../components/FacultyLayout';
import { db, auth } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';

export default function FacultyAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Alerts');

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

    // Use a simple query to avoid the "Index Required" errors in your console
    const q = query(collection(db, "reports"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let combinedData = [];
      const userEmail = auth.currentUser?.email;

      snapshot.docs.forEach(docSnap => {
        const data = { id: docSnap.id, ...docSnap.data() };
        
        // 1. Show ALL Emergencies (Visible to everyone)
        if (data.category === "Emergency Alert") {
          combinedData.push({ 
            ...data, 
            type: 'emergency', 
            icon: 'campaign',
            iconBg: '#dc2626'
          });
        }

        // 2. Show reports specifically ASSIGNED to John (You)
        else if (data.assignedTo === userEmail) {
          combinedData.push({ 
            ...data, 
            type: 'assignment', 
            icon: 'assignment_ind',
            iconBg: '#3d7a77'
          });
        }
      });

      // Client-side sort to avoid needing Firebase Composite Indexes
      combinedData.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setAlerts(combinedData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id, currentUnread) => {
    if (currentUnread === false) return;
    try {
      await updateDoc(doc(db, "reports", id), { unread: false });
    } catch (e) { console.error("Error marking read:", e); }
  };

  const markAllAsRead = async () => {
    try {
      const batch = writeBatch(db);
      alerts.forEach((alert) => {
        if (alert.unread !== false) {
          batch.update(doc(db, "reports", alert.id), { unread: false });
        }
      });
      await batch.commit();
    } catch (e) { console.error(e); }
  };

  const filtered = alerts.filter((a) => {
    if (activeFilter === 'All Alerts') return true;
    if (activeFilter === 'Unread') return a.unread !== false;
    if (activeFilter === 'Issues') return a.type === 'assignment';
    if (activeFilter === 'Emergency') return a.type === 'emergency';
    return true;
  });

  const unreadCount = alerts.filter(a => a.unread !== false).length;

  return (
    <FacultyLayout>
      <div className="no-scrollbar" style={{ height: '100vh', overflowY: 'auto', paddingBottom: '120px' }}>
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .alert-card { transition: 0.3s; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); }
          .emergency-unread { 
            background: rgba(220, 38, 38, 0.15) !important; 
            border: 1px solid rgba(220, 38, 38, 0.4) !important;
          }
        `}</style>

        <div className="container py-4" style={{ maxWidth: '800px' }}>
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-white fw-bold m-0">Alerts</h2>
            <button 
              onClick={markAllAsRead} 
              className="btn btn-sm text-white-50" 
              style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}
              disabled={unreadCount === 0}
            >
              <span className="material-symbols-rounded align-middle me-1" style={{ fontSize: '18px' }}>done_all</span>
              Mark all read
            </button>
          </div>

          {/* Dynamic Filters */}
          <div className="d-flex gap-2 mb-4 overflow-auto no-scrollbar pb-2">
            {['All Alerts', 'Unread', 'Issues', 'Emergency'].map((f) => (
              <button 
                key={f} 
                onClick={() => setActiveFilter(f)}
                className="btn rounded-pill px-3 py-1 fw-semibold text-nowrap"
                style={{ 
                  fontSize: '12px',
                  background: activeFilter === f ? '#3d7a77' : 'rgba(255,255,255,0.1)', 
                  color: 'white', border: 'none'
                }}
              >
                {f}{f === 'Unread' ? ` (${unreadCount})` : ''}
              </button>
            ))}
          </div>

          <div className="d-flex flex-column gap-3">
            {loading ? (
              <div className="text-center py-5 text-white opacity-50">
                <div className="spinner-border spinner-border-sm me-2"></div> Synchronizing...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5 opacity-50 text-white">
                <span className="material-symbols-rounded display-4 mb-2">notifications_off</span>
                <p>No alerts in this category.</p>
              </div>
            ) : (
              filtered.map((item) => {
                const isUnread = item.unread !== false;
                return (
                  <div key={item.id} onClick={() => markAsRead(item.id, item.unread)}
                       className={`p-3 rounded-4 alert-card ${isUnread && item.type === 'emergency' ? 'emergency-unread' : ''}`}
                       style={{ background: 'rgba(255,255,255,0.05)', opacity: isUnread ? 1 : 0.6 }}>
                    <div className="d-flex gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                           style={{ width: '42px', height: '42px', background: item.iconBg }}>
                        <span className="material-symbols-rounded text-white">{item.icon}</span>
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className={`text-white mb-1 ${isUnread ? 'fw-bold' : 'fw-normal'}`}>
                            {item.type === 'emergency' ? (item.issue || "Emergency") : `Assigned: ${item.issue}`}
                          </h6>
                          {isUnread && <div className="bg-info rounded-circle mt-1" style={{ width: '6px', height: '6px' }} />}
                        </div>
                        <p className="text-white-50 small mb-2 text-truncate-2">{item.description}</p>
                        <div className="d-flex gap-3 opacity-50">
                          <small className="text-white" style={{ fontSize: '10px' }}>📍 {item.location}</small>
                          <small className="text-white" style={{ fontSize: '10px' }}>🕒 {formatTime(item.createdAt)}</small>
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
    </FacultyLayout>
  );
}