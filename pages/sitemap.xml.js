import { locations } from '../data/locations';
import { states } from '../data/states';

const getBaseUrl = (req) => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }

  const host = req?.headers?.host;
  const proto =
    req?.headers?.['x-forwarded-proto'] ||
    (host && host.includes('localhost') ? 'http' : 'https');

  if (host) {
    return `${proto}://${host}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

const buildUrlSet = (urls) => {
  const lastmod = new Date().toISOString();
  const entries = urls
    .map(
      (url) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
};

export async function getServerSideProps({ req, res }) {
  const baseUrl = getBaseUrl(req);
  const staticPages = [
    '/',
    '/about',
    '/contact',
    '/core-package',
    '/how-it-works',
    '/legal',
    '/pricing',
    '/resources',
    '/reviews',
    '/services'
  ];
  const locationPages = locations.map((location) => `/locations/${location.slug}`);
  const statePricingPages = states.map((state) => `/pricing/${state.slug}`);

  const sitemap = buildUrlSet(
    [...staticPages, ...locationPages, ...statePricingPages].map((path) => `${baseUrl}${path}`)
  );

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
