'use client';
import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import StatusBadge from '@/components/StatusBadge';
import { api, STATUS_LABEL } from '@/lib/api';

const EMPTY = { title: '', description: '', pickupAddress: '', dropoffAddress: '', customerName: '', customerPhone: '', dueDate: '', assignedToId: '' };

export default function AdminTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [filter, setFilter] = useState({ status: '', staffId: '' });
  const [error, setError] = useState('');

  const load = useCallback(() => {
    const q = new URLSearchParams();
    if (filter.status) q.set('status', filter.status);
    if (filter.staffId) q.set('staffId', filter.staffId);
    api(`/tasks?${q}`).then(setTasks).catch((e) => setError(e.message));
  }, [filter]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { api('/users/staff').then(setStaff).catch(() => {}); }, []);

  async function create(e: FormEvent) {
    e.preventDefault(); setError('');
    try {
      const body: any = { ...form };
      Object.keys(body).forEach((k) => body[k] === '' && delete body[k]);
      await api('/tasks', { method: 'POST', body });
      setForm(EMPTY); load();
    } catch (err: any) { setError(err.message); }
  }
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });
  const activeStaff = staff.filter((s) => s.isActive);

  return (
    <Shell role="ADMIN">
      <div className="grid gap-4 lg:grid-cols-3">
        <form onSubmit={create} className="card space-y-3 lg:col-span-1">
          <h2 className="font-semibold">Create task</h2>
          <div><label className="label">Title</label><input className="input" value={form.title} onChange={set('title')} required /></div>
          <div><label className="label">Description</label><textarea className="input" rows={2} value={form.description} onChange={set('description')} /></div>
          <div><label className="label">Pickup address</label><input className="input" value={form.pickupAddress} onChange={set('pickupAddress')} required /></div>
          <div><label className="label">Drop-off address</label><input className="input" value={form.dropoffAddress} onChange={set('dropoffAddress')} required /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">Customer name</label><input className="input" value={form.customerName} onChange={set('customerName')} required /></div>
            <div><label className="label">Customer phone</label><input className="input" value={form.customerPhone} onChange={set('customerPhone')} required /></div>
          </div>
          <div><label className="label">Due date</label><input type="date" className="input" value={form.dueDate} onChange={set('dueDate')} /></div>
          <div><label className="label">Assign to</label>
            <select className="input" value={form.assignedToId} onChange={set('assignedToId')}>
              <option value="">Open pool (any staff can claim)</option>
              {activeStaff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn w-full">Create task</button>
        </form>

        <div className="lg:col-span-2">
          <div className="mb-3 flex flex-wrap gap-2">
            <select className="input w-auto" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
              <option value="">All statuses</option>
              {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select className="input w-auto" value={filter.staffId} onChange={(e) => setFilter({ ...filter, staffId: e.target.value })}>
              <option value="">All staff</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            {tasks.map((t) => (
              <Link key={t.id} href={`/admin/tasks/${t.id}`} className="card block hover:border-emerald-600">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{t.title}</p><StatusBadge status={t.status} />
                </div>
                <p className="text-xs text-gray-600">{t.pickupAddress} → {t.dropoffAddress}</p>
                <p className="text-xs text-gray-500">{t.assignedTo ? `Assigned to ${t.assignedTo.name}` : 'Open pool'} · {t.customerName}</p>
              </Link>
            ))}
            {tasks.length === 0 && <p className="text-sm text-gray-500">No tasks found.</p>}
          </div>
        </div>
      </div>
    </Shell>
  );
}
