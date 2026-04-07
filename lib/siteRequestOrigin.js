/**
 * Add hostname plus www / apex alias so https://example.com and https://www.example.com
 * both work when NEXT_PUBLIC_SITE_URL only lists one of them (common on Vercel).
 */
function addHostAliases(set, host) {
  if (!host || typeof host !== 'string') return;
  const h = host.split(':')[0].toLowerCase().trim();
  if (!h) return;
  set.add(h);
  if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]') return;
  if (h.startsWith('www.')) {
    const apex = h.slice(4);
    if (apex) set.add(apex);
  } else {
    set.add(`www.${h}`);
  }
}

/**
 * Hosts allowed to call public notify APIs (browser Origin / Referer must match).
 */
export function getAllowedNotifyHosts() {
  const hosts = new Set();

  addHostAliases(hosts, 'localhost');
  addHostAliases(hosts, '127.0.0.1');
  addHostAliases(hosts, '[::1]');

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) {
    try {
      addHostAliases(hosts, new URL(site).host);
    } catch {
      /* ignore */
    }
  }

  const vercel = process.env.VERCEL_URL?.replace(/^https?:\/\//, '').trim();
  if (vercel) addHostAliases(hosts, vercel);

  const extra = process.env.PUBLIC_NOTIFY_ALLOWED_HOSTS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (extra) {
    extra.forEach((h) => addHostAliases(hosts, h));
  }

  return hosts;
}

export function isSameSiteNotifyRequest(req) {
  const hosts = getAllowedNotifyHosts();
  const check = (url) => {
    if (!url || typeof url !== 'string') return false;
    try {
      return hosts.has(new URL(url).host.toLowerCase());
    } catch {
      return false;
    }
  };

  if (check(req.headers?.origin)) return true;
  if (check(req.headers?.referer)) return true;

  // Some clients omit Origin on same-origin POST; Host still identifies the site.
  const rawHost = req.headers?.host;
  if (rawHost && typeof rawHost === 'string') {
    const h = rawHost.split(':')[0].toLowerCase();
    if (hosts.has(h)) return true;
  }

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
