import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, deletePost, savePost } from '../../lib/blogStore';
import { PlusCircle, Edit, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminBlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => { setPosts(getPosts()); }, []);

  const handleDelete = (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setPosts(deletePost(id));
  };

  const togglePublish = (post) => {
    const updated = { ...post, published: !post.published };
    savePost(updated);
    setPosts(getPosts());
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>Blog posts</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>{posts.length} total · {posts.filter(p => p.published).length} published</p>
        </div>
        <Link to="/admin/blog/new" className="btn btn-primary btn-sm"><PlusCircle size={14} /> New post</Link>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {posts.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-3)' }}>
            <p style={{ marginBottom: 12 }}>No posts yet.</p>
            <Link to="/admin/blog/new" className="btn btn-primary btn-sm">Write your first post</Link>
          </div>
        )}
        {posts.map((post, i) => (
          <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: i < posts.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            {/* Status indicator */}
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: post.published ? 'var(--green)' : 'var(--amber)', flexShrink: 0 }} title={post.published ? 'Published' : 'Draft'} />

            {/* Title + meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</p>
              <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                {post.category} · {post.readTime} min · {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </p>
            </div>

            {/* Status badge */}
            <span className={`badge ${post.published ? 'badge-green' : 'badge-amber'}`} style={{ flexShrink: 0, fontSize: 10 }}>
              {post.published ? 'Published' : 'Draft'}
            </span>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {post.published && (
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener" className="btn btn-ghost btn-sm" style={{ padding: '0 8px' }} title="View live">
                  <ExternalLink size={13} />
                </a>
              )}
              <button onClick={() => togglePublish(post)} className="btn btn-ghost btn-sm" style={{ padding: '0 8px' }} title={post.published ? 'Unpublish' : 'Publish'}>
                {post.published ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
              <Link to={`/admin/blog/edit/${post.id}`} className="btn btn-ghost btn-sm" style={{ padding: '0 8px' }} title="Edit">
                <Edit size={13} />
              </Link>
              <button onClick={() => handleDelete(post.id, post.title)} className="btn btn-ghost btn-sm" style={{ padding: '0 8px', color: 'var(--red)' }} title="Delete">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
