import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Courses from './pages/Courses/Courses';
import Tools from './pages/Tools/Tools';
import DiagnosisView from './pages/Diagnosis/DiagnosisView';
import LessonView from './pages/LessonView/LessonView';
import Admin from './pages/Admin/Admin';
import './index.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router basename={import.meta.env.MODE === 'production' && !window.location.hostname.includes('vercel.app') ? '/tiagosilva/' : '/'}>
      <ScrollToTop />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/diagnosis" element={<DiagnosisView />} />
          <Route path="/lesson/:lessonId" element={<LessonView />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
