import { useLocation } from 'react-router-dom';
import ChatWidget from './ChatWidget';

// Pace (public) should never appear alongside Coach Byte (admin) — this wrapper
// hides the public widget whenever the user is inside the admin dashboard,
// where AdminPage.js mounts its own admin-mode widget instead.
export default function PublicChatWidgetGate() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  return <ChatWidget mode="public" />;
}
