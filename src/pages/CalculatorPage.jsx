import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, Heart, Home, Bitcoin, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { getCalcBySlug, getCalcsByNiche, getCalcBySlug as getById, NICHES, RELATED_CLUSTERS, CALCULATORS } from '../data/calculators';
import { CALC_COMPONENTS } from '../components/calculators/AllCalculators';
import { AdBanner, AdRect, AffiliateBox } from '../components/ui/AdSlot';
import { useStats } from '../lib/StatsContext';
import { CALC_SEO } from '../data/calcSEO';

const NICHE_ICONS  = { finance: TrendingUp, health: Heart, realestate: Home, crypto: Bitcoin };
const NICHE_COLORS = { finance: '#3b82f6', health: '#10b981', realestate: '#f59e0b', crypto: '#8b5cf6' };

// ── FAQ accordion ──────────────────────────────────────────────────────────
function FAQ({ faqs }) {
  const [open, setOpen] = React.useState(null);
  if (!faqs || !faqs.length) return null;
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>
        Frequently Asked Questions
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: open === i ? 'var(--bg-1)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.4 }}>{faq.q}</span>
              {open === i ? <ChevronUp size={16} color="var(--accent)" style={{ flexShrink: 0 }} /> : <ChevronDown size={16} color="var(--text-3)" style={{ flexShrink: 0 }} />}
            </button>
            {open === i && (
              <div style={{ padding: '0 16px 14px', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── How-to steps ───────────────────────────────────────────────────────────
function HowTo({ steps }) {
  if (!steps || !steps.length) return null;
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>
        How to Use This Calculator
      </h2>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map((step, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              {i + 1}
            </span>
            <span style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function CalculatorPage() {
  const { slug } = useParams();
  const { trackPageView, trackCalcUse } = useStats();
  const calc   = getCalcBySlug(slug);
  const seo    = CALC_SEO[slug] || {};

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
  const niche  = NICHES.find(n => n.id === calc.niche);
  const Icon   = NICHE_ICONS[calc.niche];
  const color  = NICHE_COLORS[calc.niche];
  // Use topic clusters for smarter internal linking, fall back to same niche
  const clusterIds = RELATED_CLUSTERS[calc.id] || [];
  const clusterCalcs = clusterIds.map(id => CALCULATORS.find(c => c.id === id)).filter(Boolean).slice(0, 6);
  const related = clusterCalcs.length >= 3 ? clusterCalcs : getCalcsByNiche(calc.niche).filter(c => c.id !== calc.id).slice(0, 4);

  // ── JSON-LD schemas ──────────────────────────────────────────────────────
  const faqSchema = seo.faqs && seo.faqs.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seo.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  const howToSchema = seo.howTo && seo.howTo.length ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: seo.title || `${calc.title} Calculator`,
    description: seo.intro || calc.description,
    step: seo.howTo.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: s,
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.calpro.store/' },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://www.calpro.store/calculators' },
      { '@type': 'ListItem', position: 3, name: calc.title, item: `https://www.calpro.store/calculators/${slug}` },
    ],
  };

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: seo.title || `${calc.title} Calculator`,
    url: `https://www.calpro.store/calculators/${slug}`,
    description: seo.metaDesc || calc.description,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const pageTitle    = seo.title    || `${calc.title} Calculator — CalPro`;
  const pageDesc     = seo.metaDesc || calc.description;
  const canonicalUrl = `https://www.calpro.store/calculators/${slug}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description"        content={pageDesc} />
        <link rel="canonical"           href={canonicalUrl} />
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url"         content={canonicalUrl} />
        <meta property="og:type"        content="website" />
        <meta name="twitter:card"       content="summary" />
        <meta name="twitter:title"      content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        {faqSchema      && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
        {howToSchema    && <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>}
        {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-3)', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/calculators" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Calculators</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-2)' }}>{calc.title}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }} className="calc-layout">

          {/* ── Main column ─────────────────────────────────────────────── */}
          <div>
            {/* Niche badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
              <div className="tag">{niche?.label}</div>
            </div>

            {/* H1 — keyword-rich */}
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: 8 }}>
              {calc.title} Calculator
            </h1>

            {/* Intro paragraph from SEO data */}
            <p style={{ color: 'var(--text-2)', marginBottom: '1.5rem', fontSize: '0.97rem', lineHeight: 1.7 }}>
              {seo.intro || calc.description}
            </p>

            {/* Calculator widget */}
            <div className="card">
              {CalcComponent ? <CalcComponent /> : <p style={{ color: 'var(--text-3)' }}>Calculator loading...</p>}
            </div>

            {/* Ad below calculator */}
            <div style={{ marginTop: '1.5rem' }}>
              <AdBanner slot="9876543210" />
            </div>

            {/* How-to steps */}
            <HowTo steps={seo.howTo} />

            {/* FAQ accordion */}
            <FAQ faqs={seo.faqs} />

            {/* Related calculators — topic-clustered internal links */}
            {related.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-1)' }}>
                  Related Calculators You Might Need
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {related.map(r => (
                    <Link key={r.id} to={`/calculators/${r.slug}`} style={{ textDecoration: 'none' }}>
                      <div className="card card-sm" style={{ transition: 'border-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{r.title}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4, lineHeight: 1.5 }}>{r.description.slice(0, 65)}…</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AdRect slot="1122334455" />
            <AffiliateBox affiliates={calc.affiliates} />
            <div className="card card-sm" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))', borderColor: 'rgba(59,130,246,0.2)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Go Pro — $9/month</p>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 12 }}>Remove ads, save scenarios, unlock premium features.</p>
              <Link to="/pricing" className="btn btn-primary btn-sm" style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}>Upgrade now</Link>
            </div>

            {/* Quick links to other niches */}
            <div className="card card-sm">
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>All Categories</p>
              {[
                { id: 'finance', label: 'Trading & Finance', color: '#3b82f6' },
                { id: 'health', label: 'Health & Fitness', color: '#10b981' },
                { id: 'realestate', label: 'Real Estate', color: '#f59e0b' },
                { id: 'crypto', label: 'Crypto', color: '#8b5cf6' },
              ].map(n => (
                <Link key={n.id} to={`/calculators?niche=${n.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: calc.niche === n.id ? n.color : 'var(--text-2)', fontWeight: calc.niche === n.id ? 600 : 400, fontSize: 13 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: n.color, flexShrink: 0 }} />
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .calc-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
