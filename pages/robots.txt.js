import { getSiteUrlFromRequest } from '../lib/siteUrl';

export async function getServerSideProps({ req, res }) {
  const baseUrl = getSiteUrlFromRequest(req);
  const body = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.write(body);
  res.end();

  return { props: {} };
}

export default function RobotsTxt() {
  return null;
}
