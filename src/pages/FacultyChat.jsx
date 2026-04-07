import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import FacultyLayout from '../components/FacultyLayout';

const memberNames = {
  dave: { name: 'Dave', role: 'Plumbing Specialist' },
  lumbiel: { name: 'Lumbiel', role: 'General Maintenance' },
  'mr-peo': { name: 'Mr Peo', role: 'Electrical Technician' },
  thato: { name: 'Thato', role: 'HVAC Technician' },
};

const initialMessages = [
  { id: 1, sender: 'Dave', text: 'Did you check for clogs on all floors? Just to avoid more reports.', time: '10:30 AM', isMe: false },
  { id: 2, sender: 'You', text: 'Yes, sir. I checked the ground and first floors as well. The main line is clear, it was just an isolated issue in the second-floor kitchen.', time: '10:45 AM', isMe: true },
];

export default function FacultyChat() {
  const { memberId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reportId = searchParams.get('report');

  const member = memberNames[memberId || ''] || { name: 'Team Member', role: 'Maintenance' };
  const [messages, setMessages] = useState(initialMessages);
  const [newMsg, setNewMsg] = useState('');

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setMessages([...messages, {
      id: messages.length + 1,
      sender: 'You',
      text: newMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    }]);
    setNewMsg('');
  };

  return (
    <FacultyLayout>
      <div className="d-flex flex-column h-100">
        
        {/* Header */}
        <div className="d-flex align-items-center gap-3 p-3 shadow-sm" 
             style={{ background: 'rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => navigate(-1)} className="btn border-0 p-0 text-white opacity-75">
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
          
          <img 
            src={`https://ui-avatars.com/api/?name=${member.name}&background=3d7a77&color=fff&size=40`} 
            className="rounded-circle shadow-sm" 
            width={40} 
            alt={member.name} 
          />
          
          <div className="flex-grow-1">
            <h6 className="fw-bold mb-0 text-white">{member.name}</h6>
            <small className="opacity-50" style={{ fontSize: '11px', color: 'white' }}>{member.role}</small>
          </div>

          <button className="btn border-0 p-0 text-white opacity-50">
            <span className="material-symbols-rounded">more_vert</span>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-grow-1 p-4 overflow-auto no-scrollbar" style={{ height: 'calc(100vh - 160px)' }}>
          <div className="text-center mb-4">
            <span className="badge rounded-pill px-3 py-1 fw-normal" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
              TODAY
            </span>
          </div>

          {reportId && (
            <div className="rounded-3 p-3 mb-4 mx-auto shadow-sm" 
                 style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '90%' }}>
              <p className="small fw-bold mb-1" style={{ color: '#3d7a77' }}>REFERENCE: #{reportId}</p>
              <p className="small mb-0 text-white opacity-50">You are discussing this specific maintenance request.</p>
            </div>
          )}

          <div className="d-flex flex-column gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`d-flex ${msg.isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                <div className={`px-3 py-2 rounded-4 shadow-sm ${msg.isMe ? 'rounded-bottom-end-0' : 'rounded-bottom-start-0'}`} 
                     style={{ 
                       maxWidth: '80%', 
                       background: msg.isMe ? '#3d7a77' : 'rgba(255,255,255,0.15)',
                       backdropFilter: 'blur(10px)',
                       color: 'white',
                       border: msg.isMe ? 'none' : '1px solid rgba(255,255,255,0.1)'
                     }}>
                  <p className="mb-1" style={{ fontSize: '14px', lineHeight: '1.4' }}>{msg.text}</p>
                  <div className="text-end" style={{ fontSize: '10px', opacity: 0.6 }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3" style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="d-flex align-items-center gap-2 bg-white rounded-pill px-3 py-2 shadow-lg">
            <button className="btn border-0 p-0 text-muted" type="button">
              <span className="material-symbols-rounded">mood</span>
            </button>
            
            <input 
              className="form-control border-0 bg-transparent shadow-none px-2" 
              placeholder="Write something..." 
              style={{ fontSize: '14px' }}
              value={newMsg} 
              onChange={(e) => setNewMsg(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
            />

            <button className="btn border-0 p-0 text-muted mx-1" type="button">
              <span className="material-symbols-rounded">attach_file</span>
            </button>

            <button 
              onClick={sendMessage} 
              className="btn rounded-circle d-flex align-items-center justify-content-center p-0" 
              style={{ background: '#3d7a77', width: '38px', height: '38px', color: 'white' }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>send</span>
            </button>
          </div>
        </div>

      </div>
    </FacultyLayout>
  );
}