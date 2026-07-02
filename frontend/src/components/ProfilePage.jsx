import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const profileSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  bio: yup
    .string()
    .max(500, 'Bio cannot exceed 500 characters'),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

const ProfilePage = () => {
  const { state } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: state.user?.name || '',
      bio: state.user?.bio || '',
    }
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onProfileSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.put('/api/users/profile', data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.put('/api/users/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success('Password changed successfully!');
      passwordForm.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container py-8">
        <div className="mb-8">
          <h1>Profile Settings</h1>
          <p className="mt-2" style={{ color: '#64748b' }}>
            Manage your account information and preferences
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex gap-2">
            {[
              { id: 'profile', label: 'Profile Information', icon: '👤' },
              { id: 'security', label: 'Security', icon: '🔒' },
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

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card max-w-2xl">
            <h3>Profile Information</h3>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="mt-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  {...profileForm.register('name')}
                  placeholder="Enter your full name"
                />
                {profileForm.formState.errors.name && (
                  <div className="form-error">{profileForm.formState.errors.name.message}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={state.user?.email || ''}
                  disabled
                  style={{ backgroundColor: '#f8fafc', color: '#64748b' }}
                />
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Email cannot be changed. Contact administrator if needed.
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-input"
                  {...profileForm.register('bio')}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
                {profileForm.formState.errors.bio && (
                  <div className="form-error">{profileForm.formState.errors.bio.message}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <div 
                  className="px-3 py-2 rounded"
                  style={{ 
                    backgroundColor: state.user?.role === 'admin' ? '#fee2e2' : '#dbeafe',
                    color: state.user?.role === 'admin' ? '#dc2626' : '#1d4ed8',
                    display: 'inline-block',
                    fontWeight: '500'
                  }}
                >
                  {state.user?.role?.toUpperCase()}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Role is managed by administrators
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="card max-w-2xl">
            <h3>Change Password</h3>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="mt-4">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  {...passwordForm.register('currentPassword')}
                  placeholder="Enter your current password"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <div className="form-error">{passwordForm.formState.errors.currentPassword.message}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  {...passwordForm.register('newPassword')}
                  placeholder="Enter your new password"
                />
                {passwordForm.formState.errors.newPassword && (
                  <div className="form-error">{passwordForm.formState.errors.newPassword.message}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  {...passwordForm.register('confirmPassword')}
                  placeholder="Confirm your new password"
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <div className="form-error">{passwordForm.formState.errors.confirmPassword.message}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>

            <div className="mt-8 p-4" style={{ backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
              <h4 style={{ color: '#1d4ed8', marginBottom: '0.5rem' }}>Password Requirements</h4>
              <ul style={{ fontSize: '0.875rem', color: '#64748b', marginLeft: '1rem' }}>
                <li>At least 6 characters long</li>
                <li>Contains at least one lowercase letter</li>
                <li>Contains at least one uppercase letter</li>
                <li>Contains at least one number</li>
              </ul>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="card max-w-2xl">
            <h3>Account Preferences</h3>
            <div className="mt-4">
              <div className="form-group">
                <label className="form-label">Theme</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="theme" 
                      value="light" 
                      defaultChecked={state.user?.preferences?.theme !== 'dark'}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Light Theme
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="theme" 
                      value="dark"
                      defaultChecked={state.user?.preferences?.theme === 'dark'}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Dark Theme
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notifications</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      defaultChecked={state.user?.preferences?.notifications !== false}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Email notifications
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      defaultChecked={true}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Activity alerts
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      defaultChecked={true}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Security notifications
                  </label>
                </div>
              </div>

              <button className="btn btn-primary">
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;