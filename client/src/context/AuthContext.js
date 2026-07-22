import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [token, setToken]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('citc_token');
      const storedUser  = localStorage.getItem('citc_user');

      if (!storedToken || !storedUser) {
        setLoading(false);
        return;
      }

      setToken(storedToken);
      setUser(JSON.parse(storedUser)); // show the cached version immediately, no flash of logged-out state

      // Now confirm the REAL current role/status from the server before
      // letting any route guard make a decision — this is what closes the
      // race condition where a stale cached role got used for a split
      // second before the fresh check finished.
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!res.ok) throw new Error('Invalid session');
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('citc_user', JSON.stringify(data.user));
      } catch (err) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('citc_token');
        localStorage.removeItem('citc_user');
      } finally {
        setLoading(false);
      }
    };
    init();
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