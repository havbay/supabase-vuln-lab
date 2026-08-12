import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './pages/Auth';
import Home from './pages/Home';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div className="App">
      {!session ? <Auth /> : <Home session={session} />}
    </div>
  );
}

export default App;
