import Head from 'next/head';
import { getAbsoluteSiteUrl } from '../../lib/siteUrl';

const SITE_NAME = 'Lazy Girls Tax';
const DEFAULT_OG_IMAGE = '/lazy_girls_hero.jpg';

/**
 * Shared chrome for all public blog routes: meta, top nav, footer.
 */
export default function BlogShell({ title, description, canonicalPath, children }) {
  const base = getAbsoluteSiteUrl();
  const path = canonicalPath || '/blog';
  const canonicalUrl = base ? `${base}${path.startsWith('/') ? path : `/${path}`}` : '';
  const ogImage = base ? `${base}${DEFAULT_OG_IMAGE}` : '';
  const fullTitle = `${title} | ${SITE_NAME}`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        {description ? <meta name="description" content={description} /> : null}
        {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={fullTitle} />
        {description ? <meta property="og:description" content={description} /> : null}
        {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
        {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      </Head>

      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <div className="nav-logo-wrap">
              <a href="/" className="nav-logo-text">
                Lazy Girls Tax
              </a>
              <span className="logo-sparkle logo-sparkle-1" aria-hidden="true"></span>
              <span className="logo-sparkle logo-sparkle-2" aria-hidden="true"></span>
              <span className="logo-sparkle logo-sparkle-3" aria-hidden="true"></span>
            </div>
          </div>
          <ul className="nav-menu">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/services">Services</a>
            </li>
            <li>
              <a href="/pricing">Pricing</a>
            </li>
            <li>
              <a href="/blog" className="blog-nav-active" aria-current="page">
                Blog
              </a>
            </li>
            <li>
              <a href="/contact" className="cta-nav">
                Start Here
              </a>
            </li>
          </ul>
          <button className="mobile-menu-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {children}

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Lazy Girls Tax</h3>
              <p>Trusted by creators and small business owners nationwide.</p>
              <p className="footer-tagline">
                Organized, accurate tax preparation and business support for content creators and
                influencers.
              </p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="/about">About Us</a>
                </li>
                <li>
                  <a href="/services">Services</a>
                </li>
                <li>
                  <a href="/pricing">Pricing</a>
                </li>
                <li>
                  <a href="/blog">Blog</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li>
                  <a href="/how-it-works">How It Works</a>
                </li>
                <li>
                  <a href="/resources">Free Resources</a>
                </li>
                <li>
                  <a href="/reviews">Reviews</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="/legal">Privacy Policy</a>
                </li>
                <li>
                  <a href="/legal">Terms of Service</a>
                </li>
                <li>
                  <a href="/legal">Disclosures</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Lazy Girls Tax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
