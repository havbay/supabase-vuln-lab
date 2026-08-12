import { FileText, LogOut, Database, LayoutDashboard, Users, Settings as SettingsIcon, Bell } from 'lucide-react';

export default function MockPreview() {
  const mockNotes = [
    {
      id: '1',
      title: 'Server restart required',
      content: 'The database server requires a restart after patching the latest OS updates. Scheduled for 2:00 AM.',
      created_at: new Date().toISOString(),
      user_id: 'admin-id-12345'
    },
    {
      id: '2',
      title: 'Audit user permissions',
      content: 'We need to review all user permissions in the system. Some users might have excessive access.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      user_id: 'security-id-6789'
    }
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className="sidebar" style={{ filter: 'grayscale(100%)', opacity: 0.8 }}>
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
        <div className="top-header" style={{ opacity: 0.8 }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>System Logs & Notes</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Bell size={20} style={{ color: 'var(--text-secondary)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'var(--primary-color)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                A
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>admin@sysadmin.local</span>
              <button className="secondary" style={{ padding: '0.25rem 0.5rem', marginLeft: '0.5rem' }}>
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="content-area">
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
                Supabase is not connected. Please add your credentials to <code>.env.local</code> to see live data. Here is a preview of the new dashboard UI!
              </p>
            </div>
          </div>

          <div className="card" style={{ maxWidth: '800px', opacity: 0.7, pointerEvents: 'none' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Create System Record</h3>
            <form>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Record Title</label>
                  <input type="text" placeholder="e.g., Server restart required" disabled style={{ marginBottom: 0 }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Details</label>
                <textarea placeholder="Enter detailed information..." rows={3} disabled />
              </div>
              <button type="button" disabled>
                <FileText size={16} /> Save Record
              </button>
            </form>
          </div>

          <div className="card" style={{ opacity: 0.8 }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>All System Records (Preview Data)</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Details</th>
                    <th>User ID (Author)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockNotes.map(note => (
                    <tr key={note.id}>
                      <td style={{ fontWeight: 500 }}>{note.title}</td>
                      <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{note.content}</td>
                      <td><span className="badge">{note.user_id.substring(0, 8)}...</span></td>
                      <td>{new Date(note.created_at).toLocaleDateString()}</td>
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
