import { describe, expect, it } from 'vitest';
import { frameUrl, loadOrder, nearestAvailable } from './frames';

describe('frameUrl', () => {
  it('rellena el índice 1-based con tres dígitos según la plantilla', () => {
    expect(frameUrl('/media/bottle/f%03d.webp', 0)).toBe('/media/bottle/f001.webp');
    expect(frameUrl('/media/bottle/f%03d.webp', 119)).toBe('/media/bottle/f120.webp');
  });
});

describe('loadOrder', () => {
  it('recorre todos los fotogramas una sola vez, empezando por una cobertura gruesa', () => {
    const order = loadOrder(9);
    expect(order).toEqual([0, 8, 4, 2, 6, 1, 3, 5, 7]);
  });

  it('no repite ni omite índices en secuencias largas', () => {
    const order = loadOrder(120);
    expect(order).toHaveLength(120);
    expect(new Set(order).size).toBe(120);
  });

  it('devuelve lista vacía para 0 fotogramas', () => {
    expect(loadOrder(0)).toEqual([]);
  });
});

describe('nearestAvailable', () => {
  const loaded = [true, false, false, false, true, false];

  it('devuelve el propio índice si está cargado', () => {
    expect(nearestAvailable(loaded, 4)).toBe(4);
  });

  it('busca el cargado más cercano, prefiriendo el anterior en empate', () => {
    expect(nearestAvailable(loaded, 1)).toBe(0);
    expect(nearestAvailable(loaded, 2)).toBe(0);
    expect(nearestAvailable(loaded, 3)).toBe(4);
    expect(nearestAvailable(loaded, 5)).toBe(4);
  });

  it('devuelve -1 si no hay ninguno cargado', () => {
    expect(nearestAvailable([false, false], 1)).toBe(-1);
  });
});
