import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, LogOut, FileText, Image as ImageIcon } from 'lucide-react';

export default function Home({ session }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error.message);
      alert('Error fetching notes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    try {
      let attachmentUrl = null;

      // Handle file upload if a file is selected
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`; // Insecure setup: this is just the path, rules dictate if it works!

        const { error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('attachments')
          .getPublicUrl(filePath);
          
        attachmentUrl = filePath;
      }

      const { error } = await supabase
        .from('notes')
        .insert([{ 
          title: newTitle, 
          content: newContent, 
          user_id: session.user.id,
          // note: we would add attachment_url to the DB schema if we wanted to save it, 
          // but for this lab, we just upload to storage to test bucket permissions.
        }]);

      if (error) throw error;
      
      setNewTitle('');
      setNewContent('');
      setFile(null);
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error.message);
      alert('Error adding note: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error.message);
      alert('Error deleting note: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Security Lab Notes</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Logged in as {session.user.email}</p>
        </div>
        <button onClick={handleSignOut} className="secondary">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="card">
        <h3>Create New Note</h3>
        <form onSubmit={handleAddNote} style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Note Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write something..."
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            required
          />
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary-color)' }}>
              <ImageIcon size={16} />
              <span>{file ? file.name : 'Attach a file (optional)'}</span>
              <input 
                type="file" 
                style={{ display: 'none' }} 
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
          <button type="submit">
            <FileText size={16} /> Add Note
          </button>
        </form>
      </div>

      {loading ? (
        <p>Loading notes...</p>
      ) : (
        <div className="notes-grid">
          {notes.map(note => (
            <div key={note.id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <div className="meta">
                User ID: {note.user_id?.substring(0, 8)}...<br/>
                Created: {new Date(note.created_at).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button 
                  className="danger" 
                  onClick={() => handleDelete(note.id)}
                  title="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>No notes found. Create one above!</p>
          )}
        </div>
      )}
    </div>
  );
}
