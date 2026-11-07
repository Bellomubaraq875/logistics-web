'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

type IconName = 'grid' | 'tasks' | 'users' | 'wallet' | 'truck';
type Item = { href: string; label: string; icon: IconName };

const NAV: Record<'ADMIN' | 'STAFF', Item[]> = {
  ADMIN: [
    { href: '/admin', label: 'Dashboard', icon: 'grid' },
    { href: '/admin/tasks', label: 'Tasks', icon: 'tasks' },
    { href: '/admin/staff', label: 'Staff', icon: 'users' },
    { href: '/admin/expenses', label: 'Expenses', icon: 'wallet' },
  ],
  STAFF: [
    { href: '/staff', label: 'My Tasks', icon: 'truck' },
    { href: '/staff/expenses', label: 'Expense', icon: 'wallet' },
  ],
};

function Icon({ name }: { name: IconName }) {
  const p = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  switch (name) {
    case 'grid': return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>;
    case 'tasks': return <svg {...p}><rect x="5" y="3" width="14" height="18" rx="3" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>;
    case 'users': return <svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><circle cx="17.5" cy="9" r="2.5" /><path d="M17 14.2c2.6.2 4.5 2 4.5 5.3" /></svg>;
    case 'wallet': return <svg {...p}><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M3 10h18" /><circle cx="16.5" cy="15" r="1.2" /></svg>;
    default: return <svg {...p}><path d="M3 6h11v9H3z" /><path d="M14 9h4l3 3v3h-7z" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>;
  }
}

export default function Shell({ role, children }: { role: 'ADMIN' | 'STAFF'; children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/login');
    else if (user.role !== role) router.replace(user.role === 'ADMIN' ? '/admin' : '/staff');
  }, [user, loading, role, router]);

  if (loading || !user || user.role !== role) {
    return <div className="grid min-h-screen place-items-center"><div className="spinner" role="status" aria-label="Loading" /></div>;
  }

  const items = NAV[role];
  const isActive = (href: string) =>
    path === href || (href === '/staff' ? path.startsWith('/staff/tasks') : href !== '/admin' && path.startsWith(href));
  const initials = user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="min-h-screen">
      <header className="app-header">
        <div className="page flex items-center gap-3 py-2.5">
          <Link href={role === 'ADMIN' ? '/admin' : '/staff'} className="flex items-center gap-2.5">
            <span className="brand-chip" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></svg>
            </span>
            <span className="hidden font-extrabold tracking-tight text-emerald-900 sm:inline">Logistics Tracker</span>
          </Link>
          <nav className="ml-4 hidden flex-1 items-center gap-1 md:flex" aria-label="Main">
            {items.map((n) => (
              <Link key={n.href} href={n.href} className={`nav-pill ${isActive(n.href) ? 'is-active' : ''}`} aria-current={isActive(n.href) ? 'page' : undefined}>
                <Icon name={n.icon} />{n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2.5">
            <div className="avatar" aria-hidden="true">{initials}</div>
            <div className="hidden text-right leading-tight sm:block">
              <p className="text-sm font-bold text-slate-800">{user.name}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">{role === 'ADMIN' ? 'Super Admin' : 'Staff'}</p>
            </div>
            <button onClick={logout} className="btn-outline !min-h-9 !px-3 text-xs">Log out</button>
          </div>
        </div>
      </header>

      <main className="page fade-in pb-28 pt-5 md:pb-10">{children}</main>

      <nav className="tabbar md:hidden" aria-label="Main">
        {items.map((n) => (
          <Link key={n.href} href={n.href} className={`tab ${isActive(n.href) ? 'is-active' : ''}`} aria-current={isActive(n.href) ? 'page' : undefined}>
            <Icon name={n.icon} />{n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}