import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const API_URL = 'https://realestatebackend-j2wi.onrender.com/';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user and token from localStorage on boot
    const storedUser = localStorage.getItem('aura_user');
    const storedToken = localStorage.getItem('aura_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userSession = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone,
        avatar: data.avatar || '',
      };

      setUser(userSession);
      setToken(data.token);

      localStorage.setItem('aura_user', JSON.stringify(userSession));
      localStorage.setItem('aura_token', data.token);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const userSession = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone,
        avatar: data.avatar || '',
      };

      setUser(userSession);
      setToken(data.token);

      localStorage.setItem('aura_user', JSON.stringify(userSession));
      localStorage.setItem('aura_token', data.token);

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const isFormData = profileData instanceof FormData;
      
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers,
        body: isFormData ? profileData : JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      const updatedUser = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        phone: data.phone,
        avatar: data.avatar || '',
      };

      setUser(updatedUser);
      setToken(data.token);

      localStorage.setItem('aura_user', JSON.stringify(updatedUser));
      localStorage.setItem('aura_token', data.token);

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aura_user');
    localStorage.removeItem('aura_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
