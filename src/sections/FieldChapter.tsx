import { AmbientVideo } from '../components/AmbientVideo';
import { Reveal } from '../components/Reveal';
import './FieldChapter.css';

const LOG = [
  ['Equipo', 'Una familia y tres trabajadores'],
  ['Recogida', 'Vareo sobre fardos, olivo a olivo'],
  ['Variedades', 'Picudo · Carrasqueño'],
  ['Campaña', 'Octubre 2026'],
] as const;

export function FieldChapter() {
  return (
    <section id="campo" className="chapter field" aria-labelledby="campo-title">
      <div className="container field-grid">
        <Reveal className="chapter-head field-head">
          <p className="eyebrow">
            <b>02</b> — Campo
          </p>
          <h2 id="campo-title" className="display">
            Octubre, <em>aceituna verde</em>.
          </h2>
          <p className="lede">
            Cosecha temprana: la aceituna se recoge en octubre, antes de madurar en el árbol. Rinde menos aceite
            por kilo, a cambio de un frutado más verde, amargo y picante.
          </p>
        </Reveal>

        <Reveal as="figure" className="field-main">
          <AmbientVideo
            className="ratio-wide"
            src="/media/campo-vareo.mp4"
            poster="/media/campo-vareo-poster.jpg"
            width={848}
            height={478}
            label="Trabajadores vareando olivos sobre fardos en el campo"
          />
          <figcaption className="caption mono">
            <span>Fig. 01</span> Vareo · Octubre 2026 · Grabado con el móvil
            <span className="caption-tc">00:00—00:10</span>
          </figcaption>
        </Reveal>

        <Reveal as="dl" className="field-log" delay={80}>
          {LOG.map(([k, v]) => (
            <div key={k} className="field-log-row">
              <dt className="eyebrow">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </Reveal>

        <Reveal as="figure" className="field-photo">
          <img
            src="/media/olivos-red.jpg"
            width={700}
            height={1040}
            loading="lazy"
            alt="Aceitunas verdes y ramas caídas sobre las redes bajo el olivo"
          />
          <figcaption className="caption mono">
            <span>Fig. 02</span> Aceituna sobre la red, recién vareada
          </figcaption>
        </Reveal>

        <Reveal as="figure" className="field-pile" delay={120}>
          <AmbientVideo
            className="ratio-portrait"
            src="/media/campo-fardo.mp4"
            poster="/media/campo-fardo-poster.jpg"
            width={480}
            height={600}
            label="Montón de aceituna verde recogida sobre el fardo"
          />
          <figcaption className="caption mono">
            <span>Fig. 03</span> El fardo antes de ir a la cooperativa
            <span className="caption-tc">00:00—00:08</span>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
