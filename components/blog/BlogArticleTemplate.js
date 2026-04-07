import Head from 'next/head';
import Link from 'next/link';
import { getAbsoluteSiteUrl } from '../../lib/siteUrl';
import { estimateReadingTime } from '../../lib/readingTime';
import BlogSidebar from './BlogSidebar';

function formatPostDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Single-post layout: breadcrumb, title block, Markdown body, CTA strip.
 */
export default function BlogArticleTemplate({ post, recentPosts = [], toc = [], children }) {
  const base = getAbsoluteSiteUrl();
  const url = base ? `${base}/blog/${post.slug}` : '';
  const readMinutes = estimateReadingTime(post.body);
  const dateLabel = formatPostDate(post.published_at);

  const jsonLd =
    url && post.published_at
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt || undefined,
          datePublished: post.published_at,
          dateModified: post.updated_at || post.published_at,
          url,
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          publisher: {
            '@type': 'Organization',
            name: 'Lazy Girls Tax'
          }
        }
      : null;

  return (
    <>
      {jsonLd ? (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </Head>
      ) : null}

      <article className="blog-article">
        <div className="container blog-article-outer">
          <div className="blog-main-layout blog-main-layout--article">
            <BlogSidebar toc={toc} recentPosts={recentPosts} showLatest />
            <div className="blog-main-column">
              <nav className="blog-breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span aria-hidden="true"> / </span>
                <Link href="/blog">Blog</Link>
                <span aria-hidden="true"> / </span>
                <span className="blog-breadcrumb-current">{post.title}</span>
              </nav>

              <header className="blog-article-header">
                <p className="blog-article-kicker accent-script">Lazy Girls Tax</p>
                <h1 className="blog-article-title">{post.title}</h1>
                {post.excerpt ? <p className="blog-article-deck lead">{post.excerpt}</p> : null}
                <div className="blog-article-meta-row">
                  {dateLabel ? <time dateTime={post.published_at}>{dateLabel}</time> : null}
                  {dateLabel ? <span aria-hidden="true">·</span> : null}
                  <span>{readMinutes} min read</span>
                </div>
              </header>

              <div className="blog-md blog-article-body">{children}</div>

              <section className="blog-article-cta" aria-label="Next step">
                <h2 className="blog-cta-heading">Need hands-on help?</h2>
                <p className="blog-cta-copy">
                  Bookkeeping and tax prep built for creators and sex workers—flat pricing, judgment-free
                  support.
                </p>
                <div className="blog-cta-buttons">
                  <Link href="/contact" className="btn btn-primary">
                    Start here
                  </Link>
                  <Link href="/pricing" className="btn btn-secondary">
                    View pricing
                  </Link>
                </div>
                <p className="blog-back-link">
                  <Link href="/blog">← All posts</Link>
                </p>
              </section>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
