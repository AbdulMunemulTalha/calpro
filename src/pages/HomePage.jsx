import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, Heart, Home, Bitcoin, ArrowRight, Zap, Shield, Star, CheckCircle } from 'lucide-react';
import { CALCULATORS, NICHES, getPopularCalcs } from '../data/calculators';
import { AdBanner } from '../components/ui/AdSlot';

const NICHE_ICONS  = { finance: TrendingUp, health: Heart, realestate: Home, crypto: Bitcoin };
const NICHE_COLORS = { finance: '#3b82f6', health: '#10b981', realestate: '#f59e0b', crypto: '#8b5cf6' };

// Internal link clusters — related calculators shown on homepage
const NICHE_SPOTLIGHTS = [
  {
    niche: 'finance',
    color: '#3b82f6',
    icon: TrendingUp,
    title: 'Trading & Finance Calculators',
    desc: 'Professional tools for position sizing, risk management, and investment analysis.',
    calcs: ['position-size','pip-value','risk-reward','compound-interest','profit-loss','drawdown-recovery'],
  },
  {
    niche: 'health',
    color: '#10b981',
    icon: Heart,
    title: 'Health & Fitness Calculators',
    desc: 'Science-based tools for nutrition, training, and body composition.',
    calcs: ['bmi-body-fat','macro-calorie','tdee','calorie-deficit','one-rep-max','protein-intake'],
  },
  {
    niche: 'realestate',
    color: '#f59e0b',
    icon: Home,
    title: 'Real Estate Calculators',
    desc: 'Complete tools for buying, investing and financing property decisions.',
    calcs: ['mortgage','rent-vs-buy','rental-roi','affordability','house-flip','amortization'],
  },
  {
    niche: 'crypto',
    color: '#8b5cf6',
    icon: Bitcoin,
    title: 'Crypto Calculators',
    desc: 'Essential tools for crypto trading, investing, taxes and staking.',
    calcs: ['crypto-profit','crypto-dca','liquidation-price','crypto-tax','btc-savings-plan','staking-rewards'],
  },
];

const SITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CalPro',
  url: 'https://www.calpro.store',
  description: 'Free professional calculators for trading, health, real estate and crypto.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.calpro.store/calculators?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CalPro',
  url: 'https://www.calpro.store',
  logo: 'https://www.calpro.store/logo192.png',
  sameAs: [],
};

export default function HomePage() {
  const popular = getPopularCalcs();

  return (
    <>
      <Helmet>
        <title>CalPro — Free Financial, Health, Real Estate & Crypto Calculators</title>
        <meta name="description" content="44 free professional calculators for trading, health, real estate and crypto. Position size, BMI, mortgage, crypto P&L and more. No sign-up required." />
        <link rel="canonical" href="https://www.calpro.store/" />
        <meta property="og:title"       content="CalPro — Free Financial, Health & Crypto Calculators" />
        <meta property="og:description" content="44 free professional calculators for traders, investors, fitness enthusiasts and property buyers. Instant results, no sign-up." />
        <meta property="og:url"         content="https://www.calpro.store/" />
        <meta property="og:type"        content="website" />
        <meta name="twitter:card"       content="summary" />
        <meta name="twitter:title"      content="CalPro — 44 Free Professional Calculators" />
        <meta name="twitter:description" content="Trading, health, real estate and crypto calculators. Free, instant, no sign-up." />
        <script type="application/ld+json">{JSON.stringify(SITE_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(ORG_SCHEMA)}</script>
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 0 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, fontSize: 12, color: '#60a5fa', fontWeight: 500, marginBottom: '1.5rem' }}>
            <Zap size={12} /> 44 professional calculators — 100% free
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Calculate smarter.<br />
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Decide better.</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-2)', maxWidth: 580, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Professional-grade calculators for <strong style={{color:'var(--text-1)'}}>trading</strong>, <strong style={{color:'var(--text-1)'}}>fitness</strong>, <strong style={{color:'var(--text-1)'}}>real estate</strong>, and <strong style={{color:'var(--text-1)'}}>crypto</strong>. No sign-up. No fluff. Just results.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/calculators" className="btn btn-primary btn-lg">Browse all 44 calculators <ArrowRight size={16} /></Link>
            <Link to="/pricing"     className="btn btn-ghost btn-lg">Go Pro — $9/mo</Link>
          </div>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-3)' }}>
            <Star size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
            Trusted by traders, investors, and fitness enthusiasts worldwide
          </p>
        </div>
      </section>

      {/* ── Ad ───────────────────────────────────────────────────────── */}
      <div className="container" style={{ marginBottom: '2rem' }}>
        <AdBanner slot="1234567890" />
      </div>

      {/* ── Category cards ───────────────────────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: '3rem' }}>
            {NICHES.map(n => {
              const Icon = NICHE_ICONS[n.id];
              const count = CALCULATORS.filter(c => c.niche === n.id).length;
              return (
                <Link key={n.id} to={`/calculators?niche=${n.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = n.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: n.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <Icon size={20} color={n.color} />
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 4, color: 'var(--text-1)' }}>{n.label}</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{count} free calculators</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── Popular calculators ─────────────────────────────────── */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-1)' }}>
            Most Popular Calculators
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: '3rem' }}>
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
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 2 }}>{calc.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.4 }}>{calc.description}</p>
                    </div>
                    <ArrowRight size={14} color="var(--text-3)" style={{ flexShrink: 0, marginTop: 2 }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Niche spotlights with internal links ─────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-1)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: 12 }}>
              All Calculator Categories
            </h2>
            <p style={{ color: 'var(--text-2)', fontSize: '1rem', maxWidth: 520, margin: '0 auto' }}>
              44 professional tools across four categories — all free, all instant.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {NICHE_SPOTLIGHTS.map(spot => {
              const Icon = spot.icon;
              const calcs = CALCULATORS.filter(c => spot.calcs.includes(c.id));
              return (
                <div key={spot.niche} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.75rem', borderLeft: `4px solid ${spot.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: spot.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} color={spot.color} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 2 }}>{spot.title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--text-2)' }}>{spot.desc}</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, marginTop: 14 }}>
                    {calcs.map(c => (
                      <Link key={c.id} to={`/calculators/${c.slug}`}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 8, textDecoration: 'none', fontSize: 13, color: 'var(--text-2)', transition: 'border-color 0.15s, color 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = spot.color; e.currentTarget.style.color = 'var(--text-1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: spot.color, flexShrink: 0 }} />
                        {c.title}
                        <ArrowRight size={11} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                      </Link>
                    ))}
                  </div>
                  <Link to={`/calculators?niche=${spot.niche}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 13, color: spot.color, fontWeight: 600, textDecoration: 'none' }}>
                    View all {CALCULATORS.filter(c => c.niche === spot.niche).length} {spot.title.split(' ')[0]} calculators <ArrowRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why CalPro ───────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: 12 }}>Why Use CalPro?</h2>
            <p style={{ color: 'var(--text-2)', fontSize: '1rem' }}>Professional tools that actually work — no login, no limits on the free tier.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { icon: Zap,          title: 'Instant Results',    desc: 'Click Calculate and get your answer immediately. No loading spinners or waiting.' },
              { icon: Shield,       title: 'Privacy First',      desc: 'No data is sent to any server. Every calculation runs entirely in your browser.' },
              { icon: TrendingUp,   title: 'Professional Grade', desc: 'Industry-standard formulas used by traders, analysts and financial advisors.' },
              { icon: CheckCircle,  title: 'Visual Results',     desc: 'Charts, colour-coded metrics and plain-English insights so results are instantly clear.' },
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

      {/* ── SEO content block ────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-1)', padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
            Free Online Calculators for Every Financial Decision
          </h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.97rem' }}>
            CalPro offers 44 free professional calculators across four major categories. Our <Link to="/calculators?niche=finance" style={{ color: 'var(--accent)' }}>trading and finance calculators</Link> cover everything from <Link to="/calculators/position-size" style={{ color: 'var(--accent)' }}>position sizing</Link> and <Link to="/calculators/pip-value" style={{ color: 'var(--accent)' }}>pip value</Link> to <Link to="/calculators/compound-interest" style={{ color: 'var(--accent)' }}>compound interest</Link> and <Link to="/calculators/risk-reward" style={{ color: 'var(--accent)' }}>risk/reward ratio</Link>. Whether you trade forex, stocks or crypto, these tools give you the numbers you need before entering any trade.
          </p>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.97rem' }}>
            Our <Link to="/calculators?niche=health" style={{ color: 'var(--accent)' }}>health and fitness calculators</Link> include a <Link to="/calculators/bmi-body-fat" style={{ color: 'var(--accent)' }}>BMI and body fat calculator</Link>, <Link to="/calculators/tdee" style={{ color: 'var(--accent)' }}>TDEE calculator</Link>, <Link to="/calculators/macro-calorie" style={{ color: 'var(--accent)' }}>macro calculator</Link>, and <Link to="/calculators/calorie-deficit" style={{ color: 'var(--accent)' }}>calorie deficit calculator</Link> — everything you need to plan your nutrition and training with confidence.
          </p>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.97rem' }}>
            For property buyers and investors, our <Link to="/calculators?niche=realestate" style={{ color: 'var(--accent)' }}>real estate calculators</Link> include a <Link to="/calculators/mortgage" style={{ color: 'var(--accent)' }}>mortgage calculator</Link>, <Link to="/calculators/rent-vs-buy" style={{ color: 'var(--accent)' }}>rent vs buy calculator</Link>, <Link to="/calculators/affordability" style={{ color: 'var(--accent)' }}>home affordability calculator</Link>, and <Link to="/calculators/rental-roi" style={{ color: 'var(--accent)' }}>rental ROI calculator</Link>. And our <Link to="/calculators?niche=crypto" style={{ color: 'var(--accent)' }}>crypto calculators</Link> cover <Link to="/calculators/crypto-profit" style={{ color: 'var(--accent)' }}>P&L</Link>, <Link to="/calculators/crypto-dca" style={{ color: 'var(--accent)' }}>DCA</Link>, <Link to="/calculators/crypto-tax" style={{ color: 'var(--accent)' }}>tax</Link>, and <Link to="/calculators/liquidation-price" style={{ color: 'var(--accent)' }}>liquidation price</Link>.
          </p>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.8, fontSize: '0.97rem' }}>
            All calculations run entirely in your browser — no account required, no data collected, and no paywalls. Every calculator is free to use and produces instant, visual results designed to be understood by anyone.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', padding: '3rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: 12 }}>Ready to calculate smarter?</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Access all 44 calculators free. Upgrade for an ad-free experience and premium features.</p>
            <Link to="/calculators" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>Get started free <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
