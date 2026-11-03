'use client';
import { useEffect, useState } from 'react';
import { RiderScene, RouteScene, TruckScene, WarehouseScene } from './Scenes';

const SLIDES = [
  { title: 'Welcome back, champion!', text: 'Every parcel you deliver puts a smile on someone’s face.', Scene: TruckScene },
  { title: 'Small steps, big deliveries', text: 'Keep moving. Your effort keeps the whole city running.', Scene: RiderScene },
  { title: 'Organised today, stress-free tomorrow', text: 'Log each task and expense as you go and end the day light.', Scene: WarehouseScene },
  { title: 'Your route to a great day', text: 'Check in at every stop and finish strong. You’ve got this.', Scene: RouteScene },
];

export default function Carousel() {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const playing = !hover && !userPaused && !reduced;
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, [playing]);

  const go = (n: number) => setI((n + SLIDES.length) % SLIDES.length);

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Welcome messages"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className="carousel-stage">
        {SLIDES.map(({ Scene }, idx) => (
          <div key={idx} className={`carousel-slide ${idx === i ? 'is-active' : ''}`} aria-hidden={idx !== i}>
            <Scene />
          </div>
        ))}
      </div>

      <div className="carousel-caption" aria-live={playing ? 'off' : 'polite'}>
        <h2 key={i} className="caption-in">{SLIDES[i].title}</h2>
        <p key={`p${i}`} className="caption-in">{SLIDES[i].text}</p>
      </div>

      <div className="carousel-controls">
        <button type="button" className="icon-btn" onClick={() => go(i - 1)} aria-label="Previous slide">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="dots" role="tablist" aria-label="Choose slide">
          {SLIDES.map((_, idx) => (
            <button key={idx} type="button" role="tab" aria-selected={idx === i} aria-label={`Slide ${idx + 1} of ${SLIDES.length}`}
              className={`dot ${idx === i ? 'is-active' : ''}`} onClick={() => setI(idx)} />
          ))}
        </div>
        <button type="button" className="icon-btn" onClick={() => go(i + 1)} aria-label="Next slide">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        {!reduced && (
          <button type="button" className="icon-btn" onClick={() => setUserPaused((p) => !p)} aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}>
            {userPaused
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>}
          </button>
        )}
      </div>
    </div>
  );
}
