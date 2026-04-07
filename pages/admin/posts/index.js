import Link from 'next/link';
import AdminLayout from '../../../components/admin/AdminLayout';
import { requireAdminGssp } from '../../../lib/adminAuth';
import { listAllPostsAdmin } from '../../../lib/blogDb';

export default function AdminPostsIndex({ posts, configured }) {
  return (
    <AdminLayout title="All posts">
      {!configured ? (
        <p className="admin-error">Configure Supabase environment variables to load posts.</p>
      ) : null}

      {!posts?.length ? (
        <div className="admin-card">
          <p className="admin-muted">No posts yet.</p>
          <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">
            Create the first post
          </Link>
        </div>
      ) : (
        <div className="admin-card" style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>
                    <code>{p.slug}</code>
                  </td>
                  <td>
                    <span
                      className={`admin-badge ${p.published ? 'admin-badge-published' : 'admin-badge-draft'}`}
                    >
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    {p.updated_at
                      ? new Date(p.updated_at).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })
                      : '—'}
                  </td>
                  <td>
                    <Link href={`/admin/posts/${p.id}/edit`}>Edit</Link>
                    {p.published ? (
                      <>
                        {' · '}
                        <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx) {
  const gate = await requireAdminGssp(ctx);
  if (gate) return gate;

  const configured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const { data } = await listAllPostsAdmin();

  return {
    props: {
      posts: data || [],
      configured
    }
  };
}
