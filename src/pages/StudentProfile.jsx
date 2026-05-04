import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import StudentLayout from '../components/StudentLayout';

export default function StudentProfile() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "students", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut(); 
      navigate('/'); 
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // UI-Avatars for the profile picture
  const avatarUrl = `https://ui-avatars.com/api/?name=${userData?.firstName || 'P'}+${userData?.lastName || 'S'}&background=3d7a77&color=fff&size=128`;

  return (
    <StudentLayout>
      <div className="container-fluid px-4 py-3">
        <div className="w-100 mx-auto" style={{ maxWidth: '600px' }}>
          
          {/* Profile Header */}
          <div className="d-flex flex-column align-items-center mb-4 pt-2 text-center">
            <div className="mb-3">
              <img
                src={avatarUrl}
                className="rounded-circle border border-3 border-white shadow-lg"
                width={100}
                alt="profile"
              />
            </div>
            <h4 className="text-white fw-bold mb-1">
              {loading ? "Loading..." : `${userData?.firstName} ${userData?.lastName}`}
            </h4>
            <p className="small text-white mb-0 opacity-75">{userData?.email}</p>
            {/* Adjusted to use the room_number field from  Firestore */}
            <p className="small text-white-50 mt-1">
               <span className="material-symbols-rounded fs-6 align-middle me-1">location_on</span>
               {userData?.room_number || 'Location Not Set'}
            </p>
          </div>

          <div className="d-flex flex-column gap-3">
            
            <section>
              <p className="text-white-50 fw-bold text-uppercase mb-2 px-2" style={{ fontSize: '11px', letterSpacing: '1.5px' }}>
                Account Information
              </p>
              <div className="d-flex flex-column gap-2">
                {/* Fixed the key to student_id to match  screenshot */}
                <SettingRow icon="badge" label="Student ID" value={userData?.student_id || 'N/A'} />
                <SettingRow icon="account_balance" label="Department" value={userData?.department || 'N/A'} />
                <SettingRow icon="person" label="Role" value={userData?.rank || 'Member'} />
              </div>
            </section>

            <section>
              <p className="text-white-50 fw-bold text-uppercase mb-2 px-2" style={{ fontSize: '11px', letterSpacing: '1.5px' }}>
                App Preferences
              </p>
              <div className="d-flex flex-column gap-2">
                <SettingRow 
                  icon="notifications" 
                  label="Push Notifications" 
                  toggle 
                  checked={notifications} 
                  onChange={() => setNotifications(!notifications)} 
                />
                <SettingRow 
                  icon="dark_mode" 
                  label="Dark Mode" 
                  toggle 
                  checked={darkMode} 
                  onChange={() => setDarkMode(!darkMode)} 
                />
              </div>
            </section>

            <section className="mt-4 pb-5">
              <button 
                onClick={handleLogout}
                className="btn w-100 py-3 rounded-4 fw-bold border-0 shadow-lg" 
                style={{ 
                  background: 'linear-gradient(45deg, #dc2626, #991b1b)', 
                  color: 'white',
                  fontSize: '15px',
                  letterSpacing: '2px'
                }}
              >
                LOGOUT
              </button>
            </section>

          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

function SettingRow({ icon, label, toggle, checked, onChange, value }) {
  return (
    <div 
      className="rounded-4 px-3 py-3 d-flex align-items-center justify-content-between" 
      style={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        backdropFilter: 'blur(10px)', 
        border: '1px solid rgba(255, 255, 255, 0.1)' 
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '35px', height: '35px', background: 'rgba(61, 122, 119, 0.2)' }}>
            <span className="material-symbols-rounded fs-5" style={{ color: '#4ade80' }}>{icon}</span>
        </div>
        <div>
          <span className="fw-bold text-white d-block" style={{ fontSize: '14px' }}>{label}</span>
        </div>
      </div>
      
      {toggle ? (
        <div
          onClick={onChange}
          className="position-relative"
          style={{ 
            width: '44px', 
            height: '24px', 
            background: checked ? '#3d7a77' : 'rgba(255,255,255,0.2)', 
            borderRadius: '12px', 
            cursor: 'pointer',
            transition: '0.3s'
          }}
        >
          <div 
            className="position-absolute bg-white rounded-circle shadow-sm" 
            style={{ 
              width: '18px', 
              height: '18px', 
              top: '3px', 
              left: checked ? '23px' : '3px',
              transition: '0.3s' 
            }} 
          />
        </div>
      ) : (
        <span className="text-white-50 fw-semibold" style={{ fontSize: '13px' }}>{value}</span>
      )}
    </div>
  );
}