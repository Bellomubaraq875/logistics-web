'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import StatusBadge from '@/components/StatusBadge';
import { api, naira } from '@/lib/api';

type Task = { id: string; title: string; status: string; pickupAddress: string; dropoffAddress: string; customerName: string; dueDate: string | null };

const BORDER: Record<string, string> = {
  PENDING: 'border-l-slate-300', ACCEPTED: 'border-l-sky-400', PICKED_UP: 'border-l-indigo-400', IN_TRANSIT: 'border-l-amber-400',
  DELIVERED: 'border-l-emerald-500', FAILED: 'border-l-red-500', RETURNED: 'border-l-orange-400',
};
const svg = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

function TaskCard({ t, action }: { t: Task; action?: React.ReactNode }) {
  return (
    <div className={`task-card border-l-4 ${BORDER[t.status] || 'border-l-slate-300'}`}>
      <div className="flex items-start justify-between gap-2">
        <Link href={`/staff/tasks/${t.id}`} className="font-bold text-slate-900 hover:underline">{t.title}</Link>
        <StatusBadge status={t.status} />
      </div>
      <ul className="route">
        <li>{t.pickupAddress}</li>
        <li>{t.dropoffAddress} <span className="text-slate-400">· {t.customerName}</span></li>
      </ul>
      {t.dueDate && <p className="text-xs font-semibold text-slate-500">Due {new Date(t.dueDate).toLocaleDateString()}</p>}
      {action}
    </div>
  );
}

export default function StaffHome() {
  const [tab, setTab] = useState<'mine' | 'open'>('mine');
  const [mine, setMine] = useState<Task[] | null>(null);
  const [open, setOpen] = useState<Task[] | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [m, o, s] = await Promise.all([api<Task[]>('/tasks/mine'), api<Task[]>('/tasks/open'), api('/reports/my-summary')]);
      setMine(m); setOpen(o); setSummary(s);
    } catch (e: any) { setError(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function claim(id: string) {
    setError('');
    try { await api(`/tasks/${id}/claim`, { method: 'POST' }); await load(); setTab('mine'); }
    catch (e: any) { setError(e.message); await load(); }
  }

  const active = (mine || []).filter((t) => !['DELIVERED', 'RETURNED'].includes(t.status));
  const done = (mine || []).filter((t) => ['DELIVERED', 'RETURNED'].includes(t.status));

  return (
    <Shell role="STAFF">
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Today</h1>
        <p className="text-sm text-slate-500">Your deliveries, claimed tasks and expenses at a glance.</p>
      </div>

      {!summary ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20" />)}</div>
      ) : (
        <div className="fade-in grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="stat"><span className="stat-icon tone-emerald"><svg {...svg}><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></svg></span><div><p className="stat-label">Delivered today</p><p className="stat-value">{summary.delivered}</p></div></div>
          <div className="stat"><span className="stat-icon tone-red"><svg {...svg}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg></span><div><p className="stat-label">Failed today</p><p className="stat-value">{summary.failed}</p></div></div>
          <div className="stat"><span className="stat-icon tone-sky"><svg {...svg}><path d="M3 6h11v9H3z" /><path d="M14 9h4l3 3v3h-7z" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg></span><div><p className="stat-label">Active tasks</p><p className="stat-value">{summary.active}</p></div></div>
          <div className="stat min-w-0"><span className="stat-icon tone-amber"><svg {...svg}><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M3 10h18" /></svg></span><div className="min-w-0"><p className="stat-label">Today&apos;s expense</p><p className="text-base font-extrabold">{summary.expense ? naira(summary.expense.amount) : 'Not yet'}</p></div></div>
        </div>
      )}

      <div className="mb-3 mt-5 flex items-center justify-between gap-3">
        <div className="seg">
          <button className={tab === 'mine' ? 'is-active' : ''} onClick={() => setTab('mine')}>My tasks <span className="count">{active.length}</span></button>
          <button className={tab === 'open' ? 'is-active' : ''} onClick={() => setTab('open')}>Open tasks <span className="count">{(open || []).length}</span></button>
        </div>
        <button className="btn-outline !min-h-9 !px-3 text-xs" onClick={load}>Refresh</button>
      </div>

      {error && <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

      {(mine === null || open === null) && !error ? (
        <div className="grid gap-3 md:grid-cols-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton h-32" />)}</div>
      ) : (
        <div className="fade-in grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {tab === 'mine' && active.map((t) => <TaskCard key={t.id} t={t} />)}
          {tab === 'open' && (open || []).map((t) => (
            <TaskCard key={t.id} t={t} action={<button className="btn mt-1 w-full" onClick={() => claim(t.id)}>Claim this task</button>} />
          ))}
        </div>
      )}
      {mine && tab === 'mine' && active.length === 0 && <div className="card text-center text-sm text-slate-500">No active tasks. Check the Open tasks tab.</div>}
      {open && tab === 'open' && open.length === 0 && <div className="card text-center text-sm text-slate-500">No open tasks right now.</div>}

      {tab === 'mine' && done.length > 0 && (
        <>
          <h2 className="mb-2 mt-6 text-sm font-extrabold uppercase tracking-wide text-slate-500">Completed</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{done.slice(0, 9).map((t) => <TaskCard key={t.id} t={t} />)}</div>
        </>
      )}
    </Shell>
  );
}