import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to validate token and get user data
  const validateToken = async (token) => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/validate-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const userPhone = localStorage.getItem('userPhone');
        
        if (token) {
          const userData = await validateToken(token);
          if (userData) {
            setIsAuthenticated(true);
            setIsAdmin(true);
            setUser(userData.user);
          } else {
            // Token is invalid, clear everything
            localStorage.removeItem('adminToken');
            localStorage.removeItem('userPhone');
          }
        } else if (userPhone) {
          // Regular user login
          setIsAuthenticated(true);
          setUser({ phoneNumber: userPhone });
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (loginData, isAdminUser = false) => {
    console.log('Login data received:', loginData); // Debug log

    if (isAdminUser) {
      // For admin login, we expect token and user data
      const { token, user: adminUser } = loginData;
      if (!token || !adminUser) {
        throw new Error('Invalid admin login data');
      }
      setIsAuthenticated(true);
      setIsAdmin(true);
      setUser(adminUser);
      localStorage.setItem('adminToken', token);
      localStorage.setItem('userPhone', adminUser.phoneNumber);
    } else {
      // For regular user login
      const { user: regularUser } = loginData;
      if (!regularUser) {
        throw new Error('Invalid user login data');
      }
      setIsAuthenticated(true);
      setUser(regularUser);
      localStorage.setItem('userPhone', regularUser.phoneNumber);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem('userPhone');
    localStorage.removeItem('adminToken');
    // Redirect to login page
    window.location.href = '/signin';
  };

  // If still loading, you might want to show a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, logout }}>
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