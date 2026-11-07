'use client';
import { useCallback, useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { api, naira } from '@/lib/api';

const iso = (d: Date) => d.toISOString().slice(0, 10);
const svg = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

type Row = { staffId: string; name: string; total: number; delivered: number; failed: number; returned: number; inProgress: number; successRate: number | null; approvedExpenses: number; expensePerDelivery: number | null };

function Stat({ label, value, tone, icon, wide }: { label: string; value: React.ReactNode; tone: string; icon: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`stat ${wide ? 'col-span-2 lg:col-span-1' : ''}`}>
      <span className={`stat-icon ${tone}`}>{icon}</span>
      <div className="min-w-0"><p className="stat-label">{label}</p><p className="stat-value break-words">{value}</p></div>
    </div>
  );
}

export default function AdminDashboard() {
  const now = new Date();
  const [from, setFrom] = useState(iso(new Date(now.getFullYear(), now.getMonth(), 1)));
  const [to, setTo] = useState(iso(now));
  const [preset, setPreset] = useState<number | null>(null);
  const [data, setData] = useState<{ rows: Row[]; totals: any } | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setError('');
    api(`/reports/summary?from=${from}&to=${to}`).then(setData).catch((e) => setError(e.message));
  }, [from, to]);
  useEffect(() => { load(); }, [load]);

  function applyPreset(days: number) {
    const end = new Date(); const start = new Date(); start.setDate(end.getDate() - (days - 1));
    setFrom(iso(start)); setTo(iso(end)); setPreset(days);
  }

  function exportCsv() {
    if (!data) return;
    const head = ['Staff', 'Total', 'Delivered', 'Failed', 'Returned', 'In progress', 'Success %', 'Approved expenses', 'Expense per delivery'];
    const rows = data.rows.map((r) => [r.name, r.total, r.delivered, r.failed, r.returned, r.inProgress, r.successRate ?? '', r.approvedExpenses, r.expensePerDelivery ?? '']);
    const csv = [head, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `report_${from}_to_${to}.csv`; a.click();
  }

  const t = data?.totals;
  return (
    <Shell role="ADMIN">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Delivery performance and expenses by staff member.</p>
        </div>
        <button className="btn" onClick={exportCsv} disabled={!data}>Export CSV</button>
      </div>

      <div className="card mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-[9rem] flex-1"><label className="label">From</label><input type="date" className="input" value={from} onChange={(e) => { setFrom(e.target.value); setPreset(null); }} /></div>
        <div className="min-w-[9rem] flex-1"><label className="label">To</label><input type="date" className="input" value={to} onChange={(e) => { setTo(e.target.value); setPreset(null); }} /></div>
        <div className="seg w-full sm:w-auto">
          {[[1, 'Today'], [7, '7 days'], [30, '30 days']].map(([d, l]) => (
            <button key={d} className={`flex-1 justify-center ${preset === d ? 'is-active' : ''}`} onClick={() => applyPreset(d as number)}>{l}</button>
          ))}
        </div>
      </div>

      {error && <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

      {!t ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20" />)}</div>
      ) : (
        <div className="fade-in grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Stat label="Tasks" value={t.total} tone="tone-sky" icon={<svg {...svg}><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /></svg>} />
          <Stat label="Delivered" value={t.delivered} tone="tone-emerald" icon={<svg {...svg}><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></svg>} />
          <Stat label="Failed / Returned" value={`${t.failed} / ${t.returned}`} tone="tone-red" icon={<svg {...svg}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>} />
          <Stat label="Success rate" value={t.successRate != null ? `${t.successRate}%` : '-'} tone="tone-violet" icon={<svg {...svg}><path d="M4 18l5-6 4 3 7-9" /><path d="M15 6h5v5" /></svg>} />
          <Stat wide label="Approved expenses" value={naira(t.approvedExpenses)} tone="tone-amber" icon={<svg {...svg}><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M3 10h18" /></svg>} />
        </div>
      )}

      <h2 className="mb-2 mt-6 text-sm font-extrabold uppercase tracking-wide text-slate-500">Staff performance</h2>

      {/* Desktop table */}
      <div className="card hidden overflow-x-auto p-0 md:block">
        <table className="tbl">
          <thead><tr>{['Staff', 'Tasks', 'Delivered', 'Failed', 'Returned', 'Active', 'Success', 'Expenses', 'Per delivery'].map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {data?.rows.map((r) => (
              <tr key={r.staffId}>
                <td className="font-bold text-slate-800">{r.name}</td><td>{r.total}</td>
                <td className="font-semibold text-emerald-700">{r.delivered}</td><td className="text-red-600">{r.failed}</td><td className="text-orange-600">{r.returned}</td>
                <td>{r.inProgress}</td>
                <td><div className="flex items-center gap-2"><div className="bar"><i style={{ width: `${r.successRate ?? 0}%` }} /></div><span className="text-xs font-bold">{r.successRate != null ? `${r.successRate}%` : '-'}</span></div></td>
                <td>{naira(r.approvedExpenses)}</td>
                <td>{r.expensePerDelivery != null ? naira(r.expensePerDelivery) : '-'}</td>
              </tr>
            ))}
            {data && data.rows.length === 0 && <tr><td colSpan={9} className="text-slate-500">No staff yet. Add staff from the Staff page.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {data?.rows.map((r) => (
          <div key={r.staffId} className="card">
            <div className="mb-2 flex items-center justify-between"><p className="font-bold text-slate-800">{r.name}</p><span className="text-xs font-bold text-emerald-700">{r.successRate != null ? `${r.successRate}% success` : 'No closed tasks'}</span></div>
            <div className="bar mb-3 !w-full"><i style={{ width: `${r.successRate ?? 0}%` }} /></div>
            <dl className="grid grid-cols-4 gap-2 text-center text-xs">
              <div><dt className="text-slate-500">Tasks</dt><dd className="text-base font-extrabold">{r.total}</dd></div>
              <div><dt className="text-slate-500">Done</dt><dd className="text-base font-extrabold text-emerald-700">{r.delivered}</dd></div>
              <div><dt className="text-slate-500">Failed</dt><dd className="text-base font-extrabold text-red-600">{r.failed}</dd></div>
              <div><dt className="text-slate-500">Active</dt><dd className="text-base font-extrabold">{r.inProgress}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-slate-500">Expenses: <b className="text-slate-700">{naira(r.approvedExpenses)}</b>{r.expensePerDelivery != null && <> · {naira(r.expensePerDelivery)} per delivery</>}</p>
          </div>
        ))}
        {data && data.rows.length === 0 && <p className="text-sm text-slate-500">No staff yet.</p>}
      </div>
      <p className="mt-3 text-xs text-slate-500">Tasks are counted by creation date. Expenses include approved entries only.</p>
    </Shell>
  );
}