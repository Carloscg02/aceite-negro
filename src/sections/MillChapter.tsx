import { AmbientVideo } from '../components/AmbientVideo';
import { Reveal } from '../components/Reveal';
import './MillChapter.css';

export function MillChapter() {
  return (
    <section id="almazara" className="chapter mill" aria-labelledby="almazara-title">
      <div className="container mill-grid">
        <Reveal as="figure" className="mill-media">
          <AmbientVideo
            className="ratio-tall"
            src="/media/almazara.mp4"
            poster="/media/almazara-poster.jpg"
            width={352}
            height={626}
            label="Chorro de aceite verde recién extraído cayendo en la cubeta de la almazara"
          />
          <figcaption className="caption mono">
            <span>Fig. 04</span> Almazara · Octubre 2026 · Grabado con el móvil · 0,5×
          </figcaption>
        </Reveal>

        <div className="mill-text">
          <Reveal className="chapter-head">
            <p className="eyebrow">
              <b>03</b> — Almazara
            </p>
            <h2 id="almazara-title" className="display">
              El aceite, <em>recién hecho</em>.
            </h2>
          </Reveal>

          <Reveal as="blockquote" className="mill-quote" delay={80}>
            <p className="display">
              «Aceite de oliva de categoría superior obtenido directamente de aceitunas y solo mediante
              procedimientos mecánicos.»
            </p>
            <footer className="eyebrow">Texto de la etiqueta</footer>
          </Reveal>

          <Reveal as="p" className="lede" delay={140}>
            Extraído en la cooperativa de la familia. En la imagen, el aceite tal como sale: verde y recién hecho.
          </Reveal>
        </div>
      </div>
    </section>
  );
}
