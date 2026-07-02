import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { state } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Show loading spinner while checking authentication
  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner" style={{
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if user is authenticated
  if (state.user) {
    return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user" 
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    );
  }

  // Show authentication forms if not authenticated
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container px-4">
        <div className="text-center mb-8">
          <h1>Multi-Role Dashboard</h1>
          <p className="mt-4">Secure role-based authentication system with MERN stack</p>
          <div className="mt-4 text-sm" style={{ color: '#64748b' }}>
            <p>✅ JWT-based Authentication</p>
            <p>✅ Role-based Access Control</p>
            <p>✅ RESTful API Integration</p>
            <p>✅ MongoDB Schema Design</p>
          </div>
        </div>
        
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-right" />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </AuthProvider>
    </Router>
  );
}

export default App;