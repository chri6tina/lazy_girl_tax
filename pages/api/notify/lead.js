import { getPublicSiteUrlForNotifications } from '../../../lib/siteUrl';
import { rateLimitAllow } from '../../../lib/notifyRateLimit';
import { getClientIp, isSameSiteNotifyRequest } from '../../../lib/siteRequestOrigin';
import { sendTelegramMessage } from '../../../lib/telegramNotify';

const leadBucket = new Map();

const SOURCES = new Set(['contact', 'resources', 'testimonial', 'hero']);
const FORMSPREE_LEAD_URL = 'https://formspree.io/f/xdajzbno';

function clean(str, max) {
  if (str == null) return '';
  return String(str)
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

function validEmail(s) {
  if (!s || s.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

async function submitToFormspree(fields) {
  const r = await fetch(process.env.FORMSPREE_LEAD_URL || FORMSPREE_LEAD_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(fields)
  });

  if (!r.ok) {
    throw new Error(`Formspree returned ${r.status}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!isSameSiteNotifyRequest(req)) {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }

  const ip = getClientIp(req);
  if (
    !rateLimitAllow(
      leadBucket,
      ip || 'unknown',
      Number(process.env.NOTIFY_LEAD_RATE_MAX || 12),
      Number(process.env.NOTIFY_LEAD_RATE_WINDOW_MS || 3_600_000)
    )
  ) {
    return res.status(429).json({ ok: false, error: 'Too many requests' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Obscure name — `website` often gets autofilled on desktop, which skips Telegram silently.
  if (clean(body.lgt_hp, 80)) {
    return res.status(200).json({ ok: true });
  }

  const source = clean(body.source, 32).toLowerCase();
  if (!SOURCES.has(source)) {
    return res.status(400).json({ ok: false, error: 'Invalid source' });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 254).toLowerCase();
  const phone = clean(body.phone, 40);
  const message = clean(body.message, 4000);
  const state = clean(body.state, 4);
  const emailOptIn = clean(body.email_opt_in, 8);
  const smsOptIn = clean(body.sms_opt_in, 8);
  const mailingList = clean(body.mailing_list, 8);

  if (!name || !email || !validEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Name and valid email are required' });
  }

  if (source === 'resources' || source === 'testimonial') {
    if (!state) {
      return res.status(400).json({ ok: false, error: 'State is required' });
    }
  }

  if (source === 'testimonial' && !message) {
    return res.status(400).json({ ok: false, error: 'Message is required' });
  }

  const labels = {
    contact: 'Contact form',
    resources: 'Resources / mailing list',
    testimonial: 'Review / testimonial',
    hero: 'Home hero form'
  };
  const submittedAt = new Date().toISOString();

  const lines = [
    '📩 Lazy Girls Tax — new lead',
    '',
    `Source: ${labels[source] || source}`,
    `Name: ${name}`,
    `Email: ${email}`
  ];

  if (phone) lines.push(`Phone: ${phone}`);
  if (state) lines.push(`State: ${state}`);
  if (message) lines.push('', 'Message:', message);

  if (source === 'resources') {
    lines.push(
      '',
      `Email opt-in: ${emailOptIn || '—'}`,
      `SMS opt-in: ${smsOptIn || '—'}`,
      `Mailing list: ${mailingList || '—'}`
    );
  }

  const base = getPublicSiteUrlForNotifications();
  lines.push('', `Submitted (UTC): ${submittedAt}`);
  if (base) lines.push(`Site: ${base}`);

  let notified = false;
  try {
    const r = await sendTelegramMessage(lines.join('\n'), { disableWebPagePreview: true });
    notified = !r.skipped;
  } catch (e) {
    console.error('notify/lead Telegram:', e.message);
  }

  let formspreeSubmitted = false;
  try {
    await submitToFormspree({
      _subject: `Lazy Girls Tax lead: ${labels[source] || source}`,
      site: 'Lazy Girls Tax',
      source: labels[source] || source,
      name,
      email,
      phone,
      state,
      message,
      email_opt_in: emailOptIn,
      sms_opt_in: smsOptIn,
      mailing_list: mailingList,
      submitted_at_utc: submittedAt
    });
    formspreeSubmitted = true;
  } catch (e) {
    console.error('notify/lead Formspree:', e.message);
  }

  return res.status(200).json({ ok: true, notified, formspreeSubmitted });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '32kb'
    }
  }
};
