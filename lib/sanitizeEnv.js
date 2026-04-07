/**
 * Normalize values from .env / hosting dashboards (trim, strip wrapping quotes,
 * accidental "Bearer " prefix on API keys).
 */
export function sanitizeEnvValue(raw) {
  if (raw == null) return '';
  let s = String(raw).trim();
  if (!s) return '';
  // Strip one layer of matching quotes often pasted into .env by mistake
  if (
    (s.startsWith('"') && s.endsWith('"') && s.length >= 2) ||
    (s.startsWith("'") && s.endsWith("'") && s.length >= 2)
  ) {
    s = s.slice(1, -1).trim();
  }
  if (/^bearer\s+/i.test(s)) {
    s = s.replace(/^bearer\s+/i, '').trim();
  }
  return s;
}

/** Supabase project URL without trailing slash. */
export function sanitizeSupabaseUrl(raw) {
  const s = sanitizeEnvValue(raw);
  return s.replace(/\/+$/, '');
}
