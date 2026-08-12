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

  if (!isSupabaseConfigured) {
    return <MockPreview />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={!session ? <Landing /> : <Navigate to="/portal" />} />
        <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/portal" />} />
        <Route path="/portal" element={session ? <UserPortal session={session} /> : <Navigate to="/auth" />} />
        <Route path="/admin" element={session ? <AdminDashboard session={session} /> : <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;
