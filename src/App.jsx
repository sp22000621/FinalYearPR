import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

// Page Imports
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import FacultyLogin from './pages/FacultyLogin';
import StudentHome from './pages/StudentHome';
import StudentReport from './pages/StudentReport';
import StudentAlerts from './pages/StudentAlerts';
import StudentCommunities from './pages/StudentCommunities';
import CommunityChat from './pages/CommunityChat';
import StudentProfile from './pages/StudentProfile';
import SeniorFacultyHome from './pages/SeniorFacultyHome';
import FacultyScan from './pages/FacultyScan'; 
import FacultyChat from './pages/FacultyChat';      
import FacultyTeams from './pages/FacultyTeams';
import FacultyPerformance from './pages/FacultyPerformance';
import FacultyAlerts from './pages/FacultyAlerts';
import FacultyProfile from './pages/FacultyProfile';
import FacultyHome from './pages/FacultyHome';
import SCRHome from './pages/SCRHome';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          // 1. Check students collection first
          const studentDoc = await getDoc(doc(db, "students", firebaseUser.uid));
          
          if (studentDoc.exists()) {
            const studentData = studentDoc.data();
            // Map isSRC field to internal role state
            setRole(studentData.isSRC ? "SRC" : "Student");
          } else {
            // 2. Check faculty collection if not in students
            const facultyDoc = await getDoc(doc(db, "faculty", firebaseUser.uid));
            
            if (facultyDoc.exists()) {
              const facultyData = facultyDoc.data();
              // Map 'rank' field from Firestore (image_c56a66.jpg) to internal roles
              if (facultyData.rank === "Senior Maintance Director") {
                setRole("Senior Faculty");
              } else {
                setRole("Junior Faculty");
              }
            }
          }
          setUser(firebaseUser);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="loading-screen" style={{color: 'white', background: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      Authenticating BIUST Reporting Portal...
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/student-login" element={!user ? <StudentLogin /> : <Navigate to="/dashboard-redirector" />} />
        <Route path="/faculty-login" element={!user ? <FacultyLogin /> : <Navigate to="/dashboard-redirector" />} />

        {/* Redirector:uses mapped roles from rank/isSRC */}
        <Route path="/dashboard-redirector" element={
          !user ? <Navigate to="/" /> :
          role === "Senior Faculty" ? <Navigate to="/faculty-home" /> : 
          role === "Junior Faculty" ? <Navigate to="/operator-home" /> : 
          role === "SRC" ? <Navigate to="/scr-home" /> : 
          role === "Student" ? <Navigate to="/student-home" /> :
          <div className="text-white p-5 bg-dark vh-100">Account verified, but profile mapping failed. Contact Admin.</div>
        } />

        {/* Student Flow */}
        <Route path="/student-home" element={user && role === "Student" ? <StudentHome /> : <Navigate to="/student-login" />} />
        <Route path="/student-report" element={user ? <StudentReport /> : <Navigate to="/student-login" />} />
        <Route path="/student-alerts" element={user ? <StudentAlerts /> : <Navigate to="/student-login" />} />
        <Route path="/student-communities" element={user ? <StudentCommunities /> : <Navigate to="/student-login" />} />
        <Route path="/student-communities/:id" element={user ? <CommunityChat /> : <Navigate to="/student-login" />} />
        <Route path="/student-profile" element={user ? <StudentProfile /> : <Navigate to="/student-login" />} />

        {/* Faculty Flow */}
        <Route path="/operator-home" element={role === "Junior Faculty" ? <FacultyHome /> : <Navigate to="/faculty-login" />} />
        <Route path="/faculty-home" element={role === "Senior Faculty" ? <SeniorFacultyHome /> : <Navigate to="/faculty-login" />} />
        <Route path="/faculty-scan" element={user ? <FacultyScan /> : <Navigate to="/faculty-login" />} />
        <Route path="/faculty-teams" element={user ? <FacultyTeams /> : <Navigate to="/faculty-login" />} />
        <Route path="/faculty-teams/chat/:memberId" element={user ? <FacultyChat /> : <Navigate to="/faculty-login" />} />
        <Route path="/faculty-performance" element={user ? <FacultyPerformance /> : <Navigate to="/faculty-login" />} />
        <Route path="/faculty-alerts" element={user ? <FacultyAlerts /> : <Navigate to="/faculty-login" />} />
        <Route path="/faculty-profile" element={user ? <FacultyProfile /> : <Navigate to="/faculty-login" />} />

        {/* SRC Flow */}
        <Route path="/scr-home" element={role === "SRC" ? <SCRHome /> : <Navigate to="/student-login" />} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;