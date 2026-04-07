import { timingSafeEqual, randomBytes } from 'crypto';
import { jwtVerify } from 'jose';
import { parse as parseCookie } from 'cookie';

const COOKIE_NAME = 'lgt_admin';

function safeStringEqual(a, b) {
  const A = Buffer.from(a ?? '', 'utf8');
  const B = Buffer.from(b ?? '', 'utf8');
  if (A.length !== B.length) {
    timingSafeEqual(randomBytes(32), randomBytes(32));
    return false;
  }
  return timingSafeEqual(A, B);
}

export function verifyAdminPassword(attempt) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeStringEqual(attempt, expected);
}

export async function verifyAdminRequest(req) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  const raw = req.headers.cookie || '';
  const cookies = parseCookie(raw);
  const token = cookies[COOKIE_NAME];
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function requireAdminGssp(ctx) {
  const ok = await verifyAdminRequest(ctx.req);
  if (!ok) {
    const nextPath = ctx.resolvedUrl || ctx.req?.url || '/admin';
    return {
      redirect: {
        destination: '/admin/login?next=' + encodeURIComponent(nextPath),
        permanent: false
      }
    };
  }
  return null;
}

export { COOKIE_NAME };
