import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import FacultyLogin from './pages/FacultyLogin';
import StudentHome from './pages/StudentHome';
import StudentReport from './pages/StudentReport';
import StudentAlerts from './pages/StudentAlerts';

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

        {/* Faculty Flow */}
        <Route path="/faculty-login" element={<FacultyLogin />} />
      </Routes>
    </Router>
  );
}

export default App;