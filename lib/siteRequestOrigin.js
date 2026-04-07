/**
 * Hosts allowed to call public notify APIs (browser Origin / Referer must match).
 */
export function getAllowedNotifyHosts() {
  const hosts = new Set(['localhost', '127.0.0.1', '[::1]']);

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) {
    try {
      hosts.add(new URL(site).host);
    } catch {
      /* ignore */
    }
  }

  const vercel = process.env.VERCEL_URL?.replace(/^https?:\/\//, '').trim();
  if (vercel) hosts.add(vercel);

  const extra = process.env.PUBLIC_NOTIFY_ALLOWED_HOSTS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (extra) {
    extra.forEach((h) => hosts.add(h));
  }

  return hosts;
}

export function isSameSiteNotifyRequest(req) {
  const hosts = getAllowedNotifyHosts();
  const check = (url) => {
    if (!url || typeof url !== 'string') return false;
    try {
      return hosts.has(new URL(url).host);
    } catch {
      return false;
    }
  };

  if (check(req.headers?.origin)) return true;
  if (check(req.headers?.referer)) return true;
  return false;
}

export function getClientIp(req) {
  const xff = req.headers?.['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim().slice(0, 64);
  }
  if (req.socket?.remoteAddress) return String(req.socket.remoteAddress).slice(0, 64);
  return '';
}
