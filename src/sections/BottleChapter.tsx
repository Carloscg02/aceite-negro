import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { BottleSequence } from '../components/BottleSequence';
import { BOTTLE_ANNOTATIONS, BOTTLE_STOPS } from '../config/bottle';
import frames from '../config/bottle-frames.json';
import { SALE_FORMATS, UNIT_PRICE_CENTS } from '../config/site';
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

const BOXES = new Intl.ListFormat('es', { type: 'conjunction' }).format(SALE_FORMATS.map((f) => String(f.bottles)));

export function BottleChapter() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLSpanElement | null>(null);
  const rotationRef = useRef<HTMLSpanElement | null>(null);
  const frameRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState<string>('intro');

  const onProgress = useCallback((p: number) => {
    setActive(activeAnnotation(p, BOTTLE_ANNOTATIONS) ?? 'intro');
    if (trackRef.current) trackRef.current.style.transform = `scaleY(${p})`;
    if (sectionRef.current) sectionRef.current.dataset.started = String(p > 0.015);
  }, []);
  const progressRef = useScrollProgress(sectionRef, onProgress);

  const onFrame = useCallback((frame: number) => {
    if (rotationRef.current) rotationRef.current.textContent = `${pad(rotationDegrees(frame, frames.frameCount))}°`;
    if (frameRef.current) frameRef.current.textContent = pad(frame + 1);
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
                Cosecha temprana · <b>Octubre 2026</b>
              </p>
              <h1 id="hero-title" className="display hero-title">
                <span className="l">Aceite</span> <span className="l">Negro</span> <em className="l">Picudo</em>
              </h1>
              <p className="lede">
                Aceite de oliva virgen extra de un solo lote: <strong>1.500 litros</strong> en{' '}
                <strong>3.000 botellas</strong> de 500 ml.
              </p>
            </div>

            <div className="annotation" data-active={is('variedades')}>
              <p className="eyebrow">
                <b>{angleAt('variedades')}</b> — Variedades
              </p>
              <p className="display annotation-big">
                Picudo <em>y</em> Carrasqueño
              </p>
              <p className="lede">
                Las dos variedades del lote, recogidas juntas en octubre con la aceituna todavía verde.
              </p>
            </div>

            <div className="annotation" data-active={is('contraetiqueta')}>
              <p className="eyebrow">
                <b>{angleAt('contraetiqueta')}</b> — Contraetiqueta
              </p>
              <p className="display annotation-big mono-nums">
                72 g <em>/ 100 g</em>
              </p>
              <p className="lede">
                de grasa monoinsaturada. <strong>{'Vitamina E: 20\u00a0mg'}</strong>
                {' por cada 100\u00a0g (167\u00a0%\u00a0VRN).'}
              </p>
              <a className="link-cta" href="#ficha">
                Ficha completa <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>

            <div className="annotation" data-active={is('formato')}>
              <p className="eyebrow">
                <b>{angleAt('formato')}</b> — Formato
              </p>
              <p className="display annotation-big mono-nums">500 ml</p>
              <p className="lede">
                {SALE_FORMATS.length > 0 ? (
                  <>
                    En cajas de <strong>{BOXES}</strong> botellas, a{' '}
                    <strong>{formatEuros(UNIT_PRICE_CENTS)}</strong> la botella.
                  </>
                ) : (
                  'Venta por cajas, bajo encargo.'
                )}
              </p>
              <a className="link-cta" href="#comprar">
                Ver cajas <span className="arrow" aria-hidden="true">→</span>
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
              <span className="hud-key">Fotograma</span>
              <span className="hud-val">
                <span ref={frameRef}>001</span> / {frames.frameCount}
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
