import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, LogOut, FileText, Image as ImageIcon, LayoutDashboard, Users, Settings as SettingsIcon, Bell } from 'lucide-react';

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
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('attachments').upload(filePath, file);
        if (uploadError) throw uploadError;
      }

      const { error } = await supabase.from('notes').insert([{ 
        title: newTitle, 
        content: newContent, 
        user_id: session.user.id,
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
      const { error } = await supabase.from('notes').delete().eq('id', id);
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
    <div className="app-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          SysAdmin Pro
        </div>
        <div className="sidebar-nav">
          <a href="#" className="nav-item">
            <LayoutDashboard size={20} />
            Overview
          </a>
          <a href="#" className="nav-item active">
            <FileText size={20} />
            System Logs & Notes
          </a>
          <a href="#" className="nav-item">
            <Users size={20} />
            User Management
          </a>
          <a href="#" className="nav-item">
            <SettingsIcon size={20} />
            Settings
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-header">
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>System Logs & Notes</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Bell size={20} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'var(--primary-color)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                {session.user.email[0].toUpperCase()}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{session.user.email}</span>
              <button onClick={handleSignOut} className="secondary" style={{ padding: '0.25rem 0.5rem', marginLeft: '0.5rem' }}>
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="content-area">
          <div className="card" style={{ maxWidth: '800px' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Create System Record</h3>
            <form onSubmit={handleAddNote}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Record Title</label>
                  <input type="text" placeholder="e.g., Server restart required" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required style={{ marginBottom: 0 }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Details</label>
                <textarea placeholder="Enter detailed information..." rows={3} value={newContent} onChange={(e) => setNewContent(e.target.value)} required />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <ImageIcon size={18} />
                  <span>{file ? file.name : 'Attach server log or image'}</span>
                  <input type="file" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} />
                </label>
                <button type="submit">
                  <FileText size={16} /> Save Record
                </button>
              </div>
            </form>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>All System Records</h3>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading records...</div>
            ) : notes.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No records found. Create one above.</div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Details</th>
                      <th>User ID (Author)</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map(note => (
                      <tr key={note.id}>
                        <td style={{ fontWeight: 500 }}>{note.title}</td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{note.content}</td>
                        <td><span className="badge">{note.user_id?.substring(0, 8)}...</span></td>
                        <td>{new Date(note.created_at).toLocaleDateString()}</td>
                        <td>
                          <button className="danger" onClick={() => handleDelete(note.id)} style={{ padding: '0.25rem 0.5rem' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
