import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug, getPublishedPosts } from '../lib/blogStore';
import { useStats } from '../lib/StatsContext';
import { AdBanner, AdRect } from '../components/ui/AdSlot';
import { format } from 'date-fns';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const { trackBlogView } = useStats();

  useEffect(() => {
    const p = getPostBySlug(slug);
    setPost(p);
    if (p) {
      trackBlogView(slug);
      const all = getPublishedPosts().filter(x => x.slug !== slug && x.category === p.category).slice(0, 3);
      setRelated(all);
    }
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) return (
    <div className="container section" style={{ textAlign: 'center' }}>
      <h2>Post not found</h2>
      <Link to="/blog" className="btn btn-primary" style={{ marginTop: 16 }}>Back to blog</Link>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{post.title} — CalPro Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-3)', marginBottom: '2rem', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> All posts
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '3rem', alignItems: 'start' }}>
          <article>
            <div style={{ marginBottom: '2rem' }}>
              <span className="badge badge-blue" style={{ marginBottom: 14, display: 'inline-block' }}>{post.category}</span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>{post.title}</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'var(--text-3)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> {format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {post.readTime} min read</span>
                <span>By {post.author}</span>
              </div>
            </div>

            <AdBanner slot="post-top" style={{ marginBottom: '2rem' }} />

            <div style={{ lineHeight: 1.8, color: 'var(--text-1)' }}>
              <style>{`
                .blog-content h2 { font-family: var(--font-display); font-size: 1.5rem; font-weight: 600; margin: 2rem 0 0.75rem; color: var(--text-1); }
                .blog-content h3 { font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.5rem; }
                .blog-content p { margin-bottom: 1rem; color: var(--text-2); font-size: 1rem; }
                .blog-content ul, .blog-content ol { margin: 0 0 1rem 1.5rem; color: var(--text-2); }
                .blog-content li { margin-bottom: 0.4rem; }
                .blog-content code { font-family: var(--font-mono); background: var(--bg-2); padding: 2px 6px; border-radius: 4px; font-size: 0.875em; color: var(--accent); }
                .blog-content pre { background: var(--bg-2); border: 1px solid var(--border); border-radius: 10px; padding: 1rem; overflow-x: auto; margin-bottom: 1rem; }
                .blog-content pre code { background: none; padding: 0; color: var(--text-1); }
                .blog-content blockquote { border-left: 3px solid var(--accent); padding-left: 1rem; margin: 1.5rem 0; color: var(--text-2); font-style: italic; }
                .blog-content a { color: var(--accent); text-decoration: underline; text-underline-offset: 2px; }
                .blog-content table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.9rem; }
                .blog-content th { background: var(--bg-2); padding: 8px 12px; border: 1px solid var(--border); text-align: left; font-weight: 600; }
                .blog-content td { padding: 8px 12px; border: 1px solid var(--border); color: var(--text-2); }
                .blog-content strong { color: var(--text-1); font-weight: 600; }
                .blog-content hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }
              `}</style>
              <div className="blog-content">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </div>

            {post.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <Tag size={14} color="var(--text-3)" />
                {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            )}

            {related.length > 0 && (
              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 14, color: 'var(--text-2)' }}>Related posts</h3>
                <div style={{ display: 'grid', gap: 10 }}>
                  {related.map(r => (
                    <Link key={r.id} to={`/blog/${r.slug}`} style={{ textDecoration: 'none' }}>
                      <div className="card card-sm" style={{ transition: 'border-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)' }}>{r.title}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{format(new Date(r.createdAt), 'MMM d, yyyy')} · {r.readTime} min</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AdRect slot="post-sidebar" />
            <div className="card card-sm" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))', borderColor: 'rgba(59,130,246,0.2)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Try our free calculators</p>
              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 10 }}>Put this knowledge to work with our professional calculation tools.</p>
              <Link to="/calculators" className="btn btn-primary btn-sm" style={{ width: '100%', textDecoration: 'none' }}>Browse calculators</Link>
            </div>
          </aside>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .blog-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
}
