import { useRouter } from 'next/router';
import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { requireAdminGssp } from '../../../lib/adminAuth';

export default function AdminNewPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slug.trim() || undefined,
          excerpt,
          body,
          published
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not save');
        setLoading(false);
        return;
      }
      const id = data.post?.id;
      if (id) {
        router.push(`/admin/posts/${id}/edit`);
      } else {
        router.push('/admin/posts');
      }
    } catch {
      setError('Request failed');
      setLoading(false);
    }
  }

  return (
    <AdminLayout title="New post">
      {error ? <div className="admin-error">{error}</div> : null}
      <div className="admin-card">
        <form className="admin-form" onSubmit={onSubmit}>
          <label htmlFor="post-title">Title</label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="post-slug">Slug (optional — auto from title)</label>
          <input
            id="post-slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-post-url"
          />

          <label htmlFor="post-excerpt">Excerpt</label>
          <textarea id="post-excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />

          <label htmlFor="post-body">Body (Markdown)</label>
          <textarea
            id="post-body"
            className="admin-field-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />

          <div className="admin-form-row">
            <input
              id="post-published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <label htmlFor="post-published" style={{ marginBottom: 0 }}>
              Publish immediately
            </label>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Save post'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx) {
  const gate = await requireAdminGssp(ctx);
  if (gate) return gate;
  return { props: {} };
}
