import { useEffect, type RefObject } from 'react';
import { passThroughProgress } from '../lib/scrub';

/**
 * Adaptador DOM: escribe en `--p` (0..1) cuánto ha recorrido el elemento el viewport,
 * para efectos ligados al scroll resueltos en CSS (sin re-render de React).
 */
export function useViewportProgress(target: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--p', passThroughProgress(rect.top, rect.height, window.innerHeight).toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target]);
}
