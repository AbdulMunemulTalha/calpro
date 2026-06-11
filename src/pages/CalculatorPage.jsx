import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, Heart, Home, Bitcoin, ArrowLeft, ExternalLink } from 'lucide-react';
import { getCalcBySlug, getCalcsByNiche, NICHES } from '../data/calculators';
import { CALC_COMPONENTS } from '../components/calculators/AllCalculators';
import { AdBanner, AdRect, AffiliateBox } from '../components/ui/AdSlot';
import { useStats } from '../lib/StatsContext';

const NICHE_ICONS = { finance: TrendingUp, health: Heart, realestate: Home, crypto: Bitcoin };
const NICHE_COLORS = { finance: '#3b82f6', health: '#10b981', realestate: '#f59e0b', crypto: '#8b5cf6' };

export default function CalculatorPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { trackPageView, trackCalcUse } = useStats();
  const calc = getCalcBySlug(slug);

  useEffect(() => {
    if (calc) { trackPageView('/calculators/' + slug); trackCalcUse(calc.id); }
  }, [slug]);

  if (!calc) return (
    <div className="container section" style={{ textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 12 }}>Calculator not found</h2>
      <Link to="/calculators" className="btn btn-primary">Browse all calculators</Link>
    </div>
  );

  const CalcComponent = CALC_COMPONENTS[calc.id];
  const niche = NICHES.find(n => n.id === calc.niche);
  const Icon = NICHE_ICONS[calc.niche];
  const color = NICHE_COLORS[calc.niche];
  const related = getCalcsByNiche(calc.niche).filter(c => c.id !== calc.id).slice(0, 4);

  return (
    <>
      <Helmet>
        <title>{calc.title} Calculator — CalPro</title>
        <meta name="description" content={calc.description} />
      </Helmet>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <Link to="/calculators" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-3)', marginBottom: '1.5rem', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> All calculators
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          {/* Main calculator */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div className="tag" style={{ marginBottom: 4 }}>{niche?.label}</div>
              </div>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: 8 }}>{calc.title} Calculator</h1>
            <p style={{ color: 'var(--text-2)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{calc.description}</p>

            <div className="card">
              {CalcComponent ? <CalcComponent /> : <p style={{ color: 'var(--text-3)' }}>Calculator loading...</p>}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <AdBanner slot="9876543210" />
            </div>

            {/* Related calculators */}
            {related.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-2)' }}>More {niche?.label} calculators</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {related.map(r => (
                    <Link key={r.id} to={`/calculators/${r.slug}`} style={{ textDecoration: 'none' }}>
                      <div className="card card-sm" style={{ transition: 'border-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{r.description.slice(0, 60)}...</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AdRect slot="1122334455" />
            <AffiliateBox affiliates={calc.affiliates} />
            <div className="card card-sm" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))', borderColor: 'rgba(59,130,246,0.2)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Go Pro — $9/month</p>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 12 }}>Remove ads, save scenarios, unlock premium features.</p>
              <Link to="/pricing" className="btn btn-primary btn-sm" style={{ width: '100%', textDecoration: 'none' }}>Upgrade now</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .calc-layout { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
