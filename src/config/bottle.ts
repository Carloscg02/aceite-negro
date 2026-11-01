import { annotationsForStops, type FrameStop } from '../lib/scrub';
import frames from './bottle-frames.json';

/**
 * Paradas del giro 360° (fotogramas de public/media/bottle, medidos sobre el vídeo de estudio):
 * - 0: frente.
 * - 50: canto; el vidrio sin etiqueta deja ver el color del aceite (sin etiqueta entre 45 y 53).
 * - 83: contraetiqueta centrada (desvío del centro < 1 px).
 * - último: de nuevo de frente.
 * Los tramos están dimensionados para no superar 12 fotogramas por cada 5 % de scroll.
 */
export const BOTTLE_STOPS: readonly FrameStop[] = [
  { id: 'intro', from: 0, to: 0.02, frame: 0 },
  { id: 'variedades', from: 0.35, to: 0.39, frame: 50 },
  { id: 'contraetiqueta', from: 0.63, to: 0.67, frame: 83 },
  { id: 'formato', from: 0.97, to: 1, frame: frames.frameCount - 1 },
];

export const BOTTLE_ANNOTATIONS = annotationsForStops(BOTTLE_STOPS);
