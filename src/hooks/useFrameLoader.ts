import { useEffect, useRef, useState } from 'react';
import { frameUrl, loadOrder } from '../lib/frames';

export type LoadStatus = 'loading' | 'ready' | 'error';

const CONCURRENCY = 6;
/** Fotogramas (en orden de bisección) necesarios para declarar la secuencia lista. */
const READY_AFTER = 16;

/**
 * Adaptador DOM: precarga progresiva de la secuencia de fotogramas.
 * El primer fotograma es obligatorio (si falla → error); el resto rellena huecos.
 */
export function useFrameLoader(template: string, count: number, enabled: boolean) {
  const images = useRef<Array<HTMLImageElement | null>>([]);
  const loaded = useRef<boolean[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!enabled || count <= 0) return;
    let cancelled = false;
    images.current = new Array(count).fill(null);
    loaded.current = new Array(count).fill(false);

    const order = loadOrder(count);
    const needed = Math.min(READY_AFTER, count);
    let cursor = 0;
    let done = 0;

    const loadOne = async (index: number) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = frameUrl(template, index);
      try {
        await img.decode();
        if (cancelled) return;
        images.current[index] = img;
        loaded.current[index] = true;
      } catch {
        if (cancelled) return;
        if (index === 0) setStatus('error');
      }
      done += 1;
      if (done === needed && loaded.current[0]) setStatus('ready');
      if (done % 8 === 0 || done === count) setPercent(Math.round((done / count) * 100));
    };

    const worker = async () => {
      while (!cancelled && cursor < order.length) {
        const index = order[cursor++];
        if (index !== undefined) await loadOne(index);
      }
    };

    for (let i = 0; i < CONCURRENCY; i++) void worker();
    return () => {
      cancelled = true;
    };
  }, [template, count, enabled]);

  return { images, loaded, status, percent };
}
