#!/usr/bin/env node
// Genera los medios optimizados de la landing a partir de docs/resources/.
// Uso: npm run media                      (todos los pasos)
//      node scripts/build-media.mjs aceite  (solo los pasos indicados: botella | aceite | aceituna | logo)
// Requiere la devDependency ffmpeg-static (binario estático con libx264, libwebp y minterpolate).
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';
import { apply, readFrames, similarity, smooth, track, warpCrop } from './lib/stabilize.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => join(root, 'docs/resources', f);
const out = join(root, 'public/media');
const run = (args) => execFileSync(ffmpeg, ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
const kb = (file) => `${Math.round(statSync(file).size / 1024)} KB`;

// 1. Botella 360°: 240 fotogramas -> 120 (uno de cada dos), recorte centrado en la botella
//    y niveles que llevan el blanco de estudio a 255 para fundirse con multiply.
//    Se codifica en un directorio temporal y se copia encima del actual (sin borrar la carpeta):
//    así un `npm run dev` en marcha sigue sirviendo los fotogramas sin reiniciarse.
function botella() {
  const framesDir = join(out, 'bottle');
  const tmp = mkdtempSync(join(tmpdir(), 'botella-'));
  try {
    const filter = [
      "select='not(mod(n\\,2))'",
      'crop=500:680:390:40',
      'colorlevels=rimin=0.02:gimin=0.02:bimin=0.02:rimax=0.86:gimax=0.86:bimax=0.86',
    ].join(',');
    run([
      '-i', src('aceite-negro-video.mp4'),
      '-vf', filter,
      '-fps_mode', 'vfr',
      '-c:v', 'libwebp', '-quality', '74', '-compression_level', '6',
      join(tmp, 'f%03d.webp'),
    ]);
    const fresh = readdirSync(tmp).filter((f) => f.endsWith('.webp'));
    mkdirSync(framesDir, { recursive: true });
    for (const f of fresh) copyFileSync(join(tmp, f), join(framesDir, f));
    for (const f of readdirSync(framesDir)) if (!fresh.includes(f)) rmSync(join(framesDir, f));
    writeFileSync(
      join(root, 'src/config/bottle-frames.json'),
      JSON.stringify({ frameCount: fresh.length, width: 500, height: 680, path: '/media/bottle/f%03d.webp' }, null, 2) +
        '\n',
    );
    // Fallback estático (estado error): foto de estudio de la botella.
    run([
      '-i', src('foto-botella-gemini-delante.jpeg'),
      '-vf', 'crop=1380:1876:75:172,scale=500:680,colorlevels=rimax=0.9:gimax=0.9:bimax=0.9',
      '-q:v', '4', join(out, 'bottle-still.jpg'),
    ]);
    return `${fresh.length} fotogramas`;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// 2. Aceite: bucle del chorro cayendo en la cubeta (plano cenital 15.45–16.95 s, sin el recogedor verde).
//    El móvil se fija «en trípode» siguiendo dos esquinas inmóviles de la cubeta; se recorta un cuadrado
//    alrededor del punto de impacto, se ralentiza ×1/3 con interpolación de movimiento, se cierra el bucle
//    con un fundido del final sobre el principio y se gradúa hacia el verde oliva de la marca.
const OIL = {
  start: 15.45,
  end: 16.95,
  width: 480,
  height: 854,
  anchors: [[150, 400], [320, 322]], // esquina inferior del tabique · rincón pared-suelo
  center: [195, 435], // punto de impacto del chorro (ligeramente descentrado: entra la estela)
  crop: 300,
  slow: 3,
  fade: 0.8,
  size: 480,
  grade:
    "curves=all='0/0 0.35/0.09 0.7/0.38 0.9/0.68 1/0.86',eq=saturation=1.4," +
    'colorbalance=gs=0.01:bs=-0.06:gm=0.03:bm=-0.12:gh=0.01:bh=-0.08',
};

function aceite() {
  const { width: W, height: H, anchors, center, crop } = OIL;
  const frames = readFrames(ffmpeg, src('Aceite-liquido.mp4'), OIL);
  const tracked = track(frames, W, H, anchors);
  const path = anchors.map((_, k) => ({
    x: smooth(tracked.map((f) => f[k].x), 2),
    y: smooth(tracked.map((f) => f[k].y), 2),
  }));
  const crops = frames.map((frame, n) => {
    const t = similarity(anchors[0], anchors[1], [path[0].x[n], path[0].y[n]], [path[1].x[n], path[1].y[n]]);
    const [mx, my] = apply(t, ...center);
    const r = (crop / 2) * t.s;
    if (mx - r < 0 || my - r < 0 || mx + r > W - 1 || my + r > H - 1) {
      throw new Error(`aceite: el recorte sale del fotograma ${n}; reduce OIL.crop o mueve OIL.center`);
    }
    return warpCrop(frame, W, H, t, center[0], center[1], crop);
  });

  const tmp = mkdtempSync(join(tmpdir(), 'aceite-'));
  try {
    const raw = join(tmp, 'estable.rgb');
    writeFileSync(raw, Buffer.concat(crops));
    const slowed = ((frames.length - 1) * OIL.slow + 1) / 30;
    const offset = (slowed - 2 * OIL.fade - 0.04).toFixed(3);
    const D = OIL.fade;
    const graph =
      `[0:v]setpts=${OIL.slow}*PTS,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,fps=30,split=2[c1][c2];` +
      `[c1]trim=start=${D},setpts=PTS-STARTPTS,fps=30[tail];` +
      `[c2]trim=end=${D},setpts=PTS-STARTPTS,fps=30[head];` +
      `[tail][head]xfade=transition=fade:duration=${D}:offset=${offset},hqdn3d=1.5:1.5:3:3,${OIL.grade},` +
      `scale=${OIL.size}:${OIL.size}:flags=lanczos,unsharp=5:5:0.45,format=yuv420p[v]`;
    const master = join(tmp, 'bucle.mkv');
    run([
      '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${crop}x${crop}`, '-r', '30', '-i', raw,
      '-filter_complex', graph, '-map', '[v]', '-an', '-c:v', 'libx264', '-qp', '0', '-preset', 'veryfast', master,
    ]);
    // Dos codificaciones desde el mismo máster sin pérdidas: VP9 (preferida) y H.264 (compatibilidad).
    // `bitexact` evita los UID y la fecha aleatorios del muxer WebM: regenerar no ensucia el diff.
    const webm = join(out, 'aceite-bucle.webm');
    const mp4 = join(out, 'aceite-bucle.mp4');
    run(['-i', master, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32', '-row-mt', '1', '-deadline', 'good',
      '-cpu-used', '1', '-pix_fmt', 'yuv420p', '-fflags', '+bitexact', webm]);
    run(['-i', master, '-c:v', 'libx264', '-crf', '23', '-preset', 'slow', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', mp4]);
    run(['-i', master, '-frames:v', '1', '-q:v', '3', join(out, 'aceite-bucle-poster.jpg')]);
    const maxErr = Math.max(...tracked.flat().map((p) => p.err));
    // xfade: el bucle dura lo que tarda en empezar el fundido más el propio fundido.
    const loop = Number(offset) + D;
    return `bucle ${loop.toFixed(2)} s, webm ${kb(webm)} · mp4 ${kb(mp4)}, error de seguimiento máx. ${maxErr.toFixed(1)}`;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// 3. Aceituna: fotograma nítido del montón recién vareado (0,3 s), recortado dentro del montón para
//    que no asome la lona, con gradación oliva de clave baja y reescalado ×2 (lanczos).
function aceituna() {
  const file = join(out, 'aceituna.jpg');
  run([
    '-ss', '0.3', '-i', src('video-trabajo-campo-olivos.mp4'), '-frames:v', '1',
    '-vf',
    'crop=340:340:96:514,hqdn3d=2:2:0:0,' +
      "curves=all='0/0 0.35/0.08 0.65/0.32 0.9/0.66 1/0.82',eq=saturation=1.25," +
      'colorbalance=rs=0.03:bs=-0.08:rm=0.05:gm=0.02:bm=-0.14:rh=0.02:bh=-0.1,' +
      'scale=704:704:flags=lanczos,unsharp=5:5:0.6',
    '-q:v', '3', file,
  ]);
  return kb(file);
}

function aceitunaPicuda() {
  const file = join(out, 'aceituna-picuda.jpg');
  copyFileSync(src('aceituna-picuda.jpg'), file);
  return kb(file);
}

function logo() {
  run(['-i', src('foto-logo.jpeg'), '-vf', 'scale=480:-2', '-q:v', '3', join(out, 'logo.jpg')]);
  return 'logo.jpg';
}

const STEPS = { botella, aceite, aceituna, aceitunaPicuda, logo };
const requested = process.argv.slice(2);
mkdirSync(out, { recursive: true });
for (const name of requested.length ? requested : Object.keys(STEPS)) {
  const step = STEPS[name];
  if (!step) throw new Error(`Paso desconocido: ${name}. Pasos: ${Object.keys(STEPS).join(', ')}`);
  console.warn(`media OK — ${name}: ${step()}`);
}
