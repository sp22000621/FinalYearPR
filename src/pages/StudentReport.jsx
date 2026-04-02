import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';

const categories = [
  { icon: 'build', label: 'Maintenance Issue' },
  { icon: 'people', label: 'Roommate Conflict' },
  { icon: 'volume_up', label: 'Noise Complaint' },
  { icon: 'search', label: 'Theft/Lost Item' },
  { icon: 'medical_services', label: 'Health/Safety Hazard' },
  { icon: 'emergency', label: 'Emergency Alert', isEmergency: true },
];

export default function StudentReport() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate('/student-home'), 2000);
  };

  return (
    <StudentLayout>
      <div className="container-fluid p-4 p-md-5">
        {!submitted ? (
          <div className="w-100 mx-auto" style={{ maxWidth: '1000px' }}>
            {/* Header Area */}
            <div className="d-flex align-items-center mb-4">
              <button className="btn text-white p-0 me-3" onClick={() => navigate('/student-home')}>
                <span className="material-symbols-rounded">arrow_back</span>
              </button>
              <div>
                <h2 className="text-white fw-bold mb-1 fs-3">Report New Issue</h2>
                <p className="text-white-50 small mb-0">Choose a report type from the list, then add more details for faster support.</p>
              </div>
            </div>

            {!selected ? (
              /* Category List - Wide Rows */
              <div className="d-flex flex-column gap-3">
                {categories.map((cat) => (
                  <div 
                    key={cat.label} 
                    className="p-4 rounded-4 d-flex align-items-center transition-all cursor-pointer"
                    onClick={() => setSelected(cat.label)}
                    style={{ 
                      background: cat.isEmergency ? 'rgba(220, 38, 38, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: cat.isEmergency ? '1px solid rgba(220, 38, 38, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: cat.isEmergency ? '#ff4d4d' : 'white'
                    }}
                  >
                    <span className="material-symbols-rounded me-4 fs-4">{cat.icon}</span>
                    <span className="fw-semibold fs-5">{cat.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              /* Detail Input Area - Wide View */
              <div className="p-4 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-white-10">
                  <div className="d-flex align-items-center gap-3 text-white">
                    <span className="material-symbols-rounded opacity-75">assignment</span>
                    <span className="fw-bold fs-5">{selected}</span>
                  </div>
                  <button className="btn text-white-50 p-0" onClick={() => setSelected(null)}>
                    <span className="material-symbols-rounded">close</span>
                  </button>
                </div>

                <label className="text-white-50 small mb-2 d-block">More Details (optional)</label>
                <textarea 
                  className="form-control bg-transparent text-white border-white-25 mb-4 p-3 fs-5"
                  rows="6"
                  placeholder="Describe the issue here..."
                  style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />

                <button 
                  className="btn w-100 py-3 fw-bold fs-5 rounded-3" 
                  style={{ background: '#3d7a77', color: 'white' }}
                  onClick={handleSubmit}
                >
                  Submit Report
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Success State - Full Screen Centered */
          <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
            <div className="mb-4 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(25, 135, 84, 0.2)', border: '2px solid #198754' }}>
              <span className="material-symbols-rounded text-success fs-1">check</span>
            </div>
            <h2 className="text-white fw-bold mb-2">Report Submitted!</h2>
            <p className="text-white-50">Your {selected} report has been submitted successfully.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}