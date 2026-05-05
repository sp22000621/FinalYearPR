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
          // 1. Check students collection
          const studentDoc = await getDoc(doc(db, "students", firebaseUser.uid));
          
          if (studentDoc.exists()) {
            const studentData = studentDoc.data();
            setRole(studentData.isSRC ? "SRC" : "Student");
          } else {
            // 2. Check faculty collection
            const facultyDoc = await getDoc(doc(db, "faculty", firebaseUser.uid));
            
            if (facultyDoc.exists()) {
              const facultyData = facultyDoc.data();
              const rank = (facultyData.rank || "").toLowerCase();
              
              // Case-insensitive keyword check for "senior"
              if (rank.includes("senior")) {
                setRole("Senior Faculty");
              } else {
                setRole("Junior Faculty");
              }
            }
          }
          setUser(firebaseUser);
        } catch (error) {
          console.error("Auth routing error:", error);
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
    <div style={{background: '#000', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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

        {/* Redirector logic using updated URL for Seniors */}
        <Route path="/dashboard-redirector" element={
          !user ? <Navigate to="/" /> :
          role === "Senior Faculty" ? <Navigate to="/senior-faculty-home" /> : 
          role === "Junior Faculty" ? <Navigate to="/operator-home" /> : 
          role === "SRC" ? <Navigate to="/scr-home" /> : 
          <Navigate to="/student-home" />
        } />

        {/* Senior Faculty Flow */}
        <Route path="/senior-faculty-home" element={user && role === "Senior Faculty" ? <SeniorFacultyHome /> : <Navigate to="/faculty-login" />} />
        
        {/* Junior Faculty (Operator) Flow */}
        <Route path="/operator-home" element={user && role === "Junior Faculty" ? <FacultyHome /> : <Navigate to="/faculty-login" />} />

        {/* Shared Faculty Sub-pages */}
        <Route path="/faculty-scan" element={user ? <FacultyScan /> : <Navigate to="/faculty-login" />} />
        <Route path="/faculty-teams" element={user ? <FacultyTeams /> : <Navigate to="/faculty-login" />} />
        <Route path="/faculty-teams/chat/:memberId" element={user ? <FacultyChat /> : <Navigate to="/faculty-login" />} />
        <Route path="/faculty-performance" element={user ? <FacultyPerformance /> : <Navigate to="/faculty-login" />} />
        <Route path="/faculty-alerts" element={user ? <FacultyAlerts /> : <Navigate to="/faculty-login" />} />
        <Route path="/faculty-profile" element={user ? <FacultyProfile /> : <Navigate to="/faculty-login" />} />

        {/* Student/SRC Flow */}
        <Route path="/student-home" element={user && role === "Student" ? <StudentHome /> : <Navigate to="/student-login" />} />
        <Route path="/scr-home" element={role === "SRC" ? <SCRHome /> : <Navigate to="/student-login" />} />
        <Route path="/student-report" element={user ? <StudentReport /> : <Navigate to="/student-login" />} />
        <Route path="/student-alerts" element={user ? <StudentAlerts /> : <Navigate to="/student-login" />} />
        <Route path="/student-communities" element={user ? <StudentCommunities /> : <Navigate to="/student-login" />} />
        <Route path="/student-communities/:id" element={user ? <CommunityChat /> : <Navigate to="/student-login" />} />
        <Route path="/student-profile" element={user ? <StudentProfile /> : <Navigate to="/student-login" />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;