import React, { createContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on first render
  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.getItem('token')) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data);
          setIsAuthenticated(true);
          setIsAdmin(res.data.role === 'admin');
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
          setError(err.response?.data?.message || 'Authentication error');
        }
      }
      
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  // Login user
  const login = async (username, password) => {
    try {
      const res = await API.post('/auth/login', { username, password });
      
      localStorage.setItem('token', res.data.token);
      
      // Get user data
      const userRes = await API.get('/auth/me');
      setUser(userRes.data);
      setIsAuthenticated(true);
      setIsAdmin(userRes.data.role === 'admin');
      setError(null);
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        error,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 