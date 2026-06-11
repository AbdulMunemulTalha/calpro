import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

const ADMIN_CREDS = { username: 'admin', password: 'calpro2024!' };

export function AdminProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('cp_admin') === 'true';
  });

  const login = (username, password) => {
    if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
      localStorage.setItem('cp_admin', 'true');
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('cp_admin');
    setIsLoggedIn(false);
  };

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
