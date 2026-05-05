import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import FacultyLayout from '../components/FacultyLayout';

const memberData = {
  'hxhtakeover@biust.ac.bw': { name: 'Meruem Hunter', role: 'Field Operative' },
  'swarthyn10@gmail.com': { name: 'John Wick', role: 'Senior Maintenance Director' },
};

export default function FacultyChat() {
  const { memberId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  
  const [replyContext, setReplyContext] = useState(searchParams.get('report'));
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const currentUser = auth.currentUser;

  const member = memberData[memberId] || { 
    name: memberId?.split('@')[0].toUpperCase() || 'Team Member', 
    role: 'Maintenance Team' 
  };

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // INSTANT LISTENER (Same logic as your homepage/scan)
  useEffect(() => {
    if (!memberId || !currentUser?.email) return;

    // Simplified query to prevent index-failure delays
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.email),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        // Local filter ensures it's specifically with this member
        .filter(m => m.participants.includes(memberId));
      
      setMessages(msgs);
    }, (err) => {
      console.error("FIREBASE ERROR: Check console for index link!", err);
    });

    return () => unsubscribe();
  }, [memberId, currentUser?.email]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !currentUser?.email) return;

    const messageData = {
      text: newMsg,
      sender: currentUser.email,
      participants: [currentUser.email, memberId],
      createdAt: serverTimestamp(),
    };

    if (replyContext) {
      messageData.quotedReport = replyContext;
    }

    try {
      // Clear input and context immediately for that snappy feel
      setNewMsg('');
      setReplyContext(null); 
      
      await addDoc(collection(db, "chats"), messageData);
    } catch (err) {
      console.error("Error sending:", err);
    }
  };

  return (
    <FacultyLayout>
      <div className="d-flex flex-column h-100">
        
        {/* Header */}
        <div className="d-flex align-items-center gap-3 p-3 shadow-sm" 
             style={{ background: 'rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
          <button onClick={() => navigate(-1)} className="btn border-0 p-0 text-white opacity-75">
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
          
          <img 
            src={`https://ui-avatars.com/api/?name=${member.name}&background=3d7a77&color=fff&size=40`} 
            className="rounded-circle shadow-sm" width={40} alt={member.name} 
          />
          
          <div className="flex-grow-1">
            <h6 className="fw-bold mb-0 text-white">{member.name}</h6>
            <small className="opacity-50 text-white" style={{ fontSize: '11px' }}>{member.role}</small>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          className="flex-grow-1 p-4 overflow-auto no-scrollbar" 
          style={{ height: 'calc(100vh - 180px)' }}
          ref={scrollRef}
        >
          <div className="d-flex flex-column gap-3">
            {messages.map((msg) => {
              const isMe = msg.sender === currentUser?.email;
              return (
                <div key={msg.id} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div className={`px-3 py-2 rounded-4 shadow-sm ${isMe ? 'rounded-bottom-end-0' : 'rounded-bottom-start-0'}`} 
                       style={{ 
                         maxWidth: '80%', 
                         background: isMe ? '#3d7a77' : 'rgba(255,255,255,0.12)',
                         color: 'white',
                         border: '1px solid rgba(255,255,255,0.1)',
                         backdropFilter: 'blur(10px)'
                       }}>
                    
                    {msg.quotedReport && (
                       <div className="mb-2 p-2 rounded-2" 
                            style={{ 
                              background: 'rgba(0,0,0,0.2)', 
                              borderLeft: `3px solid ${isMe ? '#4fd1c5' : '#3d7a77'}`, 
                              fontSize: '11px' 
                            }}>
                         <div className="fw-bold" style={{ color: isMe ? '#4fd1c5' : '#81e6d9' }}>Replying to Report</div>
                         <div className="opacity-75 text-truncate">#{msg.quotedReport}</div>
                       </div>
                    )}

                    <p className="mb-1" style={{ fontSize: '14px', lineHeight: '1.5' }}>{msg.text}</p>
                    <div className="text-end" style={{ fontSize: '10px', opacity: 0.5 }}>
                       {msg.createdAt?.toDate() 
                         ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                         : '...'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3">
          <div className="bg-white rounded-4 shadow-lg p-2 overflow-hidden">
            
            {replyContext && (
              <div className="px-3 py-2 mb-2 rounded-3 d-flex align-items-center justify-content-between animate__animated animate__fadeInUp" 
                   style={{ background: '#f1f3f5', borderLeft: '4px solid #3d7a77' }}>
                <div className="d-flex flex-column">
                  <span className="fw-bold" style={{ fontSize: '11px', color: '#3d7a77' }}>Responding about</span>
                  <span className="text-muted text-truncate" style={{ fontSize: '12px', maxWidth: '250px' }}>#{replyContext}</span>
                </div>
                <button className="btn btn-sm p-0 text-muted" onClick={() => setReplyContext(null)}>
                  <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>close</span>
                </button>
              </div>
            )}

            <div className="d-flex align-items-center gap-2 px-2 pb-1">
              <input 
                className="form-control border-0 bg-transparent shadow-none" 
                placeholder="Write a message..." 
                value={newMsg} 
                onChange={(e) => setNewMsg(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
              />
              <button 
                onClick={sendMessage} 
                className="btn rounded-circle d-flex align-items-center justify-content-center" 
                style={{ background: '#3d7a77', width: '38px', height: '38px', color: 'white' }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>send</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </FacultyLayout>
  );
}