import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import HomePage           from './pages/HomePage';
import LoginPage          from './pages/LoginPage';
import DashboardPage      from './pages/DashboardPage';
import AdminPage          from './pages/AdminPage';
import AdminOverviewPage  from './pages/AdminOverviewPage';
import Navbar             from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/"         element={<HomePage />} />
          <Route path="/login"    element={<LoginPage />} />

          {/* Member-only routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<PrivateRoute adminOnly />}>
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<AdminOverviewPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
