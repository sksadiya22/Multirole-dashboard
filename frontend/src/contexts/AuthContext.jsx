import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const initialState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptor for token
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      try {
        localStorage.setItem('token', state.token);
      } catch (error) {
        console.warn('Failed to save token to localStorage:', error);
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      try {
        localStorage.removeItem('token');
      } catch (error) {
        console.warn('Failed to remove token from localStorage:', error);
      }
    }
  }, [state.token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      let token = null;
      try {
        token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      } catch (error) {
        console.warn('Failed to read token from localStorage:', error);
      }
      
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await axios.get('/api/auth/me');
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: response.data.user, token },
          });
        } catch (error) {
          dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
          try {
            localStorage.removeItem('token');
          } catch (storageError) {
            console.warn('Failed to remove token from localStorage:', storageError);
          }
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await axios.post('/api/auth/login', { email, password });
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw new Error(message);
    }
  };

  const register = async (name, email, password) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await axios.post('/api/auth/register', { name, email, password });
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};