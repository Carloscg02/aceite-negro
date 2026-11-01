import { describe, it, expect } from 'vitest';
import { buildWhatsAppUrl, buildMailtoUrl } from './contact';

describe('buildWhatsAppUrl', () => {
  it('strips non-digits from phone number and URI encodes text', () => {
    const url = buildWhatsAppUrl('+34 600 00 00 00', 'Hola, quiero reservar una caja.');
    expect(url).toBe('https://wa.me/34600000000?text=Hola%2C%20quiero%20reservar%20una%20caja.');
  });

  it('handles numbers with dashes and brackets', () => {
    const url = buildWhatsAppUrl('(34) 612-345-678', 'Pedido Aceite Negro');
    expect(url).toBe('https://wa.me/34612345678?text=Pedido%20Aceite%20Negro');
  });

  it('throws an error if phone has fewer than 8 digits', () => {
    expect(() => buildWhatsAppUrl('1234567', 'Test')).toThrowError(
      'Phone number must contain at least 8 digits',
    );
    expect(() => buildWhatsAppUrl('+12 34', 'Test')).toThrowError();
  });
});

describe('buildMailtoUrl', () => {
  it('builds mailto link with encoded subject when body is omitted', () => {
    const url = buildMailtoUrl('pedidos@aceitenegropicudo.es', 'Pedido Aceite Negro');
    expect(url).toBe('mailto:pedidos@aceitenegropicudo.es?subject=Pedido%20Aceite%20Negro');
  });

  it('builds mailto link with encoded subject and encoded body when body is provided', () => {
    const url = buildMailtoUrl(
      'pedidos@aceitenegropicudo.es',
      'Consulta lote',
      'Hola, ¿quedan botellas de 500 ml?',
    );
    expect(url).toBe(
      'mailto:pedidos@aceitenegropicudo.es?subject=Consulta%20lote&body=Hola%2C%20%C2%BFquedan%20botellas%20de%20500%20ml%3F',
    );
  });
});

