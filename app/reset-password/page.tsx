'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useMemo, useState } from 'react';
import AuthShell from '@/components/auth/AuthShell';
import PasswordField from '@/components/auth/PasswordField';
import { api } from '@/lib/api';

function score(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
}
const LEVELS = [
  { label: 'Too weak', color: '#f87171' }, { label: 'Weak', color: '#fb923c' },
  { label: 'Okay', color: '#fbbf24' }, { label: 'Good', color: '#a3e635' }, { label: 'Strong', color: '#34d399' },
];

function ResetForm() {
  const token = useSearchParams().get('token') || '';
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const s = useMemo(() => score(pw), [pw]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (pw !== pw2) return setError('The two passwords don’t match.');
    setBusy(true); setError('');
    try {
      await api('/auth/reset-password', { method: 'POST', body: { token, password: pw } });
      setDone(true);
      setTimeout(() => router.replace('/login'), 2500);
    } catch (err: any) { setError(err.message); } finally { setBusy(false); }
  }

  if (!token) {
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div className="auth-alert error" role="alert">This reset link is missing its token. Please request a new one.</div>
        <Link href="/forgot-password" className="clay-btn-soft">Request a new link</Link>
      </div>
    );
  }
  if (done) {
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div className="auth-alert ok" role="status">Password updated. Taking you to sign in…</div>
        <Link href="/login" className="clay-btn-soft">Sign in now</Link>
      </div>
    );
  }
  return (
    <form onSubmit={submit}>
      <div>
        <PasswordField id="new-password" label="New password" value={pw} onChange={setPw} autoComplete="new-password" minLength={8} placeholder="At least 8 characters" />
        {pw && (
          <>
            <div className="strength" aria-hidden="true"><i style={{ width: `${(s + 1) * 20}%`, background: LEVELS[s].color }} /></div>
            <p className="auth-foot" style={{ margin: '4px 0 0', textAlign: 'left' }}>Strength: {LEVELS[s].label}</p>
          </>
        )}
      </div>
      <PasswordField id="confirm-password" label="Confirm new password" value={pw2} onChange={setPw2} autoComplete="new-password" minLength={8} placeholder="Type it again" />
      {error && <div className="auth-alert error" role="alert">{error}</div>}
      <button className="clay-btn" disabled={busy}>{busy ? 'Saving…' : 'Set new password'}</button>
    </form>
  );
}

export default function ResetPassword() {
  return (
    <AuthShell>
      <h1 className="auth-title">Choose a new password</h1>
      <p className="auth-sub">Pick something you’ll remember but others can’t guess. A mix of letters, numbers and symbols works well.</p>
      <Suspense fallback={<p className="auth-sub">Loading…</p>}><ResetForm /></Suspense>
    </AuthShell>
  );
}
