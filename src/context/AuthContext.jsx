import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => api.getStoredUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync if storage changes in other tabs
    const handleStorage = (e) => {
      if (e.key === 'tiem_gau_auth_user_v1') {
        setUser(api.getStoredUser());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = async (account, password) => {
    setLoading(true);
    try {
      const res = await api.loginUser(account, password);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.registerUser(userData);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider, extraData) => {
    setLoading(true);
    try {
      const res = await api.loginWithSocial(provider, extraData);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logoutUser();
    setUser(null);
  };

  const updateUser = (patch) => {
    if (!user) return;
    const updated = { ...user, ...patch };
    api.setStoredUser(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        socialLogin,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
