import type { SaleFormat } from '../domain/catalog';

export const GLASS_PRICE_CENTS = 1300; // 13 € botella de cristal (500 ml)
export const PET_PRICE_CENTS = 1000; // 10 € botella de PET (500 ml)

const env = import.meta.env;

export const SALE_FORMATS: SaleFormat[] = [
  {
    id: 'botella-cristal',
    name: 'Botella de cristal',
    bottles: 1,
    bottleMl: 500,
    unitPriceCents: GLASS_PRICE_CENTS,
    paymentLink: env.VITE_STRIPE_LINK_CRISTAL ?? null,
    availability: 'available',
  },
  {
    id: 'botella-pet',
    name: 'Botella de PET',
    bottles: 1,
    bottleMl: 500,
    unitPriceCents: PET_PRICE_CENTS,
    paymentLink: env.VITE_STRIPE_LINK_PET ?? null,
    availability: 'available',
  },
];

export const CONTACT = {
  whatsapp: '+34 689 09 11 31',
};
