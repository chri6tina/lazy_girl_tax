/** @type {import('next').NextConfig} */
const nextConfig = {
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
      { source: '/script.js', destination: '/api/assets/script.js' },
      { source: '/lazy_girls_hero.jpg', destination: '/api/assets/lazy_girls_hero.jpg' },
      { source: '/logo.jpg', destination: '/api/assets/logo.jpg' }
    ];
  }
};

module.exports = nextConfig;
