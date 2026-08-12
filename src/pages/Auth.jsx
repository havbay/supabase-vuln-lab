import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, ShieldCheck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess('Account created! Check your email to confirm, or sign in directly if email confirmation is disabled.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontWeight: 800, fontSize: '1.375rem', marginBottom: '3rem' }}>
          <Lock size={24} strokeWidth={2.5} /> VaultShare
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>
          Your firm's documents.<br />Safe. Always.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
          VaultShare is the secure document exchange platform built specifically for financial professionals. Sign in to access your vault.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { icon: <ShieldCheck size={18} />, text: 'AES-256 encryption at rest & in transit' },
            { icon: <FileText size={18} />, text: 'Full audit trail on every document action' },
            { icon: <Lock size={18} />, text: 'SOC 2 Type II compliant infrastructure' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem' }}>
              <div style={{ color: 'var(--brand-light)' }}>{item.icon}</div>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '0.375rem' }}>{isSignUp ? 'Create your account' : 'Welcome back'}</h2>
            <p>{isSignUp ? 'Get started with a free 14-day trial.' : 'Sign in to access your document vault.'}</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: 'var(--brand-muted)', border: '1px solid var(--brand-light)', color: 'var(--brand-dark)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleAuth}>
            <div className="form-field">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {!isSignUp && (
              <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                <a href="#" style={{ fontSize: '0.8125rem' }}>Forgot password?</a>
              </div>
            )}
            <button type="submit" style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem' }} disabled={loading}>
              {loading ? 'Please wait…' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9375rem' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button type="button" className="ghost" style={{ padding: 0, color: 'var(--brand)', fontWeight: 600, fontSize: '0.9375rem', display: 'inline' }} onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccess(null); }}>
              {isSignUp ? 'Sign in' : 'Sign up free'}
            </button>
          </p>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--text-3)' }}>← Back to homepage</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
