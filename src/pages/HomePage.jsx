import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, Heart, Home, Bitcoin, ArrowRight, Zap, Shield, Star } from 'lucide-react';
import { CALCULATORS, NICHES, getPopularCalcs } from '../data/calculators';
import { AdBanner } from '../components/ui/AdSlot';

const NICHE_ICONS = { finance: TrendingUp, health: Heart, realestate: Home, crypto: Bitcoin };
const NICHE_COLORS = { finance: '#3b82f6', health: '#10b981', realestate: '#f59e0b', crypto: '#8b5cf6' };

export default function HomePage() {
  const popular = getPopularCalcs();

  return (
    <>
      <Helmet>
        <title>CalPro — Free Financial, Health & Crypto Calculators</title>
        <meta name="description" content="Professional calculators for trading, health, real estate, and crypto. Free, fast, and built for results." />
      </Helmet>

      {/* Hero */}
      <section style={{ padding: '6rem 0 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, fontSize: 12, color: '#60a5fa', fontWeight: 500, marginBottom: '1.5rem' }}>
            <Zap size={12} /> 21 professional calculators — free
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Calculate smarter.<br />
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Decide better.</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-2)', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Professional-grade calculators for trading, fitness, real estate, and crypto. No sign-up. No fluff. Just results.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/calculators" className="btn btn-primary btn-lg">Browse all calculators <ArrowRight size={16} /></Link>
            <Link to="/pricing" className="btn btn-ghost btn-lg">Go Pro — $9/mo</Link>
          </div>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-3)' }}>
            <Star size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
            Trusted by 10,000+ traders, investors, and fitness enthusiasts
          </p>
        </div>
      </section>

      {/* Ad banner */}
      <div className="container" style={{ marginBottom: '2rem' }}>
        <AdBanner slot="1234567890" />
      </div>

      {/* Niches */}
      <section className="section-sm">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: '3rem' }}>
            {NICHES.map(n => {
              const Icon = NICHE_ICONS[n.id];
              const calcCount = CALCULATORS.filter(c => c.niche === n.id).length;
              return (
                <Link key={n.id} to={`/calculators?niche=${n.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = n.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: n.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <Icon size={20} color={n.color} />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{n.label}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{calcCount} calculators</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Popular calculators */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.25rem' }}>Most popular</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {popular.map(calc => {
              const Icon = NICHE_ICONS[calc.niche];
              const color = NICHE_COLORS[calc.niche];
              return (
                <Link key={calc.id} to={`/calculators/${calc.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card card-sm" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, transition: 'border-color 0.15s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color={color} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', marginBottom: 2 }}>{calc.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.4 }}>{calc.description}</p>
                    </div>
                    <ArrowRight size={14} color="var(--text-3)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'var(--bg-1)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: 12 }}>Why CalPro?</h2>
            <p style={{ color: 'var(--text-2)', fontSize: '1rem' }}>Professional tools that actually work — no login, no limits on free tier.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { icon: Zap, title: 'Instant results', desc: 'Every calculator updates in real time as you type. No submit button needed.' },
              { icon: Shield, title: 'Privacy first', desc: 'No data is sent to any server. Everything runs in your browser.' },
              { icon: TrendingUp, title: 'Built for precision', desc: 'Professional formulas used by traders, analysts, and advisors.' },
              { icon: Star, title: 'Ad-free on Pro', desc: 'Upgrade to remove ads, unlock saved scenarios, and get priority support.' },
            ].map((f, i) => (
              <div key={i} className="card">
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <f.icon size={18} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '3rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: 12 }}>Ready to calculate smarter?</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Access all 21 calculators free. Upgrade for an ad-free experience and premium features.</p>
            <Link to="/calculators" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>Get started free <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
