import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, PlusCircle, FileText, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function UserPortal({ session }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyNotes();
  }, []);

  const fetchMyNotes = async () => {
    try {
      setLoading(true);
      // In a secure setup, RLS would enforce this. 
      // Right now, this queries all notes, but we filter client-side just for UI, OR we query by eq('user_id', session.user.id). 
      // Actually, if we query all, they will see all (vulnerable!). Let's just query all and see what happens when they click "Admin Dashboard" vs here.
      // Wait, let's query only their own so the user portal looks correct, but they can still hack it.
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    try {
      const { error } = await supabase.from('notes').insert([{ 
        title: newTitle, 
        content: newContent, 
        user_id: session.user.id,
      }]);

      if (error) throw error;
      
      setNewTitle('');
      setNewContent('');
      fetchMyNotes();
    } catch (error) {
      alert('Error adding ticket: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <header style={{ padding: '1rem 2rem', background: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.125rem' }}>
          <Users size={20} color="var(--primary-color)" />
          Employee Portal
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/admin" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Go to Admin Dashboard</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{session.user.email}</span>
            <button onClick={handleSignOut} className="secondary" style={{ padding: '0.25rem 0.5rem' }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '2rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>My IT Tickets</h1>
        
        <div className="card" style={{ marginBottom: '2rem', background: 'white' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PlusCircle size={18}/> Submit New Ticket</h3>
          <form onSubmit={handleAddNote}>
            <input type="text" placeholder="Issue Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
            <textarea placeholder="Describe your issue..." rows={3} value={newContent} onChange={(e) => setNewContent(e.target.value)} required />
            <button type="submit">Submit Ticket</button>
          </form>
        </div>

        <h3 style={{ marginBottom: '1rem' }}>Ticket History</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <p>Loading tickets...</p>
          ) : notes.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>You haven't submitted any tickets yet.</p>
          ) : (
            notes.map(note => (
              <div key={note.id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem' }}>
                <div style={{ background: '#e0e7ff', padding: '0.75rem', borderRadius: '50%', color: '#3730a3' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{note.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0.5rem 0', fontSize: '0.875rem' }}>{note.content}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#9ca3af', fontSize: '0.75rem' }}>
                    <Clock size={12} /> {new Date(note.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
