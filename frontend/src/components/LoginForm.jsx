import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginForm = ({ onSwitchToRegister }) => {
  const { login, state } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Login successful! Welcome back!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-center mb-4">Login to Dashboard</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="Enter your password"
              autoComplete="current-password"
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

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={state.loading}
        >
          {state.loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-4">
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: '500'
            }}
          >
            Create Account
          </button>
        </p>
      </div>

      <div className="mt-6 text-center text-sm" style={{ color: '#64748b' }}>
        <p><strong>Demo Credentials:</strong></p>
        <p>Admin: admin@demo.com / password123</p>
        <p>User: user@demo.com / password123</p>
      </div>
    </div>
  );
};

export default LoginForm;