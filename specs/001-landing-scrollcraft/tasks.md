# Tasks 001 — Landing ScrollCraft

> Ciclo por tarea: RED → GREEN (refactor en revisión). Cada `[x]` exige **Prueba Observada** con salida real de consola.

- [x] T1 — Scaffold Vite + React + TS en puerto 5174, Vitest, ESLint y bootstrap Agent Eyes (Playwright chromium + `tests/e2e/ui-health.spec.ts` base).
  - Prueba Observada:
    - `vite.config.ts` configurado con `server: { port: 5174, strictPort: true }` y `preview: { port: 5174, strictPort: true }`.
    - `playwright.config.ts` apuntando a `http://localhost:5174` con Chromium instalado (`chromium-1248`) y librerías compartidas resueltas en espacio de usuario.
    - Salida de `npm run dev` en puerto `5174`: `VITE v8.3.5 ready in 410 ms -> Local: http://localhost:5174/`.
    - Salida de `npm run lint`: `eslint . && tsc --noEmit` -> exit code `0`.

- [x] T2 — Pipeline de medios `scripts/build-media.mjs` → `public/media/` (120 frames WebP, almazara/campo mp4, pósters, fotos).
  - Prueba Observada:
    - Ejecución real de `node scripts/build-media.mjs`:
      `media OK — 120 fotogramas de botella en public/media/bottle`
    - Artefactos verificados en `public/media/`: 120 fotogramas `f001.webp..f120.webp` (`1.2M` total), `almazara.mp4` (`447 KB`, tramos 5.5–8.0s y 14.5–17.5s recortados sin recogedor verde y ralentizados 0.5x), `campo-vareo.mp4`, `campo-fardo.mp4`, pósters JPG, `logo.jpg`, `etiqueta.jpg` y `src/config/bottle-frames.json` (`frameCount: 120, width: 500, height: 680`).

- [x] T3 — `src/lib/scrub.ts` + `src/lib/frames.ts` vía TDD (CA-1, CA-2, CA-3).
  - Prueba Observada:
    - Ciclo RED -> GREEN completado con Vitest:
      `✓ src/lib/scrub.test.ts (19 tests) 18ms`
      `✓ src/lib/frames.test.ts (7 tests) 14ms`
      `Test Files 2 passed (2) | Tests 26 passed (26)`

- [x] T4 — `src/domain/catalog.ts` + `src/domain/contact.ts` + `src/config/site.ts` vía TDD (CA-4, CA-5, CA-6, CA-7).
  - Prueba Observada:
    - Ciclo RED -> GREEN completado con Vitest:
      `✓ src/domain/contact.test.ts (5 tests) 11ms`
      `✓ src/domain/catalog.test.ts (15 tests) 40ms`
    - Formatos configurados en `src/config/site.ts`: `Caja de 6` (6 × 500 ml = `3 L`, `60 €` a `10 € / botella`) y `Caja de 12` (12 × 500 ml = `6 L`, `120 €` a `10 € / botella`), con lectura de `VITE_STRIPE_LINK_CAJA_6` / `VITE_STRIPE_LINK_CAJA_12` y fallback a WhatsApp.

- [x] T5 — `<PurchaseSection>` con los 4 estados vía Testing Library (CA-8).
  - Prueba Observada:
    - Ciclo RED (`Failed to resolve import "./PurchaseSection"`) -> GREEN:
      `✓ src/sections/PurchaseSection.test.tsx (7 tests) 412ms`
    - Verificados los estados `populated` (con enlaces `https://buy.stripe.com/...`), `sold_out` por formato (botón deshabilitado `Caja de 6 agotada` sin enlace), `unconfigured` (fallback a `https://wa.me/...`), `all_sold_out` y `empty` (`role="status"` + sección `Pedidos directos` con WhatsApp y correo para particulares y tiendas/restaurantes).
    - Auditoría de tokens CSS: 0 colores hexadecimales fuera de `src/styles/tokens.css`.

- [x] T6 — `<BottleSequence>` (canvas scrub + estados loading/ready/error/reduced) y capítulo 1 con anotaciones (CA-9, RF-2).
  - Prueba Observada:
    - Ciclo RED (`Failed to resolve import "./BottleSequence"`) -> GREEN:
      `✓ src/components/BottleSequence.test.tsx (4 tests) 262ms`
    - Verificados los 4 estados (`loading` con póster `500x680` y aviso `aria-live`, `ready` con `<canvas role="img">` e interpolación `lerp`, `error` con `/media/bottle-still.jpg`, y `reduced` con vista frontal estática sin canvas).
    - Integración visual verificada sobre `http://localhost:5174`: foco de estudio (`--light-pool`) con `mix-blend-mode: multiply` sobre `--surface`, sin vitrina ni recuadro, y HUD técnico de rotación/fotograma.

- [x] T7 — Capítulos Campo, Almazara, Ficha y pie (RF-1) con tokens de `design.md`.
  - Prueba Observada:
    - Implementados `FieldChapter.tsx`, `MillChapter.tsx`, `SpecSheetChapter.tsx` y `SiteChrome.tsx` consumiendo exclusivamente tokens de `src/styles/tokens.css` (verificado con `grep -rn -E "#[0-9a-fA-F]{3,8}" src/components src/sections src/styles/global.css` -> 0 ocurrencias).
    - Build de producción verificado (`npm run build`): `✓ 50 modules transformed. dist/assets/index-Ccq4K_WO.css 29.27 kB | dist/assets/index-I-PqZ94e.js 244.47 kB -> ✓ built in 441ms`.
    - Inspección semántica en vivo (`ariaSnapshot`): jerarquía `h1` único (`Aceite Negro Picudo`) -> `h2` por capítulo (`Octubre, aceituna verde.`, `El aceite, recién hecho.`, `Todo lo que dice la etiqueta.`, `Por cajas.`), `table "Información nutricional por 100 g"` y `contentinfo` con datos reales de etiqueta (`N.RGSEAA 40.044510/J`, `Lote JCCC141026`, `Juan Carlos Cano Carrillo y otro C.B · E23312572`).

- [x] T8 — Verificación E2E Agent Eyes completa en 5174 (CA-10) + `npm test` / `npm run lint` / `compass check` (CA-11).
  - Prueba Observada:
    - `npm test`: `Test Files 6 passed (6) | Tests 57 passed (57)`.
    - `npm run lint`: `eslint . && tsc --noEmit` -> exit code `0` (0 errores, 0 warnings).
    - `npx playwright test` contra `http://localhost:5174`:
      `✓ 1 Desktop (1280x800): ariaSnapshot, jerarquía h1->h2, cero errores de consola y cero overflow (1.8s)`
      `✓ 2 Mobile (375x812): cero desbordamiento horizontal en todos los capítulos y cero errores (2.1s)`
      `✓ 3 Signature Move (Scroll Scrub 360°): avance progresivo sin saltos bruscos ni overflow (7.6s)`
      `✓ 4 prefers-reduced-motion: desactiva el canvas y muestra vista frontal estática (1.0s)`
      `4 passed (13.3s)`
