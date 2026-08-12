import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, LogOut, FileText, LayoutDashboard, Users, Settings as SettingsIcon, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard({ session }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  const fetchAllDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
      fetchAllDocuments();
    } catch (error) {
      alert('Error deleting document: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className="sidebar" style={{ backgroundColor: '#083344' }}>
        <div className="sidebar-header" style={{ borderColor: '#164e63' }}>
          VaultShare Admin
        </div>
        <div className="sidebar-nav">
          <a href="#" className="nav-item">
            <LayoutDashboard size={20} />
            Overview
          </a>
          <a href="#" className="nav-item active" style={{ backgroundColor: '#164e63', color: 'white' }}>
            <FileText size={20} />
            Client Documents
          </a>
          <a href="#" className="nav-item">
            <Users size={20} />
            Clients
          </a>
          <a href="#" className="nav-item">
            <SettingsIcon size={20} />
            System Settings
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-header">
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Compliance Review</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/portal" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Switch to Client Portal</Link>
            <Bell size={20} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#083344', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
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
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>All Client Uploads</h3>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading documents...</div>
            ) : documents.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No documents found in the system.</div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Document Title</th>
                      <th>Notes / Description</th>
                      <th>Client ID</th>
                      <th>Date Uploaded</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc.id}>
                        <td style={{ fontWeight: 500 }}>{doc.title}</td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.description}</td>
                        <td><span className="badge" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>{doc.user_id?.substring(0, 8)}...</span></td>
                        <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                        <td>
                          <button className="danger" onClick={() => handleDelete(doc.id)} style={{ padding: '0.25rem 0.5rem' }}>
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
