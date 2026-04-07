import Link from 'next/link';

const BROWSE_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

/**
 * Shared blog sidebar: site sections, optional in-page TOC, optional latest posts.
 */
export default function BlogSidebar({ toc = [], recentPosts = [], showLatest = true }) {
  const hasToc = toc.length > 0;
  const posts = showLatest && recentPosts.length > 0 ? recentPosts : [];

  return (
    <aside className="blog-sidebar" aria-label="Blog navigation">
      <nav className="blog-sidebar-block" aria-label="Site sections">
        <h2 className="blog-sidebar-heading">Sections</h2>
        <ul className="blog-sidebar-list">
          {BROWSE_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className="blog-sidebar-link">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {hasToc ? (
        <nav className="blog-sidebar-block" aria-label="On this page">
          <h2 className="blog-sidebar-heading">On this page</h2>
          <ul className="blog-sidebar-toc">
            {toc.map((item) => (
              <li
                key={item.id}
                className={item.depth === 3 ? 'blog-sidebar-toc-sub' : undefined}
              >
                <a href={`#${item.id}`} className="blog-sidebar-toc-link">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {posts.length > 0 ? (
        <div className="blog-sidebar-block">
          <h2 className="blog-sidebar-heading">Latest</h2>
          <ul className="blog-sidebar-list blog-sidebar-list-tight">
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/blog/${p.slug}`} className="blog-sidebar-link">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
