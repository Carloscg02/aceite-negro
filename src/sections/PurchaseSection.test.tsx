import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { PurchaseSection } from './PurchaseSection';
import type { SaleFormat } from '../domain/catalog';

const CONTACT = { whatsapp: '+34 611 22 33 44', email: 'pedidos@example.es' };

const caja = (over: Partial<SaleFormat> = {}): SaleFormat => ({
  id: 'caja-6',
  name: 'Caja de 6',
  bottles: 6,
  bottleMl: 500,
  unitPriceCents: 1000,
  paymentLink: 'https://buy.stripe.com/test_caja6',
  availability: 'available',
  ...over,
});

const caja12 = (over: Partial<SaleFormat> = {}): SaleFormat =>
  caja({ id: 'caja-12', name: 'Caja de 12', bottles: 12, paymentLink: 'https://buy.stripe.com/test_caja12', ...over });

// Testing Library normaliza los espacios (incl. U+00A0) del DOM; el NBSP se verifica en catalog.test.ts.
describe('<PurchaseSection>', () => {
  it('populated: lista cada formato con litros, precio total y enlace de pago Stripe', () => {
    render(<PurchaseSection formats={[caja(), caja12()]} contact={CONTACT} />);

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    const rows = screen.getAllByRole('listitem');
    expect(rows).toHaveLength(2);

    const first = within(rows[0]!);
    expect(first.getByText('Caja de 6')).toBeInTheDocument();
    expect(first.getByText('6 × 500 ml · 3 L')).toBeInTheDocument();
    expect(first.getByText('60 €')).toBeInTheDocument();
    expect(first.getByRole('link', { name: /comprar caja de 6/i })).toHaveAttribute(
      'href',
      'https://buy.stripe.com/test_caja6',
    );

    const second = within(rows[1]!);
    expect(second.getByText('12 × 500 ml · 6 L')).toBeInTheDocument();
    expect(second.getByText('120 €')).toBeInTheDocument();
  });

  it('muestra el precio unitario por botella', () => {
    render(<PurchaseSection formats={[caja()]} contact={CONTACT} />);
    expect(screen.getByText('10 € / botella')).toBeInTheDocument();
  });

  it('sold_out: el formato agotado no ofrece enlace de compra y se anuncia como agotado', () => {
    render(<PurchaseSection formats={[caja({ availability: 'sold_out' }), caja12()]} contact={CONTACT} />);

    const [agotada, disponible] = screen.getAllByRole('listitem');
    const a = within(agotada!);
    expect(a.queryByRole('link', { name: /comprar/i })).not.toBeInTheDocument();
    expect(a.getByRole('button', { name: /caja de 6 agotada/i })).toBeDisabled();
    expect(within(disponible!).getByRole('link', { name: /comprar caja de 12/i })).toBeInTheDocument();
  });

  it('unconfigured: sin enlace Stripe válido deriva a pedido por WhatsApp prellenado', () => {
    render(<PurchaseSection formats={[caja({ paymentLink: null })]} contact={CONTACT} />);

    const row = within(screen.getByRole('listitem'));
    const link = row.getByRole('link', { name: /pedir caja de 6 por whatsapp/i });
    expect(link.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/34611223344\?text=/);
    expect(decodeURIComponent(link.getAttribute('href')!)).toContain('caja de 6');
  });

  it('all_sold_out: sin formatos comprables muestra aviso y contacto directo', () => {
    render(
      <PurchaseSection
        formats={[caja({ availability: 'sold_out' }), caja12({ availability: 'sold_out' })]}
        contact={CONTACT}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(/no quedan cajas disponibles en la web/i);
    expect(screen.queryByRole('link', { name: /comprar/i })).not.toBeInTheDocument();
  });

  it('empty: sin formatos publicados muestra aviso y contacto directo', () => {
    render(<PurchaseSection formats={[]} contact={CONTACT} />);

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByRole('status')).toHaveTextContent(/formatos de venta online/i);
  });

  it('siempre ofrece contacto directo por WhatsApp y email para particulares y profesionales', () => {
    render(<PurchaseSection formats={[caja()]} contact={CONTACT} />);

    const contacto = screen.getByRole('region', { name: /pedidos directos/i });
    const whatsapps = within(contacto).getAllByRole('link', { name: /whatsapp/i });
    const emails = within(contacto).getAllByRole('link', { name: /email|correo/i });
    expect(whatsapps.length).toBeGreaterThanOrEqual(1);
    expect(emails.length).toBeGreaterThanOrEqual(1);
    expect(emails[0]).toHaveAttribute('href', expect.stringMatching(/^mailto:pedidos@example\.es\?subject=/));
    expect(within(contacto).getByText(/tiendas|restaurantes|profesionales/i)).toBeInTheDocument();
  });
});
