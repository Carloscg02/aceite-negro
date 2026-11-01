import { describe, it, expect } from 'vitest';
import {
  totalLiters,
  totalPriceCents,
  formatEuros,
  formatLiters,
  resolvePurchase,
  catalogState,
  type SaleFormat,
} from './catalog';
import { SALE_FORMATS } from '../config/site';

describe('catalog calculations', () => {
  const format6: SaleFormat = {
    id: 'caja-6',
    name: 'Caja de 6',
    bottles: 6,
    bottleMl: 500,
    unitPriceCents: 1000,
    paymentLink: null,
    availability: 'available',
  };

  const format12: SaleFormat = {
    id: 'caja-12',
    name: 'Caja de 12',
    bottles: 12,
    bottleMl: 500,
    unitPriceCents: 1000,
    paymentLink: 'https://buy.stripe.com/test_12',
    availability: 'available',
  };

  it('calculates total liters from bottles and bottle size', () => {
    expect(totalLiters(format6)).toBe(3);
    expect(totalLiters(format12)).toBe(6);
  });

  it('calculates total price in cents from bottles and unit price', () => {
    expect(totalPriceCents(format6)).toBe(6000);
    expect(totalPriceCents(format12)).toBe(12000);
  });
});

describe('formatEuros', () => {
  it('formats integer euro amounts without decimal places with nbsp separator', () => {
    expect(formatEuros(6000)).toBe('60\u00a0€');
    expect(formatEuros(12000)).toBe('120\u00a0€');
    expect(formatEuros(1000)).toBe('10\u00a0€');
  });

  it('formats fractional euro amounts with two decimal places with nbsp separator', () => {
    expect(formatEuros(1050)).toBe('10,50\u00a0€');
    expect(formatEuros(99)).toBe('0,99\u00a0€');
  });
});

describe('formatLiters', () => {
  it('formats integer and fractional liters with nbsp separator', () => {
    expect(formatLiters(3)).toBe('3\u00a0L');
    expect(formatLiters(6)).toBe('6\u00a0L');
    expect(formatLiters(1.5)).toBe('1,5\u00a0L');
  });
});

describe('resolvePurchase', () => {
  const baseFormat: SaleFormat = {
    id: 'caja-6',
    name: 'Caja de 6',
    bottles: 6,
    bottleMl: 500,
    unitPriceCents: 1000,
    paymentLink: null,
    availability: 'available',
  };

  it('prioritizes sold_out even if a payment link is present', () => {
    const soldOutWithLink: SaleFormat = {
      ...baseFormat,
      paymentLink: 'https://buy.stripe.com/abc123',
      availability: 'sold_out',
    };
    expect(resolvePurchase(soldOutWithLink)).toEqual({ kind: 'sold_out' });
  });

  it('returns buyable when paymentLink is a valid Stripe link with path content', () => {
    const buyableFormat: SaleFormat = {
      ...baseFormat,
      paymentLink: 'https://buy.stripe.com/live_abc123',
      availability: 'available',
    };
    expect(resolvePurchase(buyableFormat)).toEqual({
      kind: 'buyable',
      href: 'https://buy.stripe.com/live_abc123',
    });
  });

  it('returns unconfigured when paymentLink is null', () => {
    const noLink: SaleFormat = {
      ...baseFormat,
      paymentLink: null,
      availability: 'available',
    };
    expect(resolvePurchase(noLink)).toEqual({ kind: 'unconfigured' });
  });

  it('returns unconfigured when paymentLink is bare prefix with nothing after it', () => {
    const barePrefix: SaleFormat = {
      ...baseFormat,
      paymentLink: 'https://buy.stripe.com/',
      availability: 'available',
    };
    expect(resolvePurchase(barePrefix)).toEqual({ kind: 'unconfigured' });
  });

  it('returns unconfigured when paymentLink is not a Stripe payment link', () => {
    const otherUrl: SaleFormat = {
      ...baseFormat,
      paymentLink: 'https://example.com/checkout',
      availability: 'available',
    };
    expect(resolvePurchase(otherUrl)).toEqual({ kind: 'unconfigured' });
  });
});

describe('catalogState', () => {
  const availableFormat: SaleFormat = {
    id: 'caja-6',
    name: 'Caja de 6',
    bottles: 6,
    bottleMl: 500,
    unitPriceCents: 1000,
    paymentLink: null,
    availability: 'available',
  };

  const soldOutFormat: SaleFormat = {
    id: 'caja-12',
    name: 'Caja de 12',
    bottles: 12,
    bottleMl: 500,
    unitPriceCents: 1000,
    paymentLink: null,
    availability: 'sold_out',
  };

  it('returns empty when list is empty', () => {
    expect(catalogState([])).toBe('empty');
  });

  it('returns all_sold_out when every format is sold_out', () => {
    expect(catalogState([soldOutFormat, { ...soldOutFormat, id: 'caja-6-sold' }])).toBe(
      'all_sold_out',
    );
  });

  it('returns populated when at least one format is available', () => {
    expect(catalogState([availableFormat])).toBe('populated');
    expect(catalogState([availableFormat, soldOutFormat])).toBe('populated');
  });
});

describe('site SALE_FORMATS configuration', () => {
  it('configures botella-cristal (500 ml) at 13 €', () => {
    const format = SALE_FORMATS.find((f) => f.id === 'botella-cristal');
    expect(format).toBeDefined();
    if (!format) throw new Error('botella-cristal not found');
    expect(format.bottles).toBe(1);
    expect(format.bottleMl).toBe(500);
    expect(totalLiters(format)).toBe(0.5);
    expect(totalPriceCents(format)).toBe(1300);
    expect(formatEuros(totalPriceCents(format))).toBe('13\u00a0€');
  });

  it('configures botella-pet (500 ml) at 10 €', () => {
    const format = SALE_FORMATS.find((f) => f.id === 'botella-pet');
    expect(format).toBeDefined();
    if (!format) throw new Error('botella-pet not found');
    expect(format.bottles).toBe(1);
    expect(format.bottleMl).toBe(500);
    expect(totalLiters(format)).toBe(0.5);
    expect(totalPriceCents(format)).toBe(1000);
    expect(formatEuros(totalPriceCents(format))).toBe('10\u00a0€');
  });
});




