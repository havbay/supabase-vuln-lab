import { FileText, Lock, Database } from 'lucide-react';

const mockDocs = [
  { id: '1', title: '2025 W-2 Form', description: 'Attached my W-2 for the last fiscal year for review.', created_at: new Date().toISOString(), user_id: 'abc12345-xxxx' },
  { id: '2', title: 'Q1 Financial Statement', description: 'Confidential statements for compliance review.', created_at: new Date(Date.now() - 86400000).toISOString(), user_id: 'def67890-xxxx' },
  { id: '3', title: 'Mortgage Agreement', description: 'Home purchase mortgage contract for verification.', created_at: new Date(Date.now() - 2*86400000).toISOString(), user_id: 'abc12345-xxxx' },
];

export default function MockPreview() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo"><Lock size={20} strokeWidth={2.5} /> VaultShare</div>
        <div style={{ padding: '0.75rem 0' }}>
          <div className="sidebar-section">Main</div>
          <a href="#" className="nav-item"><FileText size={18} /> Client Documents</a>
          <a href="#" className="nav-item active"><Database size={18} /> Setup Required</a>
        </div>
      </aside>

      <div className="main-content">
        <div className="top-bar">
          <div style={{ fontWeight: 600 }}>VaultShare Admin — Preview Mode</div>
        </div>

        <div className="page-body">

          {/* Banner */}
          <div style={{ background: 'linear-gradient(135deg, var(--sidebar-bg), var(--brand))', color: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', boxShadow: 'var(--shadow-md)' }}>
            <Database size={32} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.375rem' }}>Supabase Not Connected — Preview Mode</div>
              <p style={{ opacity: 0.8, fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
                To activate the app, add your <code style={{ background: 'rgba(255,255,255,0.15)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>VITE_SUPABASE_URL</code> and <code style={{ background: 'rgba(255,255,255,0.15)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>VITE_SUPABASE_ANON_KEY</code> to your <strong>.env.local</strong> file, then run the <strong>database_setup.sql</strong> in Supabase's SQL Editor.
              </p>
            </div>
          </div>

          <div className="stats-grid">
            {[{ label: 'Total Documents', value: 3, sub: 'sample data' }, { label: 'Pending Review', value: 3, sub: 'demo' }, { label: 'Clients', value: 2, sub: 'demo' }].map(s => (
              <div key={s.label} className="stat-card">
                <div className="label">{s.label}</div>
                <div className="value">{s.value}</div>
                <div className="sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden', opacity: 0.85 }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3>Sample Documents (Preview Only)</h3>
            </div>
            <div className="table-container">
              <table>
                <thead><tr><th>Document</th><th>Description</th><th>Client ID</th><th>Status</th><th>Uploaded</th></tr></thead>
                <tbody>
                  {mockDocs.map(doc => (
                    <tr key={doc.id}>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}><div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={15} color="var(--brand)" /></div><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{doc.title}</span></div></td>
                      <td style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>{doc.description}</td>
                      <td><span className="badge">{doc.user_id.substring(0, 8)}…</span></td>
                      <td><span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: '#fef3c7', color: '#92400e' }}>Under Review</span></td>
                      <td style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>{new Date(doc.created_at).toLocaleDateString()}</td>
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
