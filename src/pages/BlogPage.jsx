import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, ArrowRight } from 'lucide-react';
import { getPublishedPosts } from '../lib/blogStore';
import { useStats } from '../lib/StatsContext';
import { AdBanner } from '../components/ui/AdSlot';
import { format } from 'date-fns';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const { trackPageView } = useStats();

  useEffect(() => {
    setPosts(getPublishedPosts());
    trackPageView('/blog');
  }, []);

  const categories = ['All', ...new Set(posts.map(p => p.category))];
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? posts : posts.filter(p => p.category === cat);

  const catColors = { Trading: '#3b82f6', Health: '#10b981', Crypto: '#8b5cf6', 'Real Estate': '#f59e0b' };

  return (
    <>
      <Helmet>
        <title>Blog — Trading, Finance, Health & Crypto Guides | CalPro</title>
        <meta name="description" content="Expert guides on forex trading, personal finance, fitness nutrition, real estate investing and cryptocurrency. Free educational content from CalPro." />
        <link rel="canonical" href="https://www.calpro.store/blog" />
        <meta property="og:title" content="CalPro Blog — Trading, Finance, Health & Crypto Guides" />
        <meta property="og:description" content="Expert guides on forex trading, personal finance, fitness and crypto investing." />
        <meta property="og:url" content="https://www.calpro.store/blog" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div style={{ background: 'var(--bg-1)', borderBottom: '1px solid var(--border)', padding: '2.5rem 0 1.5rem' }}>
        <div className="container">
          <nav style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>
            <a href="/" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Home</a>
            <span style={{ margin: '0 6px' }}>/</span>
            <span style={{ color: 'var(--text-2)' }}>Blog</span>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>Trading, Finance & Fitness Blog</h1>
          <p style={{ color: 'var(--text-2)' }}>Expert guides on finance, fitness, real estate, and crypto.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <AdBanner slot="blog-top" />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '2rem' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} className="btn btn-sm" style={{
              background: cat === c ? 'var(--accent)' : 'var(--bg-2)',
              color: cat === c ? '#fff' : 'var(--text-2)',
              border: '1px solid', borderColor: cat === c ? 'var(--accent)' : 'var(--border)',
            }}>{c}</button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-3)' }}>
            <p>No posts yet. Check back soon.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map(post => (
            <Link key={post.id} to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'border-color 0.15s, transform 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span className="badge" style={{ background: (catColors[post.category] || '#3b82f6') + '22', color: catColors[post.category] || '#60a5fa' }}>{post.category}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {post.readTime} min read
                  </span>
                </div>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.4, marginBottom: 10, color: 'var(--text-1)', flex: 1 }}>{post.title}</h2>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55, marginBottom: 16 }}>{post.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                  <span style={{ fontSize: 13, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>Read more <ArrowRight size={12} /></span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
