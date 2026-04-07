import { sanitizeEnvValue } from './sanitizeEnv';

const MAX_MESSAGE_LEN = 3900;

export function getTelegramNotifyConfig() {
  const token = sanitizeEnvValue(process.env.TELEGRAM_BOT_TOKEN);
  const chat = sanitizeEnvValue(process.env.TELEGRAM_DEFAULT_CHAT_ID);
  if (!token || !chat) return null;
  return {
    token,
    chatId: /^\d+$/.test(chat) ? Number(chat) : chat
  };
}

/**
 * Send a plain-text Telegram message using the site bot + default chat.
 * @param {string} text
 * @param {{ disableWebPagePreview?: boolean }} [opts]
 */
export async function sendTelegramMessage(text, opts = {}) {
  const cfg = getTelegramNotifyConfig();
  if (!cfg) return { skipped: true };

  let body = String(text || '').trim();
  if (!body) return { skipped: true };
  if (body.length > MAX_MESSAGE_LEN) {
    body = `${body.slice(0, MAX_MESSAGE_LEN - 1)}…`;
  }

  const res = await fetch(`https://api.telegram.org/bot${cfg.token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: cfg.chatId,
      text: body,
      disable_web_page_preview: opts.disableWebPagePreview !== false
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram ${res.status}: ${err.slice(0, 240)}`);
  }

  return { ok: true };
}
