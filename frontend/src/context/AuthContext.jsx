import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agriqura_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('agriqura_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('agriqura_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      // Only logout if the server explicitly rejected the token (401/403)
      // For network errors or 500s, keep the cached user so the page doesn't flash blank
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        logout();
      }
      // For other errors (network, 500, etc.), silently keep cached user
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('agriqura_token', res.data.token);
      localStorage.setItem('agriqura_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    return res.data;
  };

  const verifyOTP = async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    if (res.data.token) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('agriqura_token', res.data.token);
      localStorage.setItem('agriqura_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const resendOTP = async (email) => {
    const res = await api.post('/auth/resend-otp', { email });
    return res.data;
  };

  const googleLogin = async (idToken) => {
    const res = await api.post('/auth/google', { idToken, token: idToken }, {
      withCredentials: true // Crucial if using sessions or cookies
    });
    if (res.data.token) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('agriqura_token', res.data.token);
      localStorage.setItem('agriqura_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const updateUserProfile = async (profileData) => {
    const res = await api.put('/users/profile', profileData);
    if (res.data.success && res.data.user) {
      const updatedUser = { ...user, ...res.data.user };
      setUser(updatedUser);
      localStorage.setItem('agriqura_user', JSON.stringify(updatedUser));
    }
    return res.data;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('agriqura_token');
    localStorage.removeItem('agriqura_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        verifyOTP,
        resendOTP,
        googleLogin,
        updateUserProfile,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
