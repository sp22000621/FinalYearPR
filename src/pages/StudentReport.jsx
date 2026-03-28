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
    // Increased timeout slightly for better user experience
    setTimeout(() => navigate('/student-home'), 2500);
  };

  return (
    <StudentLayout>
      <div className="container-fluid p-4 p-md-5">
        {!submitted ? (
          <div className="w-100 mx-auto" style={{ maxWidth: '1000px' }}>
            {/* Header Area */}
            <div className="d-flex align-items-center mb-4">
              <button className="btn text-white p-0 me-3 hover-orange" onClick={() => navigate('/student-home')}>
                <span className="material-symbols-rounded">arrow_back</span>
              </button>
              <div>
                <h2 className="text-white fw-bold mb-1 fs-3">Report New Issue</h2>
                <p className="text-white-50 small mb-0">Choose a report type from the list, then add more details for faster support.</p>
              </div>
            </div>

            {!selected ? (
              /* Category List - Wide, Semi-Solid White Rows */
              <div className="d-flex flex-column gap-3">
                {categories.map((cat) => (
                  <div 
                    key={cat.label} 
                    className="p-4 rounded-4 d-flex align-items-center transition-all cursor-pointer shadow-sm hover-light-bg"
                    onClick={() => setSelected(cat.label)}
                    style={{ 
                      /* Theming update: Increased white opacity (0.9) to match dashboard viewability */
                      background: cat.isEmergency ? 'rgba(220, 38, 38, 0.2)' : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)', /* Maintains glass effect */
                      border: cat.isEmergency ? '1px solid rgba(220, 38, 38, 0.4)' : '1px solid rgba(255, 255, 255, 0.3)',
                      /* Text color is now dark (#333) against the white background */
                      color: cat.isEmergency ? '#dc2626' : '#333' 
                    }}
                  >
                    <span className="material-symbols-rounded me-4 fs-4" style={{color: cat.isEmergency ? '#dc2626' : '#3d7a77'}}>{cat.icon}</span>
                    <span className="fw-semibold fs-5">{cat.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              /* Detail Input Area - Semi-Solid White Container */
              <div className="p-4 rounded-4 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary-subtle">
                  <div className="d-flex align-items-center gap-3" style={{color: '#333'}}>
                    <span className="material-symbols-rounded" style={{color: '#3d7a77'}}>assignment</span>
                    <span className="fw-bold fs-5">{selected}</span>
                  </div>
                  <button className="btn text-muted p-0 hover-orange" onClick={() => setSelected(null)}>
                    <span className="material-symbols-rounded">close</span>
                  </button>
                </div>

                <label className="text-muted small mb-2 d-block fw-semibold">More Details (optional)</label>
                <textarea 
                  className="form-control bg-light text-dark border-secondary-subtle mb-4 p-3 fs-5"
                  rows="6"
                  placeholder="Describe the issue here..."
                  style={{ borderRadius: '12px', resize: 'none' }}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />

                <button 
                  className="btn w-100 py-3 fw-bold fs-5 rounded-3 text-white transition-all shadow-sm" 
                  style={{ background: '#3d7a77' }}
                  onClick={handleSubmit}
                >
                  Submit Report
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Success...Semi-Solid White Glass Container for Visibility */
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
             <div className="p-5 rounded-4 shadow-lg text-center" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.3)', maxWidth: '600px', color: '#333' }}>
                <div className="mb-4 d-flex align-items-center justify-content-center mx-auto" style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(25, 135, 84, 0.1)', border: '3px solid #198754' }}>
                  <span className="material-symbols-rounded text-success fs-1">check_circle</span>
                </div>
                <h1 className="fw-bold mb-3 fs-2">Report Submitted!</h1>
                <p className="fs-5 opacity-75 mb-0">Your {selected} report has been successfully submitted. You will be redirected shortly.</p>
             </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}