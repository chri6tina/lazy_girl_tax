const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prefer this app as tracing root when another package-lock exists higher on disk (e.g. user home).
  outputFileTracingRoot: path.join(__dirname),
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
      { source: '/lazy_girls_hero.jpg', destination: '/api/assets/lazy_girls_hero.jpg' },
      { source: '/logo.jpg', destination: '/api/assets/logo.jpg' }
    ];
  }
};

module.exports = nextConfig;
