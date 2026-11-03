import { ReactNode } from 'react';
import Carousel from './Carousel';
import './auth.css';

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="auth-root">
      <div className="auth-blob b1" aria-hidden="true" />
      <div className="auth-blob b2" aria-hidden="true" />
      <div className="auth-blob b3" aria-hidden="true" />
      <div className="auth-card">
        <section className="auth-art" aria-label="Welcome"><Carousel /></section>
        <section className="auth-form">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" />
              </svg>
            </span>
            <span className="brand-name">Logistics Tracker</span>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
