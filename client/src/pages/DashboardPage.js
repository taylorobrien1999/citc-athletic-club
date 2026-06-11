// Stub — will be built out in CACOS-20
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  return (
    <main style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.firstName}. Role: {user?.role}</p>
      <button onClick={logout}>Log out</button>
    </main>
  );
}
