'use client';
import { useEffect, useRef } from 'react';

export default function SignaturePad({ onChange }: { onChange: (file: File | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.strokeStyle = '#111';
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * ref.current!.width) / r.width, y: ((e.clientY - r.top) * ref.current!.height) / r.height };
  };
  const down = (e: React.PointerEvent) => {
    drawing.current = true;
    ref.current!.setPointerCapture(e.pointerId);
    const ctx = ref.current!.getContext('2d')!; const p = pos(e);
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = ref.current!.getContext('2d')!; const p = pos(e);
    ctx.lineTo(p.x, p.y); ctx.stroke(); dirty.current = true;
  };
  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (!dirty.current) return;
    ref.current!.toBlob((b) => b && onChange(new File([b], 'signature.png', { type: 'image/png' })), 'image/png');
  };
  const clear = () => {
    const c = ref.current!; c.getContext('2d')!.clearRect(0, 0, c.width, c.height);
    dirty.current = false; onChange(null);
  };

  return (
    <div>
      <canvas ref={ref} width={600} height={220}
        className="w-full touch-none rounded-lg border border-dashed border-gray-400 bg-white"
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} />
      <button type="button" onClick={clear} className="mt-1 text-xs text-gray-500 underline">Clear signature</button>
    </div>
  );
}
