import { describe, it, expect } from 'vitest';
import {
  clamp,
  scrollProgress,
  frameIndexForProgress,
  lerp,
  activeAnnotation,
  type Annotation,
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




