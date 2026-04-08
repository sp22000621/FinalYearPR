import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import FacultyLayout from './components/FacultyLayout';
import FacultyChat from './pages/FacultyChat';     
import FacultyTeams from './pages/FacultyTeams';
import FacultyPerformance from './pages/FacultyPerformance';
import FacultyAlerts from './pages/FacultyAlerts';
import FacultyProfile from './pages/FacultyProfile';
import FacultyHome from './pages/FacultyHome';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Student Flow */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-home" element={<StudentHome />} />
        <Route path="/student/report" element={<StudentReport />} />
        <Route path="/student-alerts" element={<StudentAlerts />} />
        <Route path="/student-communities" element={<StudentCommunities />} />
        <Route path="/student-communities/:id" element={<CommunityChat />} />
        <Route path="/student-profile" element={<StudentProfile />} />

        {/* Faculty Flow */}
        <Route path="/operator-home" element={<FacultyHome />} />
        <Route path="/faculty-login" element={<FacultyLogin />} />
        <Route path="/faculty-home" element={<SeniorFacultyHome />} />
        <Route path="/faculty-scan" element={<FacultyScan />} />
        <Route path="/faculty-teams/chat/:memberId" element={<FacultyChat />} />
        <Route path="/faculty-teams" element={<FacultyTeams />} />
        <Route path="/faculty-performance" element={<FacultyPerformance />} />
        <Route path="/faculty-alerts" element={<FacultyAlerts />} />
        <Route path="/faculty-profile" element={<FacultyProfile />} />
      </Routes>
    </Router>
  );
}

export default App;