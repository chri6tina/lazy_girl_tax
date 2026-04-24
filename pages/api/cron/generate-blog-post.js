import { verifyCronAuth } from '../../../lib/cronAuth';
import { generateAndSaveResearchPost } from '../../../lib/researchBlogGenerator';

/**
 * Cron / agent endpoint: generates one research-style blog post via OpenAI, saves to Supabase.
 * Default: published immediately (live + sitemap). Opt out with ?publish=0 (GET) or publish: false (POST).
 *
 * Security: Authorization: Bearer CRON_SECRET (Vercel Cron uses this when CRON_SECRET is set)
 *           or header x-cron-secret: CRON_SECRET
 *
 * GET  — Vercel Cron; optional ?topic=...&publish=0 to save as draft
 * POST — JSON body { topic?, publish?: boolean, notifyTelegram? }
 */
export default async function handler(req, res) {
  if (!verifyCronAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let topic;
  let publish = true;
  let notifyTelegram = true;

  const explicitDraft = (v) =>
    v === false || v === 0 || v === '0' || v === 'false' || v === 'draft';

  if (req.method === 'POST') {
    topic = req.body?.topic;
    if (explicitDraft(req.body?.publish)) publish = false;
    if (req.body?.notifyTelegram === false) notifyTelegram = false;
  } else {
    topic = typeof req.query.topic === 'string' ? req.query.topic : undefined;
    if (explicitDraft(req.query.publish)) publish = false;
    if (req.query.notify === '0' || req.query.notify === 'false') notifyTelegram = false;
  }

  const result = await generateAndSaveResearchPost({
    topic,
    publish,
    notifyTelegram
  });

  if (result.error) {
    console.error(result.error);
    return res.status(502).json({
      error: result.error.message || 'Generation failed'
    });
  }

  return res.status(200).json({
    ok: true,
    id: result.post?.id,
    slug: result.post?.slug,
    title: result.post?.title,
    published: result.post?.published,
    topicUsed: result.topicUsed
  });
}

export const config = {
  api: { bodyParser: { sizeLimit: '64kb' } }
};
