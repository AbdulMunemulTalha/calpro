import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useStats } from '../../lib/StatsContext';
import { CALCULATORS } from '../../data/calculators';
import { getPublishedPosts } from '../../lib/blogStore';
import { TrendingUp, Calculator, FileText, Eye, PlusCircle, RefreshCw } from 'lucide-react';

const TT_STYLE = { background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, fontSize: 12, color: '#f1f5f9' };

function StatCard({ icon: Icon, label, value, sub, color = 'var(--accent)' }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color={color} />
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-1)', lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { stats, resetStats } = useStats();
  const posts = getPublishedPosts();

  // Build daily views chart (last 14 days)
  const dailyData = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({ date: label, views: stats.dailyViews[key] || 0 });
    }
    return days;
  }, [stats.dailyViews]);

  // Top calculators
  const topCalcs = useMemo(() => {
    return Object.entries(stats.calcUsage || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([id, uses]) => {
        const calc = CALCULATORS.find(c => c.id === id);
        return { name: calc?.title || id, uses };
      });
  }, [stats.calcUsage]);

  // Top blog posts
  const topBlog = useMemo(() => {
    return Object.entries(stats.blogViews || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([slug, views]) => ({ slug, views }));
  }, [stats.blogViews]);

  const totalCalcs = Object.values(stats.calcUsage || {}).reduce((s, v) => s + v, 0);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>Welcome back. Here's your site overview.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/admin/blog/new" className="btn btn-primary btn-sm"><PlusCircle size={14} /> New post</Link>
          <button onClick={() => { if (window.confirm('Reset all stats?')) resetStats(); }} className="btn btn-ghost btn-sm" title="Reset stats">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: '2rem' }}>
        <StatCard icon={Eye} label="Total page views" value={stats.totalPageViews.toLocaleString()} sub="all time" color="var(--accent)" />
        <StatCard icon={Calculator} label="Calculator uses" value={totalCalcs.toLocaleString()} sub="all time" color="var(--purple)" />
        <StatCard icon={FileText} label="Published posts" value={posts.length} sub={`${Object.values(stats.blogViews || {}).reduce((s, v) => s + v, 0)} total blog views`} color="var(--green)" />
        <StatCard icon={TrendingUp} label="Top niche" value={(() => {
          const niche = {};
          CALCULATORS.forEach(c => { niche[c.niche] = (niche[c.niche] || 0) + (stats.calcUsage?.[c.id] || 0); });
          const top = Object.entries(niche).sort(([, a], [, b]) => b - a)[0];
          return top ? top[0] : '—';
        })()} sub="by calculator uses" color="var(--amber)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Daily views chart */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: '1rem' }}>Page views — last 14 days</h3>
          {dailyData.every(d => d.views === 0) ? (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 13 }}>No data yet. Start getting traffic!</div>
          ) : (
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <XAxis dataKey="date" stroke="var(--text-3)" tick={{ fontSize: 10 }} interval={1} />
                  <YAxis stroke="var(--text-3)" tick={{ fontSize: 10 }} width={28} />
                  <Tooltip contentStyle={TT_STYLE} />
                  <Line type="monotone" dataKey="views" stroke="var(--accent)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top calculators chart */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: '1rem' }}>Top calculators</h3>
          {topCalcs.length === 0 ? (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 13 }}>No calculator usage yet.</div>
          ) : (
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCalcs} layout="vertical">
                  <XAxis type="number" stroke="var(--text-3)" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" stroke="var(--text-3)" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip contentStyle={TT_STYLE} />
                  <Bar dataKey="uses" fill="var(--purple)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Blog views + recent posts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: '1rem' }}>Top blog posts</h3>
          {topBlog.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No blog views yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topBlog.map(({ slug, views }) => (
                <div key={slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slug}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-1)', fontSize: 12, marginLeft: 12 }}>{views} views</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Recent posts</h3>
            <Link to="/admin/blog" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {posts.slice(0, 5).map(post => (
              <div key={post.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-1)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
                <span className={`badge ${post.published ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: 10, marginLeft: 8, flexShrink: 0 }}>{post.published ? 'Live' : 'Draft'}</span>
              </div>
            ))}
            {posts.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-3)' }}>No posts yet. <Link to="/admin/blog/new" style={{ color: 'var(--accent)' }}>Create one →</Link></p>}
          </div>
        </div>
      </div>
    </div>
  );
}
