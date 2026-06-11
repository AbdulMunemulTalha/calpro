import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calculator, Shield, Mail, MapPin } from 'lucide-react';

// ─── About ───────────────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <>
      <Helmet><title>About — CalPro</title></Helmet>
      <div className="container-sm" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700 }}>About CalPro</h1>
            <p style={{ fontSize: 14, color: 'var(--text-3)' }}>Built for people who think in numbers</p>
          </div>
        </div>
        <div style={{ lineHeight: 1.8, color: 'var(--text-2)' }}>
          <p style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>
            CalPro was built out of frustration with financial calculators that are slow, ad-heavy, and hard to use on mobile. We wanted one place with professional-grade tools that work instantly, look great, and respect your privacy.
          </p>
          <p style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>
            All 21 calculators run entirely in your browser. We don't collect your inputs, we don't sell your data, and we don't require a sign-up to use any tool.
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-1)', margin: '2rem 0 0.75rem' }}>Our mission</h2>
          <p style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>
            Democratize financial intelligence. A position sizing calculator or mortgage amortization tool used to require expensive software or a Bloomberg terminal. We think everyone deserves access to the same tools.
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-1)', margin: '2rem 0 0.75rem' }}>The calculators</h2>
          <p style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>
            We cover four core niches: <strong style={{ color: 'var(--text-1)' }}>Trading & Finance</strong>, <strong style={{ color: 'var(--text-1)' }}>Health & Fitness</strong>, <strong style={{ color: 'var(--text-1)' }}>Real Estate</strong>, and <strong style={{ color: 'var(--text-1)' }}>Crypto</strong>. Each calculator uses industry-standard formulas and is designed for both beginners and professionals.
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-1)', margin: '2rem 0 0.75rem' }}>Disclaimer</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-3)', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem' }}>
            CalPro calculators are for educational and informational purposes only. They do not constitute financial, investment, medical, or legal advice. Always consult a qualified professional before making financial decisions.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/contact" className="btn btn-primary">Get in touch</Link>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Privacy Policy ───────────────────────────────────────────────────────────
export function PrivacyPage() {
  const sections = [
    { title: 'Information we collect', content: 'CalPro does not collect, store, or transmit any personal information by default. All calculator inputs and results remain entirely in your browser\'s memory and are never sent to our servers. We do not require account creation to use any calculator.\n\nIf you create a Pro account, we collect your email address and payment information (processed securely by Stripe). We store only the minimum data necessary to provide the service.' },
    { title: 'Cookies and analytics', content: 'We use privacy-respecting analytics (aggregate page view counts only) to understand which calculators are most useful. We do not use tracking cookies or cross-site identifiers. If you have a Pro account, we use a session cookie to keep you logged in. You can disable cookies in your browser settings without affecting calculator functionality.' },
    { title: 'Advertising', content: 'Free users see Google AdSense advertisements. Google may use cookies to show personalized ads based on your browsing history. You can opt out of personalized ads at Google\'s ad settings page (adssettings.google.com). Pro subscribers see no advertisements.' },
    { title: 'Affiliate links', content: 'Some calculator pages include affiliate links to brokers, financial tools, and fitness products. If you click these links and make a purchase, CalPro may earn a commission at no additional cost to you. We only link to products we believe are genuinely useful. Affiliate relationships do not influence our calculator results or editorial content.' },
    { title: 'Data security', content: 'Since we do not store your calculator inputs, there is no sensitive financial data on our servers to be breached. Pro account emails are stored with industry-standard encryption. All CalPro pages are served over HTTPS.' },
    { title: 'Third-party services', content: 'We use the following third-party services: Google AdSense (advertising for free users), Stripe (payment processing for Pro), Google Analytics (aggregate traffic data). Each has its own privacy policy governing their data practices.' },
    { title: 'Children\'s privacy', content: 'CalPro is not directed at children under 13. We do not knowingly collect information from children under 13. If you believe we have inadvertently collected such information, contact us at privacy@calpro.com.' },
    { title: 'Changes to this policy', content: 'We may update this privacy policy periodically. We will notify Pro subscribers of material changes via email. Continued use of CalPro after changes constitutes acceptance of the updated policy.' },
    { title: 'Contact', content: 'For privacy questions or requests, contact us at privacy@calpro.com. For California residents: you have the right to request disclosure of personal information we\'ve collected and to request deletion of that information.' },
  ];

  return (
    <>
      <Helmet><title>Privacy Policy — CalPro</title></Helmet>
      <div className="container-sm" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.5rem' }}>
          <Shield size={20} color="var(--accent)" />
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Last updated: January 1, 2025</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-2)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          CalPro is built with your privacy in mind. Here's exactly what we collect and why.
        </p>
        <div className="alert alert-success" style={{ marginBottom: '2rem', fontSize: 14 }}>
          ✓ Your calculator inputs never leave your browser. We don't store them.
        </div>
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: i < sections.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: 10 }}>{s.title}</h2>
            {s.content.split('\n\n').map((p, j) => (
              <p key={j} style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 8 }}>{p}</p>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Terms of Use ─────────────────────────────────────────────────────────────
export function TermsPage() {
  const sections = [
    { title: 'Acceptance of terms', content: 'By using CalPro (calpro.com), you agree to these Terms of Use. If you do not agree, do not use the service. We may update these terms at any time; continued use constitutes acceptance.' },
    { title: 'Description of service', content: 'CalPro provides free and paid online calculators for educational and informational purposes in the areas of personal finance, trading, health, real estate, and cryptocurrency.' },
    { title: 'Not financial or medical advice', content: 'IMPORTANT: CalPro calculators are educational tools only. Nothing on CalPro constitutes financial advice, investment advice, tax advice, medical advice, or any other form of professional advice. Always consult a licensed professional before making financial, medical, or investment decisions. Past performance does not guarantee future results. All investments carry risk including total loss of principal.' },
    { title: 'Accuracy disclaimer', content: 'We make every effort to ensure our calculators use accurate formulas. However, we make no warranty that results are accurate, complete, or suitable for any particular purpose. You use CalPro at your own risk.' },
    { title: 'Intellectual property', content: 'All CalPro content, code, and design are owned by CalPro and protected by copyright law. You may not copy, modify, or redistribute our calculators without written permission. You may share links to our calculators freely.' },
    { title: 'Prohibited uses', content: 'You may not: use CalPro for any illegal purpose; attempt to access our systems without authorization; scrape or automate access to our calculators without permission; use our affiliate links fraudulently; or resell CalPro services.' },
    { title: 'Limitation of liability', content: 'To the fullest extent permitted by law, CalPro shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including financial losses, arising from your use of or reliance on CalPro calculators.' },
    { title: 'Governing law', content: 'These terms are governed by the laws of the United States. Any disputes shall be resolved in the applicable courts.' },
  ];

  return (
    <>
      <Helmet><title>Terms of Use — CalPro</title></Helmet>
      <div className="container-sm" style={{ padding: '3rem 1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Terms of Use</h1>
        <p style={{ color: 'var(--text-3)', marginBottom: '2rem', fontSize: '0.9rem' }}>Last updated: January 1, 2025</p>
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: i < sections.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: 10 }}>{s.title}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.75 }}>{s.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const s = n => e => setForm(p => ({ ...p, [n]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Helmet><title>Contact — CalPro</title></Helmet>
      <div className="container-sm" style={{ padding: '3rem 1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>Get in touch</h1>
        <p style={{ color: 'var(--text-2)', marginBottom: '2.5rem' }}>Questions, bugs, business inquiries, or just want to say hi — we'd love to hear from you.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            {sent ? (
              <div className="alert alert-success" style={{ fontSize: 14 }}>
                ✓ Message sent! We'll get back to you within 24 hours.
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Name</label>
                  <input className="input" placeholder="Your name" required onChange={s('name')} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Email</label>
                  <input className="input" type="email" placeholder="you@example.com" required onChange={s('email')} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Subject</label>
                  <select className="input" onChange={s('subject')}>
                    <option value="">Select a topic...</option>
                    <option value="bug">Bug report</option>
                    <option value="feature">Feature request</option>
                    <option value="billing">Billing question</option>
                    <option value="business">Business inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>Message</label>
                  <textarea className="input" rows={5} placeholder="Tell us what's on your mind..." required onChange={s('message')} />
                </div>
                <button type="submit" className="btn btn-primary">Send message</button>
              </form>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: Mail, title: 'Email', value: 'hello@calpro.com', sub: 'Response within 24 hours' },
              { icon: Shield, title: 'Privacy', value: 'privacy@calpro.com', sub: 'Data & privacy questions' },
            ].map(c => (
              <div key={c.title} className="card card-sm" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <c.icon size={16} color="var(--accent)" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{c.title}</p>
                  <p style={{ fontSize: 13, color: 'var(--accent)' }}>{c.value}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
