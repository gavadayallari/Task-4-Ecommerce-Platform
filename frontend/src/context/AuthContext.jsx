import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('shopnova_user') || localStorage.getItem('novacart_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('shopnova_token') || localStorage.getItem('novacart_token') || null;
  });

  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const refreshUser = async () => {
    const currentToken = localStorage.getItem('shopnova_token') || localStorage.getItem('novacart_token');
    if (currentToken) {
      try {
        const res = await authAPI.getMe();
        setUser(res.data.user);
        localStorage.setItem('shopnova_user', JSON.stringify(res.data.user));
        return res.data.user;
      } catch (err) {
        console.error('[Auth Error]: Failed to refresh user profile', err);
      }
    }
    return null;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('shopnova_token') || localStorage.getItem('novacart_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data.user);
          localStorage.setItem('shopnova_user', JSON.stringify(res.data.user));
        } catch (error) {
          console.error('[Auth Error]: Token invalid or session expired');
          logout(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { token: jwtToken, user: authUser } = res.data;

      localStorage.setItem('shopnova_token', jwtToken);
      localStorage.setItem('shopnova_user', JSON.stringify(authUser));
      setToken(jwtToken);
      setUser(authUser);

      showToast(`Welcome back, ${authUser.name}!`, 'success');
      return { success: true, user: authUser };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await authAPI.register(formData);
      const { token: jwtToken, user: authUser } = res.data;

      localStorage.setItem('shopnova_token', jwtToken);
      localStorage.setItem('shopnova_user', JSON.stringify(authUser));
      setToken(jwtToken);
      setUser(authUser);

      showToast('Account created successfully! Welcome to ShopNova.', 'success');
      return { success: true, user: authUser };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = (notify = true) => {
    localStorage.removeItem('shopnova_token');
    localStorage.removeItem('shopnova_user');
    localStorage.removeItem('novacart_token');
    localStorage.removeItem('novacart_user');
    setToken(null);
    setUser(null);
    if (notify) {
      showToast('Logged out successfully', 'info');
    }
  };

  const updateProfile = async (formData) => {
    try {
      const res = await authAPI.updateProfile(formData);
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('shopnova_user', JSON.stringify(updatedUser));
      showToast('Profile updated successfully!', 'success');
      return { success: true, user: updatedUser };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        refreshUser
      }}
    >
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
