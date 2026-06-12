import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, Heart, Home, Bitcoin, Search, ArrowRight, Flame } from 'lucide-react';
import { CALCULATORS, NICHES } from '../data/calculators';
import { useStats } from '../lib/StatsContext';

const NICHE_ICONS  = { finance: TrendingUp, health: Heart, realestate: Home, crypto: Bitcoin };
const NICHE_COLORS = { finance: '#3b82f6', health: '#10b981', realestate: '#f59e0b', crypto: '#8b5cf6' };

// Long-tail keyword targets for each niche
const NICHE_DESCRIPTIONS = {
  all: {
    title: 'All Free Online Calculators — CalPro',
    desc: '44 free professional calculators for trading, health, real estate and crypto. Position size, BMI, mortgage, pip value, compound interest and more.',
    h1: 'All Free Calculators',
    body: '44 professional tools across finance, health, real estate and crypto. All free, all instant.',
  },
  finance: {
    title: 'Trading & Finance Calculators — Free Online Tools | CalPro',
    desc: 'Free trading calculators: position size, pip value, risk/reward ratio, compound interest, profit/loss, margin and more. Professional tools for forex, stock and crypto traders.',
    h1: 'Trading & Finance Calculators',
    body: 'Professional trading tools used by forex, stock and crypto traders. Calculate position sizes, risk/reward ratios, pip values, compound interest and more — all free.',
  },
  health: {
    title: 'Health & Fitness Calculators — Free Online Tools | CalPro',
    desc: 'Free health calculators: BMI, TDEE, macro calculator, calorie deficit, one rep max, running pace, water intake, ideal weight and protein intake. All free.',
    h1: 'Health & Fitness Calculators',
    body: 'Science-based nutrition and fitness tools. Calculate your BMI, daily calories, macros, hydration needs, one-rep max and ideal weight — all free.',
  },
  realestate: {
    title: 'Real Estate Calculators — Free Online Tools | CalPro',
    desc: 'Free real estate calculators: mortgage payment, rent vs buy, rental ROI, home affordability, refinance, down payment savings, stamp duty and amortization schedule.',
    h1: 'Real Estate Calculators',
    body: 'Complete tools for home buyers and property investors. Calculate mortgage payments, rental yields, affordability, refinance savings and more.',
  },
  crypto: {
    title: 'Crypto Calculators — Free Online Tools | CalPro',
    desc: 'Free crypto calculators: profit/loss, DCA, tax, liquidation price, position size, staking rewards, BTC savings plan, ATH return and funding rate calculators.',
    h1: 'Crypto Calculators',
    body: 'Essential tools for cryptocurrency traders and investors. Calculate crypto P&L, DCA returns, tax liability, liquidation prices and staking rewards.',
  },
};

const LIST_SCHEMA = (niche, count) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: NICHE_DESCRIPTIONS[niche]?.h1 || 'All Calculators',
  description: NICHE_DESCRIPTIONS[niche]?.desc,
  url: `https://www.calpro.store/calculators${niche !== 'all' ? `?niche=${niche}` : ''}`,
  numberOfItems: count,
});

export default function CalculatorsListPage() {
  const [params] = useSearchParams();
  const [activeNiche, setActiveNiche] = useState(params.get('niche') || 'all');
  const [search, setSearch] = useState('');
  const { trackPageView } = useStats();

  React.useEffect(() => { trackPageView('/calculators'); }, []);

  const filtered = CALCULATORS.filter(c => {
    const matchNiche = activeNiche === 'all' || c.niche === activeNiche;
    const q = search.toLowerCase();
    const matchSearch = !search || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.tags.some(t => t.includes(q));
    return matchNiche && matchSearch;
  });

  const nicheInfo = NICHE_DESCRIPTIONS[activeNiche] || NICHE_DESCRIPTIONS.all;
  const canonicalUrl = `https://www.calpro.store/calculators${activeNiche !== 'all' ? `?niche=${activeNiche}` : ''}`;

  return (
    <>
      <Helmet>
        <title>{nicheInfo.title}</title>
        <meta name="description" content={nicheInfo.desc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title"       content={nicheInfo.title} />
        <meta property="og:description" content={nicheInfo.desc} />
        <meta property="og:url"         content={canonicalUrl} />
        <meta property="og:type"        content="website" />
        <script type="application/ld+json">{JSON.stringify(LIST_SCHEMA(activeNiche, filtered.length))}</script>
      </Helmet>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div style={{ background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '2.5rem 0 1.5rem' }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>
            <Link to="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 6px' }}>/</span>
            <span style={{ color: 'var(--text-2)' }}>Calculators</span>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: 6 }}>
            {nicheInfo.h1}
          </h1>
          <p style={{ color: 'var(--text-2)', marginBottom: '1.5rem', fontSize: '0.97rem' }}>
            {nicheInfo.body}
          </p>
          <div style={{ position: 'relative', maxWidth: 380 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
            <input className="input" style={{ paddingLeft: 36 }} placeholder="Search calculators..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* ── Niche filter tabs ──────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button onClick={() => setActiveNiche('all')} className="btn btn-sm"
            style={{ background: activeNiche === 'all' ? 'var(--accent)' : 'var(--bg-2)', color: activeNiche === 'all' ? '#fff' : 'var(--text-2)', border: '1px solid', borderColor: activeNiche === 'all' ? 'var(--accent)' : 'var(--border)' }}>
            All ({CALCULATORS.length})
          </button>
          {NICHES.map(n => {
            const Icon  = NICHE_ICONS[n.id];
            const count = CALCULATORS.filter(c => c.niche === n.id).length;
            const active = activeNiche === n.id;
            return (
              <button key={n.id} onClick={() => setActiveNiche(n.id)} className="btn btn-sm"
                style={{ background: active ? n.color + '22' : 'var(--bg-2)', color: active ? n.color : 'var(--text-2)', border: '1px solid', borderColor: active ? n.color : 'var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={13} /> {n.label} ({count})
              </button>
            );
          })}
        </div>

        {/* ── Results count ──────────────────────────────────────────── */}
        {search && (
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </p>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-3)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No calculators found for "{search}"</p>
            <button onClick={() => { setSearch(''); setActiveNiche('all'); }} className="btn btn-ghost btn-sm">Clear filters</button>
          </div>
        )}

        {/* ── Calculator grid ────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {filtered.map(calc => {
            const Icon  = NICHE_ICONS[calc.niche];
            const color = NICHE_COLORS[calc.niche];
            return (
              <Link key={calc.id} to={`/calculators/${calc.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'border-color 0.15s, transform 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color={color} />
                    </div>
                    {calc.popular && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 6, padding: '2px 7px', letterSpacing: '0.04em' }}>
                        <Flame size={9} /> HOT
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: 'var(--text-1)' }}>{calc.title}</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, flex: 1 }}>{calc.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
                    {calc.tags.slice(0, 3).map(t => <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <span style={{ fontSize: 13, color: color, fontWeight: 600 }}>Open calculator →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── SEO content block ──────────────────────────────────────── */}
        {!search && activeNiche === 'all' && (
          <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 14 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              About CalPro's Free Calculators
            </h2>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.8, fontSize: '0.94rem', marginBottom: '0.75rem' }}>
              CalPro provides 44 free professional calculators designed for traders, investors, fitness enthusiasts and property buyers. Every calculator runs entirely in your browser — no account required, no data collected.
            </p>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.8, fontSize: '0.94rem', marginBottom: '0.75rem' }}>
              Our <Link to="/calculators?niche=finance" style={{ color: 'var(--accent)' }}>finance calculators</Link> are built for professional-grade risk management and investment analysis. Our <Link to="/calculators?niche=health" style={{ color: 'var(--accent)' }}>health calculators</Link> use evidence-based formulas like Mifflin-St Jeor for TDEE and the Navy Method for body fat. Our <Link to="/calculators?niche=realestate" style={{ color: 'var(--accent)' }}>real estate tools</Link> handle everything from mortgage amortization to rental yield analysis. And our <Link to="/calculators?niche=crypto" style={{ color: 'var(--accent)' }}>crypto calculators</Link> cover every major decision in digital asset trading and investing.
            </p>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.8, fontSize: '0.94rem' }}>
              All tools are free forever on the basic plan. <Link to="/pricing" style={{ color: 'var(--accent)' }}>Upgrade to Pro</Link> for an ad-free experience and saved calculation history.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
