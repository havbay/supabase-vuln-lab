import { Link } from 'react-router-dom';
import { Lock, FileSignature, Building2, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1.5rem 2rem', background: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem', color: '#0f766e' }}>
          <Lock size={24} />
          VaultShare
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/auth" style={{ textDecoration: 'none' }}>
            <button className="secondary">Client Login</button>
          </Link>
          <Link to="/auth" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#0f766e' }}>Get Started</button>
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)', maxWidth: '900px', lineHeight: 1.1 }}>
          Secure Document Exchange for <span style={{ color: '#0f766e' }}>Financial Firms</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px' }}>
          VaultShare allows your clients to securely upload tax returns, W-2s, and sensitive contracts directly to your compliance officers.
        </p>
        
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div className="card" style={{ width: '300px', textAlign: 'left', borderTop: '4px solid #0f766e' }}>
            <FileSignature size={32} style={{ color: '#0f766e', marginBottom: '1rem' }} />
            <h3>Client Uploads</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Clients can securely upload encrypted tax documents and financial statements.</p>
          </div>
          <div className="card" style={{ width: '300px', textAlign: 'left', borderTop: '4px solid #0369a1' }}>
            <Building2 size={32} style={{ color: '#0369a1', marginBottom: '1rem' }} />
            <h3>Compliance Dashboard</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Officers can review submitted documents in a centralized, secure dashboard.</p>
          </div>
        </div>

        <Link to="/auth" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '1rem 2rem', fontSize: '1.125rem', backgroundColor: '#0f766e' }}>
            Enter VaultShare Demo <ArrowRight size={20} />
          </button>
        </Link>
      </main>
    </div>
  );
}
