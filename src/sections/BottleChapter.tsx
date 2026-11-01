import { useCallback, useRef, useState } from 'react';
import { BottleSequence } from '../components/BottleSequence';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { activeAnnotation, type Annotation } from '../lib/scrub';
import frames from '../config/bottle-frames.json';
import './BottleChapter.css';

/** Tramos del giro: el vídeo muestra el frente (0), el canto, la contraetiqueta (~0.6) y vuelve al frente. */
const ANNOTATIONS: Annotation[] = [
  { id: 'intro', from: 0, to: 0.22 },
  { id: 'variedades', from: 0.22, to: 0.48 },
  { id: 'contraetiqueta', from: 0.48, to: 0.76 },
  { id: 'lote', from: 0.76, to: 1 },
];

const pad = (n: number, len = 3) => String(n).padStart(len, '0');

export function BottleChapter() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLSpanElement | null>(null);
  const rotationRef = useRef<HTMLSpanElement | null>(null);
  const frameRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState<string>('intro');

  const onProgress = useCallback((p: number) => {
    setActive(activeAnnotation(p, ANNOTATIONS) ?? 'intro');
    if (trackRef.current) trackRef.current.style.transform = `scaleY(${p})`;
    if (sectionRef.current) sectionRef.current.dataset.started = String(p > 0.015);
  }, []);
  const progressRef = useScrollProgress(sectionRef, onProgress);

  const onFrame = useCallback((frame: number) => {
    if (rotationRef.current) rotationRef.current.textContent = `${pad(Math.round((frame / frames.frameCount) * 360))}°`;
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
                <b>01</b> — Variedades
              </p>
              <p className="display annotation-big">
                Picudo <em>y</em> Carrasqueño
              </p>
              <p className="lede">
                Las dos variedades del lote, recogidas juntas en octubre, cuando la aceituna aún está verde.
              </p>
            </div>

            <div className="annotation" data-active={is('contraetiqueta')}>
              <p className="eyebrow">
                <b>02</b> — Contraetiqueta
              </p>
              <p className="display annotation-big mono-nums">
                72 g <em>/ 100 g</em>
              </p>
              <p className="lede">
                de grasa monoinsaturada. <strong>Vitamina E: 20 mg</strong> por cada 100 g (167 % VRN).
              </p>
            </div>

            <div className="annotation" data-active={is('lote')}>
              <p className="eyebrow">
                <b>03</b> — Lote
              </p>
              <p className="annotation-code mono">JCCC141026</p>
              <p className="lede">
                Un único envasado. Consumo preferente antes del fin de <strong>10/2028</strong>.
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
