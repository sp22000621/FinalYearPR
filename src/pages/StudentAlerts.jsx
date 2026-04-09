import React, { useState } from 'react';
import StudentLayout from '../components/StudentLayout';

const alerts = [
  {
    id: 1,
    icon: 'error',
    iconBg: '#dc2626',
    title: 'Urgent: Water Shutdown',
    description: 'Block A will experience a water shutdown from 2PM to 4PM for emergency plumbing repairs.',
    time: '2 hours ago',
    unread: true,
    category: 'Issues',
  },
  {
    id: 2,
    icon: 'check_circle',
    iconBg: '#16a34a',
    title: 'Issue Resolved',
    description: 'Your report #REQ-3011 (Electrical) has been marked as resolved by the maintenance team.',
    time: '5 hours ago',
    unread: true,
    category: 'Issues',
  },
  {
    id: 3,
    icon: 'warning',
    iconBg: '#dc2626',
    title: '🚨 Emergency: Ongoing Strike',
    description: 'Due to the ongoing student strike, all campus activities are cancelled until further notice.',
    time: 'Today, 08:00 AM',
    unread: true,
    category: 'Emergency',
  },
  {
    id: 4,
    icon: 'pending',
    iconBg: '#f97316',
    title: 'Issue In Progress',
    description: 'Your report #REQ-4088 (Air Conditioning) is now in progress.',
    time: 'Yesterday',
    unread: false,
    category: 'Issues',
  },
  {
    id: 5,
    icon: 'schedule',
    iconBg: '#3b82f6',
    title: 'Scheduled Maintenance',
    description: 'Routine electrical inspections will occur in Block C corridors next Tuesday.',
    time: 'Yesterday, 08:00',
    unread: false,
    category: 'Events',
  },
];

const filters = ['All Alerts', 'Unread', 'Issues', 'Events', 'Emergency'];

export default function StudentAlerts() {
  const [activeFilter, setActiveFilter] = useState('All Alerts');

  const filtered = alerts.filter((a) => {
    if (activeFilter === 'All Alerts') return true;
    if (activeFilter === 'Unread') return a.unread;
    return a.category === activeFilter;
  });

  const unreadCount = alerts.filter(a => a.unread).length;

  return (
    <StudentLayout>
      {/* Scrollable Container with Hidden Scrollbar */}
      <div className="no-scrollbar" style={{ 
        height: 'calc(100vh - 70px)', 
        overflowY: 'auto', 
        paddingBottom: '120px',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}>
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>

        <div className="container-fluid px-3 py-4">
          <div className="w-100 mx-auto" style={{ maxWidth: '800px' }}>
            
            {/* Header Area - Scaled Down */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="text-white fw-bold mb-1">Campus Alerts</h4>
                <p className="text-white-50 small mb-0">Real-time campus notifications.</p>
              </div>
              <button className="btn text-white-50 p-0">
                <span className="material-symbols-rounded fs-3">done_all</span>
              </button>
            </div>

            {/* Filter chips - Scaled Down */}
            <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="btn px-3 py-1 rounded-pill fw-semibold border-0"
                  style={activeFilter === f
                    ? { background: '#3d7a77', color: 'white', fontSize: '12px' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', fontSize: '12px' }
                  }
                >
                  {f}{f === 'Unread' ? ` (${unreadCount})` : ''}
                </button>
              ))}
            </div>

            {/* Alert List - Transparent Glass Style */}
            <div className="d-flex flex-column gap-2">
              {filtered.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-4 d-flex gap-3"
                  style={{
                    background: alert.category === 'Emergency' 
                      ? 'rgba(220, 38, 38, 0.15)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: alert.category === 'Emergency' 
                      ? '1px solid rgba(220, 38, 38, 0.3)' 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ backgroundColor: alert.iconBg, width: '40px', height: '40px' }}
                  >
                    <span className="material-symbols-rounded text-white fs-5">{alert.icon}</span>
                  </div>
                  
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="fw-bold text-white mb-1" style={{ fontSize: '14px' }}>{alert.title}</h6>
                      {alert.unread && (
                        <div className="rounded-circle flex-shrink-0 mt-1" style={{ width: '8px', height: '8px', background: '#4ddbff' }} />
                      )}
                    </div>
                    <p className="mb-1 text-white-50" style={{ fontSize: '12px', lineHeight: '1.4' }}>{alert.description}</p>
                    <small className="text-white-50 opacity-50 d-block" style={{ fontSize: '10px' }}>{alert.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}