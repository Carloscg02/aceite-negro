import { describe, expect, it } from 'vitest';
import { parseLot } from './lot';

describe('parseLot', () => {
  it('lee las iniciales del productor y la fecha DDMMAA del lote impreso en la etiqueta', () => {
    expect(parseLot('JCCC141026')).toEqual({
      code: 'JCCC141026',
      initials: 'JCCC',
      day: 14,
      month: 10,
      year: 2026,
      monthName: 'octubre',
      weekday: 'miércoles',
    });
  });

  it('normaliza mayúsculas y espacios alrededor', () => {
    expect(parseLot('  jccc141026 ')?.code).toBe('JCCC141026');
    expect(parseLot('AB010127')).toMatchObject({
      initials: 'AB',
      day: 1,
      month: 1,
      year: 2027,
      monthName: 'enero',
      weekday: 'viernes',
    });
  });

  it('devuelve null si el código no son iniciales seguidas de 6 dígitos', () => {
    for (const bad of ['', '141026', 'JCCC14102', 'JCCC1410266', 'JC-C141026', 'JCCC 141026']) {
      expect(parseLot(bad), bad).toBeNull();
    }
  });

  it('devuelve null con fechas imposibles', () => {
    expect(parseLot('JCCC321026')).toBeNull(); // día 32
    expect(parseLot('JCCC001026')).toBeNull(); // día 0
    expect(parseLot('JCCC141326')).toBeNull(); // mes 13
    expect(parseLot('JCCC310926')).toBeNull(); // 31 de septiembre
    expect(parseLot('JCCC290225')).toBeNull(); // 2025 no es bisiesto
    expect(parseLot('JCCC290224')).toMatchObject({ day: 29, month: 2, year: 2024, weekday: 'jueves' });
  });
});
