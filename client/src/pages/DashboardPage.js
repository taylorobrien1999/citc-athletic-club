// Stub — will be built out in CACOS-32
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <main style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <h2>Member Dashboard</h2>
      <p style={{ color: '#6b7280' }}>Welcome, {user?.firstName}. Full dashboard coming soon.</p>
    </main>
  );
}