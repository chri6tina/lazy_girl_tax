import { sanitizeEnvValue } from './sanitizeEnv';

/**
 * Single origin string for Telegram / outbound notifications only.
 * Strips infra hosts (Supabase project URL, *.vercel.app) so messages never show those as "your site".
 */
function normalizeNotificationOrigin(raw) {
  const s = sanitizeEnvValue(raw);
  if (!s) return '';
  let candidate = s;
  if (!/^https?:\/\//i.test(candidate)) candidate = `https://${candidate}`;
  try {
    const parsed = new URL(candidate);
    const host = parsed.host.toLowerCase();
    if (host === 'supabase.co' || host.endsWith('.supabase.co')) return '';
    if (host.endsWith('.vercel.app') || host === 'vercel.app') return '';
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return '';
  }
}

/**
 * Public marketing URL for links in Telegram (visit/lead/blog cron). Never uses VERCEL_URL or request Host.
 * Set NEXT_PUBLIC_SITE_URL to https://www.yoursite.com, or override with NOTIFY_PUBLIC_SITE_URL / TELEGRAM_SITE_URL.
 */
export function getPublicSiteUrlForNotifications() {
  const fromOverride =
    normalizeNotificationOrigin(process.env.NOTIFY_PUBLIC_SITE_URL) ||
    normalizeNotificationOrigin(process.env.TELEGRAM_SITE_URL);
  if (fromOverride) return fromOverride;

  return normalizeNotificationOrigin(process.env.NEXT_PUBLIC_SITE_URL) || '';
}

/** Prefer an explicit opt (e.g. cron body); otherwise env-based public URL. */
export function resolveSiteUrlForNotifications(explicit) {
  return normalizeNotificationOrigin(explicit) || getPublicSiteUrlForNotifications();
}

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
