import Link from 'next/link';
import BlogSidebar from './BlogSidebar';

function formatPostDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/** Stable gradient accent per slug (on-brand cyan / teal family). */
function accentStyle(slug) {
  let h = 0;
  const s = String(slug || '');
  for (let i = 0; i < s.length; i += 1) {
    h = s.charCodeAt(i) + ((h << 5) - h);
  }
  const hues = [192, 175, 200, 205, 168, 188];
  const hue = hues[Math.abs(h) % hues.length];
  const hue2 = (hue + 18) % 360;
  return {
    background: `linear-gradient(105deg, hsl(${hue}, 72%, 42%) 0%, hsl(${hue2}, 68%, 52%) 100%)`
  };
}

/**
 * Listing layout: hero + cards (used on /blog).
 */
export default function BlogIndexTemplate({ posts, emptyHint }) {
  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="blog-hero-bg" aria-hidden="true" />
        <div className="container blog-hero-inner">
          <div className="blog-hero-layout">
            <div className="blog-hero-copy">
              <div className="hero-badge blog-hero-badge">Tax tips &amp; resources</div>
              <p className="blog-hero-eyebrow accent-script">Lazy Girls Tax</p>
              <div className="blog-hero-title-block">
                <h1 className="blog-hero-title">Blog</h1>
                <span className="blog-hero-title-rule" aria-hidden="true" />
              </div>
              <p className="blog-hero-lead lead">
                Practical tax and bookkeeping notes for creators, freelancers, and independent
                contractors—straight talk, no shame, no jargon wall.
              </p>
            </div>

            <aside className="blog-hero-panel" aria-label="Blog highlights">
              <div className="blog-hero-decor" aria-hidden="true">
                <span className="blog-hero-orb blog-hero-orb-a" />
                <span className="blog-hero-orb blog-hero-orb-b" />
                <span className="blog-hero-orb blog-hero-orb-c" />
              </div>
              <div className="blog-hero-highlight">
                <span className="blog-hero-highlight-value">{posts.length}</span>
                <span className="blog-hero-highlight-label">
                  {posts.length === 1 ? 'Article live' : 'Articles live'}
                </span>
                {posts.length === 0 ? (
                  <p className="blog-hero-highlight-note">First guides are on the way—check back soon.</p>
                ) : (
                  <p className="blog-hero-highlight-note">Written for real-world independent work.</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="container blog-index-body">
        <div className="blog-main-layout blog-main-layout--index">
          <BlogSidebar recentPosts={posts.slice(0, 8)} showLatest={posts.length > 0} />
          <div className="blog-main-column">
            {emptyHint ? (
              <p className="blog-hint">{emptyHint}</p>
            ) : (
              <ul className="blog-grid blog-grid--in-layout">
                {posts.map((post) => (
                  <li key={post.id} className="blog-card">
                    <Link href={`/blog/${post.slug}`} className="blog-card-link">
                      <span className="blog-card-accent" style={accentStyle(post.slug)} />
                      <div className="blog-card-body">
                        <span className="blog-card-kicker">Article</span>
                        <h2 className="blog-card-title">{post.title}</h2>
                        {post.excerpt ? <p className="blog-card-excerpt">{post.excerpt}</p> : null}
                        <div className="blog-card-footer">
                          <time
                            className="blog-card-meta"
                            dateTime={post.published_at || undefined}
                          >
                            {formatPostDate(post.published_at) || '—'}
                          </time>
                          <span className="blog-card-cta">
                            Read article
                            <span className="blog-card-cta-arrow" aria-hidden="true">
                              →
                            </span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
