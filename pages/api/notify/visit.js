import { getSiteUrlFromRequest } from '../../../lib/siteUrl';
import { rateLimitAllow } from '../../../lib/notifyRateLimit';
import { getClientIp, isSameSiteNotifyRequest } from '../../../lib/siteRequestOrigin';
import { sendTelegramMessage } from '../../../lib/telegramNotify';

const visitBucket = new Map();

function visitNotifyEnabled() {
  const v = process.env.TELEGRAM_NOTIFY_VISITS?.trim().toLowerCase();
  if (v === '0' || v === 'false' || v === 'off' || v === 'no') return false;
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!isSameSiteNotifyRequest(req)) {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }

  if (!visitNotifyEnabled()) {
    return res.status(200).json({ ok: true, skipped: true });
  }

  const ip = getClientIp(req);
  if (
    !rateLimitAllow(
      visitBucket,
      ip || 'unknown',
      Number(process.env.NOTIFY_VISIT_RATE_MAX || 24),
      Number(process.env.NOTIFY_VISIT_RATE_WINDOW_MS || 600_000)
    )
  ) {
    return res.status(429).json({ ok: false, error: 'Too many requests' });
  }

  const path =
    typeof req.body?.path === 'string' ? req.body.path.trim().slice(0, 320) : '';
  const ref =
    typeof req.body?.referrer === 'string'
      ? req.body.referrer.trim().slice(0, 200)
      : '';

  const base = getSiteUrlFromRequest(req);
  const when = new Date().toISOString();

  const text = [
    '🌐 Lazy Girls Tax — site visit',
    '',
    `Path: ${path || '/'}`,
    base ? `Site: ${base}` : null,
    ref ? `Referrer: ${ref}` : null,
    `Time (UTC): ${when}`
  ]
    .filter(Boolean)
    .join('\n');

  try {
    await sendTelegramMessage(text, { disableWebPagePreview: true });
  } catch (e) {
    console.error('notify/visit Telegram:', e.message);
  }

  return res.status(200).json({ ok: true });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8kb'
    }
  }
};
