import { verifyCronAuth } from '../../../lib/cronAuth';
import { generateAndSaveResearchPost } from '../../../lib/researchBlogGenerator';

/**
 * Cron / agent endpoint: generates one research-style blog draft via OpenAI, saves to Supabase.
 *
 * Security: Authorization: Bearer CRON_SECRET (Vercel Cron uses this when CRON_SECRET is set)
 *           or header x-cron-secret: CRON_SECRET
 *
 * GET  — for Vercel Cron; optional query ?topic=...&publish=1
 * POST — JSON body { topic?, publish?, notifyTelegram? }
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
  let publish = false;
  let notifyTelegram = true;

  if (req.method === 'POST') {
    topic = req.body?.topic;
    publish = !!req.body?.publish;
    if (req.body?.notifyTelegram === false) notifyTelegram = false;
  } else {
    topic = typeof req.query.topic === 'string' ? req.query.topic : undefined;
    publish = req.query.publish === '1' || req.query.publish === 'true';
    if (req.query.notify === '0' || req.query.notify === 'false') notifyTelegram = false;
  }

  const result = await generateAndSaveResearchPost({
    topic,
    publish,
    notifyTelegram,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL
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
