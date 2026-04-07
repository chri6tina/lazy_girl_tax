import Link from 'next/link';
import AdminLayout from '../../components/admin/AdminLayout';
import { requireAdminGssp } from '../../lib/adminAuth';
import { listAllPostsAdmin } from '../../lib/blogDb';

export default function AdminDashboard({ posts, configured }) {
  const published = posts.filter((p) => p.published).length;
  const drafts = posts.length - published;

  return (
    <AdminLayout title="Dashboard">
      {!configured ? (
        <div className="admin-card admin-error">
          Supabase is not configured. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code>SUPABASE_SERVICE_ROLE_KEY</code>, run <code>001_blog_posts.sql</code> in the Supabase
          SQL editor, then restart the dev server.
        </div>
      ) : null}

      <div className="admin-card">
        <p className="admin-muted" style={{ marginTop: 0 }}>
          Published: <strong>{published}</strong> · Drafts: <strong>{drafts}</strong> · Total:{' '}
          <strong>{posts.length}</strong>
        </p>
        <div className="admin-actions">
          <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">
            New post
          </Link>
          <Link href="/admin/posts" className="admin-btn admin-btn-ghost">
            All posts
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx) {
  const gate = await requireAdminGssp(ctx);
  if (gate) return gate;

  const configured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await listAllPostsAdmin();
  if (error && configured) {
    console.error(error);
  }

  return {
    props: {
      posts: data || [],
      configured
    }
  };
}
