import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';

const moduleNames = {
  math101: 'MATH 101',
  comp201: 'COMP 201',
  infs303: 'INFS 303',
  chem102: 'CHEM 102',
  eng210: 'ENG 210',
  phys101: 'PHYS 101',
};

const initialMessages = [
  { id: 1, sender: 'Thabo M.', text: 'Has anyone started on Assignment 3?', time: '10:15 AM', isMe: false },
  { id: 2, sender: 'You', text: "Yes, I'm halfway through. The integration part is tricky.", time: '10:18 AM', isMe: true },
  { id: 3, sender: 'Kago L.', text: 'Can someone share the lecture notes from last Friday?', time: '10:22 AM', isMe: false },
  { id: 4, sender: 'Lebo S.', text: 'I uploaded them to the shared drive. Check the link in description.', time: '10:25 AM', isMe: false },
];

export default function CommunityChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(initialMessages);
  const [newMsg, setNewMsg] = useState('');

  const moduleName = moduleNames[id] || 'Community';

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
    <StudentLayout>

      <div className="d-flex flex-column" style={{ height: 'calc(100vh - 80px)', width: '100%' }}>
        
        <div className="d-flex align-items-center gap-3 p-4" style={{ background: 'rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => navigate('/student-communities')} className="btn p-0 text-white border-0 shadow-none">
            <span className="material-symbols-rounded fs-2">arrow_back</span>
          </button>
          <div className="rounded-4 d-flex align-items-center justify-content-center" style={{ background: '#3d7a77', width: '50px', height: '50px' }}>
            <span className="material-symbols-rounded text-white fs-3">school</span>
          </div>
          <div>
            <h4 className="fw-bold mb-0 text-white">{moduleName}</h4>
            <span className="text-white-50 fs-6">245 active members</span>
          </div>
        </div>

        {/* Messages  */}
        <div className="flex-grow-1 p-4 overflow-y-auto d-flex flex-column gap-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`d-flex ${msg.isMe ? 'justify-end ms-auto' : 'justify-start me-auto'}`} style={{ maxWidth: '85%' }}>
              <div 
                className="p-3 rounded-4" 
                style={{ 
                  background: msg.isMe ? '#3d7a77' : 'rgba(255, 255, 255, 0.95)',
                  color: msg.isMe ? 'white' : '#222',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
              >
                {!msg.isMe && <p className="fw-bold mb-1" style={{ color: '#3d7a77', fontSize: '0.9rem' }}>{msg.sender}</p>}
                <p className="mb-1">{msg.text}</p>
                <p className="text-end mb-0" style={{ fontSize: '0.75rem', opacity: 0.6 }}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar - Full width across the bottom */}
        <div className="p-4" style={{ background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="d-flex gap-2 mx-auto" style={{ maxWidth: '1200px' }}>
             <input
              className="form-control py-3 px-4 fs-5 border-0"
              placeholder="Type a message..."
              style={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '15px' }}
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="btn rounded-4 px-4 d-flex align-items-center justify-content-center border-0"
              style={{ background: '#3d7a77', color: 'white' }}
            >
              <span className="material-symbols-rounded fs-3">send</span>
            </button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}