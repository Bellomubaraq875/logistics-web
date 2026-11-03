'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import AuthShell from '@/components/auth/AuthShell';
import { api } from '@/lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await api('/auth/forgot-password', { method: 'POST', body: { email } });
      setSent(true);
    } catch (err: any) { setError(err.message); } finally { setBusy(false); }
  }

  return (
    <AuthShell>
      <h1 className="auth-title">Forgot your password?</h1>
      <p className="auth-sub">No stress, it happens. Enter your email and we’ll send you a link to choose a new one.</p>

      {sent ? (
        <div className="auth-form-stack" style={{ display: 'grid', gap: 16 }}>
          <div className="auth-alert ok" role="status">
            If an account exists for <b>{email}</b>, a reset link is on its way. It expires in 30 minutes. Check your spam folder too.
          </div>
          <Link href="/login" className="clay-btn-soft">Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div>
            <label htmlFor="email" className="auth-label">Email address</label>
            <div className="clay-field">
              <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 8l9 6 9-6" />
              </svg>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@company.com" required />
            </div>
          </div>
          {error && <div className="auth-alert error" role="alert">{error}</div>}
          <button className="clay-btn" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button>
          <div className="auth-row" style={{ justifyContent: 'center' }}><Link href="/login" className="auth-link">← Back to sign in</Link></div>
          <p className="auth-foot" style={{ marginTop: 0 }}>No email on your account? Ask your admin to reset your password for you.</p>
        </form>
      )}
    </AuthShell>
  );
}
