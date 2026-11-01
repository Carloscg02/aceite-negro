import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SiteFooter, SiteHeader } from './SiteChrome';

const CONTACT = { whatsapp: '+34 670 94 14 88' };

const fichaOf = () => screen.getByText(/ficha completa/i).closest('details');

describe('<SiteHeader>', () => {
  it('navega a los tres movimientos de la página', () => {
    render(<SiteHeader />);
    const nav = screen.getByRole('navigation', { name: /capítulos/i });
    expect(within(nav).getByRole('link', { name: 'Variedad' })).toHaveAttribute('href', '#variedad');
    expect(within(nav).getByRole('link', { name: 'Ficha' })).toHaveAttribute('href', '#ficha');
    expect(within(nav).getByRole('link', { name: 'Comprar' })).toHaveAttribute('href', '#comprar');
  });
});

describe('<SiteFooter>', () => {
  it('muestra a la vista, fuera de la ficha plegada, los datos legales de la etiqueta y el contacto por WhatsApp', () => {
    render(<SiteFooter contact={CONTACT} />);
    const footer = screen.getByRole('contentinfo');
    const ficha = fichaOf()!;
    const visible = (text: string) => within(footer).getAllByText(text).filter((el) => !ficha.contains(el));

    expect(visible('N.RGSEAA 40.044510/J')).toHaveLength(1);
    expect(visible('JCCC141026')).toHaveLength(1);
    expect(visible('Juan Carlos Cano Carrillo y otro C.B')).toHaveLength(1);
    expect(visible('E23312572')).toHaveLength(1);
    const waLink = within(footer).getByRole('link', { name: /\+34 670 94 14 88/i });
    expect(waLink).toHaveAttribute('href', expect.stringMatching(/^https:\/\/wa\.me\/34670941488\?text=/));
    expect(waLink).toHaveAttribute('target', '_blank');
    expect(waLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(within(footer).getByText(/no se atienden llamadas/i)).toBeInTheDocument();
  });

  it('guarda la ficha completa plegada, con la tabla nutricional y los datos de etiqueta', () => {
    render(<SiteFooter contact={CONTACT} />);
    const ficha = fichaOf();
    expect(ficha).not.toBeNull();
    expect(ficha).toHaveAttribute('id', 'ficha');
    expect(ficha).not.toHaveAttribute('open');

    const sheet = within(ficha!);
    const table = sheet.getByRole('table', { name: /información nutricional/i, hidden: true });
    // Testing Library normaliza los espacios (incl. U+00A0) del DOM al comparar texto.
    expect(within(table).getByText('72 g')).toBeInTheDocument();
    expect(within(table).getByText('20 mg (167 % VRN*)')).toBeInTheDocument();
    expect(sheet.getByText('Picudo y Carrasqueño')).toBeInTheDocument();
    expect(sheet.getByText('N.RGSEAA 40.044510/J')).toBeInTheDocument();
    expect(sheet.getByText('JCCC141026')).toBeInTheDocument();
    expect(sheet.getByText('Juan Carlos Cano Carrillo y otro C.B · E23312572')).toBeInTheDocument();
    expect(sheet.getByText('Antes del fin de 10/2028')).toBeInTheDocument();
  });

  it('el enlace «Ficha» de la cabecera despliega la ficha', async () => {
    const user = userEvent.setup();
    render(
      <>
        <SiteHeader />
        <SiteFooter contact={CONTACT} />
      </>,
    );
    await user.click(screen.getByRole('link', { name: 'Ficha' }));
    expect(fichaOf()).toHaveAttribute('open');
  });
});
