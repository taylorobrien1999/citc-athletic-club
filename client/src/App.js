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
import ContactPage        from './pages/ContactPage';
import AdminInquiriesPage from './pages/AdminInquiriesPage';
import CoachesPage        from './pages/CoachesPage';
import TrainingProgramsPage from './pages/TrainingProgramsPage';
import TrackMeetsPage from './pages/TrackMeetsPage';
import MissionPage from './pages/MissionPage';
import CodeOfConductPage from './pages/CodeOfConductPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/"         element={<HomePage />} />
          <Route path="/login"    element={<LoginPage />} />

          <Route path="/contact" element={<ContactPage />} />
          <Route path="/the-club/coaches" element={<CoachesPage />} />
          <Route path="/the-club/training" element={<TrainingProgramsPage />} />
          <Route path="/the-club/meets" element={<TrackMeetsPage />} />
          <Route path="/the-club/mission" element={<MissionPage />} />
          <Route path="/the-club/conduct" element={<CodeOfConductPage />} />

          {/* Member-only routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<PrivateRoute adminOnly />}>
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="inquiries" element={<AdminInquiriesPage />} />
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
