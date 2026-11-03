'use client';
import { useState, KeyboardEvent } from 'react';

type Props = {
  id: string; label: string; value: string; onChange: (v: string) => void;
  autoComplete?: string; placeholder?: string; minLength?: number; required?: boolean;
  onCapsLock?: (on: boolean) => void;
};

export default function PasswordField({ id, label, value, onChange, autoComplete, placeholder, minLength, required = true, onCapsLock }: Props) {
  const [show, setShow] = useState(false);
  const caps = (e: KeyboardEvent<HTMLInputElement>) => onCapsLock?.(e.getModifierState('CapsLock'));

  return (
    <div>
      <label htmlFor={id} className="auth-label">{label}</label>
      <div className="clay-field">
        <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="11" width="16" height="10" rx="3" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
        <input id={id} type={show ? 'text' : 'password'} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)} onKeyUp={caps} onKeyDown={caps}
          autoComplete={autoComplete} minLength={minLength} required={required} />
        <button type="button" className="eye-btn" onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
          {show ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 3l18 18" /><path d="M10.6 6.1A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.9" /><path d="M6.6 6.7C3.9 8.4 2.5 12 2.5 12s3.5 6 9.5 6c1.5 0 2.8-.4 4-.9" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" /><circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
