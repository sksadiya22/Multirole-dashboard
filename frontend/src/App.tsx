import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';

const AppContent: React.FC = () => {
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
    return <Dashboard />;
  }

  // Show authentication forms if not authenticated
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container px-4">
        <div className="text-center mb-8">
          <h1>Multi-Role Dashboard</h1>
          <p className="mt-4">A full-stack MERN application with role-based access control</p>
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