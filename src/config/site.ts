import type { SaleFormat } from '../domain/catalog';

export const UNIT_PRICE_CENTS = 1000; // 10 € por botella de 500 ml (provisional)

const env = import.meta.env;

export const SALE_FORMATS: SaleFormat[] = [
  {
    id: 'caja-6',
    name: 'Caja de 6',
    bottles: 6,
    bottleMl: 500,
    unitPriceCents: UNIT_PRICE_CENTS,
    paymentLink: env.VITE_STRIPE_LINK_CAJA_6 ?? null,
    availability: 'available',
  },
  {
    id: 'caja-12',
    name: 'Caja de 12',
    bottles: 12,
    bottleMl: 500,
    unitPriceCents: UNIT_PRICE_CENTS,
    paymentLink: env.VITE_STRIPE_LINK_CAJA_12 ?? null,
    availability: 'available',
  },
];

export const CONTACT = {
  whatsapp: '+34 600 000 000',
  email: 'pedidos@aceitenegropicudo.es',
}; // placeholders
