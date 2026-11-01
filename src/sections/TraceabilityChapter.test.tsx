import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { TraceabilityChapter } from './TraceabilityChapter';

const PRODUCER = 'Juan Carlos Cano Carrillo';

describe('<TraceabilityChapter>', () => {
  it('abre su propio capítulo con un h2', () => {
    render(<TraceabilityChapter lotCode="JCCC141026" producer={PRODUCER} />);
    expect(screen.getByRole('heading', { level: 2, name: 'El lote es la fecha.' })).toBeInTheDocument();
  });

  it('descifra el lote en iniciales del productor, día, mes y año', () => {
    render(<TraceabilityChapter lotCode="JCCC141026" producer={PRODUCER} />);

    const lot = screen.getByLabelText('Lectura del lote JCCC141026');
    expect(within(lot).getAllByRole('term').map((t) => t.textContent)).toEqual(['JCCC', '14', '10', '26']);
    expect(within(lot).getByText(PRODUCER)).toBeInTheDocument();
    expect(within(lot).getByText('miércoles')).toBeInTheDocument();
    expect(within(lot).getByText('octubre')).toBeInTheDocument();
    expect(within(lot).getByText('2026')).toBeInTheDocument();
  });

  it('si el código no se puede leer, muestra el lote tal cual sin inventar la lectura', () => {
    render(<TraceabilityChapter lotCode="L-0001" producer={PRODUCER} />);

    expect(screen.queryAllByRole('term')).toHaveLength(0);
    expect(screen.getByText('L-0001')).toBeInTheDocument();
  });

  it('documenta aceituna y aceite con dos figuras numeradas y con timecode real del original', () => {
    render(<TraceabilityChapter lotCode="JCCC141026" producer={PRODUCER} />);

    const figures = screen.getAllByRole('figure');
    expect(figures).toHaveLength(2);
    expect(within(figures[0]!).getByRole('img', { name: /aceituna/i })).toHaveAttribute('src', '/media/aceituna.jpg');
    expect(figures[0]).toHaveTextContent(/Fig\. 01/);
    expect(figures[0]).toHaveTextContent('00:00.3');
    expect(figures[1]).toHaveTextContent(/Fig\. 02/);
    expect(figures[1]).toHaveTextContent('00:15.45—00:16.95');
  });

  it('el aceite es un bucle silencioso con póster, nombre accesible y botón de pausa', () => {
    render(<TraceabilityChapter lotCode="JCCC141026" producer={PRODUCER} />);

    const video = screen.getByLabelText(/aceite.*cubeta/i) as HTMLVideoElement;
    expect(video.tagName).toBe('VIDEO');
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('poster', '/media/aceite-bucle-poster.jpg');
    expect(screen.getByRole('button', { name: /pausar/i })).toBeInTheDocument();
  });

  it('cita la definición literal de la etiqueta', () => {
    render(<TraceabilityChapter lotCode="JCCC141026" producer={PRODUCER} />);
    expect(screen.getByText(/solo mediante procedimientos mecánicos/)).toBeInTheDocument();
  });
});
