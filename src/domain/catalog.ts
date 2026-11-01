/**
 * Dominio de catálogo y formatos de venta de Aceite Negro.
 */

export type Availability = 'available' | 'sold_out';

export interface SaleFormat {
  id: string;
  name: string;
  bottles: number;
  bottleMl: number;
  unitPriceCents: number;
  paymentLink: string | null;
  availability: Availability;
}

export type PurchaseState =
  | { kind: 'buyable'; href: string }
  | { kind: 'sold_out' }
  | { kind: 'unconfigured' };

/**
 * Calcula los litros totales contenidos en un formato de venta.
 */
export function totalLiters(f: SaleFormat): number {
  return (f.bottles * f.bottleMl) / 1000;
}

/**
 * Calcula el precio total en céntimos para un formato de venta.
 */
export function totalPriceCents(f: SaleFormat): number {
  return f.bottles * f.unitPriceCents;
}

/**
 * Formatea una cantidad en céntimos a euros con el formato es-ES.
 * Sin decimales si es entero (6000 -> "60\u00a0€"), con dos decimales si no (1050 -> "10,50\u00a0€").
 * Espacio no divisible (U+00A0) antes del símbolo €.
 */
export function formatEuros(cents: number): string {
  const euros = cents / 100;
  const isInteger = Number.isInteger(euros);
  const formatted = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: isInteger ? 0 : 2,
  }).format(euros);
  return `${formatted}\u00a0€`;
}

/**
 * Formatea una cantidad en litros según es-ES, con espacio no divisible (U+00A0) antes de la L.
 * Ejemplo: 3 -> "3\u00a0L", 1.5 -> "1,5\u00a0L".
 */
export function formatLiters(liters: number): string {
  const formatted = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(liters);
  return `${formatted}\u00a0L`;
}

const STRIPE_PREFIX = 'https://buy.stripe.com/';

/**
 * Resuelve el estado de compra de un formato.
 * - 'sold_out' si el formato está agotado (tiene prioridad sobre el enlace).
 * - 'buyable' si tiene un enlace Stripe válido (empieza por https://buy.stripe.com/ y contiene slug).
 * - 'unconfigured' si no tiene enlace o no es válido (fallback a WhatsApp).
 */
export function resolvePurchase(f: SaleFormat): PurchaseState {
  if (f.availability === 'sold_out') {
    return { kind: 'sold_out' };
  }
  if (
    typeof f.paymentLink === 'string' &&
    f.paymentLink.startsWith(STRIPE_PREFIX) &&
    f.paymentLink.length > STRIPE_PREFIX.length
  ) {
    return { kind: 'buyable', href: f.paymentLink };
  }
  return { kind: 'unconfigured' };
}

/**
 * Determina el estado global del catálogo.
 * - 'empty' si la lista está vacía.
 * - 'all_sold_out' si todos los formatos están agotados.
 * - 'populated' si hay formatos disponibles para venta o contacto.
 */
export function catalogState(
  list: readonly SaleFormat[],
): 'empty' | 'all_sold_out' | 'populated' {
  if (list.length === 0) {
    return 'empty';
  }
  if (list.every((f) => f.availability === 'sold_out')) {
    return 'all_sold_out';
  }
  return 'populated';
}



