'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import StatusBadge from '@/components/StatusBadge';
import { api, naira } from '@/lib/api';

type Task = { id: string; title: string; status: string; pickupAddress: string; dropoffAddress: string; customerName: string; dueDate: string | null };

function TaskCard({ t, action }: { t: Task; action?: React.ReactNode }) {
  return (
    <div className="card space-y-1">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/staff/tasks/${t.id}`} className="font-medium hover:underline">{t.title}</Link>
        <StatusBadge status={t.status} />
      </div>
      <p className="text-xs text-gray-600">From: {t.pickupAddress}</p>
      <p className="text-xs text-gray-600">To: {t.dropoffAddress} ({t.customerName})</p>
      {t.dueDate && <p className="text-xs text-gray-500">Due: {new Date(t.dueDate).toLocaleDateString()}</p>}
      {action}
    </div>
  );
}

export default function StaffHome() {
  const [tab, setTab] = useState<'mine' | 'open'>('mine');
  const [mine, setMine] = useState<Task[]>([]);
  const [open, setOpen] = useState<Task[]>([]);
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

  const active = mine.filter((t) => !['DELIVERED', 'RETURNED'].includes(t.status));
  const done = mine.filter((t) => ['DELIVERED', 'RETURNED'].includes(t.status));

  return (
    <Shell role="STAFF">
      {summary && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="card"><p className="text-xs text-gray-500">Delivered today</p><p className="text-2xl font-semibold text-emerald-700">{summary.delivered}</p></div>
          <div className="card"><p className="text-xs text-gray-500">Failed today</p><p className="text-2xl font-semibold text-red-600">{summary.failed}</p></div>
          <div className="card"><p className="text-xs text-gray-500">Active tasks</p><p className="text-2xl font-semibold">{summary.active}</p></div>
          <div className="card"><p className="text-xs text-gray-500">Today's expense</p>
            <p className="text-lg font-semibold">{summary.expense ? naira(summary.expense.amount) : 'Not submitted'}</p></div>
        </div>
      )}
      <div className="mb-3 flex gap-2">
        <button onClick={() => setTab('mine')} className={tab === 'mine' ? 'btn' : 'btn-outline'}>My Tasks ({active.length})</button>
        <button onClick={() => setTab('open')} className={tab === 'open' ? 'btn' : 'btn-outline'}>Open Tasks ({open.length})</button>
      </div>
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {tab === 'mine' && active.map((t) => <TaskCard key={t.id} t={t} />)}
        {tab === 'open' && open.map((t) => (
          <TaskCard key={t.id} t={t} action={<button className="btn mt-2" onClick={() => claim(t.id)}>Claim this task</button>} />
        ))}
      </div>
      {tab === 'mine' && active.length === 0 && <p className="text-sm text-gray-500">No active tasks. Check the Open Tasks tab.</p>}
      {tab === 'open' && open.length === 0 && <p className="text-sm text-gray-500">No open tasks right now.</p>}
      {tab === 'mine' && done.length > 0 && (
        <>
          <h2 className="mb-2 mt-6 text-sm font-semibold text-gray-600">Completed</h2>
          <div className="grid gap-3 sm:grid-cols-2">{done.slice(0, 10).map((t) => <TaskCard key={t.id} t={t} />)}</div>
        </>
      )}
    </Shell>
  );
}
