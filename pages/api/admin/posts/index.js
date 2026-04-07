import { verifyAdminRequest } from '../../../../lib/adminAuth';
import { insertPost } from '../../../../lib/blogDb';
import { slugify } from '../../../../lib/slugify';

function pickPublishedAt(published, existingPublishedAt) {
  if (!published) return null;
  return existingPublishedAt || new Date().toISOString();
}

export default async function handler(req, res) {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, slug: slugInput, excerpt, body, published } = req.body || {};
  if (!title || String(title).trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const slug = slugify(slugInput || title);
  if (!slug) {
    return res.status(400).json({ error: 'Could not generate a URL slug from the title' });
  }

  const pub = !!published;
  const { data, error } = await insertPost({
    title: String(title).trim(),
    slug,
    excerpt: excerpt != null ? String(excerpt) : '',
    body: body != null ? String(body) : '',
    published: pub,
    published_at: pickPublishedAt(pub, null)
  });

  if (error) {
    if (error.code === '23505' || String(error.message || '').toLowerCase().includes('duplicate')) {
      return res.status(409).json({ error: 'Slug already exists — pick a different title or slug.' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message || 'Save failed' });
  }

  return res.status(201).json({ post: data });
}

export const config = {
  api: { bodyParser: { sizeLimit: '2mb' } }
};
