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

/** Parada del giro: entre `from` y `to` (progreso 0..1) la botella se queda quieta en `frame`. */
export interface FrameStop {
  id: string;
  from: number;
  to: number;
  frame: number;
}

/** Curva de suavizado cúbica: derivada nula en los extremos (arranca y se asienta sin golpe). */
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Fotograma (fraccionario) para un progreso, recorriendo las paradas en orden:
 * meseta en cada parada y tramo suavizado entre una y la siguiente.
 * Fuera de [0, 1] clampa; ante entradas no finitas devuelve la primera parada; sin paradas, 0.
 */
export function frameForProgress(progress: number, stops: readonly FrameStop[]): number {
  const first = stops[0];
  if (!first) return 0;
  if (!Number.isFinite(progress)) return first.frame;
  const p = clamp(progress, 0, 1);
  if (p <= first.to) return first.frame;
  for (let i = 1; i < stops.length; i++) {
    const prev = stops[i - 1]!;
    const next = stops[i]!;
    if (p < next.from) {
      const t = clamp((p - prev.to) / (next.from - prev.to), 0, 1);
      return lerp(prev.frame, next.frame, smoothstep(t));
    }
    if (p <= next.to) return next.frame;
  }
  return stops[stops.length - 1]!.frame;
}

/**
 * Anotaciones que cubren [0, 1] sin huecos: cada una contiene la meseta de su parada
 * y el relevo ocurre a mitad de camino entre paradas (cuando la botella va más rápido).
 */
export function annotationsForStops(stops: readonly FrameStop[]): Annotation[] {
  return stops.map((stop, i) => {
    const prev = stops[i - 1];
    const next = stops[i + 1];
    return {
      id: stop.id,
      from: prev ? (prev.to + stop.from) / 2 : 0,
      to: next ? (stop.to + next.from) / 2 : 1,
    };
  });
}

/**
 * Progreso [0..1] de un elemento que atraviesa el viewport: 0 cuando su borde superior
 * asoma por abajo, 1 cuando su borde inferior sale por arriba. Nunca NaN.
 */
export function passThroughProgress(rectTop: number, height: number, viewportHeight: number): number {
  if (!Number.isFinite(rectTop) || !Number.isFinite(height) || !Number.isFinite(viewportHeight)) return 0;
  const run = viewportHeight + height;
  if (run <= 0) return 0;
  return clamp((viewportHeight - rectTop) / run, 0, 1);
}

/** Grados de giro (redondeados) que representa un fotograma de la secuencia 360°. */
export function rotationDegrees(frame: number, frameCount: number): number {
  if (!Number.isFinite(frame) || !Number.isFinite(frameCount) || frameCount <= 0) return 0;
  return Math.round((frame / frameCount) * 360);
}
