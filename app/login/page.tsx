'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import AuthShell from '@/components/auth/AuthShell';
import PasswordField from '@/components/auth/PasswordField';
import { warmUp } from '@/lib/api';
import { useAuth } from '@/lib/auth';

const REMEMBER_KEY = 'logistics_remember_id';

export default function Login() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [caps, setCaps] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [slow, setSlow] = useState(false);
  const [greeting, setGreeting] = useState('Welcome back');
  const slowTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    warmUp(); // start waking the server while the person types
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) { setIdentifier(saved); setRemember(true); }
    } catch {}
    return () => clearTimeout(slowTimer.current);
  }, []);

  // already signed in? go straight to the right dashboard
  useEffect(() => {
    if (!loading && user) router.replace(user.role === 'ADMIN' ? '/admin' : '/staff');
  }, [user, loading, router]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setError(''); setSlow(false);
    slowTimer.current = setTimeout(() => setSlow(true), 3000);
    try {
      const u = await login(identifier, password);
      try { remember ? localStorage.setItem(REMEMBER_KEY, identifier) : localStorage.removeItem(REMEMBER_KEY); } catch {}
      router.replace(u.role === 'ADMIN' ? '/admin' : '/staff');
    } catch (err: any) {
      const m = String(err.message || '');
      setError(m === 'Invalid credentials' ? 'That email/phone or password doesn’t look right. Please try again.'
        : m === 'Failed to fetch' ? 'Can’t reach the server right now. Please check your connection and try again.' : m);
      setBusy(false);
    } finally {
      clearTimeout(slowTimer.current); setSlow(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="auth-title">{greeting}!</h1>
      <p className="auth-sub">Sign in to see today’s deliveries. We’re glad you’re here.</p>

      <form onSubmit={submit}>
        <div>
          <label htmlFor="identifier" className="auth-label">Email or phone</label>
          <div className="clay-field">
            <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <input id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username" placeholder="you@company.com or 0801…" required />
          </div>
        </div>

        <PasswordField id="password" label="Password" value={password} onChange={setPassword}
          autoComplete="current-password" placeholder="Enter your password" onCapsLock={setCaps} />
        {caps && <div className="auth-alert warn" role="status">Caps Lock is on.</div>}

        <div className="auth-row">
          <label className="auth-check"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label>
          <Link href="/forgot-password" className="auth-link">Forgot password?</Link>
        </div>

        {error && <div className="auth-alert error" role="alert">{error}</div>}
        {slow && <div className="auth-alert warn" role="status">Waking up the server. The first sign-in of the day can take up to a minute, so thanks for waiting.</div>}

        <button className="clay-btn" disabled={busy}>{busy ? 'Signing you in…' : 'Sign in'}</button>
      </form>

      <p className="auth-foot">Accounts are created by your admin. Need help? Ask your supervisor.</p>
    </AuthShell>
  );
}