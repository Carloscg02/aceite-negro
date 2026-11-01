import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './AmbientVideo.css';

interface Props {
  src: string;
  poster: string;
  /** Descripción accesible del contenido del vídeo. */
  label: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * Vídeo documental silencioso: se reproduce solo en viewport, con pausa accesible
 * y póster fijo si el usuario prefiere movimiento reducido.
 */
export function AmbientVideo({ src, poster, label, width, height, className = '' }: Props) {
  const reduced = useReducedMotion();
  const [wrapRef, inView] = useInView<HTMLDivElement>({ rootMargin: '120px 0px' });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const shouldPlay = inView && !reduced && !userPaused;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) {
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [shouldPlay]);

  return (
    <div ref={wrapRef} className={`ambient ${className}`.trim()} data-playing={playing}>
      <video
        ref={videoRef}
        className="ambient-video"
        src={shouldPlay || playing ? src : undefined}
        poster={poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
      />
      <span className="grain" aria-hidden="true" />
      {!reduced && (
        <button
          type="button"
          className="ambient-toggle mono"
          onClick={() => setUserPaused((p) => !p)}
          aria-pressed={userPaused}
        >
          {userPaused ? 'Reproducir' : 'Pausar'}
          <span className="visually-hidden"> vídeo: {label}</span>
        </button>
      )}
    </div>
  );
}
