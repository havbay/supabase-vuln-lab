import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let data, err;
      if (isSignUp) {
        const { data: d, error: e } = await supabase.auth.signUp({ email, password });
        data = d; err = e;
      } else {
        const { data: d, error: e } = await supabase.auth.signInWithPassword({ email, password });
        data = d; err = e;
      }

      if (err) throw err;
      
      if (isSignUp) {
        alert('Check your email for the login link or log in if email confirmation is off!');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', background: '#e0e7ff', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary-color)', marginBottom: '1rem' }}>
            <Lock size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Security Admin Portal</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {isSignUp ? 'Create an admin account' : 'Sign in to access the dashboard'}
          </p>
        </div>

        {error && (
          <div style={{ color: 'var(--danger)', marginBottom: '1.5rem', padding: '0.75rem', background: '#fef2f2', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Email Address</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>{' '}
          <button 
            type="button" 
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', padding: 0, fontWeight: 500, display: 'inline' }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}
