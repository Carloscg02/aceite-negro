import { describe, expect, it } from 'vitest';
import { activeAnnotation, frameForProgress } from '../lib/scrub';
import frames from './bottle-frames.json';
import { BOTTLE_ANNOTATIONS, BOTTLE_STOPS } from './bottle';

const LAST = frames.frameCount - 1;

describe('Giro de la botella (config real)', () => {
  it('empieza de frente en el primer fotograma y termina en el último', () => {
    expect(frameForProgress(0, BOTTLE_STOPS)).toBe(0);
    expect(frameForProgress(1, BOTTLE_STOPS)).toBe(LAST);
  });

  it('las paradas están ordenadas, dentro de [0, 1] y en fotogramas existentes', () => {
    let previousTo = -Infinity;
    for (const stop of BOTTLE_STOPS) {
      expect(stop.from).toBeGreaterThan(previousTo);
      expect(stop.to).toBeGreaterThanOrEqual(stop.from);
      expect(stop.to).toBeLessThanOrEqual(1);
      expect(Number.isInteger(stop.frame)).toBe(true);
      expect(stop.frame).toBeGreaterThanOrEqual(0);
      expect(stop.frame).toBeLessThanOrEqual(LAST);
      previousTo = stop.to;
    }
  });

  it('nunca salta más de 12 fotogramas en ningún tramo del 5 % de scroll', () => {
    for (let p = 0; p <= 0.95; p += 0.0025) {
      const delta = frameForProgress(p + 0.05, BOTTLE_STOPS) - frameForProgress(p, BOTTLE_STOPS);
      expect(delta, `ventana desde ${p.toFixed(4)}`).toBeLessThanOrEqual(12);
    }
  });

  it('en cada parada se muestra su propia anotación', () => {
    for (const stop of BOTTLE_STOPS) {
      expect(activeAnnotation((stop.from + stop.to) / 2, BOTTLE_ANNOTATIONS)).toBe(stop.id);
    }
    expect(BOTTLE_ANNOTATIONS.map((a) => a.id)).toEqual(['intro', 'variedades', 'contraetiqueta', 'formato']);
  });
});
