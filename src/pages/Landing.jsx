import { Link } from 'react-router-dom';
import { Shield, Server, Users, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1.5rem 2rem', background: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-color)' }}>
          <Shield size={24} />
          SysAdmin Pro
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/auth" style={{ textDecoration: 'none' }}>
            <button className="secondary">Login</button>
          </Link>
          <Link to="/auth" style={{ textDecoration: 'none' }}>
            <button>Get Started</button>
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)', maxWidth: '800px', lineHeight: 1.2 }}>
          Enterprise System Management <br/> <span style={{ color: 'var(--primary-color)' }}>Secured by Supabase</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px' }}>
          A complete solution for monitoring server logs, managing user access, and enforcing strict Row Level Security policies.
        </p>
        
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div className="card" style={{ width: '300px', textAlign: 'left' }}>
            <Server size={32} style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
            <h3>Server Logging</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Securely log server events and attach incident reports.</p>
          </div>
          <div className="card" style={{ width: '300px', textAlign: 'left' }}>
            <Users size={32} style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
            <h3>User Portal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Allow staff to submit IT tickets directly to the admin queue.</p>
          </div>
        </div>

        <Link to="/auth" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Enter Demo <ArrowRight size={20} />
          </button>
        </Link>
      </main>
    </div>
  );
}
