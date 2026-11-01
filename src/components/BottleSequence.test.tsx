import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BottleSequence } from './BottleSequence';

const base = {
  frameCount: 120,
  template: '/media/bottle/f%03d.webp',
  width: 500,
  height: 680,
  stillSrc: '/media/bottle-still.jpg',
  progressRef: { current: 0 },
};

describe('<BottleSequence>', () => {
  it('loading: muestra el póster del primer fotograma con la geometría final y anuncia la carga', () => {
    const { container } = render(<BottleSequence {...base} status="loading" reducedMotion={false} />);

    const poster = screen.getByRole('img', { name: /botella/i });
    expect(poster).toHaveAttribute('src', '/media/bottle/f001.webp');
    expect(poster).toHaveAttribute('width', '500');
    expect(poster).toHaveAttribute('height', '680');
    expect(screen.getByText(/cargando giro 360/i)).toBeInTheDocument();
    expect(container.querySelector('[data-status="loading"]')).not.toBeNull();
  });

  it('ready: dibuja la secuencia en un canvas accesible ligado al scroll', () => {
    const { container } = render(<BottleSequence {...base} status="ready" reducedMotion={false} />);

    const canvas = screen.getByRole('img', { name: /gira.*desplaza/i });
    expect(canvas.tagName).toBe('CANVAS');
    expect(canvas).toHaveAttribute('width', '500');
    expect(canvas).toHaveAttribute('height', '680');
    expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    expect(container.querySelector('[data-status="ready"]')).not.toBeNull();
  });

  it('error: sustituye la secuencia por la foto fija de la botella', () => {
    render(<BottleSequence {...base} status="error" reducedMotion={false} />);

    const still = screen.getByRole('img', { name: /botella/i });
    expect(still.tagName).toBe('IMG');
    expect(still).toHaveAttribute('src', '/media/bottle-still.jpg');
    expect(document.querySelector('canvas')).toBeNull();
  });

  it('reduced-motion: muestra la botella de frente, estática y sin canvas', () => {
    const { container } = render(<BottleSequence {...base} status="ready" reducedMotion />);

    const front = screen.getByRole('img', { name: /botella/i });
    expect(front.tagName).toBe('IMG');
    expect(front).toHaveAttribute('src', '/media/bottle/f001.webp');
    expect(document.querySelector('canvas')).toBeNull();
    expect(container.querySelector('[data-status="reduced"]')).not.toBeNull();
  });
});
