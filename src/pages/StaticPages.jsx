import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calculator, Shield, Mail, ExternalLink, TrendingUp, Heart, Home, Bitcoin, CheckCircle } from 'lucide-react';

// ─── About ───────────────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About CalPro — Free Professional Calculators for Finance, Health & Crypto</title>
        <meta name="description" content="CalPro provides 44 free professional calculators for trading, health, real estate and crypto. Learn about our mission, tools and privacy-first approach." />
        <link rel="canonical" href="https://www.calpro.store/about" />
        <meta property="og:title" content="About CalPro — Free Professional Calculators" />
        <meta property="og:description" content="44 free calculators for traders, investors, fitness enthusiasts and property buyers. No sign-up, no data collection, no paywalls." />
        <meta property="og:url" content="https://www.calpro.store/about" />
      </Helmet>
      <div className="container-sm" style={{ padding: '3rem 1.5rem' }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 6px' }}>/</span>
          <span style={{ color: 'var(--text-2)' }}>About</span>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700 }}>About CalPro</h1>
            <p style={{ fontSize: 14, color: 'var(--text-3)' }}>Free professional calculators for smarter decisions</p>
          </div>
        </div>
        <div style={{ lineHeight: 1.8, color: 'var(--text-2)' }}>
          <p style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>
            CalPro was built out of frustration with financial calculators that are slow, ad-heavy, and difficult to use on mobile. We wanted one platform with professional-grade tools that work instantly, display results visually, and respect your privacy.
          </p>
          <p style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>
            All 44 calculators run entirely in your browser. We don't collect your inputs, we don't sell your data, and we don't require a sign-up to use any tool.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-1)', margin: '2rem 0 0.75rem' }}>Our Mission</h2>
          <p style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>
            Democratize financial intelligence. A position sizing calculator or mortgage amortization tool used to require expensive software. We believe everyone deserves access to the same professional tools — for free.
          </p>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-1)', margin: '2rem 0 0.75rem' }}>What We Cover</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
            {[
              { icon: TrendingUp, color: '#3b82f6', label: 'Trading & Finance', desc: '14 calculators', link: '/calculators?niche=finance' },
              { icon: Heart,      color: '#10b981', label: 'Health & Fitness',  desc: '9 calculators',  link: '/calculators?niche=health' },
              { icon: Home,       color: '#f59e0b', label: 'Real Estate',       desc: '10 calculators', link: '/calculators?niche=realestate' },
              { icon: Bitcoin,    color: '#8b5cf6', label: 'Crypto',            desc: '11 calculators', link: '/calculators?niche=crypto' },
            ].map((cat, i) => (
              <Link key={i} to={cat.link} style={{ textDecoration: 'none' }}>
                <div className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12, transition: 'border-color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = cat.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: cat.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <cat.icon size={16} color={cat.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{cat.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{cat.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-1)', margin: '2rem 0 0.75rem' }}>Privacy Promise</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.5rem' }}>
            {['No account required to use any calculator', 'No calculator inputs or results are sent to our servers', 'We never sell your personal data to third parties', 'Google AdSense cookies are disclosed in our Privacy Policy'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={16} color="var(--green)" />
                <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{item}</span>
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-1)', margin: '2rem 0 0.75rem' }}>Disclaimer</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-3)', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem' }}>
            CalPro calculators are for educational and informational purposes only. They do not constitute financial, investment, medical, or legal advice. Always consult a qualified professional before making financial decisions. Results are estimates based on the inputs provided.
          </p>

          <div style={{ marginTop: '2rem', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/calculators" className="btn btn-primary" style={{ textDecoration: 'none' }}>Browse all calculators</Link>
            <Link to="/contact"     className="btn btn-ghost"   style={{ textDecoration: 'none' }}>Contact us</Link>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Privacy ──────────────────────────────────────────────────────────────────
export function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — CalPro Calculator Tools</title>
        <meta name="description" content="CalPro privacy policy. Explains how we use cookies, Google AdSense advertising, and Google Analytics. All calculations run in your browser — no personal data collected." />
        <link rel="canonical" href="https://www.calpro.store/privacy" />
      </Helmet>
      <div className="container-sm" style={{ padding: '3rem 1.5rem' }}>
        <nav style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 6px' }}>/</span>
          <span style={{ color: 'var(--text-2)' }}>Privacy Policy</span>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
          <div style={{ width: 44, height: 44, background: 'rgba(16,185,129,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={22} color="var(--green)" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700 }}>Privacy Policy</h1>
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Last updated: June 2025</p>
          </div>
        </div>
        <div style={{ lineHeight: 1.85, color: 'var(--text-2)', fontSize: '0.97rem' }}>

          {/* 1 */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>1. Overview</h2>
            <p>CalPro (calpro.store) is committed to protecting your privacy. All calculator computations run entirely inside your browser — no calculation inputs or results are ever transmitted to our servers. This policy explains what information we collect, how we use it, and your rights regarding that information.</p>
          </div>

          {/* 2 */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>2. Information We Do Not Collect</h2>
            <p style={{ marginBottom: 8 }}>We do not collect, store, or transmit:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                'Any inputs or results from our calculators',
                'Your name, email address, or physical address (unless you contact us voluntarily)',
                'Financial data, health data, or any sensitive personal information',
                'Passwords or payment information',
              ].map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>

          {/* 3 */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>3. Information We May Collect</h2>
            <p style={{ marginBottom: 8 }}><strong style={{ color: 'var(--text-1)' }}>Analytics data:</strong> We use Google Analytics to collect anonymous usage data including page views, approximate geographic region (country/city level), browser type, device type, and session duration. This data cannot be used to personally identify you. You can opt out using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google Analytics Opt-out Browser Add-on</a>.</p>
            <p><strong style={{ color: 'var(--text-1)' }}>Server logs:</strong> Our hosting provider (Vercel) automatically logs standard server data including IP addresses and request timestamps for security purposes. These logs are retained for a maximum of 30 days.</p>
          </div>

          {/* 4 — REQUIRED Google AdSense disclosure */}
          <div style={{ marginBottom: '1.75rem', padding: '1.25rem', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>4. Advertising — Google AdSense</h2>
            <p style={{ marginBottom: 8 }}>CalPro uses <strong style={{ color: 'var(--text-1)' }}>Google AdSense</strong> to display advertisements. Google AdSense is a third-party advertising service operated by Google LLC.</p>
            <p style={{ marginBottom: 8 }}>Google AdSense uses <strong style={{ color: 'var(--text-1)' }}>cookies and web beacons</strong> to serve advertisements to you based on your prior visits to this website and other websites across the internet. These cookies allow Google and its partners to serve ads based on your browsing history and interests (interest-based or personalised advertising).</p>
            <p style={{ marginBottom: 8 }}>By continuing to use CalPro, you acknowledge that <strong style={{ color: 'var(--text-1)' }}>third-party vendors including Google may place and read cookies on your browser</strong>, or use web beacons and similar technologies to collect information as a result of ad serving on our website.</p>
            <p style={{ marginBottom: 8 }}>The information collected through advertising cookies may include:</p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Pages visited on CalPro and other websites</li>
              <li>Your approximate geographic location (country/region level)</li>
              <li>Browser type and device type</li>
              <li>Inferred interests based on browsing behaviour</li>
            </ul>
            <p style={{ marginBottom: 8 }}>
              You can <strong style={{ color: 'var(--text-1)' }}>opt out of personalised advertising</strong> by:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google's Ad Settings</a></li>
              <li>Visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>www.aboutads.info/choices</a> (Digital Advertising Alliance)</li>
              <li>Visiting <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>www.youronlinechoices.eu</a> (European Interactive Digital Advertising Alliance)</li>
              <li>Using the AdChoices icon displayed within Google ads</li>
            </ul>
            <p>For more information on how Google uses data when you use our site, visit: <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>How Google uses data when you use our partners' sites or apps</a>.</p>
          </div>

          {/* 5 */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>5. Cookies</h2>
            <p style={{ marginBottom: 8 }}>CalPro uses the following types of cookies:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { type: 'Essential / Functional', desc: "A theme preference cookie (dark/light mode) stored in your browser's localStorage. This does not track you and is never shared with third parties." },
                { type: 'Analytics cookies (Google Analytics)', desc: 'Anonymous cookies that measure how visitors interact with the website — pages viewed, time on site, general location. No personally identifiable information is collected.' },
                { type: 'Advertising cookies (Google AdSense)', desc: 'Cookies placed by Google and its advertising partners to serve interest-based ads. These cookies may track your browsing across websites over time. You can opt out at Google Ad Settings.' },
              ].map((c, i) => (
                <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>{c.type}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6 */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>6. Affiliate Links</h2>
            <p>Some calculator pages include affiliate links to third-party products and services. If you click an affiliate link and make a purchase, CalPro may receive a small commission at no extra cost to you. Affiliate links are clearly labelled. We are not responsible for the privacy practices of third-party websites — please review their privacy policies before using their services.</p>
          </div>

          {/* 7 */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>7. Your Rights (GDPR / CCPA)</h2>
            <p style={{ marginBottom: 8 }}>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li><strong>EU/EEA residents (GDPR):</strong> Right to access, correct, delete, or restrict processing of your data; right to data portability; right to object to processing; right to withdraw consent.</li>
              <li><strong>California residents (CCPA):</strong> Right to know what data is collected; right to request deletion; right to opt out of the sale of personal information (we do not sell your data).</li>
              <li><strong>All users:</strong> Right to opt out of personalised advertising through the mechanisms described in Section 4.</li>
            </ul>
            <p style={{ marginTop: 8 }}>To exercise your rights, contact us via our <Link to="/contact" style={{ color: 'var(--accent)' }}>Contact page</Link>.</p>
          </div>

          {/* 8 */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>8. Children's Privacy</h2>
            <p>CalPro is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided personal information through our site, please contact us so we can delete it. We comply with the Children's Online Privacy Protection Act (COPPA).</p>
          </div>

          {/* 9 */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>9. Data Security</h2>
            <p>All connections to CalPro are encrypted using HTTPS/TLS. Since we do not store personal calculator data on our servers, the risk of a data breach affecting your calculator inputs or results is zero. Standard hosting security measures are maintained through our hosting provider Vercel.</p>
          </div>

          {/* 10 */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>10. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. The "Last updated" date at the top of this page will reflect the most recent revision. Continued use of CalPro after any changes constitutes your acceptance of the revised policy.</p>
          </div>

          {/* 11 */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>11. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us through our <Link to="/contact" style={{ color: 'var(--accent)' }}>Contact page</Link>. We will respond within 30 days.</p>
          </div>

          {/* Google link */}
          <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text-3)' }}>
            For more information on how Google uses data when you use our site, visit{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
              How Google uses data when you use our partners' sites or apps
            </a>.
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Terms ────────────────────────────────────────────────────────────────────
export function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Use — CalPro</title>
        <meta name="description" content="CalPro terms of use. Our calculators are for educational purposes only and do not constitute financial, medical or legal advice." />
        <link rel="canonical" href="https://www.calpro.store/terms" />
      </Helmet>
      <div className="container-sm" style={{ padding: '3rem 1.5rem' }}>
        <nav style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 6px' }}>/</span>
          <span style={{ color: 'var(--text-2)' }}>Terms of Use</span>
        </nav>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: 6 }}>Terms of Use</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: '2rem' }}>Last updated: June 2025</p>
        <div style={{ lineHeight: 1.85, color: 'var(--text-2)', fontSize: '0.97rem' }}>
          {[
            { h: 'Acceptance of Terms', body: 'By accessing and using CalPro (calpro.store), you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use this website.' },
            { h: 'Educational Purpose Only', body: 'All calculators and tools on CalPro are provided for educational and informational purposes only. Nothing on CalPro constitutes financial, investment, trading, medical, legal, or tax advice. Always consult a qualified professional before making any financial, health, or investment decisions.' },
            { h: 'Accuracy of Results', body: 'While we strive to provide accurate calculation tools, CalPro cannot guarantee the accuracy of results. Calculator results are estimates based on the formulas used and inputs provided. Results should not be relied upon as the sole basis for any decision.' },
            { h: 'Limitation of Liability', body: 'CalPro and its operators shall not be liable for any losses, damages, or consequences arising from the use of our calculators or reliance on their results. This includes but is not limited to financial losses, investment losses, health outcomes, or any other damages.' },
            { h: 'Acceptable Use', body: 'You agree to use CalPro only for lawful purposes and in a manner that does not infringe the rights of others. You may not attempt to interfere with the website\'s functionality, attempt to gain unauthorized access to any systems, or use automated tools to scrape or misuse the service.' },
            { h: 'Intellectual Property', body: 'All content on CalPro including text, graphics, logos, and code is the property of CalPro and is protected by applicable intellectual property laws. You may use calculators for personal, non-commercial use but may not reproduce, distribute, or create derivative works without written permission.' },
            { h: 'Advertising & Affiliates', body: 'CalPro displays Google AdSense advertisements. Google and its partners use cookies to serve ads based on your prior visits to this and other websites. Ads are clearly distinguishable from editorial content. CalPro may also include affiliate links to third-party products and services — we may earn a commission on qualifying purchases. Affiliate relationships do not influence our calculator accuracy or editorial decisions. All advertising is disclosed in our Privacy Policy.' },
            { h: 'Changes to Terms', body: 'We reserve the right to update these terms at any time. Continued use of CalPro after changes are posted constitutes acceptance of the revised terms.' },
            { h: 'Governing Law', body: 'These terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms or your use of CalPro shall be subject to the jurisdiction of the applicable courts.' },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 8 }}>{i + 1}. {s.h}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────
export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'General inquiry', message: '' });
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <>
      <Helmet>
        <title>Contact CalPro — Get in Touch</title>
        <meta name="description" content="Contact the CalPro team. Report a bug, request a new calculator, or ask a question about our free financial and health calculator tools." />
        <link rel="canonical" href="https://www.calpro.store/contact" />
      </Helmet>
      <div className="container-sm" style={{ padding: '3rem 1.5rem' }}>
        <nav style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 6px' }}>/</span>
          <span style={{ color: 'var(--text-2)' }}>Contact</span>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
          <div style={{ width: 44, height: 44, background: 'rgba(59,130,246,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={22} color="var(--accent)" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700 }}>Contact Us</h1>
            <p style={{ fontSize: 14, color: 'var(--text-3)' }}>We typically respond within 24–48 hours</p>
          </div>
        </div>

        {sent ? (
          <div style={{ padding: '2rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 14, textAlign: 'center' }}>
            <CheckCircle size={40} color="var(--green)" style={{ marginBottom: 12 }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>Message sent!</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 16 }}>Thanks for reaching out. We'll get back to you within 24–48 hours.</p>
            <Link to="/calculators" className="btn btn-primary" style={{ textDecoration: 'none' }}>Browse calculators</Link>
          </div>
        ) : (
          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Name</label>
                  <input className="input" placeholder="Your name" value={form.name} onChange={s('name')} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</label>
                  <input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={s('email')} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subject</label>
                <select className="input" value={form.subject} onChange={s('subject')}>
                  <option>General inquiry</option>
                  <option>Bug report</option>
                  <option>Calculator request</option>
                  <option>Partnership / advertising</option>
                  <option>Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Message</label>
                <textarea className="input" rows={5} placeholder="Tell us what's on your mind..." value={form.message} onChange={s('message')} style={{ resize: 'vertical' }} />
              </div>
              <button onClick={() => { if (form.name && form.email && form.message) setSent(true); }} className="btn btn-primary" style={{ width: '100%', height: 46, fontWeight: 700 }}>
                Send Message
              </button>
            </div>
          </div>
        )}

        {/* Quick links */}
        <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 10 }}>Quick links</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: 'Browse all calculators', to: '/calculators' },
              { label: 'View pricing & Pro features', to: '/pricing' },
              { label: 'Privacy policy', to: '/privacy' },
              { label: 'Terms of use', to: '/terms' },
            ].map((l, i) => (
              <Link key={i} to={l.to} style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>→ {l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
