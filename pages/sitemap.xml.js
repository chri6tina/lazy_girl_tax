import { locations } from '../data/locations';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
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

export async function getServerSideProps({ res }) {
  const baseUrl = getBaseUrl();
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

  const sitemap = buildUrlSet(
    [...staticPages, ...locationPages].map((path) => `${baseUrl}${path}`)
  );

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
