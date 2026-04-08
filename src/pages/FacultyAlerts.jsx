import React, { useState } from 'react';
import FacultyLayout from '../components/FacultyLayout';

const alerts = [
  { id: 1, icon: 'error', iconBg: '#dc2626', title: 'Urgent: Water Shutdown', description: 'Block A will experience a water shutdown from 2PM to 4PM for emergency plumbing repairs.', time: '2 hours ago', unread: true, category: 'Issues' },
  { id: 2, icon: 'check_circle', iconBg: '#16a34a', title: 'Issue Resolved', description: 'Report #REQ-3011 (Electrical) has been marked as resolved.', time: '5 hours ago', unread: true, category: 'Issues' },
  { id: 3, icon: 'warning', iconBg: '#dc2626', title: '🚨 Emergency: Ongoing Strike', description: 'Due to the ongoing student strike, all lessons and campus activities are cancelled until further notice.', time: 'Today, 08:00 AM', unread: true, category: 'Emergency' },
  { id: 4, icon: 'campaign', iconBg: '#dc2626', title: '🚨 Lessons Cancelled', description: 'All lectures and tutorials for today have been cancelled due to ongoing disruptions.', time: 'Today, 09:30 AM', unread: true, category: 'Emergency' },
  { id: 5, icon: 'schedule', iconBg: '#3b82f6', title: 'Scheduled Maintenance', description: 'Routine electrical inspections will occur in Block C corridors next Tuesday.', time: 'Yesterday, 08:00', unread: false, category: 'Events' },
];

const filters = ['All Alerts', 'Unread', 'Issues', 'Events', 'Emergency'];

export default function FacultyAlerts() {
  const [activeFilter, setActiveFilter] = useState('All Alerts');
  
  const filtered = alerts.filter((a) => {
    if (activeFilter === 'All Alerts') return true;
    if (activeFilter === 'Unread') return a.unread;
    return a.category === activeFilter;
  });
  
  const unreadCount = alerts.filter(a => a.unread).length;

  return (
    <FacultyLayout>
      <div className="container py-4 no-scrollbar" style={{ maxWidth: '800px', height: '100vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-white mb-0">Alerts</h2>
          <button className="btn border-0 p-0 text-white opacity-50">
            <span className="material-symbols-rounded">done_all</span>
          </button>
        </div>

        {/* Horizontal Filters */}
        <div className="d-flex gap-2 mb-4 overflow-auto no-scrollbar pb-2">
          {filters.map((f) => (
            <button 
              key={f} 
              onClick={() => setActiveFilter(f)}
              className="btn rounded-pill px-3 py-1 fw-semibold text-nowrap"
              style={{ 
                fontSize: '12px',
                background: activeFilter === f ? '#3d7a77' : 'rgba(255,255,255,0.1)', 
                color: 'white',
                border: 'none',
                minWidth: 'fit-content'
              }}
            >
              {f}{f === 'Unread' ? ` (${unreadCount})` : ''}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="d-flex flex-column gap-3 pb-5">
          {filtered.map((alert) => (
            <div 
              key={alert.id} 
              className="p-3 d-flex gap-3 shadow-sm"
              style={{ 
                borderRadius: '20px',
                background: alert.category === 'Emergency' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(255,255,255,0.07)', 
                border: alert.category === 'Emergency' ? '1px solid rgba(220, 38, 38, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                style={{ backgroundColor: alert.iconBg, width: '40px', height: '40px' }}
              >
                <span className="material-symbols-rounded text-white" style={{ fontSize: '20px' }}>
                  {alert.icon}
                </span>
              </div>

              <div className="flex-grow-1 min-w-0">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <h6 className="fw-bold mb-1 text-white small">{alert.title}</h6>
                  {alert.unread && (
                    <div className="rounded-circle mt-1" style={{ 
                      background: '#3d7a77', 
                      width: '8px', 
                      height: '8px',
                      flexShrink: 0 
                    }} />
                  )}
                </div>
                <p className="mb-2 text-white opacity-75" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                  {alert.description}
                </p>
                <small className="opacity-50 text-white" style={{ fontSize: '11px' }}>
                  {alert.time}
                </small>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-5 opacity-50 text-white">
              <span className="material-symbols-rounded display-4 mb-2">notifications_off</span>
              <p>No alerts in this category.</p>
            </div>
          )}
        </div>

      </div>
    </FacultyLayout>
  );
}