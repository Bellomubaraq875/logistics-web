'use client';
import { useCallback, useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import StatusBadge from '@/components/StatusBadge';
import { api, naira } from '@/lib/api';

export default function AdminExpenses() {
  const [status, setStatus] = useState('PENDING');
  const [list, setList] = useState<any[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api(`/expenses${status ? `?status=${status}` : ''}`).then(setList).catch((e) => setError(e.message));
  }, [status]);
  useEffect(() => { load(); }, [load]);

  async function review(id: string, s: 'APPROVED' | 'REJECTED') {
    let reviewNote: string | undefined;
    if (s === 'REJECTED') {
      const r = window.prompt('Reason for rejection (staff will see this):');
      if (r === null) return;
      reviewNote = r || undefined;
    }
    try { await api(`/expenses/${id}/review`, { method: 'PATCH', body: { status: s, reviewNote } }); load(); }
    catch (e: any) { setError(e.message); }
  }

  return (
    <Shell role="ADMIN">
      <div className="mb-3 flex gap-2">
        {['PENDING', 'APPROVED', 'REJECTED', ''].map((s) => (
          <button key={s || 'all'} className={status === s ? 'btn' : 'btn-outline'} onClick={() => setStatus(s)}>{s ? s.charAt(0) + s.slice(1).toLowerCase() : 'All'}</button>
        ))}
      </div>
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
      <div className="space-y-2">
        {list.map((x) => (
          <div key={x.id} className="card flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium">{x.staff.name} · {naira(x.amount)}</p>
              <p className="text-xs text-gray-500">{new Date(x.date).toLocaleDateString('en-NG', { dateStyle: 'medium', timeZone: 'UTC' })}{x.note ? ` · ${x.note}` : ''}</p>
              {x.reviewNote && <p className="text-xs text-red-600">Note: {x.reviewNote}</p>}
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={x.status} />
              {x.status === 'PENDING' && (<>
                <button className="btn" onClick={() => review(x.id, 'APPROVED')}>Approve</button>
                <button className="btn-danger" onClick={() => review(x.id, 'REJECTED')}>Reject</button>
              </>)}
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-gray-500">Nothing here.</p>}
      </div>
    </Shell>
  );
}
