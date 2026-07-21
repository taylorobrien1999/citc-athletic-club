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
import AdminAnnouncementsPage from './pages/AdminAnnouncementsPage';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminProgramsPage from './pages/AdminProgramsPage';
import AdminResourcesPage from './pages/AdminResourcesPage';
import AdminSiteContentPage from './pages/AdminSiteContentPage';
import NewsPage from './pages/NewsPage';
import PhotosPage from './pages/PhotosPage';
import FeesPage from './pages/FeesPage';
import AthleticsAlbertaPage from './pages/AthleticsAlbertaPage';
import VolunteerPage from './pages/VolunteerPage';
import RecordsPage from './pages/RecordsPage';
import CreateAccountPage from './pages/CreateAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminMembersPage from './pages/AdminMembersPage';
import AdminRecordsPage from './pages/AdminRecordsPage';
import PublicChatWidgetGate from './components/PublicChatWidgetGate';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <PublicChatWidgetGate />
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
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/photos" element={<PhotosPage />} />
          <Route path="/membership/fees" element={<FeesPage />} />
          <Route path="/membership/athletics-alberta" element={<AthleticsAlbertaPage />} />
          <Route path="/membership/volunteer" element={<VolunteerPage />} />
          <Route path="/news/records" element={<RecordsPage />} />
          <Route path="/create-account/:token" element={<CreateAccountPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Member-only routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<PrivateRoute adminOnly />}>
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="inquiries" element={<AdminInquiriesPage />} />
              <Route path="announcements" element={<AdminAnnouncementsPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="programs" element={<AdminProgramsPage />} />
              <Route path="resources" element={<AdminResourcesPage />} />
              <Route path="site-content" element={<AdminSiteContentPage />} />
              <Route path="members" element={<AdminMembersPage />} />
              <Route path="records" element={<AdminRecordsPage />} />
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
