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

  useEffect(() => {
    if (!currentUser?.email) return;

    // 1. First, get EVERYONE from the faculty collection
    const syncTeams = async () => {
      try {
        const facultySnap = await getDocs(collection(db, "faculty"));
        const allFaculty = [];
        
        facultySnap.forEach((doc) => {
          const data = doc.data();
          // FILTER: Don't show yourself in the list
          if (data.email !== currentUser.email) {
            allFaculty.push({
              email: data.email,
              displayName: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email.split('@')[0],
              department: data.department || 'Faculty',
              lastMsg: 'No messages yet',
              time: '',
              unread: 0,
              timestamp: 0 // for sorting
            });
          }
        });

        // 2. Now listen to chats to overlay the "latest message" and "unread" data
        const chatQuery = query(
          collection(db, "chats"),
          where("participants", "array-contains", currentUser.email),
          orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(chatQuery, (chatSnap) => {
          const messages = chatSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          
          // Map chat data to our faculty list
          const updatedList = allFaculty.map(member => {
            const memberMessages = messages.filter(m => m.participants.includes(member.email));
            const latest = memberMessages[0]; // Already sorted by desc
            const unreadCount = memberMessages.filter(m => m.sender !== currentUser.email && !m.read).length;

            return {
              ...member,
              lastMsg: latest ? latest.text : 'No messages yet',
              time: latest?.createdAt?.toDate()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '',
              unread: unreadCount,
              timestamp: latest?.createdAt?.toMillis() || 0
            };
          });

          // Sort so people you just talked to are at the top
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
                transition: '0.3s'
              }}
              onClick={() => navigate(`/faculty-teams/chat/${member.email}`)}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            >
              <img 
                src={`https://ui-avatars.com/api/?name=${member.displayName}&background=3d7a77&color=fff&size=48`} 
                className="rounded-circle shadow-sm" 
                width={48} height={48} alt={member.displayName} 
              />
              
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold mb-0 text-white" style={{ fontSize: '15px' }}>{member.displayName}</h6>
                  <small className="opacity-50 text-white" style={{ fontSize: '11px' }}>{member.time}</small>
                </div>
                <p className="mb-0 opacity-50 text-white" style={{ fontSize: '12px' }}>{member.department}</p>
                <p className="mb-0 text-white text-truncate opacity-75 mt-1" style={{ fontSize: '13px' }}>
                  {member.lastMsg}
                </p>
              </div>

              {member.unread > 0 && (
                <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" 
                     style={{ background: '#3d7a77', color: 'white', fontSize: '10px', width: '22px', height: '22px' }}>
                  {member.unread}
                </div>
              )}
            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-5 opacity-50 text-white">
              <span className="material-symbols-rounded display-4 mb-2">person_search</span>
              <p>No team members found.</p>
            </div>
          )}
        </div>
      </div>
    </FacultyLayout>
  );
}