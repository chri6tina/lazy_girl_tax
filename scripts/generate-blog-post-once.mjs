/**
 * Generates one AI blog post by calling the local Next.js API (run `npm run dev` in lazy_girl_tax first).
 *
 *   npm run blog:generate-once
 *   npm run blog:generate-publish          # same, but publishes (works on Windows)
 *   npm run blog:generate-once -- --topic "Your topic"
 *
 * If port 3000 is a different Next app, this script auto-detects lazy_girl_tax by probing ports
 * (POST → 401 JSON Unauthorized). Override with BLOG_API_ORIGIN or BLOG_DEV_PORT in .env.local.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');

/** Prefer 3001 first — many devs have another app on 3000 */
const PORTS_TO_PROBE = [3001, 3002, 3003, 3000, 3004, 3005, 3006, 3007, 3008, 3009, 3010];

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
    console.error('Missing .env.local');
    process.exit(1);
  }
}

function argValue(name) {
  const i = process.argv.indexOf(name);
  if (i === -1 || !process.argv[i + 1]) return null;
  return process.argv[i + 1];
}

/** lazy_girl_tax returns 401 JSON for bad Bearer; other apps return HTML 404 */
async function probeLazyGirlCronApi(base) {
  const url = `${base.replace(/\/$/, '')}/api/cron/generate-blog-post`;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer __not_valid__',
        'Content-Type': 'application/json'
      },
      body: '{}',
      signal: ctrl.signal
    });
    clearTimeout(t);
    const text = await res.text();
    if (res.status !== 401) return false;
    const j = JSON.parse(text);
    return j?.error === 'Unauthorized';
  } catch {
    return false;
  }
}

async function resolveApiBase() {
  const explicit = (process.env.BLOG_API_ORIGIN || '').replace(/\/$/, '');
  if (explicit) return explicit;
  const p = process.env.BLOG_DEV_PORT?.trim();
  if (p) return `http://127.0.0.1:${p}`;

  for (const port of PORTS_TO_PROBE) {
    const base = `http://127.0.0.1:${port}`;
    if (await probeLazyGirlCronApi(base)) {
      console.error(`Auto-detected lazy_girl_tax dev server: ${base}`);
      return base;
    }
  }
  console.error(
    'Could not find lazy_girl_tax on common ports (need 401 JSON from /api/cron/generate-blog-post).\n' +
      'Start "npm run dev" in this folder, then run again — or set BLOG_API_ORIGIN or BLOG_DEV_PORT in .env.local.'
  );
  process.exit(1);
}

loadDotEnvLocal();

const cron = process.env.CRON_SECRET?.trim();
if (!cron) {
  console.error('Set CRON_SECRET in .env.local, then restart dev if needed.');
  process.exit(1);
}

const publish =
  process.argv.includes('--publish') ||
  process.env.BLOG_PUBLISH === '1' ||
  /^true$/i.test(process.env.BLOG_PUBLISH || '');
const topic = argValue('--topic');

const body = {
  publish,
  ...(topic ? { topic } : {})
};

async function main() {
  const base = await resolveApiBase();
  const url = `${base}/api/cron/generate-blog-post`;

  console.error(`Calling: POST ${url} (publish=${publish})`);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cron}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const looksLikeHtml = /<!DOCTYPE|<html[\s>]/i.test(text.slice(0, 200));
    if (looksLikeHtml || res.status === 404) {
      console.error(
        '\nWrong dev server or route missing. If lazy_girl_tax is running, set in .env.local:\n' +
          '  BLOG_API_ORIGIN=http://127.0.0.1:PORT\n' +
          '(Use the port shown when you run npm run dev in lazy_girl_tax.)\n'
      );
    }
    console.error('Failed:', res.status, looksLikeHtml ? '(HTML response, not JSON)' : json);
    process.exit(1);
  }

  console.log('OK:', json);
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || base;
  console.log(
    publish
      ? `\nPublished — open: ${site}/blog/${json.slug}`
      : `\nDraft — review in admin: ${site}/admin/posts/${json.id}/edit`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
