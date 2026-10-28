'use client';
import { useCallback, useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { api, naira } from '@/lib/api';

const iso = (d: Date) => d.toISOString().slice(0, 10);

export default function AdminDashboard() {
  const now = new Date();
  const [from, setFrom] = useState(iso(new Date(now.getFullYear(), now.getMonth(), 1)));
  const [to, setTo] = useState(iso(now));
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setError('');
    api(`/reports/summary?from=${from}&to=${to}`).then(setData).catch((e) => setError(e.message));
  }, [from, to]);
  useEffect(() => { load(); }, [load]);

  function preset(days: number) {
    const end = new Date(); const start = new Date(); start.setDate(end.getDate() - (days - 1));
    setFrom(iso(start)); setTo(iso(end));
  }

  function exportCsv() {
    if (!data) return;
    const head = ['Staff', 'Total', 'Delivered', 'Failed', 'Returned', 'In progress', 'Success %', 'Approved expenses', 'Expense per delivery'];
    const rows = data.rows.map((r: any) => [r.name, r.total, r.delivered, r.failed, r.returned, r.inProgress, r.successRate ?? '', r.approvedExpenses, r.expensePerDelivery ?? '']);
    const csv = [head, ...rows].map((r: any[]) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `report_${from}_to_${to}.csv`; a.click();
  }

  const t = data?.totals;
  return (
    <Shell role="ADMIN">
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div><label className="label">From</label><input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><label className="label">To</label><input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <button className="btn-outline" onClick={() => preset(1)}>Today</button>
        <button className="btn-outline" onClick={() => preset(7)}>Last 7 days</button>
        <button className="btn-outline" onClick={() => preset(30)}>Last 30 days</button>
        <button className="btn" onClick={exportCsv} disabled={!data}>Export CSV</button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {t && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="card"><p className="text-xs text-gray-500">Tasks</p><p className="text-2xl font-semibold">{t.total}</p></div>
          <div className="card"><p className="text-xs text-gray-500">Delivered</p><p className="text-2xl font-semibold text-emerald-700">{t.delivered}</p></div>
          <div className="card"><p className="text-xs text-gray-500">Failed / Returned</p><p className="text-2xl font-semibold text-red-600">{t.failed} / {t.returned}</p></div>
          <div className="card"><p className="text-xs text-gray-500">Success rate</p><p className="text-2xl font-semibold">{t.successRate ?? '-'}{t.successRate != null && '%'}</p></div>
          <div className="card"><p className="text-xs text-gray-500">Approved expenses</p><p className="text-lg font-semibold">{naira(t.approvedExpenses)}</p></div>
        </div>
      )}
      <div className="card overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs text-gray-600">
            <tr>{['Staff', 'Tasks', 'Delivered', 'Failed', 'Returned', 'Active', 'Success', 'Expenses', 'Per delivery'].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {data?.rows.map((r: any) => (
              <tr key={r.staffId}>
                <td className="px-3 py-2 font-medium">{r.name}</td><td className="px-3 py-2">{r.total}</td>
                <td className="px-3 py-2">{r.delivered}</td><td className="px-3 py-2">{r.failed}</td><td className="px-3 py-2">{r.returned}</td>
                <td className="px-3 py-2">{r.inProgress}</td>
                <td className="px-3 py-2">{r.successRate != null ? `${r.successRate}%` : '-'}</td>
                <td className="px-3 py-2">{naira(r.approvedExpenses)}</td>
                <td className="px-3 py-2">{r.expensePerDelivery != null ? naira(r.expensePerDelivery) : '-'}</td>
              </tr>
            ))}
            {data && data.rows.length === 0 && <tr><td colSpan={9} className="px-3 py-4 text-gray-500">No staff yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-500">Tasks are counted by creation date. Expenses include approved entries only.</p>
    </Shell>
  );
}
