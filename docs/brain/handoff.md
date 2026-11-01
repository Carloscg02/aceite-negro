# Handoff del Proyecto: `aceite-negro` (`claude-ui`)

- **Estado Actual**: Prototipo técnico funcional (`001-landing-scrollcraft`). **Diagnóstico:** Es una buena base técnica (pipeline de medios, rotación 360° en canvas con scrub suave, suite de tests y soporte responsive), pero **todavía está muy lejos de ser una buena página/landing atractiva y con alta conversión**. Necesita una profunda iteración estética, de ritmo, microinteracciones y acabado premium. (La versión paralela de `argon-ui` fue descartada por desastre).
- **Cómo Lanzar la Landing desde Terminal**:
  ```bash
  # 1. Situarse en el directorio del worktree (o clon de la rama claude-ui)
  cd /home/carlos/aceite-negro/.worktrees/claude-ui

  # 2. Instalar dependencias (si no se ha hecho previamente)
  npm install

  # 3. Lanzar servidor de desarrollo Vite (puerto 5174)
  npm run dev
  # -> Abre en navegador: http://localhost:5174

  # 4. Comandos adicionales de verificación
  npm test          # Ejecuta los 57 tests unitarios (Vitest)
  npm run e2e       # Ejecuta tests end-to-end (Playwright)
  npm run build     # Comprobación de tipos (TypeScript) y build de producción
  npm run media     # Regenera los 120 fotogramas WebP y clips de vídeo optimizados
  ```
- **Última Tarea Realizada**: Pipeline multimedia (`scripts/build-media.mjs`), contrato visual «Almazara Nocturna» (`docs/brain/design.md`), canvas interactivo 360° (`src/components/BottleSequence.tsx`), catálogo D2C y checkout directo por Stripe/WhatsApp.
- **Siguiente Paso para la Nueva Sesión**:
  1. Revisar la página en `http://localhost:5174` y rediseñar/pulir las secciones que quedan toscas (ritmo de scroll, jerarquía tipográfica, integración del cuaderno documental de campo y almazara).
  2. Ajustar precios, formatos y enlaces en `.env` / `src/config/site.ts`.
- **Bloqueos Activos**: Ninguno.
