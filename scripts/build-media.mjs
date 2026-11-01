#!/usr/bin/env node
// Genera los medios optimizados de la landing a partir de docs/resources/.
// Uso: npm run media  (requiere la devDependency ffmpeg-static)
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => join(root, 'docs/resources', f);
const out = join(root, 'public/media');
const framesDir = join(out, 'bottle');

const run = (args) => execFileSync(ffmpeg, ['-v', 'error', '-y', ...args], { stdio: 'inherit' });

rmSync(out, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

// 1. Botella 360°: 240 fotogramas -> 120 (uno de cada dos), recorte centrado en la botella
//    y niveles que llevan el blanco de estudio a 255 para fundirse con multiply.
const BOTTLE_FILTER = [
  "select='not(mod(n\\,2))'",
  'crop=500:680:390:40',
  'colorlevels=rimin=0.02:gimin=0.02:bimin=0.02:rimax=0.86:gimax=0.86:bimax=0.86',
].join(',');
run([
  '-i', src('aceite-negro-video.mp4'),
  '-vf', BOTTLE_FILTER,
  '-fps_mode', 'vfr',
  '-c:v', 'libwebp', '-quality', '74', '-compression_level', '6',
  join(framesDir, 'f%03d.webp'),
]);
const frameCount = readdirSync(framesDir).filter((f) => f.endsWith('.webp')).length;
writeFileSync(
  join(root, 'src/config/bottle-frames.json'),
  JSON.stringify({ frameCount, width: 500, height: 680, path: '/media/bottle/f%03d.webp' }, null, 2) + '\n',
);

// Fallback estático (estado error): foto de estudio de la botella.
run([
  '-i', src('foto-botella-gemini-delante.jpeg'),
  '-vf', 'crop=1380:1876:75:172,scale=500:680,colorlevels=rimax=0.9:gimax=0.9:bimax=0.9',
  '-q:v', '4', join(out, 'bottle-still.jpg'),
]);

// 2. Almazara: tramos enfocados del chorro (5.5–8.0 s y 14.5–17.5 s), sin el recogedor verde,
//    ralentizados x0.5 y ligeramente graduados.
const ALMAZARA_FILTER =
  '[0:v]trim=5.5:8.0,setpts=PTS-STARTPTS,crop=352:626:128:200[a];' +
  '[0:v]trim=14.5:17.5,setpts=PTS-STARTPTS,crop=300:534:170:310,scale=352:626[b];' +
  '[a][b]concat=n=2:v=1:a=0[c];' +
  '[c]setpts=2.0*PTS,eq=contrast=1.08:saturation=0.9:brightness=-0.02,fps=30,format=yuv420p[v]';
run([
  '-i', src('Aceite-liquido.mp4'),
  '-filter_complex', ALMAZARA_FILTER, '-map', '[v]', '-an',
  '-c:v', 'libx264', '-crf', '24', '-preset', 'slow', '-movflags', '+faststart',
  join(out, 'almazara.mp4'),
]);
run(['-ss', '1.2', '-i', join(out, 'almazara.mp4'), '-frames:v', '1', '-q:v', '4', join(out, 'almazara-poster.jpg')]);

// 3. Campo: vareo (horizontal) y aceituna sobre los fardos (recorte del vertical).
run([
  '-t', '10', '-i', src('video-trabajo-campo-olivos-2.mp4'),
  '-vf', 'hqdn3d=3:3:6:6,eq=contrast=1.1:saturation=0.82:brightness=-0.03:gamma=0.96,format=yuv420p',
  '-an', '-c:v', 'libx264', '-crf', '29', '-preset', 'slow', '-movflags', '+faststart',
  join(out, 'campo-vareo.mp4'),
]);
run(['-ss', '2', '-i', join(out, 'campo-vareo.mp4'), '-frames:v', '1', '-q:v', '4', join(out, 'campo-vareo-poster.jpg')]);

run([
  '-i', src('video-trabajo-campo-olivos.mp4'),
  '-vf', 'crop=480:600:0:254,hqdn3d=3:3:6:6,eq=contrast=1.08:saturation=0.85:gamma=0.97,format=yuv420p',
  '-an', '-c:v', 'libx264', '-crf', '29', '-preset', 'slow', '-movflags', '+faststart',
  join(out, 'campo-fardo.mp4'),
]);
run(['-ss', '1', '-i', join(out, 'campo-fardo.mp4'), '-frames:v', '1', '-q:v', '4', join(out, 'campo-fardo-poster.jpg')]);

// 4. Fotos.
run([
  '-i', src('foto-olivos.jpeg'),
  '-vf', 'crop=942:1400:0:620,scale=700:-2,eq=contrast=1.08:saturation=0.85:gamma=0.97',
  '-q:v', '5', join(out, 'olivos-red.jpg'),
]);
run(['-i', src('foto-logo.jpeg'), '-vf', 'scale=480:-2', '-q:v', '3', join(out, 'logo.jpg')]);
run(['-i', src('foto-etiqueta.jpeg'), '-vf', 'scale=1100:-2', '-q:v', '4', join(out, 'etiqueta.jpg')]);

console.warn(`media OK — ${frameCount} fotogramas de botella en public/media/bottle`);
