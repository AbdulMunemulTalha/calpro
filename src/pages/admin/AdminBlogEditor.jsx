import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { savePost, getPostById, slugify } from '../../lib/blogStore';
import { ArrowLeft, Eye, Edit, Save, Loader } from 'lucide-react';

const CATEGORIES = ['Trading', 'Health', 'Crypto', 'Real Estate', 'Personal Finance', 'Other'];
const EMPTY_POST = {
  title: '',
  slug: '',
  excerpt: '',
  content: `## Introduction

Write your post content here using Markdown.

## Section heading

Paragraph text goes here. You can use **bold**, *italic*, and [links](/calculators).

- Bullet point one
- Bullet point two

## Conclusion

Wrap up your post here.`,
  category: 'Trading',
  tags: '',
  author: 'CalPro Team',
  published: false,
  readTime: 5,
};

export default function AdminBlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_POST);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  useEffect(() => {
    if (isEdit) {
      const post = getPostById(id);
      if (post) {
        setForm({ ...post, tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '' });
        setAutoSlug(false);
      }
    }
  }, [id]);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => {
      const next = { ...prev, [field]: val };
      if (field === 'title' && autoSlug) next.slug = slugify(val);
      return next;
    });
  };

  const handleSave = async (publish = null) => {
    if (!form.title.trim()) { alert('Title is required.'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    const post = {
      ...form,
      id: isEdit ? id : undefined,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
      published: publish !== null ? publish : form.published,
      readTime: parseInt(form.readTime) || 5,
    };
    savePost(post);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (!isEdit) navigate('/admin/blog');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/admin/blog')} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
            {isEdit ? 'Edit post' : 'New post'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setPreview(v => !v)} className="btn btn-ghost btn-sm">
            {preview ? <><Edit size={13} /> Editor</> : <><Eye size={13} /> Preview</>}
          </button>
          <button onClick={() => handleSave(false)} className="btn btn-secondary btn-sm" disabled={saving}>
            Save draft
          </button>
          <button onClick={() => handleSave(true)} className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : saved ? '✓ Saved!' : <><Save size={13} /> Publish</>}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <div>
            <input
              className="input"
              style={{ fontSize: 20, height: 52, fontFamily: 'var(--font-display)', fontWeight: 600 }}
              placeholder="Post title…"
              value={form.title}
              onChange={set('title')}
            />
          </div>

          {/* Slug */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)', flexShrink: 0 }}>calpro.com/blog/</span>
            <input
              className="input"
              style={{ fontSize: 13, height: 34, fontFamily: 'var(--font-mono)' }}
              placeholder="url-slug"
              value={form.slug}
              onChange={e => { setAutoSlug(false); setForm(p => ({ ...p, slug: e.target.value })); }}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Excerpt</label>
            <textarea
              className="input"
              rows={2}
              placeholder="Short description shown on the blog listing page…"
              value={form.excerpt}
              onChange={set('excerpt')}
            />
          </div>

          {/* Content editor / preview */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Content (Markdown)</label>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{form.content.split(/\s+/).length} words · ~{Math.ceil(form.content.split(/\s+/).length / 200)} min read</span>
            </div>
            {preview ? (
              <div style={{ minHeight: 500, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.5rem', lineHeight: 1.8 }}>
                <style>{`
                  .preview-content h1, .preview-content h2 { font-family: var(--font-display); font-weight: 700; margin: 1.5rem 0 0.5rem; }
                  .preview-content h2 { font-size: 1.35rem; }
                  .preview-content h3 { font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
                  .preview-content p { margin-bottom: 1rem; color: var(--text-2); }
                  .preview-content ul, .preview-content ol { margin: 0 0 1rem 1.5rem; color: var(--text-2); }
                  .preview-content code { font-family: var(--font-mono); background: var(--bg-2); padding: 2px 6px; border-radius: 4px; font-size: 0.875em; color: var(--accent); }
                  .preview-content pre { background: var(--bg-2); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; overflow-x: auto; }
                  .preview-content pre code { background: none; color: var(--text-1); }
                  .preview-content blockquote { border-left: 3px solid var(--accent); padding-left: 1rem; color: var(--text-2); font-style: italic; margin: 1rem 0; }
                  .preview-content strong { color: var(--text-1); }
                  .preview-content table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
                  .preview-content th { background: var(--bg-2); padding: 8px 12px; border: 1px solid var(--border); font-weight: 600; }
                  .preview-content td { padding: 8px 12px; border: 1px solid var(--border); color: var(--text-2); }
                `}</style>
                <div className="preview-content">
                  <ReactMarkdown>{form.content}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <textarea
                className="input"
                rows={28}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7, resize: 'vertical' }}
                value={form.content}
                onChange={set('content')}
                placeholder="Write your post in Markdown…"
              />
            )}
          </div>
        </div>

        {/* Sidebar settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Publish status */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Status</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleSave(false)} className="btn btn-secondary btn-sm" style={{ flex: 1 }} disabled={saving}>
                Save draft
              </button>
              <button onClick={() => handleSave(true)} className="btn btn-primary btn-sm" style={{ flex: 1 }} disabled={saving}>
                {form.published ? 'Update' : 'Publish'}
              </button>
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id="pub" checked={form.published} onChange={set('published')} style={{ cursor: 'pointer' }} />
              <label htmlFor="pub" style={{ fontSize: 13, color: 'var(--text-2)', cursor: 'pointer' }}>Mark as published</label>
            </div>
          </div>

          {/* Category */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Category</p>
            <select className="input" value={form.category} onChange={set('category')}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Author + read time */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Author</p>
            <input className="input" style={{ marginBottom: 10 }} value={form.author} onChange={set('author')} placeholder="Author name" />
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Read time (min)</p>
            <input className="input" type="number" min={1} max={60} value={form.readTime} onChange={set('readTime')} />
          </div>

          {/* Tags */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Tags</p>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>Comma-separated</p>
            <input className="input" value={form.tags} onChange={set('tags')} placeholder="trading, risk, stocks" />
          </div>

          {/* Markdown reference */}
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Markdown tips</p>
            {[['## Heading', 'H2 section'], ['**bold**', 'Bold text'], ['*italic*', 'Italic'], ['[text](url)', 'Link'], ['- item', 'List item'], ['`code`', 'Inline code']].map(([syntax, label]) => (
              <div key={syntax} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 11 }}>
                <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: 11 }}>{syntax}</code>
                <span style={{ color: 'var(--text-3)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
