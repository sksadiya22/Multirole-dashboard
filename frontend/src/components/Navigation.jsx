import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navigation = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  if (state.user?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin Panel', icon: '⚙️' });
  } else {
    navItems.push({ path: '/user', label: 'My Space', icon: '📊' });
  }

  return (
    <nav className="nav">
      <div className="container nav-container">
        <div className="flex items-center gap-4">
          <h1 className="nav-brand">Multi-Role Dashboard</h1>
          <div className="flex gap-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  backgroundColor: location.pathname === item.path ? '#3b82f6' : 'transparent',
                  color: location.pathname === item.path ? 'white' : '#64748b',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              {state.user?.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {state.user?.email}
            </div>
          </div>
          <div
            className="px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: state.user?.role === 'admin' ? '#fee2e2' : '#dbeafe',
              color: state.user?.role === 'admin' ? '#dc2626' : '#1d4ed8'
            }}
          >
            {state.user?.role?.toUpperCase()}
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;