import React, { createContext, useContext, useState, useEffect } from 'react';

const EARS_AuthContext = createContext(null);

export const EARS_AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('EARS_user');
    const storedToken = localStorage.getItem('EARS_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('EARS_user', JSON.stringify(userData));
    localStorage.setItem('EARS_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('EARS_user');
    localStorage.removeItem('EARS_token');
    setUser(null);
  };

  if (loading) return null;

  return (
    <EARS_AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </EARS_AuthContext.Provider>
  );
};

export const useEARS_Auth = () => useContext(EARS_AuthContext);
