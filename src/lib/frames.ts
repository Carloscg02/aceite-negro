/**
 * Utilidades puras para la secuencia de fotogramas de la botella 360°.
 */

/** Sustituye `%03d` en la plantilla por el índice 1-based con relleno de ceros. */
export function frameUrl(template: string, index: number): string {
  return template.replace(/%0(\d)d/, (_m, width: string) =>
    String(index + 1).padStart(Number(width), '0'),
  );
}

/**
 * Orden de carga por bisección: primero extremos, luego puntos medios por niveles.
 * Así una cobertura gruesa de los 360° está disponible enseguida y se va refinando.
 */
export function loadOrder(count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [0];
  const order: number[] = [0, count - 1];
  let intervals: Array<[number, number]> = [[0, count - 1]];
  while (intervals.length > 0) {
    const next: Array<[number, number]> = [];
    for (const [a, b] of intervals) {
      if (b - a <= 1) continue;
      const mid = Math.floor((a + b) / 2);
      order.push(mid);
      next.push([a, mid], [mid, b]);
    }
    intervals = next;
  }
  return order;
}

/** Índice cargado más cercano a `index` (empate → el anterior); -1 si no hay ninguno. */
export function nearestAvailable(loaded: readonly boolean[], index: number): number {
  if (loaded[index]) return index;
  for (let d = 1; d < loaded.length; d++) {
    if (loaded[index - d]) return index - d;
    if (loaded[index + d]) return index + d;
  }
  return -1;
}
