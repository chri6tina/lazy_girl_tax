import { verifyAdminRequest } from '../../../../lib/adminAuth';
import { updatePost, deletePost, getPostByIdAdmin } from '../../../../lib/blogDb';
import { slugify } from '../../../../lib/slugify';

function pickPublishedAt(published, previousPublished, previousPublishedAt) {
  if (!published) return null;
  if (previousPublished && previousPublishedAt) return previousPublishedAt;
  return new Date().toISOString();
}

export default async function handler(req, res) {
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid id' });
  }

  if (req.method === 'GET') {
    const { data, error } = await getPostByIdAdmin(id);
    if (error || !data) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(200).json({ post: data });
  }

  if (req.method === 'PUT') {
    const { title, slug: slugInput, excerpt, body, published } = req.body || {};
    const { data: existing } = await getPostByIdAdmin(id);
    if (!existing) {
      return res.status(404).json({ error: 'Not found' });
    }

    const pub = published != null ? !!published : existing.published;
    let nextSlug;
    if (slugInput != null) {
      nextSlug = slugify(slugInput);
      if (!nextSlug) {
        return res.status(400).json({ error: 'Invalid slug' });
      }
    }

    const patch = {
      ...(title != null ? { title: String(title).trim() } : {}),
      ...(slugInput != null ? { slug: nextSlug } : {}),
      ...(excerpt != null ? { excerpt: String(excerpt) } : {}),
      ...(body != null ? { body: String(body) } : {}),
      published: pub,
      published_at: pickPublishedAt(pub, existing.published, existing.published_at)
    };

    const { data, error } = await updatePost(id, patch);
    if (error) {
      if (error.code === '23505' || String(error.message || '').toLowerCase().includes('duplicate')) {
        return res.status(409).json({ error: 'Slug already exists.' });
      }
      console.error(error);
      return res.status(500).json({ error: error.message || 'Update failed' });
    }
    return res.status(200).json({ post: data });
  }

  if (req.method === 'DELETE') {
    const { error } = await deletePost(id);
    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || 'Delete failed' });
    }
    return res.status(204).end();
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}

export const config = {
  api: { bodyParser: { sizeLimit: '2mb' } }
};
