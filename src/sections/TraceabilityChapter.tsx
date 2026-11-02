import { useRef } from 'react';
import { AmbientVideo } from '../components/AmbientVideo';
import { Reveal } from '../components/Reveal';
import { LABEL_DEFINITION } from '../config/label';
import { useViewportProgress } from '../hooks/useViewportProgress';
import './TraceabilityChapter.css';

export function TraceabilityChapter() {
  const photoRef = useRef<HTMLDivElement | null>(null);
  useViewportProgress(photoRef);

  return (
    <section id="variedad" className="chapter trace" aria-labelledby="variedad-title">
      <span id="trazabilidad" className="anchor-target" aria-hidden="true" />
      <div className="container trace-grid">
        <div className="trace-intro">
          <Reveal className="chapter-head">
            <p className="eyebrow">
              <b>02</b> — Variedad
            </p>
            <h2 id="variedad-title" className="display">
              La aceituna <em>picuda</em>.
            </h2>
            <p className="lede">
              Toma el nombre del pequeño pico curvado del fruto. Es una aceituna procedente de la sierra sur de Jaén. De cosecha temprana, todavía verde, para conseguir un aceite fresco, aromático y con un amargor controlado.
            </p>
          </Reveal>
        </div>

        <Reveal as="figure" className="trace-photo">
          <div ref={photoRef} className="trace-photo-frame">
            <img
              src="/media/aceituna-picuda.jpg"
              width={1600}
              height={988}
              loading="lazy"
              alt="Aceituna picuda sobre el olivo durante la cosecha temprana"
            />
            <span className="grain" aria-hidden="true" />
          </div>
          <figcaption className="caption mono">
            <span className="caption-text">Aceituna picuda sobre el olivo · Cosecha temprana</span>
          </figcaption>
        </Reveal>

        <Reveal as="blockquote" className="trace-quote" delay={80}>
          <p className="trace-quote-tag">Una pequeña explotación familiar con una pequeña cosecha</p>
          <p className="display">«{LABEL_DEFINITION}»</p>
        </Reveal>

        <Reveal as="figure" className="trace-oil" delay={140}>
          <AmbientVideo
            sources={[
              { src: '/media/aceite-bucle.webm', type: 'video/webm' },
              { src: '/media/aceite-bucle.mp4', type: 'video/mp4' },
            ]}
            poster="/media/aceite-bucle-poster.jpg"
            width={480}
            height={480}
            label="Nuestro aceite en la almazara"
          />
          <figcaption className="caption mono">
            <span className="caption-text">Nuestro aceite en la almazara</span>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
