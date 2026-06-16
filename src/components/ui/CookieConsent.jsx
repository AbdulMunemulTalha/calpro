import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';

const CONSENT_KEY = 'calpro-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner if user hasn't consented yet
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Small delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      analytics: true,
      advertising: true,
      timestamp: new Date().toISOString(),
    }));
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      analytics: false,
      advertising: false,
      timestamp: new Date().toISOString(),
    }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Overlay for mobile */}
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
        zIndex: 9998, display: 'none',
      }} className="cookie-overlay" />

      {/* Banner */}
      <div role="dialog" aria-label="Cookie consent" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.18)',
        padding: '1.25rem 1.5rem',
        animation: 'slideUpConsent 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <style>{`
          @keyframes slideUpConsent {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>

        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          {/* Icon */}
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(59,130,246,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 2,
          }}>
            <Cookie size={20} color="var(--accent)" />
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 240 }}>
            <p style={{
              fontSize: 14, fontWeight: 600,
              color: 'var(--text-1)', marginBottom: 4,
            }}>
              We use cookies
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
              CalPro uses cookies for site analytics and to display Google AdSense advertisements.
              Google AdSense uses cookies and web beacons to show you ads based on your interests.
              Third-party vendors, including Google, may use cookies to serve ads based on your prior
              visits to this or other websites. You can opt out of personalised advertising at{' '}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                Google Ad Settings
              </a>.
              For more details see our{' '}
              <Link to="/privacy" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                Privacy Policy
              </Link>.
            </p>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            flexShrink: 0, flexWrap: 'wrap',
          }}>
            <button
              onClick={decline}
              className="btn btn-ghost btn-sm"
              style={{ minWidth: 100 }}
            >
              Decline
            </button>
            <button
              onClick={accept}
              aria-label="Accept all cookies"
              className="btn btn-primary btn-sm"
              style={{ minWidth: 120, fontWeight: 700 }}
            >
              Accept All
            </button>
            <button
              onClick={decline}
              aria-label="Close"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-3)', padding: 4, borderRadius: 6,
                display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
