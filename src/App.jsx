import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import UserPortal from './pages/UserPortal';
import Landing from './pages/Landing';
import MockPreview from './pages/MockPreview';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>Loading...</div>;
  }

  // If not configured, we still show the Landing page at '/', but portal/admin will show the Mock Preview.
  return (
    <Router>
      {!isSupabaseConfigured && (
        <div style={{ background: '#dc2626', color: 'white', textAlign: 'center', padding: '0.5rem', fontWeight: 600, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
          Database Not Connected: Please add your Supabase keys to .env.local
        </div>
      )}
      <div style={{ paddingTop: !isSupabaseConfigured ? '40px' : '0' }}>
        <Routes>
          <Route path="/" element={!session ? <Landing /> : <Navigate to="/portal" />} />
          <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/portal" />} />
          <Route path="/portal" element={isSupabaseConfigured ? (session ? <UserPortal session={session} /> : <Navigate to="/auth" />) : <MockPreview />} />
          <Route path="/admin" element={isSupabaseConfigured ? (session ? <AdminDashboard session={session} /> : <Navigate to="/auth" />) : <MockPreview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
