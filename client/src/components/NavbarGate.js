import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

// The public Navbar should never appear inside the Admin Dashboard — it has
// its own dedicated topbar/sidebar/hamburger. Showing both at once is what
// caused the double-hamburger confusion (and the wrong one navigating home).
export default function NavbarGate() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  return <Navbar />;
}
