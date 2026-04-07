import Link from 'next/link';
import { useRouter } from 'next/router';

const LINKS = [
  { href: '/admin', label: 'Dashboard', active: (r) => r.pathname === '/admin' },
  {
    href: '/admin/posts',
    label: 'All posts',
    active: (r) => r.pathname === '/admin/posts' || r.pathname === '/admin/posts/[id]/edit'
  },
  { href: '/admin/posts/new', label: 'New post', active: (r) => r.pathname === '/admin/posts/new' }
];

function linkActive(router, item) {
  return item.active(router);
}

export default function AdminLayout({ children, title }) {
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="admin-root">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar-brand">Lazy Girls Tax</div>
        <p className="admin-sidebar-muted">Blog admin</p>
        <nav className="admin-sidebar-nav">
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkActive(router, item) ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/blog">View blog (public)</Link>
        </nav>
        <button type="button" className="admin-logout" onClick={logout}>
          Log out
        </button>
      </aside>
      <div className="admin-main">
        {title ? <h1 className="admin-page-title">{title}</h1> : null}
        {children}
      </div>
    </div>
  );
}
