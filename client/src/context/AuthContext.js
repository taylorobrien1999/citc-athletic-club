import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
      setUser(JSON.parse(storedUser)); // show the cached version immediately, no flash of logged-out state

      // Then immediately re-check the REAL current role/status from the server —
      // the cached copy could be stale if an admin promoted/demoted/deactivated
      // this account since the last login. This is what makes a role change
      // take effect on the next refresh instead of requiring a fresh login.
      fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          setUser(data.user);
          localStorage.setItem('citc_user', JSON.stringify(data.user));
        })
        .catch(() => {
          // Token invalid/expired or account deactivated — log out cleanly.
          setUser(null);
          setToken(null);
          localStorage.removeItem('citc_token');
          localStorage.removeItem('citc_user');
        });
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('citc_token', jwtToken);
    localStorage.setItem('citc_user', JSON.stringify(userData));
  };

  const updateUser = (userData) => {
    setUser(userData);
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
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, isAdmin, isMember, showLogoutToast }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}