import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResumeUpload from './pages/ResumeUpload';
import ResumeBuilder from './pages/ResumeBuilder';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CareerRecommendation from './pages/CareerRecommendation';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import LearningRoadmap from './pages/LearningRoadmap';
import CourseRecommendation from './pages/CourseRecommendation';
import InterviewPrep from './pages/InterviewPrep';
import AdminPanel from './pages/AdminPanel'; // Make sure you created this file

// --- PROTECTED ROUTE COMPONENT ---
// This checks if the user is logged in before showing the page
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// --- ADMIN ROUTE COMPONENT ---
// This checks if the user is an Admin
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Check the flag we set in Login.jsx
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/dashboard" replace />; // Redirect non-admins to dashboard
  }
  return children;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <UserProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected User Routes */}
            <Route path="/resume-upload" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
            <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/career" element={<ProtectedRoute><CareerRecommendation /></ProtectedRoute>} />
            <Route path="/skills" element={<ProtectedRoute><SkillGapAnalysis /></ProtectedRoute>} />
            <Route path="/roadmap" element={<ProtectedRoute><LearningRoadmap /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><CourseRecommendation /></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />

            {/* Admin Route */}
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;