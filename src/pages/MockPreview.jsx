import { FileText, LogOut, Database, Settings } from 'lucide-react';

export default function MockPreview() {
  const mockNotes = [
    {
      id: '1',
      title: 'Welcome to Security Lab',
      content: 'This is a sample note to show how the app looks. Once you connect to Supabase, this will be populated with real data from your database.',
      created_at: new Date().toISOString(),
      user_id: 'sample-user-id-123'
    },
    {
      id: '2',
      title: 'RLS Policies to test',
      content: '1. Unauthenticated users should not read notes\n2. Users should only read their own notes\n3. Users should only update/delete their own notes',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      user_id: 'sample-user-id-123'
    }
  ];

  return (
    <div className="container" style={{ opacity: 0.9 }}>
      <div style={{
        background: 'linear-gradient(to right, #0ea5e9, #6366f1)',
        color: 'white',
        padding: '1.5rem',
        borderRadius: 'var(--radius)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <Database size={32} />
        <div>
          <h2 style={{ margin: 0, color: 'white' }}>Setup Required</h2>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
            Supabase is not connected. Please add your credentials to <code>.env.local</code> to see live data. Here is a preview of the UI.
          </p>
        </div>
      </div>

      <div className="header" style={{ opacity: 0.7, pointerEvents: 'none' }}>
        <div>
          <h1>Security Lab Notes</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Logged in as demo@example.com</p>
        </div>
        <button className="secondary">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="card" style={{ opacity: 0.7, pointerEvents: 'none' }}>
        <h3>Create New Note</h3>
        <form style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Note Title"
            disabled
          />
          <textarea
            placeholder="Write something..."
            rows={3}
            disabled
          />
          <button type="button" disabled>
            <FileText size={16} /> Add Note
          </button>
        </form>
      </div>

      <div className="notes-grid">
        {mockNotes.map(note => (
          <div key={note.id} className="note-card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="meta">
              User ID: {note.user_id.substring(0, 8)}...<br/>
              Created: {new Date(note.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
