import { useRouter } from 'next/router';
import { useState } from 'react';
import { verifyAdminRequest } from '../../lib/adminAuth';

export default function AdminLogin() {
  const router = useRouter();
  const nextDest =
    typeof router.query.next === 'string' && router.query.next.startsWith('/')
      ? router.query.next
      : '/admin';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      router.push(nextDest);
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <h1>Blog admin</h1>
        <p>Sign in to manage posts.</p>
        {error ? <div className="admin-error">{error}</div> : null}
        <form onSubmit={onSubmit}>
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  if (await verifyAdminRequest(ctx.req)) {
    const n = ctx.query.next;
    const dest = typeof n === 'string' && n.startsWith('/') ? n : '/admin';
    return { redirect: { destination: dest, permanent: false } };
  }
  return { props: {} };
}
