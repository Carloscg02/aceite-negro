import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { PurchaseSection } from './PurchaseSection';
import type { SaleFormat } from '../domain/catalog';

const CONTACT = { whatsapp: '+34 670 94 14 88' };

const cristal = (over: Partial<SaleFormat> = {}): SaleFormat => ({
  id: 'botella-cristal',
  name: 'Botella de cristal',
  bottles: 1,
  bottleMl: 500,
  unitPriceCents: 1300,
  paymentLink: null,
  availability: 'available',
  ...over,
});

const pet = (over: Partial<SaleFormat> = {}): SaleFormat => ({
  id: 'botella-pet',
  name: 'Botella de PET',
  bottles: 1,
  bottleMl: 500,
  unitPriceCents: 1000,
  paymentLink: null,
  availability: 'available',
  ...over,
});

// Testing Library normaliza los espacios (incl. U+00A0) del DOM; el NBSP se verifica en catalog.test.ts.
describe('<PurchaseSection>', () => {
  it('populated: muestra los dos formatos (cristal 13 € y PET 10 €) de 500 ml y el encargo único por WhatsApp', () => {
    render(<PurchaseSection formats={[cristal(), pet()]} contact={CONTACT} />);

    expect(screen.getByRole('heading', { level: 2, name: /en origen, por botellas/i })).toBeInTheDocument();
    const rows = screen.getAllByRole('listitem');
    expect(rows).toHaveLength(2);

    const first = within(rows[0]!);
    expect(first.getByText('Botella de cristal')).toBeInTheDocument();
    expect(first.getByText('500 ml')).toBeInTheDocument();
    expect(first.getByText('13 €')).toBeInTheDocument();

    const second = within(rows[1]!);
    expect(second.getByText('Botella de PET')).toBeInTheDocument();
    expect(second.getByText('500 ml')).toBeInTheDocument();
    expect(second.getByText('10 €')).toBeInTheDocument();
  });

  it('incluye botón con logo SVG de WhatsApp hacia +34 670 94 14 88 y aviso explícito de no llamadas ni correo', () => {
    render(<PurchaseSection formats={[cristal(), pet()]} contact={CONTACT} />);

    const cta = screen.getByRole('link', { name: /encargar por whatsapp/i });
    expect(cta.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/34670941488\?text=/);
    expect(cta).toHaveAttribute('target', '_blank');
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
    expect(cta.querySelector('svg')).not.toBeNull();

    expect(screen.getByText(/\+34 670 94 14 88/)).toBeInTheDocument();
    expect(screen.getByText(/únicamente por mensaje de whatsapp./i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /correo|email/i })).not.toBeInTheDocument();
  });

  it('sold_out: marca un formato agotado sin ocultar el resto', () => {
    render(<PurchaseSection formats={[cristal({ availability: 'sold_out' }), pet()]} contact={CONTACT} />);

    const [agotada, disponible] = screen.getAllByRole('listitem');
    expect(agotada).toHaveAttribute('data-state', 'sold_out');
    expect(within(agotada!).getByText(/agotada/i)).toBeInTheDocument();
    expect(disponible).toHaveAttribute('data-state', 'available');
  });

  it('all_sold_out: cuando todos los formatos están agotados muestra aviso de estado', () => {
    render(
      <PurchaseSection
        formats={[cristal({ availability: 'sold_out' }), pet({ availability: 'sold_out' })]}
        contact={CONTACT}
      />,
    );

    expect(screen.getByRole('status')).toHaveTextContent(/cosecha agotada|no quedan botellas disponibles/i);
  });

  it('empty: sin formatos publicados muestra aviso de estado y mantiene el contacto por WhatsApp', () => {
    render(<PurchaseSection formats={[]} contact={CONTACT} />);

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByRole('status')).toHaveTextContent(/consulta disponibilidad directamente por whatsapp/i);
    expect(screen.getByRole('link', { name: /encargar por whatsapp/i })).toBeInTheDocument();
  });
});
