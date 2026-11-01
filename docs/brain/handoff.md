# Handoff del Proyecto: `aceite-negro` (`claude-ui`)

- **Contexto de Estrategia y Ramas**:
  - Se desarrollaron y compararon en paralelo dos prototipos de landing: `argon-ui` (puerto 5173) y `claude-ui` (puerto 5174).
  - La versión de `argon-ui` resultó ser un desastre y ha sido descartada (queda preservada en la rama `argon-ui` por trazabilidad).
  - **Decisión:** Carlos se ha decantado definitivamente por **`claude-ui` como la base del proyecto**.
  - La rama `main` en remoto se mantiene intencionadamente limpia con solo la inicialización del proyecto (Compass harness, ADRs 0001-0002 y recursos brutos).
  - **Criterio de Integración:** Todo el trabajo de refinamiento se realizará en esta rama `claude-ui`. **Solo cuando la landing esté de verdad lista, visualmente pulida y con nivel alto de conversión, se integrará (merge) en `main`**.

- **Diagnóstico y Evaluación de la Landing**:
  - Cuenta con una **sólida base técnica** (rotación 360° de botella en canvas con scrub sincronizado al scroll, pipeline `scripts/build-media.mjs`, catálogo D2C, checkout por Stripe/WhatsApp y suite de 57 tests Vitest + 4 E2E Playwright).
  - Sin embargo, **está todavía muy lejos de ser una buena página**: a nivel estético, ritmo de scroll, jerarquía tipográfica, contrastes y acabados visuales sigue tosca y requiere una profunda iteración de diseño y UX antes de considerarse producto final.

- **Cómo Lanzar la Landing desde Terminal**:
  ```bash
  # 1. Situarse en el directorio del worktree (o clon de la rama claude-ui)
  cd /home/carlos/aceite-negro/.worktrees/claude-ui

  # 2. Instalar dependencias (si no se ha hecho previamente)
  npm install

  # 3. Lanzar servidor de desarrollo Vite (puerto 5174)
  npm run dev
  # -> Abre en el navegador: http://localhost:5174

  # 4. Comandos de soporte y verificación
  npm test          # Ejecuta los 57 tests unitarios con Vitest
  npm run e2e       # Ejecuta la suite Playwright
  npm run build     # Comprobación estricta de TypeScript y build de producción
  npm run media     # Regenera los 120 fotogramas WebP y clips de vídeo optimizados
  ```

- **Siguiente Paso para la Nueva Cuenta/Sesión de Claude**:
  1. Levantar el entorno con `npm run dev` en `http://localhost:5174`.
  2. Iterar sobre `src/` y `docs/brain/design.md` elevando la calidad gráfica y experiencia de navegación hasta que la landing tenga nivel comercial y transmita exclusividad artesanal.
  3. Cargar en `.env` las URLs definitivas de Stripe (`VITE_STRIPE_LINK_CAJA_6`, etc.) y teléfono de WhatsApp en `src/config/site.ts`.
  4. Realizar el merge final hacia `main`.

- **Bloqueos Activos**: Ninguno.
