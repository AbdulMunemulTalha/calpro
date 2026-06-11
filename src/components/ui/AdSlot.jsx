import React, { useEffect, useRef } from 'react';

const ADSENSE_CLIENT = 'ca-pub-2580237448099674';

export function AdBanner({ slot, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {}
  }, []);

  // Show placeholder in dev; show real ad in prod with your client ID
  if (ADSENSE_CLIENT === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return (
      <div style={{
        width: '100%', height: 90,
        background: 'var(--bg-2)',
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-3)', fontSize: 12,
        ...style
      }}>
        Ad — Replace ADSENSE_CLIENT in AdSlot.jsx
      </div>
    );
  }

  return (
    <div style={{ overflow: 'hidden', ...style }}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdRect({ slot, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    try {
      if (window.adsbygoogle) window.adsbygoogle.push({});
    } catch (e) {}
  }, []);

  if (ADSENSE_CLIENT === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return (
      <div style={{
        width: 300, height: 250,
        background: 'var(--bg-2)',
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 4,
        color: 'var(--text-3)', fontSize: 12,
        ...style
      }}>
        <span>Ad Rectangle (300×250)</span>
        <span style={{ fontSize: 11 }}>Add your AdSense ID</span>
      </div>
    );
  }

  return (
    <div style={{ width: 300, height: 250, overflow: 'hidden', ...style }}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'inline-block', width: 300, height: 250 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      />
    </div>
  );
}

export function AffiliateBox({ affiliates = [] }) {
  if (!affiliates.length) return null;
  return (
    <div style={{
      background: 'var(--bg-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.25rem',
    }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
        Sponsored partners
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {affiliates.map((a, i) => (
          <a
            key={i}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px',
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-1)' }}>{a.name}</span>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>{a.cta} →</span>
          </a>
        ))}
      </div>
      <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 8 }}>Affiliate links — we may earn a commission.</p>
    </div>
  );
}
