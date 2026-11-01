# Plan 002 — Landing compacta

## 1. Architecture Alignment
Mismas capas de `docs/brain/architecture.md`; sin backend ni dependencias nuevas.
- **Lib** `src/lib/scrub.ts`: `frameForProgress(progress, stops)` (tramos con `smoothstep` y mesetas) y `passThroughProgress(rectTop, height, vh)`.
- **Dominio** `src/domain/lot.ts`: `parseLot(code)` puro.
- **Config** `src/config/bottle.ts`: `BOTTLE_STOPS` + `BOTTLE_ANNOTATIONS`; `src/config/label.ts` (nuevo) reúne los datos literales de la etiqueta: `LOT_CODE`, `PRODUCER`, `LABEL_ROWS`, `NUTRITION`, `LABEL_DEFINITION`.
- **Presentación**: `BottleChapter` consume las paradas (prop `stops` en `BottleSequence`); nuevo `TraceabilityChapter`; `SiteFooter` absorbe la ficha (`<details>`); se eliminan `FieldChapter`, `MillChapter`, `SpecSheetChapter`. `AmbientVideo` pasa a ser siempre mirilla (máscara solo sobre vídeo y grano para no recortar el botón de pausa) y adjunta las fuentes WebM/MP4 al entrar en pantalla. Hook `useViewportProgress` escribe `--p` para el zoom lento de la foto.
- **Medios** `scripts/build-media.mjs` por pasos (`botella | aceite | aceituna | logo`) + `scripts/lib/stabilize.mjs`: seguimiento por plantilla de dos esquinas fijas de la cubeta (SAD con media restada, subpíxel), semejanza por fotograma, recorte bilineal centrado en el impacto; después ffmpeg: `minterpolate` ×⅓, cierre de bucle con `xfade`, gradación oliva, VP9 `bitexact` + H.264. `vidstab` (modo trípode) se probó y derivaba 25–45 px en este plano por las ondas; el seguimiento propio deja ±2,5 px de vaivén lento. `botella` sobrescribe los fotogramas en su sitio (borrar la carpeta deja a un `npm run dev` en marcha sirviendo `index.html` en su lugar).

## 2. ADR Gate
ADR 0001/0002 intactos. Sin ADR nuevo: cambio de presentación y de pipeline de medios.

## 3. UI / Frontend Gate
`design.md` se actualiza (v2: recorrido en 3 movimientos, regla de metraje documental, mirilla). Agent Eyes ya activo (`npx playwright test`).

## 4. Seams bajo Prueba
| Seam | Detecta | No detecta |
|---|---|---|
| `scrub.ts` | paradas, mesetas, suavizado, bordes, NaN | sensación real del giro |
| `config/bottle.ts` | saltos > 12 fotogramas/5 %, anotación por parada | encuadre de cada ángulo |
| `lot.ts` | lectura del lote y fechas imposibles | — |
| `<TraceabilityChapter>` / `<SiteFooter>` | contenido, roles, ficha plegada | estética |
| Playwright `ui-health` | aria, overflow 375/1280, consola, scrub, reduced-motion | gusto (revisión con capturas) |

## 5. Verificación
`npm test` · `npm run lint` · `npm run build` · `npx playwright test` · capturas 1280/375 revisadas a ojo.
