import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import FacultyLogin from './pages/FacultyLogin';
import StudentHome from './pages/StudentHome';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page (The 'Slick' UI) */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Student Flow */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-home" element={<StudentHome />} />

        {/* Faculty Flow (Restoring the stray) */}
        <Route path="/faculty-login" element={<FacultyLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
