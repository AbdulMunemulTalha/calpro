import React, { useEffect, useRef } from 'react';

const ADSENSE_CLIENT = 'ca-pub-2580237448099674';

// Label shown above every ad unit — required by Google policy
// to clearly distinguish ads from editorial content
function AdLabel() {
  return (
    <p style={{
      fontSize: 10,
      color: 'var(--text-3)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      fontWeight: 500,
      marginBottom: 4,
      textAlign: 'center',
    }}>
      Advertisement
    </p>
  );
}

export function AdBanner({ slot, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    try {
      if (window.adsbygoogle) window.adsbygoogle.push({});
    } catch (e) {}
  }, []);

  return (
    <div style={{ overflow: 'hidden', ...style }}>
      <AdLabel />
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

  return (
    <div style={{ width: 300, overflow: 'hidden', ...style }}>
      <AdLabel />
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
      <p style={{
        fontSize: 11, fontWeight: 600, color: 'var(--text-3)',
        letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10,
      }}>
        Sponsored partners
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {affiliates.map((a, i) => (
          <a key={i} href={a.url} target="_blank" rel="noopener noreferrer nofollow"
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
      <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 8 }}>
        Sponsored — we may earn a commission on purchases.
      </p>
    </div>
  );
}
