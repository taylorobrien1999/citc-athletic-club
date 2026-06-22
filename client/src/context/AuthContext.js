import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [token, setToken]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('citc_token');
    const storedUser  = localStorage.getItem('citc_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('citc_token', jwtToken);
    localStorage.setItem('citc_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('citc_token');
    localStorage.removeItem('citc_user');
    setShowLogoutToast(true);
    setTimeout(() => setShowLogoutToast(false), 4000);
  };

  const isAdmin  = user?.role === 'admin';
  const isMember = user?.role === 'member' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isMember, showLogoutToast }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}