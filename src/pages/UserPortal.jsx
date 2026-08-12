import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Upload, FileText, Clock, FileKey } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function UserPortal({ session }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyDocuments();
  }, []);

  const fetchMyDocuments = async () => {
    try {
      setLoading(true);
      // Insecure! No RLS means querying this actually allows fetching everything if they modify the request.
      // But the UI will just fetch their own for "appearance" of security.
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent || !file) {
      alert("Please provide a title, description, and attach a file.");
      return;
    }

    try {
      // 1. Upload the physical file to the bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('secure_files').upload(filePath, file);
      if (uploadError) throw uploadError;

      // 2. Create the database record
      const { error } = await supabase.from('documents').insert([{ 
        title: newTitle, 
        description: newContent, 
        user_id: session.user.id,
      }]);

      if (error) throw error;
      
      setNewTitle('');
      setNewContent('');
      setFile(null);
      fetchMyDocuments();
      alert("Document securely uploaded.");
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <header style={{ padding: '1rem 2rem', background: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.125rem', color: '#0f766e' }}>
          <FileKey size={20} />
          VaultShare Client Portal
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/admin" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Switch to Admin</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{session.user.email}</span>
            <button onClick={handleSignOut} className="secondary" style={{ padding: '0.25rem 0.5rem' }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '2rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>My Secure Documents</h1>
        
        <div className="card" style={{ marginBottom: '2rem', background: 'white', borderTop: '4px solid #0f766e' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Upload size={18}/> Upload Financial Document</h3>
          <form onSubmit={handleUpload}>
            <input type="text" placeholder="Document Title (e.g. 2025 Tax Return)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
            <textarea placeholder="Any notes for the compliance officer..." rows={2} value={newContent} onChange={(e) => setNewContent(e.target.value)} required />
            <div style={{ marginBottom: '1rem' }}>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} required style={{ padding: '0.5rem' }} />
            </div>
            <button type="submit" style={{ backgroundColor: '#0f766e' }}>Securely Upload</button>
          </form>
        </div>

        <h3 style={{ marginBottom: '1rem' }}>Uploaded Documents</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <p>Loading documents...</p>
          ) : documents.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>You haven't uploaded any documents yet.</p>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem' }}>
                <div style={{ background: '#ccfbf1', padding: '0.75rem', borderRadius: '50%', color: '#0f766e' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{doc.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0.5rem 0', fontSize: '0.875rem' }}>{doc.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#9ca3af', fontSize: '0.75rem' }}>
                    <Clock size={12} /> Uploaded on {new Date(doc.created_at).toLocaleString()}
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
