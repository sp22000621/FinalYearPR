import React, { useState, useEffect } from 'react';
import FacultyLayout from '../components/FacultyLayout';
import { db } from '../firebase';
import { collection, query, onSnapshot, where, Timestamp } from 'firebase/firestore';

export default function FacultyPerformance() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current month details for the header and filtering
  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();

  useEffect(() => {
    // Calculate the first and last millisecond of the current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Convert to Firestore Timestamps
    const startTs = Timestamp.fromDate(startOfMonth);
    const endTs = Timestamp.fromDate(endOfMonth);

    // Query reports only for the current month
    const q = query(
      collection(db, "reports"),
      where("createdAt", ">=", startTs),
      where("createdAt", "<=", endTs)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(data);
      setLoading(false);
    }, (error) => {
      console.error("Filter error (check if index is needed):", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [now.getMonth()]); // Triggers refresh if the month changes while the app is open

  // --- LOGIC TO CALCULATE DYNAMIC METRICS ---
  
  const getWeeklyMetrics = () => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return weeks.map((week, index) => {
      // Determine which week of the month the report belongs to
      const filtered = reports.filter(r => {
        const reportDate = r.createdAt?.toDate ? r.createdAt.toDate() : new Date();
        const day = reportDate.getDate();
        const weekIndex = Math.min(Math.floor((day - 1) / 7), 3);
        return weekIndex === index;
      });

      return {
        week,
        resolved: filtered.filter(r => r.status === 'Resolved').length,
        assigned: filtered.filter(r => r.status === 'Assigned' || r.status === 'In Progress').length
      };
    });
  };

  const getTeamRanking = () => {
    const stats = {};
    reports.forEach(r => {
      if (r.assignedTo) {
        if (!stats[r.assignedTo]) stats[r.assignedTo] = { name: r.assignedTo, resolved: 0, assigned: 0 };
        if (r.status === 'Resolved') stats[r.assignedTo].resolved += 1;
        else stats[r.assignedTo].assigned += 1;
      }
    });
    return Object.values(stats).sort((a, b) => b.resolved - a.resolved);
  };

  const weeklyData = getWeeklyMetrics();
  const teamPerformance = getTeamRanking();
  const topResolver = teamPerformance.length > 0 && teamPerformance[0].resolved > 0 ? teamPerformance[0] : null;
  const maxVal = Math.max(...weeklyData.map(d => Math.max(d.resolved, d.assigned)), 5);

  return (
    <FacultyLayout>
      <div className="container py-4 no-scrollbar" style={{ maxWidth: '800px', height: '100vh', overflowY: 'auto', paddingBottom: '100px' }}>
        
        {/* Header - Updates automatically to "May 2026", "June 2026", etc. */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <small style={{ color: '#3d7a77', fontSize: '11px', fw: 'bold', letterSpacing: '1.5px' }}>
              PERFORMANCE: {currentMonthName.toUpperCase()} {currentYear}
            </small>
            <h2 className="fw-bold text-white mb-0">Operational Metrics</h2>
          </div>
          <div className="text-end">
             <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3">
               Live Sync
             </span>
          </div>
        </div>

        {/* Chart Card */}
        <div className="p-4 mb-4" style={{ 
          background: 'rgba(255,255,255,0.05)', 
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px'
        }}>
          <h6 className="fw-bold text-white mb-1">Monthly Trend</h6>
          <p className="small opacity-50 text-white mb-4">Tracking activity for {currentMonthName}</p>

          <div className="d-flex gap-3 mb-4">
            <div className="d-flex align-items-center gap-1">
              <div className="rounded-circle" style={{ width: '8px', height: '8px', background: '#3d7a77' }} />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>Resolved ({reports.filter(r => r.status === 'Resolved').length})</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <div className="rounded-circle" style={{ width: '8px', height: '8px', background: 'rgba(90, 155, 152, 0.4)' }} />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>Pending ({reports.filter(r => r.status !== 'Resolved').length})</span>
            </div>
          </div>

          <div className="d-flex align-items-end gap-3" style={{ height: '150px' }}>
            {weeklyData.map((d) => (
              <div key={d.week} className="flex-grow-1 d-flex flex-column align-items-center gap-2">
                <div className="w-100 d-flex gap-1 align-items-end justify-content-center" style={{ height: '120px' }}>
                  <div className="rounded-top" style={{ 
                    width: '15px', height: `${(d.resolved / maxVal) * 100}%`, 
                    background: '#3d7a77', transition: 'height 0.8s ease'
                  }} />
                  <div className="rounded-top" style={{ 
                    width: '15px', height: `${(d.assigned / maxVal) * 100}%`, 
                    background: 'rgba(90, 155, 152, 0.2)', border: '1px solid rgba(90, 155, 152, 0.5)', transition: 'height 0.8s ease'
                  }} />
                </div>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{d.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Resolver Card */}
        {topResolver ? (
          <div className="p-3 mb-4 d-flex justify-content-between align-items-center" style={{ 
            background: 'rgba(61, 122, 119, 0.1)', 
            border: '1px solid rgba(61, 122, 119, 0.3)', borderRadius: '20px'
          }}>
            <div>
              <small className="text-info d-block fw-bold" style={{ fontSize: '10px' }}>⭐ MONTHLY MVP</small>
              <h5 className="fw-bold text-white mb-0">{topResolver.name.split('@')[0]}</h5>
            </div>
            <div className="text-end">
              <span className="badge rounded-pill px-3" style={{ background: '#3d7a77' }}>{topResolver.resolved} FIXED</span>
            </div>
          </div>
        ) : (
          <div className="p-4 mb-4 text-center" style={{ border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '20px' }}>
            <span className="material-symbols-rounded opacity-25 text-white display-6">leaderboard</span>
            <p className="small text-white opacity-50 mt-2 mb-0">No resolutions recorded for {currentMonthName} yet.</p>
          </div>
        )}

        {/* Operator Ranking */}
        <h6 className="fw-bold text-white mb-3">Ranking ({currentMonthName})</h6>
        <div className="d-flex flex-column gap-2">
          {teamPerformance.length === 0 ? (
            <div className="p-5 text-center text-white opacity-25">No data available for this month.</div>
          ) : (
            teamPerformance.map((m, i) => (
              <div key={m.name} className="d-flex align-items-center justify-content-between p-3" style={{ 
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '18px'
              }}>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold text-white opacity-25" style={{ width: '20px' }}>#{i + 1}</span>
                  <img src={`https://ui-avatars.com/api/?name=${m.name}&background=3d7a77&color=fff`} className="rounded-circle" width={32} height={32} alt="avatar" />
                  <div>
                    <div className="fw-semibold text-white small">{m.name.split('@')[0]}</div>
                    <div className="text-white-50" style={{ fontSize: '10px' }}>Active this month</div>
                  </div>
                </div>
                <div className="text-end">
                  <div className="fw-bold text-white" style={{ fontSize: '13px' }}>{m.resolved} <span className="opacity-50 fw-normal">solved</span></div>
                  <div className="text-info" style={{ fontSize: '10px' }}>{m.assigned} pending</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </FacultyLayout>
  );
}