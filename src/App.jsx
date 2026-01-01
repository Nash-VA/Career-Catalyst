import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResumeUpload from './pages/ResumeUpload';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CareerRecommendation from './pages/CareerRecommendation';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import LearningRoadmap from './pages/LearningRoadmap';
import CourseRecommendation from './pages/CourseRecommendation';
import InterviewPrep from './pages/InterviewPrep';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/resume-upload" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/career" element={<ProtectedRoute><CareerRecommendation /></ProtectedRoute>} />
            <Route path="/skills" element={<ProtectedRoute><SkillGapAnalysis /></ProtectedRoute>} />
            <Route path="/roadmap" element={<ProtectedRoute><LearningRoadmap /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><CourseRecommendation /></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
