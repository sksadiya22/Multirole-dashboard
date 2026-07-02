import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { state } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch system stats
      const statsResponse = await axios.get('/api/admin/stats');
      setStats(statsResponse.data.stats);
      
      // Fetch recent users
      const usersResponse = await axios.get('/api/admin/users?limit=5');
      setUsers(usersResponse.data.users);
      
      // Fetch recent activities
      const activitiesResponse = await axios.get('/api/admin/activities?limit=10');
      setActivities(activitiesResponse.data.activities);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axios.put(`/api/admin/users/${userId}`, { status: newStatus });
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await axios.put(`/api/admin/users/${userId}`, { role: newRole });
      toast.success(`User role changed to ${newRole} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update user role');
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
            <p>Loading admin dashboard...</p>
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
          <h1>Admin Dashboard</h1>
          <p className="mt-2" style={{ color: '#64748b' }}>
            Manage users, monitor system activity, and view analytics
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'users', label: 'User Management', icon: '👥' },
              { id: 'activities', label: 'System Activities', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
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
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div className="card" style={{ backgroundColor: '#dbeafe', margin: 0 }}>
                <h3 style={{ color: '#1d4ed8' }}>Total Users</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1d4ed8' }}>
                  {stats?.totalUsers || 0}
                </div>
              </div>
              <div className="card" style={{ backgroundColor: '#dcfce7', margin: 0 }}>
                <h3 style={{ color: '#16a34a' }}>Active Users</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                  {stats?.activeUsers || 0}
                </div>
              </div>
              <div className="card" style={{ backgroundColor: '#fef3c7', margin: 0 }}>
                <h3 style={{ color: '#d97706' }}>Admin Users</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706' }}>
                  {stats?.adminUsers || 0}
                </div>
              </div>
              <div className="card" style={{ backgroundColor: '#fee2e2', margin: 0 }}>
                <h3 style={{ color: '#dc2626' }}>Inactive Users</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>
                  {stats?.inactiveUsers || 0}
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Recent System Activities</h3>
              <div className="mt-4">
                {activities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{activity.description}</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        {activity.userId?.name} • {new Date(activity.timestamp).toLocaleString()}
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
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <h3>User Management</h3>
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Role</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.75rem' }}>{user.name}</td>
                        <td style={{ padding: '0.75rem' }}>{user.email}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span 
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: user.role === 'admin' ? '#fee2e2' : '#dbeafe',
                              color: user.role === 'admin' ? '#dc2626' : '#1d4ed8'
                            }}
                          >
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span 
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: user.status === 'active' ? '#dcfce7' : '#fee2e2',
                              color: user.status === 'active' ? '#16a34a' : '#dc2626'
                            }}
                          >
                            {user.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRoleToggle(user._id, user.role)}
                              className="btn btn-secondary"
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                              disabled={user._id === state.user?.id}
                            >
                              Toggle Role
                            </button>
                            <button
                              onClick={() => handleUserStatusToggle(user._id, user.status)}
                              className="btn btn-secondary"
                              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                              disabled={user._id === state.user?.id}
                            >
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="card">
            <h3>System Activities</h3>
            <div className="mt-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex justify-between items-start py-3 border-b" style={{ borderColor: '#e2e8f0' }}>
                  <div className="flex-1">
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {activity.description}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      User: {activity.userId?.name} ({activity.userId?.email})
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;