import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, Heart, Home, Bitcoin, Search, ArrowRight } from 'lucide-react';
import { CALCULATORS, NICHES } from '../data/calculators';
import { useStats } from '../lib/StatsContext';

const NICHE_ICONS = { finance: TrendingUp, health: Heart, realestate: Home, crypto: Bitcoin };
const NICHE_COLORS = { finance: '#3b82f6', health: '#10b981', realestate: '#f59e0b', crypto: '#8b5cf6' };

export default function CalculatorsListPage() {
  const [params] = useSearchParams();
  const [activeNiche, setActiveNiche] = useState(params.get('niche') || 'all');
  const [search, setSearch] = useState('');
  const { trackPageView } = useStats();

  React.useEffect(() => { trackPageView('/calculators'); }, []);

  const filtered = CALCULATORS.filter(c => {
    const matchNiche = activeNiche === 'all' || c.niche === activeNiche;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.includes(search.toLowerCase()));
    return matchNiche && matchSearch;
  });

  return (
    <>
      <Helmet>
        <title>All Calculators — CalPro</title>
        <meta name="description" content="Browse all 21 professional calculators for trading, health, real estate, and crypto." />
      </Helmet>

      <div style={{ background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '2.5rem 0 1.5rem' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>All calculators</h1>
          <p style={{ color: 'var(--text-2)', marginBottom: '1.5rem' }}>{CALCULATORS.length} professional tools, free to use.</p>
          <div style={{ position: 'relative', maxWidth: 380 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input className="input" style={{ paddingLeft: 36 }} placeholder="Search calculators..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Niche filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button onClick={() => setActiveNiche('all')} className="btn btn-sm" style={{ background: activeNiche === 'all' ? 'var(--accent)' : 'var(--bg-2)', color: activeNiche === 'all' ? '#fff' : 'var(--text-2)', border: '1px solid', borderColor: activeNiche === 'all' ? 'var(--accent)' : 'var(--border)' }}>
            All ({CALCULATORS.length})
          </button>
          {NICHES.map(n => {
            const Icon = NICHE_ICONS[n.id];
            const count = CALCULATORS.filter(c => c.niche === n.id).length;
            const active = activeNiche === n.id;
            return (
              <button key={n.id} onClick={() => setActiveNiche(n.id)} className="btn btn-sm" style={{ background: active ? n.color + '22' : 'var(--bg-2)', color: active ? n.color : 'var(--text-2)', border: '1px solid', borderColor: active ? n.color : 'var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={13} /> {n.label} ({count})
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-3)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No calculators found</p>
            <button onClick={() => { setSearch(''); setActiveNiche('all'); }} className="btn btn-ghost btn-sm">Clear filters</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {filtered.map(calc => {
            const Icon = NICHE_ICONS[calc.niche];
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
                    {calc.popular && <span className="badge badge-blue" style={{ fontSize: 10 }}>Popular</span>}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: 'var(--text-1)' }}>{calc.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, flex: 1 }}>{calc.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
                    {calc.tags.slice(0, 3).map(t => <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <span style={{ fontSize: 13, color: color, fontWeight: 500 }}>Open calculator →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
