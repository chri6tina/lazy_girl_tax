import { SignJWT } from 'jose';
import { serialize } from 'cookie';
import { verifyAdminPassword, COOKIE_NAME } from '../../../lib/adminAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!verifyAdminPassword(req.body?.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (!secret) {
    return res.status(500).json({ error: 'ADMIN_SESSION_SECRET is not set' });
  }

  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(secret));

  const secure = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    serialize(COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })
  );

  return res.status(200).json({ ok: true });
}

export const config = {
  api: { bodyParser: true }
};
