import React, { useState } from 'react';
import FacultyLayout from '../components/FacultyLayout';

const weeklyData = [
  { week: 'Week 1', resolved: 8, assigned: 12 },
  { week: 'Week 2', resolved: 15, assigned: 18 },
  { week: 'Week 3', resolved: 12, assigned: 10 },
  { week: 'Week 4', resolved: 20, assigned: 14 },
];

const teamPerformance = [
  { name: 'Dave', resolved: 18, avg: '1.2 days' },
  { name: 'Mr Peo', resolved: 14, avg: '1.8 days' },
  { name: 'Lumbiel', resolved: 22, avg: '0.9 days' },
  { name: 'Thato', resolved: 10, avg: '2.1 days' },
];

const timeFilters = ['This Week', 'This Month', 'This Year'];

export default function FacultyPerformance() {
  const [timeFilter, setTimeFilter] = useState('This Week');
  const maxResolved = Math.max(...weeklyData.map(d => Math.max(d.resolved, d.assigned)));

  return (
    <FacultyLayout>
      <div className="container py-4 no-scrollbar" style={{ maxWidth: '800px', height: '100vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <small style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>PERFORMANCE DASHBOARD</small>
            <h2 className="fw-bold text-white mb-0">Metrics Overview</h2>
          </div>
          <button className="btn border-0 p-2 text-white opacity-50">
            <span className="material-symbols-rounded">download</span>
          </button>
        </div>

        {/* Time filters */}
        <div className="d-flex gap-2 mb-4">
          {timeFilters.map((f) => (
            <button 
              key={f} 
              onClick={() => setTimeFilter(f)}
              className="btn rounded-pill px-3 py-1 fw-semibold"
              style={{ 
                fontSize: '12px',
                background: timeFilter === f ? '#3d7a77' : 'rgba(255,255,255,0.1)', 
                color: 'white',
                border: 'none'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Chart Card */}
        <div className="p-4 mb-4" style={{ 
          background: 'rgba(255,255,255,0.07)', 
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <h6 className="fw-bold text-white mb-1">Team performance over time</h6>
          <p className="small opacity-50 text-white mb-4">Resolved vs assigned issues</p>

          <div className="d-flex gap-3 mb-4">
            <div className="d-flex align-items-center gap-1">
              <div className="rounded-circle" style={{ width: '10px', height: '10px', background: '#3d7a77' }} />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>Resolved</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <div className="rounded-circle" style={{ width: '10px', height: '10px', background: '#5a9b98' }} />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>Assigned</span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="d-flex align-items-end gap-3" style={{ height: '150px' }}>
            {weeklyData.map((d) => (
              <div key={d.week} className="flex-grow-1 d-flex flex-column align-items-center gap-2">
                <div className="w-100 d-flex gap-1 align-items-end justify-content-center" style={{ height: '120px' }}>
                  <div className="rounded-top" style={{ 
                    width: '12px', 
                    height: `${(d.resolved / maxResolved) * 100}%`, 
                    background: '#3d7a77',
                    transition: 'height 0.5s ease'
                  }} />
                  <div className="rounded-top" style={{ 
                    width: '12px', 
                    height: `${(d.assigned / maxResolved) * 100}%`, 
                    background: '#5a9b98',
                    transition: 'height 0.5s ease'
                  }} />
                </div>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{d.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Best Resolver Highlight */}
        <div className="p-3 mb-4 d-flex justify-content-between align-items-center shadow-sm" style={{ 
          background: 'rgba(255,255,255,0.07)', 
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px'
        }}>
          <div>
            <small className="opacity-50 text-white d-block">Top Resolver</small>
            <h5 className="fw-bold text-white mb-0">Lumbiel</h5>
          </div>
          <div className="text-end">
            <span className="badge rounded-pill" style={{ background: '#3d7a77' }}>22 CLOSED</span>
          </div>
        </div>

        {/* Team Ranking */}
        <h6 className="fw-bold text-white mb-3">Team Ranking</h6>
        <div className="d-flex flex-column gap-2 pb-5">
          {teamPerformance.sort((a, b) => b.resolved - a.resolved).map((m, i) => (
            <div key={m.name} className="d-flex align-items-center justify-content-between p-3" style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '15px'
            }}>
              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold opacity-25 text-white" style={{ width: '20px' }}>#{i + 1}</span>
                <img src={`https://ui-avatars.com/api/?name=${m.name}&background=3d7a77&color=fff&size=36`} className="rounded-circle shadow-sm" width={36} alt={m.name} />
                <span className="fw-semibold text-white small">{m.name}</span>
              </div>
              <div className="text-end">
                <div className="fw-bold text-white" style={{ fontSize: '13px', color: '#3d7a77' }}>{m.resolved} solved</div>
                <small className="opacity-50 text-white" style={{ fontSize: '10px' }}>Avg: {m.avg}</small>
              </div>
            </div>
          ))}
        </div>

      </div>
    </FacultyLayout>
  );
}