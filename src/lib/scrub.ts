/**
 * Utilidades puras de cálculo de scroll y secuencias de fotogramas.
 */

export function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

/**
 * Calcula el progreso de scroll normalizado [0..1] para una sección.
 * progress = -rectTop / (sectionHeight - viewportHeight)
 * Devuelve 0 si la sección no es más alta que el viewport o ante entradas no finitas.
 */
export function scrollProgress(
  rectTop: number,
  sectionHeight: number,
  viewportHeight: number,
): number {
  if (
    !Number.isFinite(rectTop) ||
    !Number.isFinite(sectionHeight) ||
    !Number.isFinite(viewportHeight)
  ) {
    return 0;
  }
  const scrollableDistance = sectionHeight - viewportHeight;
  if (scrollableDistance <= 0) {
    return 0;
  }
  const rawProgress = -rectTop / scrollableDistance;
  return clamp(rawProgress, 0, 1);
}

/**
 * Mapea un progreso [0..1] al índice de fotograma [0..frameCount-1].
 * Devuelve 0 si frameCount <= 1 o el progreso no es finito.
 * Es estrictamente monótono respecto al progreso.
 */
export function frameIndexForProgress(progress: number, frameCount: number): number {
  if (!Number.isFinite(progress) || !Number.isFinite(frameCount) || frameCount <= 1) {
    return 0;
  }
  const clampedProgress = clamp(progress, 0, 1);
  return Math.round(clampedProgress * (frameCount - 1));
}

/**
 * Interpolación lineal entre dos valores numéricos.
 */
export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export interface Annotation {
  id: string;
  from: number;
  to: number;
}

/**
 * Devuelve el id de la anotación activa para un progreso dado.
 * Si p >= 1, devuelve la anotación con to >= 1 (la última en el borde).
 * Si no coincide ninguna, devuelve null.
 */
export function activeAnnotation(
  progress: number,
  list: readonly Annotation[],
): string | null {
  if (list.length === 0 || !Number.isFinite(progress)) {
    return null;
  }
  if (progress >= 1) {
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (item && item.to >= 1) {
        return item.id;
      }
    }
    return null;
  }
  for (const item of list) {
    if (progress >= item.from && progress < item.to) {
      return item.id;
    }
  }
  return null;
}




