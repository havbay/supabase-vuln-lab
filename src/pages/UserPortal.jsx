import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Upload, FileText, Clock, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const STATUS = {
  pending:  { label: 'Under Review', color: '#92400e', bg: '#fef3c7' },
  approved: { label: 'Approved',     color: '#065f46', bg: '#d1fae5' },
  rejected: { label: 'Rejected',     color: '#991b1b', bg: '#fee2e2' },
};

export default function UserPortal({ session }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchMyDocuments(); }, []);

  const fetchMyDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (!error) setDocuments(data || []);
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !file) return;
    setUploading(true);

    try {
      const ext = file.name.split('.').pop();
      const path = `${session.user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('secure_files').upload(path, file);
      if (upErr) throw upErr;

      const { error: dbErr } = await supabase.from('documents').insert([{
        title,
        description,
        user_id: session.user.id,
      }]);
      if (dbErr) throw dbErr;

      setTitle(''); setDescription(''); setFile(null);
      fetchMyDocuments();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate('/'); };

  const initials = session.user.email[0].toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Top bar */}
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', height: 'var(--header-height)', display: 'flex', alignItems: 'center', padding: '0 1.75rem', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontWeight: 800, fontSize: '1.125rem', color: 'var(--brand)' }}>
          <Lock size={20} strokeWidth={2.5} /> VaultShare
          <span style={{ fontWeight: 400, color: 'var(--text-3)', fontSize: '0.875rem', marginLeft: '0.25rem' }}>/ Client Portal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/admin" style={{ fontSize: '0.875rem', color: 'var(--text-2)', fontWeight: 500 }}>Admin View →</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--brand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>{initials}</div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-2)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.user.email}</span>
            <button className="secondary" onClick={handleSignOut} style={{ padding: '0.375rem 0.75rem' }}><LogOut size={14} /> Sign out</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '0.375rem' }}>My Documents</h1>
          <p>Upload financial documents securely. Your compliance officer will be notified automatically.</p>
        </div>

        {/* Upload card */}
        <div className="card" style={{ marginBottom: '2rem', borderTop: '3px solid var(--brand)' }}>
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={18} color="var(--brand)" /> Upload a Document
          </h3>
          <form onSubmit={handleUpload}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Document Title</label>
                <input type="text" placeholder="e.g. 2025 Federal Tax Return" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Notes for your officer</label>
                <textarea rows={2} placeholder="Any context or special instructions…" value={description} onChange={e => setDescription(e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Attach File</label>
                <input type="file" onChange={e => setFile(e.target.files[0])} required accept=".pdf,.jpg,.png,.doc,.docx" />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" disabled={uploading}>
                {uploading ? 'Uploading…' : 'Securely Upload'}
              </button>
            </div>
          </form>
        </div>

        {/* Document list */}
        <h3 style={{ marginBottom: '1rem' }}>Upload History</h3>
        {loading ? (
          <p>Loading…</p>
        ) : documents.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)' }}>
            <FileText size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No documents uploaded yet.<br/>Use the form above to submit your first document.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {documents.map(doc => {
              const st = STATUS[doc.status] || STATUS.pending;
              return (
                <div key={doc.id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1.25rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 'var(--radius)', background: 'var(--brand-light)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                      <h4>{doc.title}</h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: st.bg, color: st.color, flexShrink: 0 }}>{st.label}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0.5rem' }}>{doc.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-3)', fontSize: '0.75rem' }}>
                      <Clock size={12} /> {new Date(doc.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
