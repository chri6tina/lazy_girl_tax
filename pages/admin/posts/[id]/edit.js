import { useRouter } from 'next/router';
import { useState } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { requireAdminGssp } from '../../../../lib/adminAuth';
import { getPostByIdAdmin } from '../../../../lib/blogDb';

export default function AdminEditPost({ post }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [excerpt, setExcerpt] = useState(post.excerpt || '');
  const [body, setBody] = useState(post.body || '');
  const [published, setPublished] = useState(!!post.published);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, excerpt, body, published })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not update');
        setLoading(false);
        return;
      }
      router.replace(`/admin/posts/${post.id}/edit`);
      setLoading(false);
    } catch {
      setError('Request failed');
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!window.confirm('Delete this post permanently?')) return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: 'DELETE' });
      if (!res.ok) {
        setError('Could not delete');
        setDeleting(false);
        return;
      }
      router.push('/admin/posts');
    } catch {
      setError('Delete failed');
      setDeleting(false);
    }
  }

  return (
    <AdminLayout title="Edit post">
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

          <label htmlFor="post-slug">Slug</label>
          <input id="post-slug" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required />

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
              Published
            </label>
          </div>

          <div className="admin-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading || deleting}>
              {loading ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={onDelete}
              disabled={loading || deleting}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
            {published ? (
              <a href={`/blog/${slug}`} target="_blank" rel="noopener noreferrer">
                View live
              </a>
            ) : null}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx) {
  const gate = await requireAdminGssp(ctx);
  if (gate) return gate;

  const id = ctx.params?.id;
  if (!id || typeof id !== 'string') {
    return { notFound: true };
  }

  const { data, error } = await getPostByIdAdmin(id);
  if (error || !data) {
    return { notFound: true };
  }

  return {
    props: {
      post: data
    }
  };
}
