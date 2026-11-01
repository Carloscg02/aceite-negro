import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { TraceabilityChapter } from './TraceabilityChapter';

describe('<TraceabilityChapter>', () => {
  it('abre su propio capítulo con un h2 dedicado a la aceituna picuda', () => {
    render(<TraceabilityChapter />);
    expect(screen.getByRole('heading', { level: 2, name: /La aceituna picuda/i })).toBeInTheDocument();
  });

  it('documenta aceituna picuda y aceite sin numerar figuras', () => {
    render(<TraceabilityChapter />);

    const figures = screen.getAllByRole('figure');
    expect(figures).toHaveLength(2);
    expect(within(figures[0]!).getByRole('img', { name: /aceituna picuda/i })).toHaveAttribute(
      'src',
      '/media/aceituna-picuda.jpg',
    );
    expect(figures[0]).not.toHaveTextContent(/Fig\./);
    expect(figures[1]).not.toHaveTextContent(/Fig\./);
    expect(figures[1]).toHaveTextContent(/Nuestro aceite en la almazara/);
  });

  it('el aceite es un bucle silencioso con póster, nombre accesible y botón de pausa', () => {
    render(<TraceabilityChapter />);

    const video = screen.getByLabelText(/Nuestro aceite en la almazara/i) as HTMLVideoElement;
    expect(video.tagName).toBe('VIDEO');
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('poster', '/media/aceite-bucle-poster.jpg');
    expect(screen.getByRole('button', { name: /pausar/i })).toBeInTheDocument();
  });

  it('destaca la explotación familiar y cita la definición de la etiqueta', () => {
    render(<TraceabilityChapter />);
    expect(screen.getByText('Una pequeña explotación familiar')).toBeInTheDocument();
    expect(screen.getByText(/solo mediante procedimientos mecánicos/)).toBeInTheDocument();
  });
});
