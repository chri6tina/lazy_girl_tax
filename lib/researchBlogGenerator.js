import { insertPost, isSlugTaken } from './blogDb';
import { sanitizeEnvValue } from './sanitizeEnv';
import { slugify } from './slugify';
import { sendTelegramMessage } from './telegramNotify';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const DEFAULT_TOPIC_POOL = [
  'Why self-employment tax matters for 1099 and platform income',
  'Recordkeeping for cash, tips, and payment apps (Venmo, Cash App, PayPal)',
  'What to do if you did not receive a 1099-NEC',
  'Schedule C basics for independent contractors and creators',
  'Quarterly estimated taxes: who must pay and rough due dates',
  'Deducting ordinary and necessary business expenses without red flags',
  'Home office deduction rules in plain language',
  'Multi-state income: when you might owe more than one state return',
  'LLC vs sole proprietor for tax purposes (high level, not legal advice)',
  'S-corp payroll and reasonable compensation—when it is worth discussing',
  'OnlyFans and platform chargebacks: keeping income records clean',
  'Separate business bank accounts: why we recommend them',
  'How long to keep tax records and supporting documents',
  'Getting caught up on past-due returns without panic',
  'Estimated taxes vs withholding when you also have a W-2 job'
];

const SYSTEM_PROMPT = `You are the senior content editor for Lazy Girls Tax, a U.S. tax preparation and bookkeeping firm that works with adult industry workers, dancers, escorts, content creators, and other independent contractors—especially women and femme clients—who need judgment-free, accurate help.

Write in a warm, confident, stigma-free voice. Never include graphic sexual content, slurs, or sensationalism. Focus on practical U.S. federal tax education and honest recordkeeping. When you mention rules, keep them general and encourage readers to confirm details for their situation.

You must end the article body with a short "### Disclaimer" Markdown section stating that the post is general information, not individualized tax or legal advice, and that readers should consult a qualified professional (such as Lazy Girls Tax) for their own facts.

Output MUST be a single JSON object with exactly these string keys:
- title: compelling, specific, under 90 characters
- slug: lowercase kebab-case, short, no year unless essential, no trailing slash
- excerpt: 1–2 sentences for social/search previews
- bodyMarkdown: full post in Markdown (use ## and ### headings, bullet lists where helpful). Target roughly 900–1400 words. No front matter.`;

function pickTopic(explicit) {
  if (explicit && String(explicit).trim()) {
    return String(explicit).trim().slice(0, 500);
  }
  const pool = process.env.CRON_BLOG_TOPICS?.split('|')
    .map((s) => s.trim())
    .filter(Boolean);
  const topics = pool?.length ? pool : DEFAULT_TOPIC_POOL;
  return topics[Math.floor(Math.random() * topics.length)];
}

function stripJsonFence(raw) {
  let s = String(raw || '').trim();
  if (s.startsWith('```')) {
    s = s.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim();
  }
  return s;
}

async function callOpenAiForPost(topic) {
  const key = sanitizeEnvValue(process.env.OPENAI_API_KEY);
  if (!key) {
    return { error: new Error('OPENAI_API_KEY is not set') };
  }

  const userMessage = `Topic to cover:\n${topic}\n\nWrite for readers who may earn W-2, 1099-NEC, platform payouts, cash tips, or mixed income. Use inclusive language ("clients," "creators," "independent workers"). Ground explanations in common IRS concepts but do not fabricate citations or exact revenue procedure numbers unless you are certain; prefer "typically" and "often" when rules vary.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.65,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    return { error: new Error(`OpenAI HTTP ${res.status}: ${errText.slice(0, 400)}`) };
  }

  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) {
    return { error: new Error('OpenAI returned no message content') };
  }

  let parsed;
  try {
    parsed = JSON.parse(stripJsonFence(content));
  } catch (e) {
    return { error: new Error('Could not parse OpenAI JSON output') };
  }

  const title = String(parsed.title || '').trim();
  const excerpt = String(parsed.excerpt || '').trim();
  let bodyMarkdown = String(parsed.bodyMarkdown || parsed.body || '').trim();
  let slug = slugify(parsed.slug || title);

  if (!title || !bodyMarkdown) {
    return { error: new Error('OpenAI output missing title or bodyMarkdown') };
  }
  if (!slug) {
    slug = slugify(title);
  }

  return { title, excerpt, bodyMarkdown, slug };
}

async function uniqueSlug(base) {
  let s = base;
  let n = 0;
  while (await isSlugTaken(s)) {
    n += 1;
    s = `${base}-${n}`;
    if (n > 50) {
      s = `${base}-${Date.now().toString(36)}`;
      break;
    }
  }
  return s;
}

function shortSummary(post, maxLen = 200) {
  const raw = String(post.excerpt || '').trim() || String(post.body || '').replace(/\s+/g, ' ').trim();
  if (!raw) return '—';
  const oneLine = raw.replace(/\r?\n/g, ' ');
  if (oneLine.length <= maxLen) return oneLine;
  return `${oneLine.slice(0, maxLen - 1)}…`;
}

async function notifyTelegramDraft(post, baseUrl) {
  const origin = (baseUrl || '').replace(/\/$/, '');
  const adminPath = `/admin/posts/${post.id}/edit`;
  const blogPath = `/blog/${post.slug}`;
  const adminUrl = origin ? `${origin}${adminPath}` : adminPath;
  const blogUrl = origin ? `${origin}${blogPath}` : blogPath;

  const summary = shortSummary(post, 220);

  let text = `Lazy Girls Tax — new blog post (AI)\n\n`;
  text += `Title:\n${post.title}\n\n`;
  text += `Summary:\n${summary}\n\n`;

  if (post.published) {
    text += `Read:\n${blogUrl}`;
  } else {
    text += `Review & publish:\n${adminUrl}\n\n`;
    text += `Will be at (after you publish):\n${blogUrl}`;
  }

  try {
    const r = await sendTelegramMessage(text, { disableWebPagePreview: false });
    if (r.skipped) return;
  } catch (e) {
    console.error('Telegram sendMessage failed:', e.message);
  }
}

/**
 * Generates a post via OpenAI and inserts into blog_posts.
 * @param {object} opts
 * @param {string} [opts.topic] - optional focus; otherwise random from pool / env
 * @param {boolean} [opts.publish] - if true, publish immediately (default false = draft)
 * @param {boolean} [opts.notifyTelegram] - ping Telegram if configured (default true)
 * @param {string} [opts.siteUrl] - origin for links in notifications
 */
export async function generateAndSaveResearchPost(opts = {}) {
  const topic = pickTopic(opts.topic);
  const publish = !!opts.publish;
  const notifyTelegram = opts.notifyTelegram !== false;

  const ai = await callOpenAiForPost(topic);
  if (ai.error) {
    return { error: ai.error };
  }

  const { title, excerpt, bodyMarkdown, slug } = ai;
  const finalSlug = await uniqueSlug(slug);

  const row = {
    title,
    slug: finalSlug,
    excerpt,
    body: bodyMarkdown,
    published: publish,
    published_at: publish ? new Date().toISOString() : null
  };

  const { data, error } = await insertPost(row);
  if (error) {
    return { error };
  }

  if (notifyTelegram && data) {
    try {
      await notifyTelegramDraft(data, opts.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || '');
    } catch {
      /* optional */
    }
  }

  return { post: data, topicUsed: topic };
}
