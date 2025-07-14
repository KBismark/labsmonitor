import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { TestPanelDataProvider } from './contexts/StoryBlokContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } />
            <Route path="/signin" element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            <Route path="/reset-password" element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } />
            <Route path="/verify-email" element={
              <PublicRoute>
                <EmailVerification />
              </PublicRoute>
            } />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <TestPanelDataProvider>
                    <Dashboard />
                  </TestPanelDataProvider>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;