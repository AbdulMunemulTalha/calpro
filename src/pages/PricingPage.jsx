import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, Zap, Star, Users } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    icon: Zap,
    color: '#94a3b8',
    desc: 'Everything you need to get started.',
    cta: 'Get started free',
    ctaLink: '/calculators',
    features: [
      'All 21 calculators',
      'Real-time calculations',
      'Mobile-friendly',
      'Basic results',
      'Ad-supported',
    ],
    notIncluded: ['Save scenarios', 'Ad-free experience', 'Export to PDF', 'Priority support', 'API access'],
  },
  {
    name: 'Pro',
    price: { monthly: 9, yearly: 7 },
    icon: Star,
    color: '#3b82f6',
    popular: true,
    desc: 'For serious traders, investors, and analysts.',
    cta: 'Start Pro free for 7 days',
    ctaLink: '#',
    features: [
      'Everything in Free',
      'Ad-free experience',
      'Save unlimited scenarios',
      'Export results to PDF',
      'Historical comparisons',
      'Email support',
      'Early access to new tools',
    ],
    notIncluded: ['API access', 'Team accounts'],
  },
  {
    name: 'Team',
    price: { monthly: 29, yearly: 23 },
    icon: Users,
    color: '#8b5cf6',
    desc: 'For teams, advisors, and power users.',
    cta: 'Contact us',
    ctaLink: '/contact',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared scenario library',
      'API access (1000 req/mo)',
      'White-label calculator embeds',
      'Priority support',
      'Custom branding',
    ],
    notIncluded: [],
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <Helmet>
        <title>Pricing — CalPro</title>
        <meta name="description" content="Free forever, or upgrade to Pro for an ad-free experience and premium features. Starting at $9/month." />
      </Helmet>

      <section style={{ padding: '4rem 0 2rem', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, marginBottom: 12 }}>
            Simple, honest pricing
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: '1rem', maxWidth: 500, margin: '0 auto 2rem' }}>
            All calculators are free forever. Pro removes ads and unlocks premium features.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 30, padding: '4px 6px' }}>
            <button onClick={() => setYearly(false)} style={{ padding: '6px 16px', borderRadius: 24, border: 'none', background: !yearly ? 'var(--bg-card)' : 'transparent', color: !yearly ? 'var(--text-1)' : 'var(--text-3)', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>Monthly</button>
            <button onClick={() => setYearly(true)} style={{ padding: '6px 16px', borderRadius: 24, border: 'none', background: yearly ? 'var(--bg-card)' : 'transparent', color: yearly ? 'var(--text-1)' : 'var(--text-3)', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}>
              Yearly <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '1px 6px', borderRadius: 10, fontWeight: 600 }}>−22%</span>
            </button>
          </div>
        </div>
      </section>

      <section style={{ padding: '2rem 0 5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>
            {PLANS.map(plan => {
              const Icon = plan.icon;
              const price = yearly ? plan.price.yearly : plan.price.monthly;
              return (
                <div key={plan.name} style={{
                  background: 'var(--bg-card)',
                  border: plan.popular ? '2px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: 20,
                  padding: '2rem',
                  position: 'relative',
                }}>
                  {plan.popular && (
                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                      Most popular
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: plan.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} color={plan.color} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{plan.name}</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700 }}>${price}</span>
                    {price > 0 && <span style={{ color: 'var(--text-3)', fontSize: 14 }}>/month</span>}
                    {price === 0 && <span style={{ color: 'var(--text-3)', fontSize: 14 }}> — forever</span>}
                  </div>
                  {yearly && price > 0 && <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>Billed ${price * 12}/year</p>}
                  <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: '1.5rem', lineHeight: 1.5 }}>{plan.desc}</p>
                  <Link to={plan.ctaLink} className={`btn btn-lg ${plan.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', marginBottom: '1.5rem', textDecoration: 'none' }}>
                    {plan.cta}
                  </Link>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Check size={14} color="var(--green)" strokeWidth={2.5} />
                        <span style={{ fontSize: 13, color: 'var(--text-1)' }}>{f}</span>
                      </div>
                    ))}
                    {plan.notIncluded?.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, opacity: 0.4 }}>
                        <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--bg-3)', flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', background: 'var(--bg-1)', borderRadius: 16, border: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>All plans include</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginTop: 16 }}>
              {['No credit card for Free', 'Cancel anytime', 'Browser-only — no data stored', 'HTTPS encrypted', '99.9% uptime SLA'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-2)' }}>
                  <Check size={13} color="var(--green)" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
