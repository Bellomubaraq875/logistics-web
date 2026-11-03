'use client';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { api } from '@/lib/api';

export default function AdminStaff() {
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  const load = useCallback(() => api('/users/staff').then(setList).catch((e) => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);

  async function create(e: FormEvent) {
    e.preventDefault(); setError('');
    try {
      await api('/users/staff', { method: 'POST', body: { name: form.name, password: form.password, email: form.email || undefined, phone: form.phone || undefined } });
      setForm({ name: '', email: '', phone: '', password: '' }); load();
    } catch (err: any) { setError(err.message); }
  }
  const toggle = (s: any) => api(`/users/staff/${s.id}`, { method: 'PATCH', body: { isActive: !s.isActive } }).then(load).catch((e) => setError(e.message));
  function reset(s: any) {
    const pw = window.prompt(`New password for ${s.name} (min 6 characters):`);
    if (pw) api(`/users/staff/${s.id}`, { method: 'PATCH', body: { password: pw } }).then(() => alert('Password updated')).catch((e) => setError(e.message));
  }
  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  return (
    <Shell role="ADMIN">
      <div className="grid gap-4 md:grid-cols-3">
        <form onSubmit={create} className="card space-y-3 md:col-span-1">
          <h2 className="font-semibold">Add staff</h2>
          <div><label className="label">Full name</label><input className="input" value={form.name} onChange={set('name')} required /></div>
          <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={set('email')} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={set('phone')} /></div>
          <div><label className="label">Initial password</label><input className="input" value={form.password} onChange={set('password')} minLength={6} required /></div>
          <p className="text-xs text-gray-500">Email or phone is required. Staff can sign in with either.</p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn w-full">Create account</button>
        </form>
        <div className="card md:col-span-2">
          <h2 className="mb-2 font-semibold">Staff ({list.length})</h2>
          <ul className="divide-y text-sm">
            {list.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <div>
                  <p className={s.isActive ? 'font-medium' : 'font-medium text-gray-400 line-through'}>{s.name}</p>
                  <p className="text-xs text-gray-500">{[s.email, s.phone].filter(Boolean).join(' · ')}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-outline" onClick={() => reset(s)}>Reset password</button>
                  <button className={s.isActive ? 'btn-danger' : 'btn'} onClick={() => toggle(s)}>{s.isActive ? 'Deactivate' : 'Activate'}</button>
                </div>
              </li>
            ))}
            {list.length === 0 && <li className="py-2 text-gray-500">No staff yet.</li>}
          </ul>
        </div>
      </div>
    </Shell>
  );
}
