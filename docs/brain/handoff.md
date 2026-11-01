# Handoff del Proyecto: `aceite-negro` (rama `claude-ui-v2`)

- **Dónde estamos (2026-11-01)**: `claude-ui-v2` está en `origin` y es la **versión candidata**. Lo más probable es que Carlos se quede con ella y la mezcle en `main`. Parte de `claude-ui` (prototipo 001) e implementa la spec 002, con la auditoría `APPROVED`. `main` sigue limpia (harness, ADRs y recursos) hasta el merge, y `argon-ui` está descartada.
- **Siguiente sesión (otra cuenta)**: retoques finales **directos, sin pasar por SDD**, por decisión de Carlos. Antes de mezclar en `main`, dejar en verde `npm test`, `npm run lint`, `npm run build` y `npx playwright test`, y respetar `docs/brain/design.md` (solo tokens, cero hex fuera de `tokens.css`, nada de material de móvil a pantalla completa ni en marco).
- **Feedback que motivó la v2**: a Carlos le encanta el giro de la botella. Los vídeos de móvil a gran tamaño le parecían «cutres» y no encajaban, así que se quedaron solo la foto del montón de aceituna y el bucle del aceite, en formato pequeño.
- **Cómo retomar**:
  ```bash
  git fetch origin && git switch claude-ui-v2   # o en worktree: git worktree add .worktrees/claude-ui-v2 claude-ui-v2
  npm ci && npm run dev                         # → http://localhost:5174
  npm test && npm run lint && npm run build && npx playwright test
  ```
  - Playwright necesita `npx playwright install chromium`. Si faltan librerías del sistema y no hay sudo, se extraen en `.playwright-libs/` (gitignorado), que `playwright.config.ts` usa si existe.
- **La página, en 3 movimientos**:
  1. Botella 360° con 4 paradas anotadas, en los fotogramas 0, 50, 83 y 119 (`src/config/bottle.ts`).
  2. «El lote es la fecha»: el lote descifrado (`src/domain/lot.ts`), la foto de la aceituna y el bucle del aceite en mirilla (`TraceabilityChapter`).
  3. Compra por cajas (`PurchaseSection`).
  - La ficha completa va plegada en el pie (`SiteChrome`).
  - Datos de etiqueta en `src/config/label.ts`; formatos, precio y contacto en `src/config/site.ts`.
- **Medios**: versionados en `public/media/`. Se regeneran con `npm run media` o paso a paso con `node scripts/build-media.mjs <botella|aceite|aceituna|logo>`. El aceite usa estabilización propia (`scripts/lib/stabilize.mjs`) y la salida es reproducible (md5 estable).
- **Pendiente de Carlos antes del merge**:
  1. Confirmar la lectura del lote. Se asume que `JCCC` es Juan Carlos Cano Carrillo y `141026` el 14/10/2026. ¿Es la fecha de recogida, de molturación o de envasado? Todo el movimiento 2 depende de esto (`LOT_CODE` y `PRODUCER` en `label.ts`).
  2. Enlaces de Stripe en `.env` (`VITE_STRIPE_LINK_CAJA_6` / `_12`). Sin ellos, los botones derivan a WhatsApp.
  3. Teléfono y correo reales en `CONTACT` (`src/config/site.ts`); ahora son placeholders.
  4. Opcional: nombres del equipo (como créditos) y datos de la finca (término, altitud, número de olivos).
- **Menores**: los tokens `--surface-paper`, `--ink` y `--border-paper` siguen en reserva sin uso; las rutas `/home/carlos/...` de `PROMPT_UI_CLAUDE.md` son históricas (esta sesión trabajó en un clon sin worktrees, `~/aceite-negro/`).
- **Bloqueos activos**: ninguno.
