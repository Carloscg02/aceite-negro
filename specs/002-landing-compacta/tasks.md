# Tasks 002 — Landing compacta

> Ciclo por tarea: RED → GREEN. Cada `[x]` exige **Prueba Observada** con salida real de consola.

- [x] T1 — Medios: `scripts/lib/stabilize.mjs` + pasos `aceite` y `aceituna` en `build-media.mjs`; retirar vídeos de vareo/almazara y fotos sin uso.
  - Prueba Observada:
    - `vidstabdetect/vidstabtransform` (tripod) descartado: el seguimiento de control medía deriva de 25–45 px en el tramo 15.45–16.95 s.
    - `node scripts/build-media.mjs aceite aceituna` → `media OK — aceite: bucle 3.63 s, webm 52 KB · mp4 100 KB, error de seguimiento máx. 6.6` · `media OK — aceituna: 136 KB`.
    - Vaivén residual del punto de impacto en el bucle final: x 164–169 px, y 154–162 px en los 108 fotogramas; costura 107→0 continua.
    - `git rm` de `almazara*`, `campo-*`, `olivos-red.jpg`, `etiqueta.jpg`.
- [x] T2 — `frameForProgress`, `annotationsForStops`, `passThroughProgress` en `src/lib/scrub.ts` vía TDD (CA-1, CA-3).
  - Prueba Observada: RED `TypeError: frameForProgress is not a function` (13 fallos) → GREEN `Tests 32 passed (32)`.
- [x] T3 — `src/config/bottle.ts` (paradas + anotaciones) vía TDD (CA-2) y `BottleChapter` con 4 paradas.
  - Prueba Observada: RED `Failed to resolve import "./bottle"` + `rotationDegrees is not a function` → GREEN `Tests 38 passed (38)`.
    Paradas medidas con `label-center`: fotograma 83 = contraetiqueta centrada (desvío −0,3 px); 45–53 sin etiqueta (canto en 50).
- [x] T4 — `parseLot` en `src/domain/lot.ts` vía TDD (CA-4).
  - Prueba Observada: RED `Failed to resolve import "./lot"` → GREEN `Tests 4 passed (4)`; ampliación `weekday` RED (3 fallos) → GREEN (14/10/2026 = miércoles).
- [x] T5 — `<TraceabilityChapter>` (lote descifrado, díptico, cita) vía Testing Library (CA-5).
  - Prueba Observada: RED `Failed to resolve import "./TraceabilityChapter"` → GREEN `Tests 6 passed (6)`; ampliación día de la semana RED `Unable to find an element with the text: miércoles` → GREEN.
- [x] T6 — `<SiteFooter>` con ficha plegada + cabecera nueva (CA-6); eliminar capítulos antiguos.
  - Prueba Observada: RED 3 fallos (`Unable to find ... link ... "Trazabilidad"`, `... text: /ficha completa/i`) → GREEN `Tests 4 passed (4)`. `git rm` de Field/Mill/SpecSheet.
- [x] T7 — `design.md` v2 y Agent Eyes actualizado (CA-7) + `npm test` / `lint` / `build` (CA-8); revisión visual 1280/375.
  - Prueba Observada:
    - `npm test`: `Test Files 10 passed (10) | Tests 90 passed (90)` · `npm run lint`: exit 0 · `npm run build`: `✓ built in 346ms`.
    - `npx playwright test`: `6 passed (18.6s)` (desktop aria + h1/h2, móvil sin overflow con ficha abierta, giro sin saltos > 12 y parada en 0/50/83/119 con su anotación, bucle del aceite reproduciéndose y pausable, «Ficha» despliega la tabla, reduced-motion).
    - Auditoría de tokens: 0 hex fuera de `tokens.css`. Capturas revisadas a 1280×800, 375×812 y 320×640.
- [x] T8 — Correcciones de la puerta de auditoría (1.ª pasada `VERDICT: REJECTED`, 6 hallazgos bloqueantes).
  - Hallazgos → corrección:
    1. E2E en rojo: `botella()` borraba `public/media/bottle/` y el `npm run dev` en marcha servía `index.html` en lugar de los WebP → ahora codifica en temporal y sobrescribe en su sitio (`try/finally`, también en `aceite()`).
    2. CA-7 pedía un `h2` en la botella (que lleva el `h1`) → CA-7 y `design.md` §4.8 reescritos; el E2E exige `h1` en `#botella` y un `h2` en `#trazabilidad` y `#comprar`.
    3. CA-5 «pies en mono» sin verificar → E2E comprueba `font-family` calculado (`IBM Plex Mono`) de ambos `figcaption`; el test unitario comprueba los timecodes.
    4. CA-6 datos legales dentro de la ficha sin verificar → test de `SiteFooter` los busca dentro de `<details id="ficha">` y, aparte, a la vista fuera de ella.
    5. Variante `frame` de `AmbientVideo` sin uso (y contraria a «nada va en marco») → eliminada; el componente es siempre mirilla.
    6. Regla huérfana `.annotation-code` → eliminada. Menores: JSDoc de `similarity`, líneas en blanco, `Reveal` restaurado, spec/plan apuntan a `src/config/label.ts`, nuevo CA-9 para medios.
  - Prueba Observada:
    - `npm run media` con el servidor en marcha → 4 × `media OK`, exit 0; `f060.webp` sigue `200 image/webp` sin reiniciar; md5 de `aceite-bucle.{mp4,webm}` y `aceituna.jpg` idénticos al regenerar; 0 versionados modificados; 0 temporales huérfanos (CA-9).
    - `npm test`: `Tests 90 passed (90)` · `lint` exit 0 · `build` exit 0 · `npx playwright test`: `6 passed (19.3s)` · hex fuera de tokens: 0.
- [x] T9 — Correcciones de la 2.ª pasada (`VERDICT: REJECTED`, 1 hallazgo bloqueante + observaciones).
  - Hallazgo: CA-7 «0 overflow con la ficha abierta» sin aserción a 1280 → añadida. Observación: overflow real con la ficha abierta a 360 (+7 px) y 320 (+47 px) por `white-space: nowrap` en la tabla.
  - Prueba Observada: RED `Overflow horizontal con la ficha abierta a 360px — Expected: <= 0, Received: 7` → GREEN tras permitir salto de línea y reducir sangrado de la tabla en ≤ 860 px; el E2E recorre 375/360/320 con la ficha abierta. `build-media` informa la duración real del bucle (`3.59 s` = offset del fundido + fundido; 108 fotogramas). CA-6 comprueba también lote dentro de la ficha y razón social fuera.
    `npm test` 90/90 · `lint` exit 0 · `build` exit 0 · `npx playwright test`: `6 passed (18.1s)`.
  - 3.ª pasada: `VERDICT: APPROVED`. Pulido posterior de sus observaciones menores (sin cambiar el alcance): el `<caption>` vuelve a ser table-caption con el flex en un envoltorio interior (el E2E comprueba que ocupa todo el ancho de la tabla); los valores nutricionales llevan NBSP entre número y unidad en lugar de `nowrap`, de modo que la tabla cabe en su columna también entre 861 y 961 px. Medido con la ficha abierta: tabla = columna = caption a 1280/900/375/320 y 0 px de overflow. Se repasan `npm test` 90/90, `lint`, `build` y `6 passed (18.4s)`.
