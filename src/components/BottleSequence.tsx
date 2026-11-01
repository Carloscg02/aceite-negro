import { useEffect, useRef } from 'react';
import { frameForProgress, frameIndexForProgress, lerp, type FrameStop } from '../lib/scrub';
import { frameUrl, nearestAvailable } from '../lib/frames';
import { useFrameLoader, type LoadStatus } from '../hooks/useFrameLoader';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './BottleSequence.css';

export interface BottleSequenceProps {
  frameCount: number;
  /** Plantilla de URL con `%03d` (índice 1-based). */
  template: string;
  width: number;
  height: number;
  /** Foto fija para el estado de error. */
  stillSrc: string;
  /** Progreso 0..1 del capítulo; se lee en cada frame de animación (sin re-render). */
  progressRef: { current: number };
  /** Paradas del giro; sin ellas el progreso se reparte linealmente entre todos los fotogramas. */
  stops?: readonly FrameStop[];
  /** Notifica el fotograma pintado (HUD de rotación). */
  onFrame?: (frame: number) => void;
  /** Forzar estado (tests / depuración). */
  status?: LoadStatus;
  /** Forzar preferencia de movimiento reducido (tests). */
  reducedMotion?: boolean;
}

/** Suavizado del scrub: fracción de la distancia recorrida por frame de animación. */
const SMOOTHING = 0.22;
const NAME = 'Botella de Aceite Negro Picudo';

export function BottleSequence(props: BottleSequenceProps) {
  const { frameCount, template, width, height, stillSrc, progressRef, stops, onFrame } = props;
  const prefersReduced = useReducedMotion();
  const reduced = props.reducedMotion ?? prefersReduced;
  const loader = useFrameLoader(template, frameCount, !reduced && props.status === undefined);
  const status = props.status ?? loader.status;
  const view = reduced ? 'reduced' : status;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onFrameRef = useRef(onFrame);
  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    if (view !== 'ready') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const images = loader.images.current;
    const loaded = loader.loaded.current;
    const targetFor = (p: number) => (stops ? frameForProgress(p, stops) : frameIndexForProgress(p, frameCount));
    let current = targetFor(progressRef.current);
    let drawnImage = -1;
    let shownFrame = -1;
    let raf = 0;

    const tick = () => {
      const target = targetFor(progressRef.current);
      current = Math.abs(target - current) < 0.05 ? target : lerp(current, target, SMOOTHING);
      const frame = Math.round(current);
      const available = nearestAvailable(loaded, frame);
      const img = available >= 0 ? images[available] : null;
      if (img && available !== drawnImage) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        drawnImage = available;
      }
      if (frame !== shownFrame) {
        shownFrame = frame;
        canvas.dataset.frame = String(frame);
        onFrameRef.current?.(frame);
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) start();
      else stop();
    });
    io.observe(canvas);
    start();
    return () => {
      io.disconnect();
      stop();
    };
  }, [view, frameCount, width, height, progressRef, stops, loader.images, loader.loaded]);

  return (
    <figure className="bottle" data-status={view}>
      {view === 'ready' && (
        <canvas
          ref={canvasRef}
          className="bottle-media"
          width={width}
          height={height}
          role="img"
          aria-label={`${NAME}: gira 360° a medida que se desplaza la página`}
          data-frame="0"
        />
      )}
      {view === 'loading' && (
        <>
          <img
            className="bottle-media"
            src={frameUrl(template, 0)}
            width={width}
            height={height}
            alt={NAME}
            fetchPriority="high"
          />
          <p className="bottle-loading mono" aria-live="polite">
            Cargando giro 360° · {String(loader.percent).padStart(2, '0')}%
          </p>
        </>
      )}
      {view === 'error' && (
        <img className="bottle-media" src={stillSrc} width={width} height={height} alt={`${NAME} (foto fija)`} />
      )}
      {view === 'reduced' && (
        <img
          className="bottle-media"
          src={frameUrl(template, 0)}
          width={width}
          height={height}
          alt={`${NAME}, vista frontal`}
        />
      )}
    </figure>
  );
}
