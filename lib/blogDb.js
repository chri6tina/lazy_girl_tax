import { getServiceSupabase } from './supabaseService';

const TABLE = 'blog_posts';

export async function listPublishedPosts() {
  const supabase = getServiceSupabase();
  if (!supabase) return { data: [], error: new Error('Database not configured') };
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, title, slug, excerpt, published_at, created_at')
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false });
  return { data: data || [], error };
}

export async function getPublishedPostBySlug(slug) {
  const supabase = getServiceSupabase();
  if (!supabase) return { data: null, error: new Error('Database not configured') };
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  return { data, error };
}

export async function listAllPostsAdmin() {
  const supabase = getServiceSupabase();
  if (!supabase) return { data: [], error: new Error('Database not configured') };
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, title, slug, excerpt, published, published_at, created_at, updated_at')
    .order('updated_at', { ascending: false });
  return { data: data || [], error };
}

export async function getPostByIdAdmin(id) {
  const supabase = getServiceSupabase();
  if (!supabase) return { data: null, error: new Error('Database not configured') };
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  return { data, error };
}

export async function isSlugTaken(slug) {
  const supabase = getServiceSupabase();
  if (!supabase) return true;
  const { data } = await supabase.from(TABLE).select('id').eq('slug', slug).maybeSingle();
  return !!data;
}

export async function insertPost(row) {
  const supabase = getServiceSupabase();
  if (!supabase) return { data: null, error: new Error('Database not configured') };
  const { data, error } = await supabase.from(TABLE).insert(row).select('*').single();
  return { data, error };
}

export async function updatePost(id, patch) {
  const supabase = getServiceSupabase();
  if (!supabase) return { data: null, error: new Error('Database not configured') };
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  return { data, error };
}

export async function deletePost(id) {
  const supabase = getServiceSupabase();
  if (!supabase) return { error: new Error('Database not configured') };
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  return { error };
}

export async function listPublishedSlugsForSitemap() {
  const supabase = getServiceSupabase();
  if (!supabase) return [];
  const { data } = await supabase.from(TABLE).select('slug').eq('published', true);
  return (data || []).map((r) => r.slug).filter(Boolean);
}
