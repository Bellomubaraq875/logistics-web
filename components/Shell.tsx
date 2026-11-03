'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

const NAV = {
  ADMIN: [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/tasks', label: 'Tasks' },
    { href: '/admin/staff', label: 'Staff' },
    { href: '/admin/expenses', label: 'Expenses' },
  ],
  STAFF: [
    { href: '/staff', label: 'Tasks' },
    { href: '/staff/expenses', label: 'Daily Expense' },
  ],
};

export default function Shell({ role, children }: { role: 'ADMIN' | 'STAFF'; children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/login');
    else if (user.role !== role) router.replace(user.role === 'ADMIN' ? '/admin' : '/staff');
  }, [user, loading, role, router]);

  if (loading || !user || user.role !== role) return <p className="p-8 text-sm text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <span className="font-semibold text-emerald-800">Logistics Tracker</span>
          <nav className="flex flex-1 gap-4 text-sm">
            {NAV[role].map((n) => (
              <Link key={n.href} href={n.href}
                className={path === n.href ? 'font-medium text-emerald-800' : 'text-gray-600 hover:text-gray-900'}>
                {n.label}
              </Link>
            ))}
          </nav>
          <span className="text-xs text-gray-500">{user.name}</span>
          <button onClick={logout} className="text-xs text-red-600 hover:underline">Log out</button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4">{children}</main>
    </div>
  );
}
