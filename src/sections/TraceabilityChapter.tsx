import { useRef } from 'react';
import { AmbientVideo } from '../components/AmbientVideo';
import { Reveal } from '../components/Reveal';
import { LABEL_DEFINITION } from '../config/label';
import { parseLot, type Lot } from '../domain/lot';
import { useViewportProgress } from '../hooks/useViewportProgress';
import './TraceabilityChapter.css';

interface Props {
  lotCode: string;
  /** Persona a la que corresponden las iniciales del lote. */
  producer: string;
}

const two = (n: number) => String(n % 100).padStart(2, '0');

function LotReading({ lot, producer }: { lot: Lot; producer: string }) {
  const parts = [
    { code: lot.initials, key: 'Productor', value: producer, initials: true },
    { code: two(lot.day), key: 'Día', value: lot.weekday },
    { code: two(lot.month), key: 'Mes', value: lot.monthName },
    { code: two(lot.year), key: 'Año', value: String(lot.year) },
  ];
  return (
    <dl className="lot" aria-label={`Lectura del lote ${lot.code}`}>
      {parts.map((p) => (
        <div key={p.key} className={p.initials ? 'lot-part lot-part--initials' : 'lot-part'}>
          <dt className="lot-code mono">{p.code}</dt>
          <dd className="lot-meaning">
            <span className="eyebrow">{p.key}</span>
            <span className="lot-value">{p.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function TraceabilityChapter({ lotCode, producer }: Props) {
  const lot = parseLot(lotCode);
  const photoRef = useRef<HTMLDivElement | null>(null);
  useViewportProgress(photoRef);

  return (
    <section id="trazabilidad" className="chapter trace" aria-labelledby="trazabilidad-title">
      <div className="container trace-grid">
        <div className="trace-intro">
          <Reveal className="chapter-head">
            <p className="eyebrow">
              <b>02</b> — Trazabilidad
            </p>
            <h2 id="trazabilidad-title" className="display">
              El lote es <em>la fecha</em>.
            </h2>
            <p className="lede">
              Un solo lote y un solo código, impreso en todas las botellas.{' '}
              {lot ? (
                'Se lee así:'
              ) : (
                <>
                  Lote <span className="mono">{lotCode}</span>.
                </>
              )}
            </p>
          </Reveal>

          {lot && (
            <Reveal className="trace-lot" delay={80}>
              <LotReading lot={lot} producer={producer} />
            </Reveal>
          )}
        </div>

        <Reveal as="figure" className="trace-photo">
          <div ref={photoRef} className="trace-photo-frame">
            <img
              src="/media/aceituna.jpg"
              width={704}
              height={704}
              loading="lazy"
              alt="Montón de aceituna verde recién vareada, entre hojas de olivo, sobre el fardo"
            />
            <span className="grain" aria-hidden="true" />
          </div>
          <figcaption className="caption mono">
            <span className="caption-n">Fig. 01</span>
            <span className="caption-text">Aceituna recién vareada, sobre el fardo · Octubre 2026</span>
            <span className="caption-tc">00:00.3</span>
          </figcaption>
        </Reveal>

        <Reveal as="figure" className="trace-oil" delay={80}>
          <AmbientVideo
            sources={[
              { src: '/media/aceite-bucle.webm', type: 'video/webm' },
              { src: '/media/aceite-bucle.mp4', type: 'video/mp4' },
            ]}
            poster="/media/aceite-bucle-poster.jpg"
            width={480}
            height={480}
            label="Chorro de aceite verde recién extraído cayendo en la cubeta de la almazara"
          />
          <figcaption className="caption mono">
            <span className="caption-n">Fig. 02</span>
            <span className="caption-text">Aceite recién hecho, cayendo en la cubeta · 0,33× en bucle</span>
            <span className="caption-tc">00:15.45—00:16.95</span>
          </figcaption>
        </Reveal>

        <Reveal as="blockquote" className="trace-quote" delay={140}>
          <p className="display">«{LABEL_DEFINITION}»</p>
          <footer className="eyebrow">Definición impresa en la etiqueta</footer>
        </Reveal>
      </div>
    </section>
  );
}
