import { Reveal } from '../components/Reveal';
import './SpecSheetChapter.css';

/** Datos transcritos literalmente de la etiqueta (docs/resources/foto-etiqueta.jpeg). */
const FIGURES = [
  { value: '1.500 L', label: 'Lote completo' },
  { value: '3.000', label: 'Botellas de 500 ml' },
  { value: '72 g', label: 'Monoinsaturada / 100 g' },
  { value: '10/2028', label: 'Consumo preferente' },
] as const;

const LABEL = [
  ['Denominación', 'Aceite de oliva virgen extra'],
  ['Variedades', 'Picudo y Carrasqueño'],
  ['Cosecha', 'Temprana, octubre 2026'],
  ['Contenido', '500 ml'],
  ['Lote', 'JCCC141026'],
  ['Consumo preferente', 'Antes del fin de 10/2028'],
  ['Envasado por', 'N.RGSEAA 40.044510/J'],
  ['Productor', 'Juan Carlos Cano Carrillo y otro C.B · E23312572'],
  ['Origen', 'Producto de España'],
  ['Conservación', 'En lugar fresco y alejado de la luz'],
] as const;

const NUTRITION: Array<{ k: string; v: string; sub?: boolean }> = [
  { k: 'Valor energético', v: '3700 kJ / 900 kcal' },
  { k: 'Grasas', v: '100 g' },
  { k: 'de las cuales saturadas', v: '14 g', sub: true },
  { k: 'monoinsaturadas', v: '72 g', sub: true },
  { k: 'poliinsaturadas', v: '14 g', sub: true },
  { k: 'Colesterol', v: '0 g' },
  { k: 'Hidratos de carbono', v: '0 g' },
  { k: 'de los cuales azúcares', v: '0 g', sub: true },
  { k: 'Proteínas', v: '0 g' },
  { k: 'Sal', v: '0 g' },
  { k: 'Vitamina E', v: '20 mg (167 % VRN*)' },
];

export function SpecSheetChapter() {
  return (
    <section id="ficha" className="chapter sheet" aria-labelledby="ficha-title">
      <div className="container">
        <Reveal className="chapter-head">
          <p className="eyebrow">
            <b>04</b> — Ficha
          </p>
          <h2 id="ficha-title" className="display">
            Todo lo que dice <em>la etiqueta</em>.
          </h2>
        </Reveal>

        <Reveal as="dl" className="sheet-figures">
          {FIGURES.map((f) => (
            <div key={f.label} className="sheet-figure">
              <dt className="eyebrow">{f.label}</dt>
              <dd className="display">{f.value}</dd>
            </div>
          ))}
        </Reveal>

        <div className="double-rule sheet-rule" aria-hidden="true" />

        <div className="sheet-grid">
          <Reveal as="dl" className="sheet-label">
            {LABEL.map(([k, v]) => (
              <div key={k} className="sheet-row">
                <dt className="eyebrow">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </Reveal>

          <Reveal className="sheet-nutrition" delay={80}>
            <table>
              <caption>
                <span className="eyebrow">Información nutricional</span>
                <span className="eyebrow">por 100 g</span>
              </caption>
              <tbody>
                {NUTRITION.map((row) => (
                  <tr key={row.k} className={row.sub ? 'is-sub' : undefined}>
                    <th scope="row">{row.k}</th>
                    <td className="mono">{row.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="sheet-note mono">*VRN: valores de referencia de nutrientes.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
