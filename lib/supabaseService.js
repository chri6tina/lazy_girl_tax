import { createClient } from '@supabase/supabase-js';
import { sanitizeEnvValue, sanitizeSupabaseUrl } from './sanitizeEnv';

export function getServiceSupabase() {
  const url = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = sanitizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
