'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import StatusBadge from '@/components/StatusBadge';
import { api, fileUrl, fmtDate, mapLink } from '@/lib/api';

export default function AdminTask() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => { api(`/tasks/${id}`).then(setTask).catch((e) => setError(e.message)); }, [id]);

  async function remove() {
    if (!confirm('Delete this pending task?')) return;
    try { await api(`/tasks/${id}`, { method: 'DELETE' }); router.replace('/admin/tasks'); } catch (e: any) { setError(e.message); }
  }

  if (!task) return <Shell role="ADMIN"><p className="text-sm text-gray-500">{error || 'Loading...'}</p></Shell>;

  return (
    <Shell role="ADMIN">
      <div className="mx-auto max-w-3xl space-y-4">
        <Link href="/admin/tasks" className="text-sm text-emerald-700 underline">← All tasks</Link>
        <div className="card space-y-1">
          <div className="flex items-start justify-between gap-2"><h1 className="text-lg font-semibold">{task.title}</h1><StatusBadge status={task.status} /></div>
          {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
          <p className="text-sm"><b>Pickup:</b> {task.pickupAddress}</p>
          <p className="text-sm"><b>Drop-off:</b> {task.dropoffAddress}</p>
          <p className="text-sm"><b>Customer:</b> {task.customerName} · {task.customerPhone}</p>
          <p className="text-sm"><b>Assigned to:</b> {task.assignedTo?.name || 'Open pool'}</p>
          {task.failureReason && <p className="text-sm text-red-600"><b>Failure reason:</b> {task.failureReason}</p>}
          {task.status === 'PENDING' && <button className="btn-danger mt-2" onClick={remove}>Delete task</button>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="card">
          <h2 className="mb-2 text-sm font-semibold">Delivery timeline</h2>
          <ul className="space-y-2">
            {task.events.map((e: any) => (
              <li key={e.id} className="flex items-start justify-between gap-2 text-sm">
                <div><StatusBadge status={e.status} /> <span className="text-gray-600">{e.note}</span> <span className="text-xs text-gray-400">by {e.user.name}</span>
                  {e.lat != null
                    ? <a className="ml-2 text-xs text-emerald-700 underline" target="_blank" href={mapLink(e.lat, e.lng)}>view location{e.accuracy ? ` (±${Math.round(e.accuracy)}m)` : ''}</a>
                    : <span className="ml-2 text-xs text-gray-400">no location</span>}</div>
                <span className="shrink-0 text-xs text-gray-500">{fmtDate(e.createdAt)}</span>
              </li>
            ))}
            {task.events.length === 0 && <li className="text-sm text-gray-500">No activity yet.</li>}
          </ul>
        </div>

        <div className="card">
          <h2 className="mb-2 text-sm font-semibold">Proof of delivery</h2>
          <div className="flex flex-wrap gap-3">
            {task.proofs.map((p: any) => (
              <a key={p.id} href={fileUrl(p.fileUrl)} target="_blank" className="text-xs">
                <img src={fileUrl(p.fileUrl)} alt={p.type} className="h-32 rounded border bg-white" />
                {p.type.toLowerCase()}{p.recipientName ? ` · ${p.recipientName}` : ''}
              </a>
            ))}
            {task.proofs.length === 0 && <p className="text-sm text-gray-500">None uploaded.</p>}
          </div>
        </div>
      </div>
    </Shell>
  );
}
