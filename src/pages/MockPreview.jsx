import { FileText, LogOut, Database, LayoutDashboard, Users, Settings as SettingsIcon, Bell } from 'lucide-react';

export default function MockPreview() {
  const mockDocs = [
    {
      id: '1',
      title: '2025 W-2 Form',
      description: 'Attached my W-2 for last year.',
      created_at: new Date().toISOString(),
      user_id: 'client-id-12345'
    },
    {
      id: '2',
      title: 'Q1 Financial Statement',
      description: 'Confidential statements for review.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      user_id: 'client-id-6789'
    }
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className="sidebar" style={{ filter: 'grayscale(100%)', opacity: 0.8, backgroundColor: '#083344' }}>
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
        <div className="top-header" style={{ opacity: 0.8 }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Compliance Review</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Bell size={20} style={{ color: 'var(--text-secondary)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#083344', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                A
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>admin@vaultshare.local</span>
              <button className="secondary" style={{ padding: '0.25rem 0.5rem', marginLeft: '0.5rem' }}>
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="content-area">
          <div style={{
            background: 'linear-gradient(to right, #0f766e, #0369a1)',
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
              <h2 style={{ margin: 0, color: 'white' }}>Database Setup Required</h2>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                Supabase is not connected. Please add your credentials to <code>.env.local</code> to see live data. Here is a preview of the VaultShare dashboard!
              </p>
            </div>
          </div>

          <div className="card" style={{ opacity: 0.8 }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>All Client Uploads (Preview Data)</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Document Title</th>
                    <th>Notes / Description</th>
                    <th>Client ID</th>
                    <th>Date Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDocs.map(doc => (
                    <tr key={doc.id}>
                      <td style={{ fontWeight: 500 }}>{doc.title}</td>
                      <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.description}</td>
                      <td><span className="badge" style={{ backgroundColor: '#ccfbf1', color: '#0f766e' }}>{doc.user_id.substring(0, 8)}...</span></td>
                      <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
