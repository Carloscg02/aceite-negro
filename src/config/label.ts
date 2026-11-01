/** Datos transcritos literalmente de la etiqueta (docs/resources/foto-etiqueta.jpeg). */

export const LOT_CODE = 'JCCC141026';

/** Titular de las iniciales del lote (JCCC) y razón social completa del envasador. */
export const PRODUCER = {
  person: 'Juan Carlos Cano Carrillo',
  legalName: 'Juan Carlos Cano Carrillo y otro C.B',
  taxId: 'E23312572',
  sanitaryRegistry: 'N.RGSEAA 40.044510/J',
} as const;

export const LABEL_DEFINITION =
  'Aceite de oliva de categoría superior obtenido directamente de aceitunas y solo mediante procedimientos mecánicos.';

export const LABEL_ROWS = [
  ['Denominación', 'Aceite de oliva virgen extra'],
  ['Variedades', 'Picudo y Carrasqueño'],
  ['Cosecha', 'Temprana, octubre 2026'],
  ['Contenido', '500 ml'],
  ['Lote', LOT_CODE],
  ['Consumo preferente', 'Antes del fin de 10/2028'],
  ['Envasado por', PRODUCER.sanitaryRegistry],
  ['Productor', `${PRODUCER.legalName} · ${PRODUCER.taxId}`],
  ['Origen', 'Producto de España'],
  ['Conservación', 'En lugar fresco y alejado de la luz'],
] as const;

/** Valores con espacio de no separación (U+00A0) entre número y unidad: solo parten en « / » o antes del paréntesis. */
export const NUTRITION: ReadonlyArray<{ k: string; v: string; sub?: boolean }> = [
  { k: 'Valor energético', v: '3700\u00a0kJ / 900\u00a0kcal' },
  { k: 'Grasas', v: '100\u00a0g' },
  { k: 'de las cuales saturadas', v: '14\u00a0g', sub: true },
  { k: 'monoinsaturadas', v: '72\u00a0g', sub: true },
  { k: 'poliinsaturadas', v: '14\u00a0g', sub: true },
  { k: 'Colesterol', v: '0\u00a0g' },
  { k: 'Hidratos de carbono', v: '0\u00a0g' },
  { k: 'de los cuales azúcares', v: '0\u00a0g', sub: true },
  { k: 'Proteínas', v: '0\u00a0g' },
  { k: 'Sal', v: '0\u00a0g' },
  { k: 'Vitamina E', v: '20\u00a0mg (167\u00a0%\u00a0VRN*)' },
];
