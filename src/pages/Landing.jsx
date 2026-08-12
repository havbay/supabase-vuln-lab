import { Link } from 'react-router-dom';
import {
  Lock, FileSignature, Building2, ArrowRight, ShieldCheck,
  Zap, Globe, CheckCircle2, FileText, Users, Star
} from 'lucide-react';

const FEATURES = [
  {
    icon: <ShieldCheck size={28} />,
    title: 'Bank-Level Encryption',
    desc: 'AES-256 encryption at rest and in transit. SOC2 Type II and HIPAA compliant infrastructure as standard.',
  },
  {
    icon: <FileSignature size={28} />,
    title: 'Branded Client Portal',
    desc: 'White-label the entire experience with your firm\'s logo, colors, and a custom subdomain in minutes.',
  },
  {
    icon: <Building2 size={28} />,
    title: 'Compliance Dashboard',
    desc: 'Compliance officers review, approve, and archive submitted documents from one centralized view.',
  },
  {
    icon: <Zap size={28} />,
    title: 'Instant Notifications',
    desc: 'Clients and officers are notified by email the moment a document is uploaded, reviewed, or rejected.',
  },
  {
    icon: <Globe size={28} />,
    title: 'Global CDN',
    desc: 'Multi-region storage ensures clients can upload and download files with sub-second latency worldwide.',
  },
  {
    icon: <FileText size={28} />,
    title: 'Audit Trail',
    desc: 'Every action — upload, view, delete — is logged with a timestamp and user ID for full auditability.',
  },
];

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Partner, Chen & Associates CPA', text: 'VaultShare replaced our clunky email workflow overnight. Our clients love it and so does our compliance team.' },
  { name: 'Marcus Williams', role: 'CTO, Apex Wealth Management', text: 'We evaluated 6 platforms. VaultShare was the only one that felt built for finance, not just repurposed for it.' },
];

const PLANS = [
  {
    name: 'Professional',
    price: '$49',
    desc: 'For growing advisory firms.',
    features: ['Up to 50 Clients', '50 GB Secure Storage', 'Custom Branding', 'Email Support'],
    cta: 'Start 14-Day Trial',
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: '$199',
    desc: 'For large financial institutions.',
    features: ['Unlimited Clients', '1 TB Secure Storage', 'Custom Domain + White-label', 'Dedicated Account Manager', 'Full Audit Trail & SLA'],
    cta: 'Contact Sales',
    highlight: true,
  },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Navbar ── */}
      <nav className="landing-nav">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--brand)' }}>
            <Lock size={22} strokeWidth={2.5} />
            VaultShare
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="#features" style={{ color: 'var(--text-2)', fontWeight: 500, fontSize: '0.9375rem' }}>Features</a>
            <a href="#pricing" style={{ color: 'var(--text-2)', fontWeight: 500, fontSize: '0.9375rem' }}>Pricing</a>
            <a href="#testimonials" style={{ color: 'var(--text-2)', fontWeight: 500, fontSize: '0.9375rem' }}>Testimonials</a>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/auth"><button className="secondary">Client Login</button></Link>
              <Link to="/auth"><button>Start Free Trial</button></Link>
            </div>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1 }}>

        {/* ── Hero ── */}
        <section style={{ background: 'linear-gradient(170deg, #ffffff 55%, var(--brand-muted) 100%)', padding: '6rem 1.5rem 5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto' }} className="fade-up">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 1rem', background: 'var(--brand-light)', color: 'var(--brand)', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '2rem', letterSpacing: '0.03em' }}>
              <ShieldCheck size={14} strokeWidth={3} /> Trusted by 500+ Financial Institutions
            </div>

            <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 800, lineHeight: 1.1, color: 'var(--text-1)', marginBottom: '1.5rem' }}>
              Enterprise-Grade Document Exchange <span style={{ color: 'var(--brand)' }}>Built for Finance</span>
            </h1>

            <p style={{ fontSize: '1.1875rem', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Securely collect W-2s, tax returns, and contracts from clients with a beautiful white-label portal — fully encrypted, fully auditable.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/auth">
                <button style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                  Open Your Vault <ArrowRight size={18} />
                </button>
              </Link>
              <button className="secondary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>Book a Demo</button>
            </div>

            {/* Social proof row */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem', color: 'var(--text-3)', fontSize: '0.875rem' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="var(--warning)" color="var(--warning)" />)}
              <span style={{ marginLeft: '0.5rem' }}>Rated <strong style={{ color: 'var(--text-1)' }}>4.9/5</strong> by 200+ compliance teams</span>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" style={{ padding: '5rem 1.5rem', background: 'var(--surface)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Everything compliance requires</h2>
              <p style={{ fontSize: '1.0625rem', color: 'var(--text-2)' }}>No more emailing tax returns. VaultShare gives every stakeholder the right tools.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {FEATURES.map(f => (
                <div key={f.title} style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--bg)', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius)', background: 'var(--brand-light)', color: 'var(--brand)', marginBottom: '1.25rem' }}>
                    {f.icon}
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="testimonials" style={{ padding: '5rem 1.5rem', background: 'var(--brand-muted)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '3rem' }}>Loved by compliance teams</h2>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {TESTIMONIALS.map(t => (
                <div key={t.name} className="card" style={{ maxWidth: '480px', textAlign: 'left', padding: '2rem' }}>
                  <div style={{ display: 'flex', marginBottom: '1rem' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="var(--warning)" color="var(--warning)" />)}
                  </div>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-1)', marginBottom: '1.25rem', fontStyle: 'italic' }}>"{t.text}"</p>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" style={{ padding: '5rem 1.5rem', background: 'var(--surface)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Simple, transparent pricing</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: '3.5rem' }}>No hidden fees. No per-seat charges. Cancel anytime.</p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {PLANS.map(plan => (
                <div key={plan.name} style={{
                  position: 'relative', width: '340px', textAlign: 'left', padding: '2.5rem',
                  background: plan.highlight ? 'var(--sidebar-bg)' : 'var(--surface)',
                  color: plan.highlight ? 'white' : 'var(--text-1)',
                  border: `2px solid ${plan.highlight ? 'var(--brand)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: plan.highlight ? 'var(--shadow-xl)' : 'var(--shadow)',
                }}>
                  {plan.highlight && (
                    <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--brand)', color: 'white', padding: '0.25rem 1.25rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em' }}>
                      MOST POPULAR
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: plan.highlight ? 'var(--brand-light)' : 'var(--text-3)', marginBottom: '0.25rem' }}>{plan.name}</div>
                  <div style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.5rem' }}>{plan.price}<span style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.6 }}>/mo</span></div>
                  <p style={{ color: plan.highlight ? 'rgba(255,255,255,0.6)' : 'var(--text-3)', marginBottom: '1.75rem', fontSize: '0.9375rem' }}>{plan.desc}</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', fontSize: '0.9375rem', color: plan.highlight ? 'rgba(255,255,255,0.85)' : 'var(--text-1)' }}>
                        <CheckCircle2 size={16} color={plan.highlight ? 'var(--brand-light)' : 'var(--brand)'} strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button style={{ width: '100%', padding: '0.875rem', background: plan.highlight ? 'var(--brand)' : 'var(--bg)', color: plan.highlight ? 'white' : 'var(--text-1)', border: plan.highlight ? 'none' : '1px solid var(--border)' }}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer style={{ background: 'var(--sidebar-bg)', color: 'var(--sidebar-text)', padding: '3rem 1.5rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.125rem', color: 'white', marginBottom: '0.75rem' }}>
              <Lock size={20} strokeWidth={2.5} /> VaultShare
            </div>
            <p style={{ fontSize: '0.875rem', maxWidth: '280px', color: 'rgba(255,255,255,0.45)' }}>
              Secure document exchange for CPAs, wealth managers, and legal teams worldwide.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, color: 'white', fontSize: '0.8125rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Product</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <a href="#features" style={{ color: 'rgba(255,255,255,0.5)' }}>Features</a>
                <a href="#pricing" style={{ color: 'rgba(255,255,255,0.5)' }}>Pricing</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }}>Security</a>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'white', fontSize: '0.8125rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Legal</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }}>Privacy Policy</a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }}>Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
        <div className="container" style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)' }}>
          © 2026 VaultShare Security Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
