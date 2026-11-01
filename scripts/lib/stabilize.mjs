// Estabilización «trípode» por seguimiento de dos rasgos fijos de la escena (sin dependencias nativas).
// Lo usa scripts/build-media.mjs para el bucle del aceite: el metraje de móvil se fija a un fotograma
// de referencia mediante una transformación de semejanza (traslación + giro + escala) por fotograma,
// y se recorta un cuadrado centrado en el punto de impacto del chorro.
import { execFileSync } from 'node:child_process';

const T = 24; // semilado de la plantilla de seguimiento (48×48 px)
const R = 40; // radio de búsqueda entre fotogramas consecutivos

/** Decodifica un tramo [start, end) a fotogramas RGB24 crudos. */
export function readFrames(ffmpeg, input, { start, end, width, height }) {
  const raw = execFileSync(
    ffmpeg,
    // passthrough: sin él, el muxer rawvideo asume 25 fps y descarta fotogramas del original a 30 fps.
    ['-v', 'error', '-i', input, '-vf', `trim=${start}:${end},setpts=PTS-STARTPTS`, '-fps_mode', 'passthrough',
      '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
    { maxBuffer: 1 << 30 },
  );
  const size = width * height * 3;
  const frames = [];
  for (let o = 0; o + size <= raw.length; o += size) frames.push(raw.subarray(o, o + size));
  return frames;
}

function toGray(rgb, width, height) {
  const g = new Float32Array(width * height);
  for (let i = 0, j = 0; i < g.length; i++, j += 3) g[i] = 0.299 * rgb[j] + 0.587 * rgb[j + 1] + 0.114 * rgb[j + 2];
  return g;
}

function templateAt(gray, width, cx, cy) {
  const tpl = new Float32Array(4 * T * T);
  let sum = 0;
  for (let y = 0; y < 2 * T; y++)
    for (let x = 0; x < 2 * T; x++) {
      const v = gray[(cy - T + y) * width + (cx - T + x)];
      tpl[y * 2 * T + x] = v;
      sum += v;
    }
  const mean = sum / tpl.length;
  for (let k = 0; k < tpl.length; k++) tpl[k] -= mean;
  return tpl;
}

/** Diferencia media absoluta con medias restadas (robusta a cambios de exposición del móvil). */
function cost(gray, width, cx, cy, tpl, step) {
  let sum = 0;
  let n = 0;
  for (let y = -T; y < T; y += step)
    for (let x = -T; x < T; x += step) {
      sum += gray[(cy + y) * width + cx + x];
      n++;
    }
  const mean = sum / n;
  let sad = 0;
  for (let y = -T; y < T; y += step)
    for (let x = -T; x < T; x += step)
      sad += Math.abs(gray[(cy + y) * width + cx + x] - mean - tpl[(y + T) * 2 * T + x + T]);
  return sad / n;
}

/** Vértice de la parábola por tres muestras: refinamiento subpíxel en [-0.5, 0.5]. */
const parabola = (a, b, c) => {
  const d = a - 2 * b + c;
  return d > 0 ? Math.max(-0.5, Math.min(0.5, (a - c) / (2 * d))) : 0;
};

/**
 * Sigue cada rasgo (plantilla fija del primer fotograma, sin deriva acumulada).
 * Devuelve por fotograma `[{ x, y, err }]` con precisión subpíxel.
 */
export function track(frames, width, height, points) {
  const grays = frames.map((f) => toGray(f, width, height));
  const clampX = (v) => Math.max(T + 1, Math.min(width - T - 2, v));
  const clampY = (v) => Math.max(T + 1, Math.min(height - T - 2, v));
  const tpls = points.map(([x, y]) => templateAt(grays[0], width, x, y));
  const pos = points.map(([x, y]) => ({ x, y }));
  return grays.map((gray, n) =>
    pos.map((p, k) => {
      if (n === 0) return { x: p.x, y: p.y, err: 0 };
      let best = Infinity;
      let bx = p.x;
      let by = p.y;
      for (let y = clampY(p.y - R); y <= clampY(p.y + R); y += 2)
        for (let x = clampX(p.x - R); x <= clampX(p.x + R); x += 2) {
          const c = cost(gray, width, x, y, tpls[k], 2);
          if (c < best) [best, bx, by] = [c, x, y];
        }
      let fine = Infinity;
      for (let y = clampY(by - 2); y <= clampY(by + 2); y++)
        for (let x = clampX(bx - 2); x <= clampX(bx + 2); x++) {
          const c = cost(gray, width, x, y, tpls[k], 1);
          if (c < fine) [fine, p.x, p.y] = [c, x, y];
        }
      const at = (dx, dy) => cost(gray, width, clampX(p.x + dx), clampY(p.y + dy), tpls[k], 1);
      const sx = parabola(at(-1, 0), fine, at(1, 0));
      const sy = parabola(at(0, -1), fine, at(0, 1));
      return { x: p.x + sx, y: p.y + sy, err: fine };
    }),
  );
}

/** Media móvil centrada (radio en fotogramas) sobre una serie de números. */
export function smooth(series, radius) {
  return series.map((_, i) => {
    let s = 0;
    let n = 0;
    for (let j = Math.max(0, i - radius); j <= Math.min(series.length - 1, i + radius); j++) {
      s += series[j];
      n++;
    }
    return s / n;
  });
}

/**
 * Semejanza (escala `s` + giro `theta` alrededor de a0, más traslación a0→a) que lleva coordenadas
 * de referencia a coordenadas del fotograma, a partir de dos correspondencias (a0→a, b0→b).
 * Devuelve `{ s, theta, ax0, ay0, ax, ay }`, que consume `apply`.
 */
export function similarity([ax0, ay0], [bx0, by0], [ax, ay], [bx, by]) {
  const v0x = bx0 - ax0;
  const v0y = by0 - ay0;
  const vx = bx - ax;
  const vy = by - ay;
  const s = Math.hypot(vx, vy) / Math.hypot(v0x, v0y);
  const theta = Math.atan2(vy, vx) - Math.atan2(v0y, v0x);
  return { s, theta, ax0, ay0, ax, ay };
}

export function apply(t, x, y) {
  const c = Math.cos(t.theta) * t.s;
  const s = Math.sin(t.theta) * t.s;
  const dx = x - t.ax0;
  const dy = y - t.ay0;
  return [t.ax + c * dx - s * dy, t.ay + s * dx + c * dy];
}

/** Recorte cuadrado `size`×`size` centrado en (cx, cy) de referencia, con muestreo bilineal. */
export function warpCrop(rgb, width, height, t, cx, cy, size) {
  const out = Buffer.alloc(size * size * 3);
  const half = size / 2;
  for (let oy = 0; oy < size; oy++)
    for (let ox = 0; ox < size; ox++) {
      const [sx, sy] = apply(t, cx - half + ox + 0.5, cy - half + oy + 0.5);
      const x = Math.max(0, Math.min(width - 1.001, sx - 0.5));
      const y = Math.max(0, Math.min(height - 1.001, sy - 0.5));
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const fx = x - x0;
      const fy = y - y0;
      const i00 = (y0 * width + x0) * 3;
      const i10 = i00 + 3;
      const i01 = i00 + width * 3;
      const i11 = i01 + 3;
      const o = (oy * size + ox) * 3;
      for (let ch = 0; ch < 3; ch++) {
        const top = rgb[i00 + ch] * (1 - fx) + rgb[i10 + ch] * fx;
        const bottom = rgb[i01 + ch] * (1 - fx) + rgb[i11 + ch] * fx;
        out[o + ch] = Math.round(top * (1 - fy) + bottom * fy);
      }
    }
  return out;
}
