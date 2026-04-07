/**
 * Sends a test message via sendMessage — confirms token + chat_id end-to-end.
 * Run: npm run telegram-ping
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');

function loadDotEnvLocal() {
  try {
    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (key && process.env[key] === undefined) process.env[key] = val;
    }
  } catch {
    /* missing */
  }
}

loadDotEnvLocal();

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const chatRaw = process.env.TELEGRAM_DEFAULT_CHAT_ID?.trim();

if (!token) {
  console.error('Missing TELEGRAM_BOT_TOKEN in .env.local');
  process.exit(1);
}
if (!chatRaw) {
  console.error('Missing TELEGRAM_DEFAULT_CHAT_ID in .env.local');
  console.error('Run: npm run telegram-chat-ids — use the numeric id it prints.');
  process.exit(1);
}

const chatId = /^-?\d+$/.test(chatRaw) ? Number(chatRaw) : chatRaw;

async function main() {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: 'Lazy Girls Tax bot: connection test OK (npm run telegram-ping).'
    })
  });
  const data = await res.json();

  if (!data.ok) {
    console.error('Telegram API error:', data.description || data);
    console.error(
      '\nCommon fixes:\n' +
        '- Open the bot in Telegram and tap /start (user must not have blocked the bot).\n' +
        '- TELEGRAM_DEFAULT_CHAT_ID must match YOUR chat with THIS bot (run npm run telegram-chat-ids).\n' +
        '- For groups: bot must be in the group; id is often negative (-100...).'
    );
    process.exit(1);
  }

  console.log('Success — check Telegram. Message id:', data.result?.message_id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
