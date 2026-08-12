import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Trash2, LogOut, FileText, LayoutDashboard,
  Users, Settings, Bell, Lock, Shield, Search, Download
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard({ session }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setDocuments(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this document? This cannot be undone.')) return;
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) return alert('Error: ' + error.message);
    fetchAll();
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate('/'); };

  const initials = session.user.email[0].toUpperCase();

  const filtered = documents.filter(d =>
    d.title?.toLowerCase().includes(search.toLowerCase()) ||
    d.description?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Documents', value: documents.length, sub: 'all clients' },
    { label: 'Pending Review', value: documents.filter(d => !d.status || d.status === 'pending').length, sub: 'needs action' },
    { label: 'Clients', value: new Set(documents.map(d => d.user_id)).size, sub: 'unique users' },
  ];

  return (
    <div className="app-layout">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Lock size={20} strokeWidth={2.5} />
          VaultShare
        </div>
        <div style={{ padding: '0.75rem 0' }}>
          <div className="sidebar-section">Main</div>
          <a href="#" className="nav-item">
            <LayoutDashboard size={18} /> Overview
          </a>
          <a href="#" className="nav-item active">
            <FileText size={18} /> Client Documents
          </a>
          <a href="#" className="nav-item">
            <Users size={18} /> Clients
          </a>
          <div className="sidebar-section" style={{ marginTop: '1rem' }}>System</div>
          <a href="#" className="nav-item">
            <Shield size={18} /> Security Policies
          </a>
          <a href="#" className="nav-item">
            <Settings size={18} /> Settings
          </a>
        </div>
        <div style={{ marginTop: 'auto', padding: '1rem' }}>
          <div style={{ padding: '0.875rem', borderRadius: 'var(--radius)', background: 'rgba(255,255,255,0.06)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: '0.25rem' }}>🔒 Security Lab Mode</div>
            RLS is intentionally disabled. Test vulnerabilities and then apply the corrected policies.
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-content">

        {/* Top bar */}
        <div className="top-bar">
          <div>
            <div style={{ fontWeight: 600 }}>Compliance Review</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>VaultShare Admin Dashboard</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link to="/portal" style={{ fontSize: '0.875rem', color: 'var(--text-2)', fontWeight: 500 }}>Client View →</Link>
            <Bell size={20} style={{ color: 'var(--text-3)', cursor: 'pointer' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--sidebar-bg)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>{initials}</div>
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{session.user.email}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Compliance Officer</div>
              </div>
              <button className="secondary" onClick={handleSignOut} style={{ padding: '0.375rem 0.75rem', marginLeft: '0.25rem' }}><LogOut size={14} /></button>
            </div>
          </div>
        </div>

        <div className="page-body">

          {/* Stats */}
          <div className="stats-grid">
            {stats.map(s => (
              <div key={s.label} className="stat-card">
                <div className="label">{s.label}</div>
                <div className="value">{s.value}</div>
                <div className="sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Documents table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3>All Client Documents</h3>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input
                  placeholder="Search documents…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: '2.25rem', width: '240px', marginBottom: 0 }}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-3)' }}>Loading…</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-3)' }}>
                <FileText size={36} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                <p>{search ? 'No documents match your search.' : 'No documents in the system yet.'}</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Description</th>
                      <th>Client ID</th>
                      <th>Status</th>
                      <th>Uploaded</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(doc => (
                      <tr key={doc.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <FileText size={15} color="var(--brand)" />
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{doc.title}</span>
                          </div>
                        </td>
                        <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-2)' }}>{doc.description}</td>
                        <td><span className="badge">{doc.user_id?.substring(0, 8)}…</span></td>
                        <td>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: '#fef3c7', color: '#92400e' }}>
                            Under Review
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>{new Date(doc.created_at).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="secondary" style={{ padding: '0.375rem 0.5rem' }} title="Download"><Download size={14} /></button>
                            <button className="danger" style={{ padding: '0.375rem 0.5rem' }} onClick={() => handleDelete(doc.id)} title="Delete"><Trash2 size={14} /></button>
                          </div>
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
