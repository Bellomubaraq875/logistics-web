'use client';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import StatusBadge from '@/components/StatusBadge';
import { api, naira, today } from '@/lib/api';

export default function StaffExpenses() {
  const [list, setList] = useState<any[]>([]);
  const [date, setDate] = useState(today());
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const load = useCallback(() => api('/expenses/mine').then(setList).catch((e) => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(''); setOk('');
    try {
      await api('/expenses', { method: 'POST', body: { date, amount: Number(amount), note: note || undefined } });
      setOk('Expense submitted for approval.'); setAmount(''); setNote(''); load();
    } catch (err: any) { setError(err.message); }
  }

  return (
    <Shell role="STAFF">
      <div className="mx-auto max-w-2xl space-y-4">
        <form onSubmit={submit} className="card space-y-3">
          <h1 className="text-lg font-semibold">Submit daily expense</h1>
          <p className="text-xs text-gray-500">One total per day (transport fare, etc.). You can edit a pending or rejected entry by submitting the same date again.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Date</label><input type="date" className="input" max={today()} value={date} onChange={(e) => setDate(e.target.value)} required /></div>
            <div><label className="label">Total fare spent (NGN)</label><input type="number" min="0" step="0.01" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} required /></div>
          </div>
          <div><label className="label">Note (optional)</label><input className="input" value={note} onChange={(e) => setNote(e.target.value)} /></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {ok && <p className="text-sm text-emerald-700">{ok}</p>}
          <button className="btn">Submit</button>
        </form>

        <div className="card">
          <h2 className="mb-2 text-sm font-semibold">My expense history</h2>
          <ul className="divide-y text-sm">
            {list.map((x) => (
              <li key={x.id} className="flex items-center justify-between py-2">
                <div><p>{new Date(x.date).toLocaleDateString('en-NG', { dateStyle: 'medium', timeZone: 'UTC' })} · <b>{naira(x.amount)}</b></p>
                  {x.note && <p className="text-xs text-gray-500">{x.note}</p>}
                  {x.reviewNote && <p className="text-xs text-red-600">Admin: {x.reviewNote}</p>}</div>
                <StatusBadge status={x.status} />
              </li>
            ))}
            {list.length === 0 && <li className="py-2 text-gray-500">No expenses submitted yet.</li>}
          </ul>
        </div>
      </div>
    </Shell>
  );
}
