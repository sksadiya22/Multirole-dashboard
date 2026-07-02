import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const RegisterForm = ({ onSwitchToLogin }) => {
  const { register: registerUser, state } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Registration successful! Welcome to the dashboard!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-center mb-4">Create Account</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            {...register('name')}
            placeholder="Enter your full name"
            autoComplete="name"
          />
          {errors.name && (
            <div className="form-error">{errors.name.message}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            {...register('email')}
            placeholder="Enter your email"
            autoComplete="email"
          />
          {errors.email && (
            <div className="form-error">{errors.email.message}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              {...register('password')}
              placeholder="Create a strong password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                fontSize: '14px'
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <div className="form-error">{errors.password.message}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="form-input"
              {...register('confirmPassword')}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                fontSize: '14px'
              }}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="form-error">{errors.confirmPassword.message}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={state.loading}
        >
          {state.loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center mt-4">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: '500'
            }}
          >
            Sign In
          </button>
        </p>
      </div>

      <div className="mt-6 text-center text-sm" style={{ color: '#64748b' }}>
        <p>By creating an account, you'll get access to role-based features and personalized dashboard.</p>
      </div>
    </div>
  );
};

export default RegisterForm;