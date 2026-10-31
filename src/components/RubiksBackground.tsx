import { useEffect, useRef, useState } from 'react';
import { RubiksCanvas } from '../lib/rubiksCanvas';

export function RubiksBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<RubiksCanvas | null>(null);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    media.addEventListener('change', change);
    if (canvas.current) engine.current = new RubiksCanvas(canvas.current);
    return () => {
      media.removeEventListener('change', change);
      engine.current?.destroy(); engine.current = null;
    };
  }, []);

  useEffect(() => { engine.current?.setRunning(!reduced); }, [reduced]);

  return <canvas ref={canvas} aria-hidden="true" className="rubiks-canvas pointer-events-none fixed inset-0 h-full w-full" />;
}
