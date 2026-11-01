import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './AmbientVideo.css';

export interface VideoSource {
  src: string;
  type: string;
}

interface Props {
  /** Fuentes en orden de preferencia (el navegador elige la primera que sabe reproducir). */
  sources: readonly VideoSource[];
  poster: string;
  /** Descripción accesible del contenido del vídeo. */
  label: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * Bucle documental silencioso en mirilla: se disuelve en el negro de la página (nada va en marco),
 * no descarga nada hasta entrar en viewport, ofrece pausa accesible y se queda en el póster
 * si el usuario prefiere movimiento reducido.
 */
export function AmbientVideo({ sources, poster, label, width, height, className = '' }: Props) {
  const reduced = useReducedMotion();
  const [wrapRef, inView] = useInView<HTMLDivElement>({ rootMargin: '120px 0px' });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  // Las fuentes se adjuntan la primera vez que toca reproducir y se conservan (sin recargas).
  const [armed, setArmed] = useState(false);
  const shouldPlay = inView && !reduced && !userPaused;

  useEffect(() => {
    if (shouldPlay) setArmed(true);
  }, [shouldPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !armed) return;
    if (shouldPlay) {
      video.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [shouldPlay, armed]);

  return (
    <div ref={wrapRef} className={`ambient ${className}`.trim()} data-playing={playing}>
      <video
        ref={videoRef}
        className="ambient-video"
        poster={poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
      >
        {armed && sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
      </video>
      <span className="grain ambient-grain" aria-hidden="true" />
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
