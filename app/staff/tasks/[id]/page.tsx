'use client';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import SignaturePad from '@/components/SignaturePad';
import StatusBadge from '@/components/StatusBadge';
import { api, fileUrl, fmtDate, getPosition, mapLink } from '@/lib/api';

// next step available for each status
const NEXT: Record<string, { to: string; label: string } | undefined> = {
  PENDING: { to: 'ACCEPTED', label: 'Accept task' },
  ACCEPTED: { to: 'PICKED_UP', label: 'Mark as picked up' },
  PICKED_UP: { to: 'IN_TRANSIT', label: 'Start delivery (in transit)' },
  IN_TRANSIT: { to: 'DELIVERED', label: 'Mark as delivered' },
  FAILED: { to: 'RETURNED', label: 'Mark as returned' },
};

export default function StaffTask() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<any>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [proofType, setProofType] = useState<'PHOTO' | 'SIGNATURE'>('PHOTO');
  const [file, setFile] = useState<File | null>(null);
  const [recipient, setRecipient] = useState('');

  const load = useCallback(() => api(`/tasks/${id}`).then(setTask).catch((e) => setError(e.message)), [id]);
  useEffect(() => { load(); }, [load]);

  async function run(fn: () => Promise<any>) {
    setBusy(true); setError('');
    try { setTask(await fn()); } catch (e: any) { setError(e.message); } finally { setBusy(false); }
  }

  const changeStatus = (status: string, note?: string) =>
    run(async () => {
      // GPS is captured on every status change, so the admin sees where it happened
      const pos = await getPosition();
      return api(`/tasks/${id}/status`, { method: 'POST', body: { status, note, ...pos } });
    });

  const checkin = () =>
    run(async () => {
      const pos = await getPosition();
      return api(`/tasks/${id}/checkin`, { method: 'POST', body: { ...pos, note: 'Arrived at location' } });
    });

  const uploadProof = () =>
    run(async () => {
      if (!file) throw new Error('Choose a photo or draw a signature first');
      const form = new FormData();
      form.append('file', file); form.append('type', proofType);
      if (recipient) form.append('recipientName', recipient);
      const t = await api(`/tasks/${id}/proof`, { method: 'POST', form });
      setFile(null);
      return t;
    });

  function fail() {
    const reason = window.prompt('Why could the delivery not be completed?');
    if (reason && reason.trim()) changeStatus('FAILED', reason.trim());
  }

  if (!task) return <Shell role="STAFF"><p className="text-sm text-gray-500">{error || 'Loading...'}</p></Shell>;

  const mine = task.assignedToId !== null;
  const next = NEXT[task.status];
  const inTransit = task.status === 'IN_TRANSIT';

  return (
    <Shell role="STAFF">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="card space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-lg font-semibold">{task.title}</h1><StatusBadge status={task.status} />
          </div>
          {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
          <p className="text-sm"><b>Pickup:</b> {task.pickupAddress}</p>
          <p className="text-sm"><b>Drop-off:</b> {task.dropoffAddress}</p>
          <p className="text-sm"><b>Customer:</b> {task.customerName} · <a className="text-emerald-700 underline" href={`tel:${task.customerPhone}`}>{task.customerPhone}</a></p>
          {task.failureReason && <p className="text-sm text-red-600">Failure reason: {task.failureReason}</p>}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!mine && task.status === 'PENDING' && (
          <button className="btn w-full" disabled={busy}
            onClick={() => run(() => api(`/tasks/${id}/claim`, { method: 'POST' }))}>Claim this task</button>
        )}

        {mine && inTransit && (
          <div className="card space-y-3">
            <h2 className="text-sm font-semibold">Proof of delivery</h2>
            {task.proofs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {task.proofs.map((p: any) => (
                  <a key={p.id} href={fileUrl(p.fileUrl)} target="_blank"><img src={fileUrl(p.fileUrl)} alt={p.type} className="h-20 rounded border" /></a>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button className={proofType === 'PHOTO' ? 'btn' : 'btn-outline'} onClick={() => { setProofType('PHOTO'); setFile(null); }}>Photo</button>
              <button className={proofType === 'SIGNATURE' ? 'btn' : 'btn-outline'} onClick={() => { setProofType('SIGNATURE'); setFile(null); }}>Signature</button>
            </div>
            {proofType === 'PHOTO'
              ? <input type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
              : <SignaturePad onChange={setFile} />}
            <div><label className="label">Recipient name (optional)</label>
              <input className="input" value={recipient} onChange={(e) => setRecipient(e.target.value)} /></div>
            <button className="btn" disabled={busy || !file} onClick={uploadProof}>Upload proof</button>
          </div>
        )}

        {mine && (
          <div className="space-y-2">
            {['PICKED_UP', 'IN_TRANSIT'].includes(task.status) && (
              <button className="btn-outline w-full" disabled={busy} onClick={checkin}>I have arrived (record my location)</button>
            )}
            {next && (
              <button className="btn w-full" disabled={busy || (inTransit && task.proofs.length === 0)} onClick={() => changeStatus(next.to)}>
                {busy ? 'Working...' : next.label}
              </button>
            )}
            {inTransit && task.proofs.length === 0 && <p className="text-xs text-gray-500">Upload proof of delivery to enable the Delivered button.</p>}
            {['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT'].includes(task.status) && (
              <button className="btn-danger w-full" disabled={busy} onClick={fail}>Report failed delivery</button>
            )}
          </div>
        )}

        <div className="card">
          <h2 className="mb-2 text-sm font-semibold">Timeline</h2>
          <ul className="space-y-2">
            {task.events.map((e: any) => (
              <li key={e.id} className="flex items-start justify-between gap-2 text-sm">
                <div><StatusBadge status={e.status} /> <span className="text-gray-600">{e.note}</span>
                  {e.lat != null && <a className="ml-2 text-xs text-emerald-700 underline" target="_blank" href={mapLink(e.lat, e.lng)}>map</a>}</div>
                <span className="shrink-0 text-xs text-gray-500">{fmtDate(e.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Shell>
  );
}
