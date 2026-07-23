import { useLocation } from 'react-router-dom';
import Footer from './Footer';

export default function FooterGate() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  return <Footer />;
}
