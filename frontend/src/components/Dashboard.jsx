import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

const Dashboard = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  const handleRoleNavigation = () => {
    if (state.user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/user');
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container py-8">
        <div className="text-center mb-8">
          <h1>Welcome to Multi-Role Dashboard</h1>
          <p className="mt-4" style={{ color: '#64748b' }}>
            Secure role-based authentication system built with MERN stack
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2>Hello, {state.user?.name}! 👋</h2>
            <div className="mt-4">
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: state.user?.role === 'admin' ? '#fee2e2' : '#dbeafe',
                  color: state.user?.role === 'admin' ? '#dc2626' : '#1d4ed8'
                }}
              >
                {state.user?.role?.toUpperCase()} USER
              </span>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="card" style={{ backgroundColor: '#f8fafc', margin: 0 }}>
              <h3>Your Profile</h3>
              <div className="mt-3 text-sm" style={{ color: '#64748b' }}>
                <p><strong>Name:</strong> {state.user?.name}</p>
                <p><strong>Email:</strong> {state.user?.email}</p>
                <p><strong>Status:</strong> {state.user?.status}</p>
                <p><strong>Role:</strong> {state.user?.role}</p>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="btn btn-secondary mt-4"
                style={{ width: '100%' }}
              >
                Edit Profile
              </button>
            </div>

            <div className="card" style={{ backgroundColor: '#f0f9ff', margin: 0 }}>
              <h3>Role-Based Features</h3>
              <div className="mt-3">
                {state.user?.role === 'admin' ? (
                  <div>
                    <p className="text-sm mb-3" style={{ color: '#64748b' }}>
                      As an admin, you have access to:
                    </p>
                    <ul className="text-sm" style={{ color: '#64748b', marginLeft: '1rem' }}>
                      <li>• User Management</li>
                      <li>• System Statistics</li>
                      <li>• Activity Monitoring</li>
                      <li>• Role Management</li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm mb-3" style={{ color: '#64748b' }}>
                      As a user, you can:
                    </p>
                    <ul className="text-sm" style={{ color: '#64748b', marginLeft: '1rem' }}>
                      <li>• View Your Profile</li>
                      <li>• Update Information</li>
                      <li>• View Activity History</li>
                      <li>• Manage Preferences</li>
                    </ul>
                  </div>
                )}
              </div>
              <button 
                onClick={handleRoleNavigation}
                className="btn btn-primary mt-4"
                style={{ width: '100%' }}
              >
                Go to {state.user?.role === 'admin' ? 'Admin' : 'User'} Dashboard
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <h3>System Features</h3>
            <div className="grid mt-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="text-center p-4" style={{ backgroundColor: '#f0fdf4', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔐</div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>JWT Authentication</h4>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Secure token-based auth</p>
              </div>
              <div className="text-center p-4" style={{ backgroundColor: '#fef7ff', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Role-Based Access</h4>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Admin & User roles</p>
              </div>
              <div className="text-center p-4" style={{ backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>RESTful APIs</h4>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Complete CRUD operations</p>
              </div>
              <div className="text-center p-4" style={{ backgroundColor: '#fffbeb', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗄️</div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>MongoDB</h4>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Optimized schema design</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;