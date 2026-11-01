import { describe, it, expect } from 'vitest';
import {
  clamp,
  scrollProgress,
  frameIndexForProgress,
  frameForProgress,
  passThroughProgress,
  annotationsForStops,
  rotationDegrees,
  lerp,
  activeAnnotation,
  type Annotation,
  type FrameStop,
} from './scrub';

describe('clamp', () => {
  it('keeps value within boundaries', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps values below minimum', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it('clamps values above maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('preserves boundary values', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe('scrollProgress', () => {
  it('calculates linear progress between 0 and 1', () => {
    // sectionHeight = 3000, viewportHeight = 1000 => scrollable = 2000
    // rectTop = 0 => 0
    // rectTop = -1000 => 0.5
    // rectTop = -2000 => 1.0
    expect(scrollProgress(0, 3000, 1000)).toBe(0);
    expect(scrollProgress(-1000, 3000, 1000)).toBe(0.5);
    expect(scrollProgress(-2000, 3000, 1000)).toBe(1);
  });

  it('clamps progress to [0, 1] when outside the section', () => {
    // Before reaching the top of viewport: rectTop > 0
    expect(scrollProgress(500, 3000, 1000)).toBe(0);
    // Past the end of the section: rectTop < -2000
    expect(scrollProgress(-2500, 3000, 1000)).toBe(1);
  });

  it('returns 0 when sectionHeight <= viewportHeight (degenerate range)', () => {
    expect(scrollProgress(-100, 1000, 1000)).toBe(0);
    expect(scrollProgress(-100, 800, 1000)).toBe(0);
  });

  it('returns 0 for non-finite inputs without producing NaN', () => {
    expect(scrollProgress(Number.NaN, 3000, 1000)).toBe(0);
    expect(scrollProgress(-500, Number.NaN, 1000)).toBe(0);
    expect(scrollProgress(-500, 3000, Number.NaN)).toBe(0);
    expect(scrollProgress(Number.POSITIVE_INFINITY, 3000, 1000)).toBe(0);
    expect(scrollProgress(-500, Number.POSITIVE_INFINITY, 1000)).toBe(0);
    expect(scrollProgress(-500, 3000, Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe('frameIndexForProgress', () => {
  it('maps progress 0 to first frame and 1 to last frame', () => {
    // 120 frames indexed 0..119
    expect(frameIndexForProgress(0, 120)).toBe(0);
    expect(frameIndexForProgress(1, 120)).toBe(119);
  });

  it('maps intermediate progress rounding to nearest frame', () => {
    // 0.5 * 119 = 59.5 => rounds to 60
    expect(frameIndexForProgress(0.5, 120)).toBe(60);
    // 0.25 * 119 = 29.75 => rounds to 30
    expect(frameIndexForProgress(0.25, 120)).toBe(30);
  });

  it('clamps out of bounds progress to valid indices', () => {
    expect(frameIndexForProgress(-0.5, 120)).toBe(0);
    expect(frameIndexForProgress(1.5, 120)).toBe(119);
  });

  it('returns 0 when frameCount <= 1 or progress is non-finite', () => {
    expect(frameIndexForProgress(0.5, 1)).toBe(0);
    expect(frameIndexForProgress(0.5, 0)).toBe(0);
    expect(frameIndexForProgress(0.5, -5)).toBe(0);
    expect(frameIndexForProgress(Number.NaN, 120)).toBe(0);
    expect(frameIndexForProgress(Number.POSITIVE_INFINITY, 120)).toBe(0);
  });

  it('is monotonic as progress increases from 0 to 1', () => {
    const frameCount = 120;
    const steps = 100;
    let prevIndex = -1;
    for (let i = 0; i <= steps; i++) {
      const p = i / steps;
      const index = frameIndexForProgress(p, frameCount);
      expect(index).toBeGreaterThanOrEqual(prevIndex);
      prevIndex = index;
    }
  });
});

describe('lerp', () => {
  it('interpolates linearly between from and to', () => {
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(0, 100, 1)).toBe(100);
    expect(lerp(10, 20, 0.5)).toBe(15);
    expect(lerp(100, 0, 0.25)).toBe(75);
  });
});

describe('activeAnnotation', () => {
  const annotations: Annotation[] = [
    { id: 'etiqueta', from: 0.1, to: 0.4 },
    { id: 'vidrio', from: 0.4, to: 0.8 },
    { id: 'tapon', from: 0.8, to: 1.0 },
  ];

  it('returns null when progress is outside any annotation range', () => {
    expect(activeAnnotation(0.05, annotations)).toBeNull();
    expect(activeAnnotation(-0.1, annotations)).toBeNull();
  });

  it('returns id of first annotation where from <= progress < to', () => {
    expect(activeAnnotation(0.1, annotations)).toBe('etiqueta');
    expect(activeAnnotation(0.25, annotations)).toBe('etiqueta');
    expect(activeAnnotation(0.39, annotations)).toBe('etiqueta');
    expect(activeAnnotation(0.4, annotations)).toBe('vidrio');
    expect(activeAnnotation(0.79, annotations)).toBe('vidrio');
    expect(activeAnnotation(0.8, annotations)).toBe('tapon');
    expect(activeAnnotation(0.95, annotations)).toBe('tapon');
  });

  it('returns id of annotation with to >= 1 when progress >= 1', () => {
    expect(activeAnnotation(1.0, annotations)).toBe('tapon');
    expect(activeAnnotation(1.5, annotations)).toBe('tapon');
  });

  it('returns null when progress >= 1 but no annotation reaches to >= 1', () => {
    const truncated: Annotation[] = [
      { id: 'etiqueta', from: 0.1, to: 0.4 },
      { id: 'vidrio', from: 0.4, to: 0.8 },
    ];
    expect(activeAnnotation(1.0, truncated)).toBeNull();
  });

  it('returns null for empty list', () => {
    expect(activeAnnotation(0.5, [])).toBeNull();
  });
});

describe('frameForProgress (paradas del giro)', () => {
  const STOPS: FrameStop[] = [
    { id: 'frente', from: 0, to: 0.1, frame: 0 },
    { id: 'canto', from: 0.4, to: 0.5, frame: 40 },
    { id: 'final', from: 0.9, to: 1, frame: 100 },
  ];

  it('mantiene el fotograma exacto de cada parada en toda su meseta', () => {
    expect(frameForProgress(0, STOPS)).toBe(0);
    expect(frameForProgress(0.1, STOPS)).toBe(0);
    expect(frameForProgress(0.4, STOPS)).toBe(40);
    expect(frameForProgress(0.45, STOPS)).toBe(40);
    expect(frameForProgress(0.5, STOPS)).toBe(40);
    expect(frameForProgress(0.9, STOPS)).toBe(100);
    expect(frameForProgress(1, STOPS)).toBe(100);
  });

  it('a mitad de tramo está a medio camino entre las dos paradas', () => {
    expect(frameForProgress(0.25, STOPS)).toBeCloseTo(20, 6);
    expect(frameForProgress(0.7, STOPS)).toBeCloseTo(70, 6);
  });

  it('arranca y se asienta más despacio que una interpolación lineal', () => {
    // 10 % del tramo 0.1 → 0.4: lineal daría 4 fotogramas; el suavizado se queda muy por debajo.
    const leaving = frameForProgress(0.13, STOPS);
    expect(leaving).toBeGreaterThan(0);
    expect(leaving).toBeLessThan(2);
    // 90 % del tramo: lineal daría 36; el suavizado ya casi ha llegado.
    expect(frameForProgress(0.37, STOPS)).toBeGreaterThan(38);
  });

  it('es monótona cuando las paradas avanzan', () => {
    let previous = -1;
    for (let i = 0; i <= 1000; i++) {
      const frame = frameForProgress(i / 1000, STOPS);
      expect(frame).toBeGreaterThanOrEqual(previous);
      previous = frame;
    }
  });

  it('clampa fuera de [0, 1] y mantiene la primera parada antes de su meseta', () => {
    expect(frameForProgress(-0.5, STOPS)).toBe(0);
    expect(frameForProgress(1.5, STOPS)).toBe(100);
    expect(frameForProgress(0, [{ id: 'tarde', from: 0.2, to: 0.3, frame: 10 }])).toBe(10);
  });

  it('nunca devuelve NaN: entradas no finitas o sin paradas', () => {
    expect(frameForProgress(Number.NaN, STOPS)).toBe(0);
    expect(frameForProgress(Number.POSITIVE_INFINITY, STOPS)).toBe(0);
    expect(frameForProgress(0.5, [])).toBe(0);
  });
});

describe('annotationsForStops', () => {
  const STOPS: FrameStop[] = [
    { id: 'frente', from: 0, to: 0.1, frame: 0 },
    { id: 'canto', from: 0.4, to: 0.5, frame: 40 },
    { id: 'final', from: 0.9, to: 1, frame: 100 },
  ];

  it('reparte [0, 1] en tramos contiguos que cambian a mitad de camino entre paradas', () => {
    expect(annotationsForStops(STOPS)).toEqual([
      { id: 'frente', from: 0, to: 0.25 },
      { id: 'canto', from: 0.25, to: 0.7 },
      { id: 'final', from: 0.7, to: 1 },
    ]);
  });

  it('cada parada queda bajo su propia anotación', () => {
    const list = annotationsForStops(STOPS);
    expect(activeAnnotation(0.05, list)).toBe('frente');
    expect(activeAnnotation(0.45, list)).toBe('canto');
    expect(activeAnnotation(1, list)).toBe('final');
  });

  it('sin paradas no hay anotaciones', () => {
    expect(annotationsForStops([])).toEqual([]);
  });
});

describe('rotationDegrees', () => {
  it('convierte el fotograma en grados de giro redondeados', () => {
    expect(rotationDegrees(0, 120)).toBe(0);
    expect(rotationDegrees(60, 120)).toBe(180);
    expect(rotationDegrees(83, 120)).toBe(249);
  });

  it('nunca devuelve NaN sin fotogramas', () => {
    expect(rotationDegrees(5, 0)).toBe(0);
    expect(rotationDegrees(Number.NaN, 120)).toBe(0);
  });
});

describe('passThroughProgress', () => {
  it('vale 0 cuando el elemento asoma por abajo y 1 cuando sale por arriba', () => {
    // viewport 800, elemento de 400
    expect(passThroughProgress(800, 400, 800)).toBe(0);
    expect(passThroughProgress(-400, 400, 800)).toBe(1);
  });

  it('es lineal entre medias: centrado en pantalla vale 0.5', () => {
    expect(passThroughProgress(200, 400, 800)).toBe(0.5);
    expect(passThroughProgress(500, 400, 800)).toBe(0.25);
  });

  it('clampa fuera del recorrido', () => {
    expect(passThroughProgress(1200, 400, 800)).toBe(0);
    expect(passThroughProgress(-900, 400, 800)).toBe(1);
  });

  it('nunca devuelve NaN con entradas degeneradas', () => {
    expect(passThroughProgress(Number.NaN, 400, 800)).toBe(0);
    expect(passThroughProgress(0, Number.NaN, 800)).toBe(0);
    expect(passThroughProgress(0, 0, 0)).toBe(0);
  });
});
