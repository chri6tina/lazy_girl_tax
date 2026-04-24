const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prefer this app as tracing root when another package-lock exists higher on disk (e.g. user home).
  outputFileTracingRoot: path.join(__dirname),

  async headers() {
    return [
      {
        // Static images in /public — cache for 1 year (immutable after deploy)
        source: '/:file(.*\\.(?:jpg|jpeg|png|gif|webp|svg|ico))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Public JS bundle — cache for 1 year
        source: '/script.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Sitemap & robots — short cache so Google gets fresh data
        source: '/:file(sitemap\\.xml|robots\\.txt)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      { source: '/index.html', destination: '/' },
      { source: '/about.html', destination: '/about' },
      { source: '/contact.html', destination: '/contact' },
      { source: '/core-package.html', destination: '/core-package' },
      { source: '/how-it-works.html', destination: '/how-it-works' },
      { source: '/legal.html', destination: '/legal' },
      { source: '/pricing.html', destination: '/pricing' },
      { source: '/resources.html', destination: '/resources' },
      { source: '/reviews.html', destination: '/reviews' },
      { source: '/services.html', destination: '/services' },
      // Note: /lazy_girls_hero.jpg and /logo.jpg are now served directly from /public
      // No rewrite needed
    ];
  },
};

module.exports = nextConfig;

