import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import FacultyLogin from './pages/FacultyLogin';
import StudentHome from './pages/StudentHome';
/* Adding the new report page */
import StudentReport from './pages/StudentReport';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page (The 'Slick' UI) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Student Flow */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-home" element={<StudentHome />} />
        {/* Linking the new report page to the URL your buttons use */}
        <Route path="/student/report" element={<StudentReport />} />

        {/* Faculty Flow */}
        <Route path="/faculty-login" element={<FacultyLogin />} />
      </Routes>
    </Router>
  );
}

export default App;