import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';
import FacultyLayout from '../components/FacultyLayout';

export default function FacultyTeams() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [teamList, setTeamList] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  // Helper function to force "..." after a specific length
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    if (!currentUser?.email) return;

    const syncTeams = async () => {
      try {
        const facultySnap = await getDocs(collection(db, "faculty"));
        const allFaculty = [];
        
        facultySnap.forEach((doc) => {
          const data = doc.data();
          if (data.email !== currentUser.email) {
            allFaculty.push({
              email: data.email,
              displayName: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email.split('@')[0],
              department: data.department || 'Faculty',
              lastMsg: 'No messages yet',
              time: '',
              unread: 0,
              timestamp: 0 
            });
          }
        });

        const chatQuery = query(
          collection(db, "chats"),
          where("participants", "array-contains", currentUser.email),
          orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(chatQuery, (chatSnap) => {
          const messages = chatSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          
          const updatedList = allFaculty.map(member => {
            const memberMessages = messages.filter(m => m.participants.includes(member.email));
            const latest = memberMessages[0]; 
            const unreadCount = memberMessages.filter(m => m.sender !== currentUser.email && !m.read).length;

            return {
              ...member,
              lastMsg: latest ? latest.text : 'No messages yet',
              time: latest?.createdAt?.toDate()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '',
              unread: unreadCount,
              timestamp: latest?.createdAt?.toMillis() || 0
            };
          });

          updatedList.sort((a, b) => b.timestamp - a.timestamp);
          setTeamList(updatedList);
          setLoading(false);
        });

        return unsubscribe;
      } catch (err) {
        console.error("Sync error:", err);
        setLoading(false);
      }
    };

    const unsub = syncTeams();
    return () => { if (unsub && typeof unsub === 'function') unsub(); };
  }, [currentUser]);

  const filtered = teamList.filter((m) =>
    m.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <FacultyLayout>
      <div className="container py-4" style={{ maxWidth: '800px' }}>
        <h2 className="fw-bold mb-4 text-white">Teams</h2>

        <div className="position-relative mb-4">
          <span className="material-symbols-rounded position-absolute top-50 translate-middle-y ms-3" 
                style={{ color: 'rgba(255,255,255,0.4)', fontSize: '20px' }}>search</span>
          <input 
            className="form-control border-0 ps-5 py-3 shadow-sm" 
            style={{ 
              background: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(10px)', 
              color: 'white',
              borderRadius: '15px'
            }}
            placeholder="Search by name..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        <div className="d-flex flex-column gap-2">
          {loading ? (
            <div className="text-center py-5 text-white opacity-50">Loading Team...</div>
          ) : filtered.map((member) => (
            <div
              key={member.email}
              className="d-flex align-items-center gap-3 p-3 cursor-pointer shadow-sm"
              style={{ 
                background: 'rgba(255,255,255,0.07)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                transition: '0.3s',
                overflow: 'hidden' // Added to wrap child constraints
              }}
              onClick={() => navigate(`/faculty-teams/chat/${member.email}`)}
            >
              <div className="rounded-circle bg-info d-flex align-items-center justify-content-center text-dark fw-bold" 
                   style={{ width: '48px', height: '48px', minWidth: '48px' }}>
                {member.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2)}
              </div>
              
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold mb-0 text-white" style={{ fontSize: '15px' }}>
                    {member.displayName}
                  </h6>
                  <small className="opacity-50 text-white ms-2" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                    {member.time}
                  </small>
                </div>
                <p className="mb-0 opacity-50 text-white" style={{ fontSize: '12px' }}>
                   {member.department}
                </p>
                {/* Manual Truncation Applied Here */}
                <p className="mb-0 text-white opacity-75 mt-1" style={{ fontSize: '13px' }}>
                  {truncateText(member.lastMsg, 60)}
                </p>
              </div>

              {member.unread > 0 && (
                <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold ms-2" 
                     style={{ background: '#3d7a77', color: 'white', fontSize: '10px', width: '22px', height: '22px', minWidth: '22px' }}>
                  {member.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </FacultyLayout>
  );
}