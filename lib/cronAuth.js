/**
 * Secures cron / agent routes. Set CRON_SECRET in env; callers send:
 *   Authorization: Bearer <CRON_SECRET>
 * or header x-cron-secret: <CRON_SECRET>
 */
export function verifyCronAuth(req) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const header = req.headers['x-cron-secret'];
  const alt = typeof header === 'string' ? header.trim() : '';
  return bearer === secret || alt === secret;
}
