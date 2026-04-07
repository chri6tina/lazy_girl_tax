import { locations } from '../data/locations';
import { states } from '../data/states';
import { listPublishedSlugsForSitemap } from '../lib/blogDb';
import { getSiteUrlFromRequest } from '../lib/siteUrl';

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
  const baseUrl = getSiteUrlFromRequest(req);
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
    '/services',
    '/blog'
  ];
  const locationPages = locations.map((location) => `/locations/${location.slug}`);
  const statePricingPages = states.map((state) => `/pricing/${state.slug}`);
  const blogSlugs = await listPublishedSlugsForSitemap();
  const blogPages = blogSlugs.map((slug) => `/blog/${slug}`);

  const sitemap = buildUrlSet(
    [...staticPages, ...locationPages, ...statePricingPages, ...blogPages].map(
      (path) => `${baseUrl}${path}`
    )
  );

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
