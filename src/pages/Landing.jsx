import { Link } from 'react-router-dom';
import { Lock, FileSignature, Building2, ArrowRight, ShieldCheck, Zap, Globe, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1.5rem 2rem', background: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem', color: '#0f766e' }}>
          <Lock size={24} />
          VaultShare
        </div>
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>Features</a>
          <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>Pricing</a>
          <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
            <Link to="/auth" style={{ textDecoration: 'none' }}>
              <button className="secondary">Login</button>
            </Link>
            <Link to="/auth" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: '#0f766e' }}>Start Free Trial</button>
            </Link>
          </div>
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem', textAlign: 'center', background: 'linear-gradient(to bottom, white, var(--bg-color))' }}>
          <div style={{ display: 'inline-block', padding: '0.25rem 1rem', background: '#ccfbf1', color: '#0f766e', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Trusted by 500+ Financial Institutions
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)', maxWidth: '900px', lineHeight: 1.1 }}>
            Enterprise-Grade Document <br/><span style={{ color: '#0f766e' }}>Security & Exchange</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '700px', lineHeight: 1.6 }}>
            The ultimate white-label client portal for CPAs, Wealth Managers, and Legal Teams. securely collect W-2s, contracts, and financial statements with military-grade encryption.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/auth" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '1rem 2rem', fontSize: '1.125rem', backgroundColor: '#0f766e' }}>
                Open Your Vault <ArrowRight size={20} />
              </button>
            </Link>
            <button className="secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Book a Demo
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{ padding: '5rem 2rem', background: 'white' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why Choose VaultShare?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '4rem', fontSize: '1.125rem' }}>Everything you need to manage sensitive client documents compliantly.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
              <div style={{ padding: '1.5rem' }}>
                <ShieldCheck size={32} style={{ color: '#0f766e', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Bank-Level Security</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>AES-256 encryption at rest and in transit. Fully SOC2 and HIPAA compliant infrastructure.</p>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <Zap size={32} style={{ color: '#0f766e', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Lightning Fast</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Global CDN ensures your clients can upload gigabytes of documents in seconds, not minutes.</p>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <Globe size={32} style={{ color: '#0f766e', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Custom Branding</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>White-label the entire experience with your firm's logo, colors, and custom domain.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" style={{ padding: '5rem 2rem' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Simple, transparent pricing</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {/* Pro Plan */}
              <div className="card" style={{ width: '350px', textAlign: 'left', padding: '2.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Professional</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>For growing advisory firms.</p>
                <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>$49<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mo</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><CheckCircle2 size={18} color="#0f766e"/> Up to 500 Clients</li>
                  <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><CheckCircle2 size={18} color="#0f766e"/> 50GB Secure Storage</li>
                  <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><CheckCircle2 size={18} color="#0f766e"/> Standard Support</li>
                </ul>
                <button style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Start 14-Day Trial</button>
              </div>

              {/* Enterprise Plan */}
              <div className="card" style={{ width: '350px', textAlign: 'left', padding: '2.5rem', border: '2px solid #0f766e', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#0f766e', color: 'white', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>MOST POPULAR</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Enterprise</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>For large financial institutions.</p>
                <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>$199<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mo</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><CheckCircle2 size={18} color="#0f766e"/> Unlimited Clients</li>
                  <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><CheckCircle2 size={18} color="#0f766e"/> 1TB Secure Storage</li>
                  <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><CheckCircle2 size={18} color="#0f766e"/> Dedicated Account Manager</li>
                  <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><CheckCircle2 size={18} color="#0f766e"/> Custom White-labeling</li>
                </ul>
                <button style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0f766e' }}>Contact Sales</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ background: '#111827', color: '#9ca3af', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem', color: 'white', marginBottom: '1rem' }}>
          <Lock size={24} /> VaultShare
        </div>
        <p>© 2026 VaultShare Security Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
