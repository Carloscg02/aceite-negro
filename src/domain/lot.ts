/**
 * Lectura del código de lote impreso en la etiqueta: iniciales del productor + fecha DDMMAA.
 * `JCCC141026` → Juan Carlos Cano Carrillo · miércoles 14 · octubre · 2026.
 */

export interface Lot {
  code: string;
  initials: string;
  day: number;
  month: number;
  year: number;
  monthName: string;
  weekday: string;
}

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
] as const;

/** Índice de `Date#getUTCDay()` (0 = domingo). */
const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'] as const;

const LOT_PATTERN = /^([A-Z]+)(\d{2})(\d{2})(\d{2})$/;

/** Devuelve la lectura del lote o `null` si el formato o la fecha no son válidos (años 20AA). */
export function parseLot(raw: string): Lot | null {
  const code = raw.trim().toUpperCase();
  const match = LOT_PATTERN.exec(code);
  if (!match) return null;
  const [, initials = '', dd = '', mm = '', yy = ''] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = 2000 + Number(yy);
  const date = new Date(Date.UTC(year, month - 1, day));
  const exists = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  const monthName = MONTHS[month - 1];
  const weekday = WEEKDAYS[date.getUTCDay()];
  if (!exists || !monthName || !weekday) return null;
  return { code, initials, day, month, year, monthName, weekday };
}
