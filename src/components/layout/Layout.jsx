import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, NavLink } from 'react-router-dom';
import { Calculator, Menu, X, TrendingUp, Heart, Home, Bitcoin, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';

const NICHE_LINKS = [
  { label: 'Trading & Finance', href: '/calculators?niche=finance', icon: TrendingUp, color: '#3b82f6' },
  { label: 'Health & Fitness',  href: '/calculators?niche=health',   icon: Heart,       color: '#10b981' },
  { label: 'Real Estate',       href: '/calculators?niche=realestate',icon: Home,        color: '#f59e0b' },
  { label: 'Crypto',            href: '/calculators?niche=crypto',   icon: Bitcoin,     color: '#8b5cf6' },
];

function ThemeToggle({ theme, toggle }) {
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={{
        position: 'relative',
        width: 52,
        height: 28,
        borderRadius: 14,
        border: '1px solid var(--border)',
        background: isDark
          ? 'linear-gradient(135deg, #1a243d, #131c30)'
          : 'linear-gradient(135deg, #dbeafe, #ede9fe)',
        cursor: 'pointer',
        padding: 0,
        transition: 'all 0.3s ease',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Track icons */}
      <span style={{
        position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)',
        fontSize: 10, opacity: isDark ? 0 : 1, transition: 'opacity 0.2s',
        pointerEvents: 'none',
      }}>☀️</span>
      <span style={{
        position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
        fontSize: 10, opacity: isDark ? 1 : 0, transition: 'opacity 0.2s',
        pointerEvents: 'none',
      }}>🌙</span>
      {/* Thumb */}
      <span style={{
        position: 'absolute',
        top: 3,
        left: isDark ? 'calc(100% - 24px)' : 3,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: isDark
          ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
          : 'linear-gradient(135deg, #f59e0b, #ef4444)',
        transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        pointerEvents: 'none',
      }}>
        {isDark
          ? <Moon size={10} color="#fff" />
          : <Sun size={10} color="#fff" />
        }
      </span>
    </button>
  );
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); setCalcOpen(false); }, [location]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!calcOpen) return;
    const fn = (e) => {
      if (!e.target.closest('[data-calc-dropdown]')) setCalcOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [calcOpen]);

  const headerBg = scrolled
    ? isDark ? 'rgba(7,11,20,0.95)' : 'rgba(248,250,252,0.95)'
    : 'transparent';
  const headerBorder = scrolled
    ? isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)'
    : '1px solid transparent';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: headerBg,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: headerBorder,
        transition: 'all 0.2s',
      }}>
        <div className="container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calculator size={18} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--text-1)' }}>
              Cal<span style={{ color: 'var(--accent)' }}>Pro</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            <div style={{ position: 'relative' }} data-calc-dropdown>
              <button
                onClick={() => setCalcOpen(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: 'none', border: 'none', color: 'var(--text-2)', fontSize: 14, cursor: 'pointer', borderRadius: 8, transition: 'color 0.15s' }}
              >
                Calculators <ChevronDown size={14} style={{ transform: calcOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {calcOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: 4,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: 8, minWidth: 220, zIndex: 200,
                  boxShadow: 'var(--shadow-lg)',
                }}>
                  {NICHE_LINKS.map(n => {
                    const Icon = n.icon;
                    return (
                      <Link key={n.href} to={n.href}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, color: 'var(--text-2)', fontSize: 14, transition: 'background 0.1s, color 0.1s', textDecoration: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.color = 'var(--text-1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-2)'; }}>
                        <Icon size={16} color={n.color} />{n.label}
                      </Link>
                    );
                  })}
                  <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
                  <Link to="/calculators"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, color: 'var(--accent)', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
                    View all calculators →
                  </Link>
                </div>
              )}
            </div>
            {[{ to: '/blog', label: 'Blog' }, { to: '/pricing', label: 'Pricing' }].map(l => (
              <NavLink key={l.to} to={l.to}
                style={({ isActive }) => ({ padding: '6px 12px', borderRadius: 8, fontSize: 14, color: isActive ? 'var(--text-1)' : 'var(--text-2)', textDecoration: 'none', transition: 'color 0.15s' })}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side: theme toggle + Go Pro + mobile menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle theme={theme} toggle={toggle} />
            <Link to="/pricing" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Go Pro</Link>
            <button
              onClick={() => setMenuOpen(v => !v)}
              style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-1)', cursor: 'pointer', padding: 4 }}
              className="mobile-menu-btn"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '1rem 1.5rem' }}>
            {[{ to: '/calculators', label: 'All Calculators' }, { to: '/blog', label: 'Blog' }, { to: '/pricing', label: 'Pricing' }, { to: '/about', label: 'About' }].map(l => (
              <Link key={l.to} to={l.to}
                style={{ display: 'block', padding: '10px 0', color: 'var(--text-2)', fontSize: 15, textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                {l.label}
              </Link>
            ))}
            {/* Theme toggle in mobile menu */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
              <span style={{ fontSize: 15, color: 'var(--text-2)' }}>
                {isDark ? '🌙 Dark mode' : '☀️ Light mode'}
              </span>
              <ThemeToggle theme={theme} toggle={toggle} />
            </div>
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <div className="container" style={{ padding: '3rem 1.5rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, textDecoration: 'none' }}>
                <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calculator size={15} color="#fff" />
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text-1)' }}>Cal<span style={{ color: 'var(--accent)' }}>Pro</span></span>
              </Link>
              <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>Free financial, health, real estate, and crypto calculators.</p>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Calculators</p>
              {[{ to: '/calculators?niche=finance', label: 'Finance' }, { to: '/calculators?niche=health', label: 'Health' }, { to: '/calculators?niche=realestate', label: 'Real Estate' }, { to: '/calculators?niche=crypto', label: 'Crypto' }].map(l => (
                <Link key={l.to} to={l.to} style={{ display: 'block', fontSize: 13, color: 'var(--text-3)', marginBottom: 6, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-1)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-3)'}>{l.label}</Link>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Company</p>
              {[{ to: '/about', label: 'About' }, { to: '/blog', label: 'Blog' }, { to: '/pricing', label: 'Pricing' }, { to: '/contact', label: 'Contact' }].map(l => (
                <Link key={l.to} to={l.to} style={{ display: 'block', fontSize: 13, color: 'var(--text-3)', marginBottom: 6, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-1)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-3)'}>{l.label}</Link>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Legal</p>
              {[{ to: '/privacy', label: 'Privacy Policy' }, { to: '/terms', label: 'Terms of Use' }].map(l => (
                <Link key={l.to} to={l.to} style={{ display: 'block', fontSize: 13, color: 'var(--text-3)', marginBottom: 6, textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-1)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-3)'}>{l.label}</Link>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>© {new Date().getFullYear()} CalPro. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>For educational purposes only. Not financial advice.</p>
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'underline' }}>
                How Google uses data
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
