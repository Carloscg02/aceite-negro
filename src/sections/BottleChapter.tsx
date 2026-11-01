import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { BottleSequence } from '../components/BottleSequence';
import { BOTTLE_ANNOTATIONS, BOTTLE_STOPS } from '../config/bottle';
import frames from '../config/bottle-frames.json';
import { GLASS_PRICE_CENTS, PET_PRICE_CENTS } from '../config/site';
import { formatEuros } from '../domain/catalog';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { activeAnnotation, rotationDegrees } from '../lib/scrub';
import './BottleChapter.css';

const pad = (n: number, len = 3) => String(n).padStart(len, '0');

/** Grados en los que se detiene la botella en cada parada (los mismos que marca el HUD). */
const angleAt = (id: string) => {
  const stop = BOTTLE_STOPS.find((s) => s.id === id);
  return `${stop ? rotationDegrees(stop.frame, frames.frameCount) : 0}°`;
};

export function BottleChapter() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLSpanElement | null>(null);
  const rotationRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState<string>('intro');

  const onProgress = useCallback((p: number) => {
    setActive(activeAnnotation(p, BOTTLE_ANNOTATIONS) ?? 'intro');
    if (trackRef.current) trackRef.current.style.transform = `scaleY(${p})`;
    if (sectionRef.current) sectionRef.current.dataset.started = String(p > 0.015);
  }, []);
  const progressRef = useScrollProgress(sectionRef, onProgress);

  const onFrame = useCallback((frame: number) => {
    if (rotationRef.current) rotationRef.current.textContent = `${pad(rotationDegrees(frame, frames.frameCount))}°`;
  }, []);

  const is = (id: string) => active === id;

  return (
    <section id="botella" ref={sectionRef} className="bottle-chapter" aria-labelledby="hero-title" data-started="false">
      <div className="bottle-stage">
        <div className="container stage-grid">
          <div className="stage-bottle">
            <span className="bottle-pool" aria-hidden="true" />
            <BottleSequence
              frameCount={frames.frameCount}
              template={frames.path}
              width={frames.width}
              height={frames.height}
              stillSrc="/media/bottle-still.jpg"
              progressRef={progressRef}
              stops={BOTTLE_STOPS}
              onFrame={onFrame}
            />
          </div>

          <div className="annotations">
            <div className="annotation" data-active={is('intro')}>
              <p className="eyebrow">
                Edición limitada · <b>Cosecha 2026</b>
              </p>
              <h1 id="hero-title" className="display hero-title">
                <span className="l">Aceite</span> <span className="l">Negro</span> <em className="l">Picudo</em>
              </h1>
              <p className="lede">
                Recogida temprana · Octubre 2026.
              </p>
            </div>

            <div className="annotation" data-active={is('variedades')}>
              <p className="eyebrow">
                <b>{angleAt('variedades')}</b> — Variedades
              </p>
              <p className="display annotation-big">
                Picudo 75% <em>y</em> Carrasqueño 25%
              </p>
              <p className="lede">
                Aceite de oliva virgen extra.
              </p>
            </div>

            <div className="annotation" data-active={is('contraetiqueta')}>
              <p className="eyebrow">
                <b>{angleAt('contraetiqueta')}</b> — Contraetiqueta
              </p>
              <p className="display annotation-big">
                72 g de grasa <em>monoinsaturada</em>
              </p>
              <p className="lede">
                Por cada 100&nbsp;g de aceite. Alto contenido natural en{' '}
                <strong>{'Vitamina E: 20\u00a0mg'}</strong>
                {' (167\u00a0%\u00a0VRN).'}
              </p>
              <a className="link-cta" href="#ficha">
                Ficha completa <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>

            <div className="annotation" data-active={is('formato')}>
              <p className="eyebrow">
                <b>{angleAt('formato')}</b> — Formato
              </p>
              <p className="display annotation-big annotation-big--huge mono-nums">500 ml</p>
              <p className="lede">
                Botella de cristal (<strong>{formatEuros(GLASS_PRICE_CENTS)}</strong>) o PET (
                <strong>{formatEuros(PET_PRICE_CENTS)}</strong>). Venta presencial en Jaén.
              </p>
              <a className="link-cta" href="#comprar">
                Encargar <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <aside className="hud mono" aria-label="Datos del giro">
            <p>
              <span className="hud-key">Rotación</span>
              <span ref={rotationRef} className="hud-val">
                000°
              </span>
            </p>
            <p>
              <span className="hud-key">Formato</span>
              <span className="hud-val">500 ml</span>
            </p>
            <span className="hud-track" aria-hidden="true">
              <span ref={trackRef} className="hud-fill" />
              {BOTTLE_STOPS.map((s) => (
                <span
                  key={s.id}
                  className="hud-tick"
                  data-active={is(s.id)}
                  style={{ '--at': String((s.from + s.to) / 2) } as CSSProperties}
                />
              ))}
            </span>
          </aside>
        </div>

        <p className="scroll-cue mono" aria-hidden="true">
          Desplaza <span className="scroll-line" /> la botella gira
        </p>
      </div>
    </section>
  );
}
