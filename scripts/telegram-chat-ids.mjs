/**
 * Lists chat ids from your bot's recent updates (Telegram Bot API getUpdates).
 *
 * 1. Put TELEGRAM_BOT_TOKEN in .env.local
 * 2. Message your bot in Telegram (private or group) — or /start
 * 3. Run: npm run telegram-chat-ids
 *
 * If getUpdates is always empty, a webhook may be active. Run with --delete-webhook once
 * (only for dev bots — never on a bot that serves production traffic).
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
    /* missing .env.local */
  }
}

loadDotEnvLocal();

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
if (!token) {
  console.error('Set TELEGRAM_BOT_TOKEN in .env.local');
  process.exit(1);
}

const api = (method, body) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  }).then((r) => r.json());

function chatFromUpdate(u) {
  return (
    u.message?.chat ||
    u.edited_message?.chat ||
    u.channel_post?.chat ||
    u.edited_channel_post?.chat ||
    u.my_chat_member?.chat ||
    null
  );
}

async function main() {
  const deleteWebhook = process.argv.includes('--delete-webhook');

  let info = await api('getWebhookInfo');
  if (!info.ok) {
    console.error('getWebhookInfo:', info);
    process.exit(1);
  }
  if (info.result?.url) {
    console.warn(
      `Webhook is active: ${info.result.url}\n` +
        'While it is set, getUpdates usually stays empty.'
    );
    if (!deleteWebhook) {
      console.warn(
        'Options:\n' +
          '  • Use a separate test bot + token for this script, or\n' +
          '  • Run: npm run telegram-chat-ids -- --delete-webhook\n' +
          '    (only safe for a dev bot — removes the webhook so getUpdates works)\n'
      );
      process.exit(0);
    }
    console.warn('Removing webhook (--delete-webhook)...');
    const del = await api('deleteWebhook', { drop_pending_updates: true });
    if (!del.ok) {
      console.error('deleteWebhook:', del);
      process.exit(1);
    }
    console.warn('Webhook removed. Message your bot again, then re-run this script.\n');
  }

  const updates = await api('getUpdates');
  if (!updates.ok) {
    console.error('getUpdates:', updates);
    process.exit(1);
  }

  const rows = [];
  const seen = new Set();

  for (const u of updates.result || []) {
    const chat = chatFromUpdate(u);
    if (!chat?.id) continue;
    const id = chat.id;
    if (seen.has(id)) continue;
    seen.add(id);
    const label = [chat.type, chat.title || chat.username || chat.first_name || '(private)']
      .filter(Boolean)
      .join(' · ');
    rows.push({ id, label });
  }

  if (!rows.length) {
    console.log(
      'No chats found yet.\n' +
        '- Open Telegram, find your bot, tap Start or send any message.\n' +
        '- For a group: add the bot, send a message in the group (you may need to disable privacy mode in BotFather /setprivacy).\n' +
        '- Run: npm run telegram-chat-ids'
    );
    return;
  }

  console.log('Use this in TELEGRAM_DEFAULT_CHAT_ID:\n');
  for (const { id, label } of rows) {
    console.log(`  ${id}  (${label})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
