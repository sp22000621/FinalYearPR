import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../firebase'; 
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import StudentLayout from '../components/StudentLayout';

export default function CommunityChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [communityData, setCommunityData] = useState(null);
  const scrollRef = useRef();

  // 1. Get the Community Name & Info dynamically
  useEffect(() => {
    const docRef = doc(db, "communities", id);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setCommunityData(docSnap.data());
      }
    });
    return () => unsub();
  }, [id]);

  // 2. Get Real-time Messages from the sub-collection
  useEffect(() => {
    const q = query(
      collection(db, "communities", id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setMessages(loadedMessages);
      
      // Auto-scroll to bottom when new messages arrive
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsub();
  }, [id]);

  // 3. Send Message to Firestore
  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    try {
      await addDoc(collection(db, "communities", id, "messages"), {
        text: newMsg,
        sender: auth.currentUser?.displayName || auth.currentUser?.email || 'Student',
        uid: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
        isMe: true // We store this, but we'll use UID to check logic below
      });
      setNewMsg('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <StudentLayout>
      <div className="d-flex flex-column" style={{ height: 'calc(100vh - 80px)', width: '100%' }}>
        
        {/* Dynamic Header */}
        <div className="d-flex align-items-center gap-3 p-4" style={{ background: 'rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => navigate('/student-communities')} className="btn p-0 text-white border-0 shadow-none">
            <span className="material-symbols-rounded fs-2">arrow_back</span>
          </button>
          <div className="rounded-4 d-flex align-items-center justify-content-center" 
               style={{ background: communityData?.category === 'Official' ? '#f59e0b' : '#3d7a77', width: '50px', height: '50px' }}>
            <span className="material-symbols-rounded text-white fs-3">
              {communityData?.category === 'Official' ? 'verified_user' : 'school'}
            </span>
          </div>
          <div className="text-start">
            <h4 className="fw-bold mb-0 text-white">{communityData?.name || 'Loading...'}</h4>
            <span className="text-white-50 fs-6">Active Community</span>
          </div>
        </div>

        {/* Real-time Messages Area */}
        <div className="flex-grow-1 p-4 overflow-y-auto d-flex flex-column gap-3 no-scrollbar">
          {messages.map((msg) => {
            // Check if the message was sent by the current logged-in user
            const isMe = msg.uid === auth.currentUser?.uid;

            return (
              <div key={msg.id} className={`d-flex ${isMe ? 'justify-content-end ms-auto' : 'justify-content-start me-auto'}`} style={{ maxWidth: '85%' }}>
                <div 
                  className="p-3 rounded-4 text-start" 
                  style={{ 
                    background: isMe ? '#3d7a77' : 'rgba(255, 255, 255, 0.95)',
                    color: isMe ? 'white' : '#222',
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  {!isMe && <p className="fw-bold mb-1" style={{ color: '#3d7a77', fontSize: '0.8rem' }}>{msg.sender}</p>}
                  <p className="mb-1">{msg.text}</p>
                  <p className="text-end mb-0" style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                    {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                  </p>
                </div>
              </div>
            );
          })}
          {/* Invisible element to anchor the scroll */}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4" style={{ background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="d-flex gap-2 mx-auto" style={{ maxWidth: '1200px' }}>
             <input
              className="form-control py-3 px-4 fs-5 border-0 shadow-none"
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