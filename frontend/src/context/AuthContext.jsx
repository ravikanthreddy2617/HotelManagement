import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('vc_token');
      const storedUser = localStorage.getItem('vc_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse stored user', e);
      localStorage.removeItem('vc_token');
      localStorage.removeItem('vc_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.success && res.data) {
      const authData = res.data;
      const userInfo = {
        id: authData.id,
        name: authData.name,
        email: authData.email,
        phone: authData.phone,
        role: authData.role,
      };
      setToken(authData.token);
      setUser(userInfo);
      localStorage.setItem('vc_token', authData.token);
      localStorage.setItem('vc_user', JSON.stringify(userInfo));
      return userInfo;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success && res.data) {
      const authData = res.data;
      const userInfo = {
        id: authData.id,
        name: authData.name,
        email: authData.email,
        phone: authData.phone,
        role: authData.role,
      };
      setToken(authData.token);
      setUser(userInfo);
      localStorage.setItem('vc_token', authData.token);
      localStorage.setItem('vc_user', JSON.stringify(userInfo));
      return userInfo;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vc_token');
    localStorage.removeItem('vc_user');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
