import { serialize } from 'cookie';
import { COOKIE_NAME } from '../../../lib/adminAuth';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  const secure = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    serialize(COOKIE_NAME, '', {
      path: '/',
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: 0
    })
  );
  return res.status(200).json({ ok: true });
}
