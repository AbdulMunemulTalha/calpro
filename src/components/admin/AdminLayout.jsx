import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../lib/AdminContext';
import { Calculator, LayoutDashboard, FileText, LogOut, PlusCircle, ExternalLink } from 'lucide-react';

export default function AdminLayout() {
  const { isLoggedIn, logout } = useAdmin();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoggedIn) navigate('/admin/login', { replace: true });
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const navItem = (to, Icon, label, end = false) => (
    <NavLink to={to} end={end} style={({ isActive }) => ({
      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px',
      borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none',
      color: isActive ? 'var(--text-1)' : 'var(--text-3)',
      background: isActive ? 'var(--bg-3)' : 'transparent',
      transition: 'all 0.15s',
    })}>
      <Icon size={16} /> {label}
    </NavLink>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-0)' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: 'var(--bg-1)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '1.25rem 0.75rem' }}>
        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px', marginBottom: '1.75rem', textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={15} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>CalPro <span style={{ color: 'var(--text-3)', fontSize: 11, fontWeight: 400 }}>Admin</span></span>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <NavLink to="/admin" end style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none', color: isActive ? 'var(--text-1)' : 'var(--text-3)', background: isActive ? 'var(--bg-3)' : 'transparent', transition: 'all 0.15s' })}>
            <LayoutDashboard size={16} /> Dashboard
          </NavLink>
          <NavLink to="/admin/blog" style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none', color: isActive ? 'var(--text-1)' : 'var(--text-3)', background: isActive ? 'var(--bg-3)' : 'transparent', transition: 'all 0.15s' })}>
            <FileText size={16} /> Blog posts
          </NavLink>
          <NavLink to="/admin/blog/new" style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: 'none', color: isActive ? 'var(--accent)' : 'var(--text-3)', background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent', transition: 'all 0.15s' })}>
            <PlusCircle size={16} /> New post
          </NavLink>
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a href="/" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 8, fontSize: 13, color: 'var(--text-3)', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>
            <ExternalLink size={16} /> View site
          </a>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 8, fontSize: 13, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
