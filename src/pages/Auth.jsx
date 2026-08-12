import { useState } from 'react';
import { supabase } from '../lib/supabase';

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
        const { data: d, error: e } = await supabase.auth.signUp({
          email,
          password,
        });
        data = d;
        err = e;
      } else {
        const { data: d, error: e } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        data = d;
        err = e;
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
    <div className="auth-container card">
      <h2>{isSignUp ? 'Create an Account' : 'Sign In'}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Log in to explore the Security Lab
      </p>

      {error && (
        <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.5rem', background: '#fef2f2', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleAuth} className="auth-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button className="secondary" onClick={() => setIsSignUp(!isSignUp)} style={{ width: '100%', justifyContent: 'center' }}>
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}
