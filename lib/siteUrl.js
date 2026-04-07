/**
 * Canonical origin for URLs in <head>, Open Graph, and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL (e.g. https://www.example.com) in production builds.
 */
export function getAbsoluteSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (configured) return configured;
  const vercel = process.env.VERCEL_URL?.replace(/^https?:\/\//, '');
  if (vercel) return `https://${vercel}`;
  return '';
}

export function getSiteUrlFromRequest(req) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }

  const host = req?.headers?.host;
  const proto =
    req?.headers?.['x-forwarded-proto'] ||
    (host && String(host).includes('localhost') ? 'http' : 'https');

  if (host) {
    return `${proto}://${host}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}
