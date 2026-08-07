import { useLocation } from 'react-router-dom';
import Footer from './Footer';

// Routes that render their own full-screen animated background (see
// AuthBackground) and don't want the standard footer breaking that scene.
const NO_FOOTER_PREFIXES = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/create-account',
];

export default function FooterGate() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = NO_FOOTER_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  if (isAdminRoute || isAuthRoute) return null;

  return <Footer />;
}
