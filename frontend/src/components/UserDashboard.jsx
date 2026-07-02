import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { state } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user activities
      const activitiesResponse = await axios.get('/api/users/activities?limit=10');
      setActivities(activitiesResponse.data.activities);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container py-8">
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
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container py-8">
        <div className="mb-8">
          <h1>My Dashboard</h1>
          <p className="mt-2" style={{ color: '#64748b' }}>
            Welcome back, {state.user?.name}! Here's your personal space.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'activities', label: 'My Activities', icon: '📋' },
              { id: 'preferences', label: 'Preferences', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium`}
                style={{
                  backgroundColor: activeTab === tab.id ? '#3b82f6' : '#f1f5f9',
                  color: activeTab === tab.id ? 'white' : '#374151',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div className="card" style={{ backgroundColor: '#f0f9ff', margin: 0 }}>
                <h3 style={{ color: '#1d4ed8' }}>Profile Information</h3>
                <div className="mt-4 space-y-2">
                  <div>
                    <strong>Name:</strong> {state.user?.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {state.user?.email}
                  </div>
                  <div>
                    <strong>Role:</strong> 
                    <span 
                      className="ml-2 px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: '#dbeafe',
                        color: '#1d4ed8'
                      }}
                    >
                      {state.user?.role?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <strong>Status:</strong> 
                    <span 
                      className="ml-2 px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: '#dcfce7',
                        color: '#16a34a'
                      }}
                    >
                      {state.user?.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card" style={{ backgroundColor: '#f0fdf4', margin: 0 }}>
                <h3 style={{ color: '#16a34a' }}>Quick Stats</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span>Total Activities:</span>
                    <span style={{ fontWeight: 'bold' }}>{activities.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Created:</span>
                    <span style={{ fontWeight: 'bold' }}>
                      {state.user?.createdAt ? new Date(state.user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Login:</span>
                    <span style={{ fontWeight: 'bold' }}>
                      {state.user?.lastLogin ? new Date(state.user.lastLogin).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Recent Activities</h3>
              <div className="mt-4">
                {activities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{activity.description}</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <span 
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: '#f0f9ff',
                        color: '#0369a1'
                      }}
                    >
                      {activity.action}
                    </span>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="text-center py-8" style={{ color: '#64748b' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                    <p>No activities yet. Start exploring the dashboard!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="card">
            <h3>My Activity History</h3>
            <div className="mt-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex justify-between items-start py-3 border-b" style={{ borderColor: '#e2e8f0' }}>
                  <div className="flex-1">
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {activity.description}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                    {activity.ipAddress && (
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        IP: {activity.ipAddress}
                      </div>
                    )}
                  </div>
                  <span 
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: '#f0f9ff',
                      color: '#0369a1'
                    }}
                  >
                    {activity.action}
                  </span>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="text-center py-8" style={{ color: '#64748b' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                  <p>No activities recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="card">
            <h3>Account Preferences</h3>
            <div className="mt-4">
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <div className="card" style={{ backgroundColor: '#f8fafc', margin: 0 }}>
                  <h4>Theme Settings</h4>
                  <div className="mt-3">
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                      Current theme: {state.user?.preferences?.theme || 'light'}
                    </p>
                    <div className="flex gap-2">
                      <button className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                        Light Theme
                      </button>
                      <button className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                        Dark Theme
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ backgroundColor: '#f8fafc', margin: 0 }}>
                  <h4>Notification Settings</h4>
                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '0.875rem' }}>Email Notifications</span>
                      <input 
                        type="checkbox" 
                        defaultChecked={state.user?.preferences?.notifications !== false}
                        style={{ marginLeft: '1rem' }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span style={{ fontSize: '0.875rem' }}>Activity Alerts</span>
                      <input 
                        type="checkbox" 
                        defaultChecked={true}
                        style={{ marginLeft: '1rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4>Account Actions</h4>
                <div className="flex gap-4 mt-3">
                  <button 
                    onClick={() => window.location.href = '/profile'}
                    className="btn btn-primary"
                  >
                    Edit Profile
                  </button>
                  <button className="btn btn-secondary">
                    Change Password
                  </button>
                  <button className="btn btn-secondary">
                    Download Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;