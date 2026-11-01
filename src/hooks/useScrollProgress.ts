import { useEffect, useRef, type RefObject } from 'react';
import { scrollProgress } from '../lib/scrub';

type Listener = (progress: number) => void;

/**
 * Adaptador DOM: progreso 0..1 del scroll a través de una sección alta con escenario sticky.
 * Devuelve una ref (sin re-render por scroll) y permite suscribirse a cambios.
 */
export function useScrollProgress(target: RefObject<HTMLElement | null>, onChange?: Listener) {
  const progress = useRef(0);
  const listener = useRef<Listener | undefined>(onChange);

  useEffect(() => {
    listener.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = target.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const next = scrollProgress(rect.top, rect.height, window.innerHeight);
      if (next !== progress.current) {
        progress.current = next;
        listener.current?.(next);
      }
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

  return progress;
}
