import BlogIndexTemplate from '../../components/blog/BlogIndexTemplate';
import BlogShell from '../../components/blog/BlogShell';
import { listPublishedPosts } from '../../lib/blogDb';
import { sanitizeEnvValue, sanitizeSupabaseUrl } from '../../lib/sanitizeEnv';

function formatBlogFetchError(message) {
  const base = message || 'Could not load posts.';
  if (!/api key|jwt|invalid|unauthorized/i.test(base)) return base;
  return `${base} Common causes: (1) NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be from the same Supabase project (Settings → API). (2) Use the service_role key, not the anon key. (3) Remove surrounding quotes in .env and redeploy.`;
}

export default function BlogIndex({ posts, configured, fetchError }) {
  const description = 'Tax tips, resources, and updates from Lazy Girls Tax.';

  let body;
  if (!configured) {
    body = (
      <main className="blog-page">
        <div className="container blog-index-body">
          <p className="blog-hint">
            Blog database is not configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code>SUPABASE_SERVICE_ROLE_KEY</code>, then run the SQL in{' '}
            <code>supabase/migrations/001_blog_posts.sql</code>.
          </p>
        </div>
      </main>
    );
  } else if (fetchError) {
    body = (
      <main className="blog-page">
        <div className="container blog-index-body">
          <p className="blog-alert">{fetchError}</p>
        </div>
      </main>
    );
  } else if (posts.length === 0) {
    body = (
      <BlogIndexTemplate
        posts={[]}
        emptyHint="No published posts yet. Check back soon—or sign in to the admin to publish your first article."
      />
    );
  } else {
    body = <BlogIndexTemplate posts={posts} />;
  }

  return (
    <BlogShell title="Blog" description={description} canonicalPath="/blog">
      {body}
    </BlogShell>
  );
}

export async function getServerSideProps() {
  const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceKey = sanitizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const configured = !!(supabaseUrl && serviceKey);

  if (!configured) {
    return { props: { posts: [], configured: false, fetchError: null } };
  }

  const { data, error } = await listPublishedPosts();
  if (error) {
    return {
      props: {
        posts: [],
        configured: true,
        fetchError: formatBlogFetchError(error.message)
      }
    };
  }

  return {
    props: {
      posts: data,
      configured: true,
      fetchError: null
    }
  };
}
