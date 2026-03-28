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
    description: 'Due to the ongoing student strike, all lessons and campus activities are cancelled until further notice. Please stay safe and await further communications.',
    time: 'Today, 08:00 AM',
    unread: true,
    category: 'Emergency',
  },
  {
    id: 4,
    icon: 'pending',
    iconBg: '#f97316',
    title: 'Issue In Progress',
    description: 'Your report #REQ-4088 (Air Conditioning) is now in progress. A technician has been assigned.',
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
  {
    id: 6,
    icon: 'campaign',
    iconBg: '#dc2626',
    title: '🚨 Lessons Cancelled',
    description: 'All lectures and tutorials for today have been cancelled due to the ongoing disruptions. Campus facilities remain closed.',
    time: 'Today, 09:30 AM',
    unread: true,
    category: 'Emergency',
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
      <div className="container-fluid p-4 p-md-5">
        <div className="w-100 mx-auto" style={{ maxWidth: '1000px' }}>
          
          {/* Header Area */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-white fw-bold mb-1 fs-3">Campus Alerts</h2>
              <p className="text-white-50 small mb-0">Stay updated with real-time campus notifications.</p>
            </div>
            <button className="btn text-white-50 p-0 hover-orange">
              <span className="material-symbols-rounded fs-2">done_all</span>
            </button>
          </div>

          {/* Filter chips - Modern horizontal scroll */}
          <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="btn px-4 py-2 rounded-pill fw-semibold whitespace-nowrap transition-all border-0"
                style={activeFilter === f
                  ? { background: '#3d7a77', color: 'white' }
                  : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }
                }
              >
                {f}{f === 'Unread' ? ` (${unreadCount})` : ''}
              </button>
            ))}
          </div>

          {/* Alert List */}
          <div className="d-flex flex-column gap-3">
            {filtered.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-4 d-flex gap-3 shadow-sm"
                style={{
                  /* Using high-visibility glass style */
                  background: alert.category === 'Emergency' ? 'rgba(220, 38, 38, 0.2)' : 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(15px)',
                  border: alert.category === 'Emergency' ? '1px solid rgba(220, 38, 38, 0.4)' : '1px solid rgba(255,255,255,0.3)',
                  color: alert.category === 'Emergency' ? '#dc2626' : '#333'
                }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ backgroundColor: alert.iconBg, width: '48px', height: '48px' }}
                >
                  <span className="material-symbols-rounded text-white fs-4">{alert.icon}</span>
                </div>
                
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <h5 className="fw-bold mb-1 fs-5">{alert.title}</h5>
                    {alert.unread && (
                      <div className="rounded-circle flex-shrink-0 mt-2" style={{ width: '10px', height: '10px', background: '#3d7a77' }} />
                    )}
                  </div>
                  <p className="mb-2 fs-6 opacity-75">{alert.description}</p>
                  <small className="fw-semibold opacity-50 d-block">{alert.time}</small>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </StudentLayout>
  );
}