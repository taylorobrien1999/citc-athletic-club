import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Usage:
//   <Route element={<PrivateRoute />}>
//     <Route path="/dashboard" element={<DashboardPage />} />
//   </Route>
//
//   <Route element={<PrivateRoute adminOnly />}>
//     <Route path="/admin" element={<AdminPage />} />
//   </Route>

import { Outlet } from 'react-router-dom';

export default function PrivateRoute({ adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return null; // Wait for localStorage restore before redirecting

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
