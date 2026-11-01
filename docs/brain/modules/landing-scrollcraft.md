# Módulo: Landing ScrollCraft (`001-landing-scrollcraft`)

## 1. Propósito
Landing D2C estática («Almazara Nocturna») para el lote único de **Aceite Negro Picudo** (3.000 botellas × 500 ml = 1.500 L, variedades Picudo y Carrasqueño, cosecha temprana octubre 2026), con giro 360° de la botella guiado por el scroll y compra por cajas mediante Stripe Payment Links o contacto directo.

## 2. Mapa de Archivos y Seams
- **Matemática de Scroll y Secuencia (`src/lib/`)**:
  - `scrub.ts`: `clamp`, `scrollProgress`, `frameIndexForProgress`, `lerp`, `activeAnnotation`.
  - `frames.ts`: `frameUrl`, `loadOrder` (precarga por bisección binaria), `nearestAvailable`.
- **Dominio de Catálogo y Contacto (`src/domain/`)**:
  - `catalog.ts`: `totalLiters`, `totalPriceCents`, `formatEuros`, `formatLiters`, `resolvePurchase` (`buyable` | `sold_out` | `unconfigured`), `catalogState`.
  - `contact.ts`: `buildWhatsAppUrl`, `buildMailtoUrl`.
- **Configuración (`src/config/`)**:
  - `site.ts`: formatos iniciales (`Caja de 6` = 3 L / 60 €, `Caja de 12` = 6 L / 120 €), enlaces Stripe vía `VITE_STRIPE_LINK_CAJA_6` / `VITE_STRIPE_LINK_CAJA_12` y placeholders de contacto.
  - `bottle-frames.json`: manifiesto generado por `scripts/build-media.mjs` (120 fotogramas WebP `500x680`).
- **Presentación (`src/components/`, `src/sections/`, `src/styles/`)**:
  - `tokens.css` + `global.css`: espejo estricto de `docs/brain/design.md`.
  - `BottleSequence.tsx` + `BottleChapter.tsx`: canvas 360° con `mix-blend-mode: multiply` sobre foco `--light-pool`, HUD técnico y soporte `prefers-reduced-motion`.
  - `FieldChapter.tsx`, `MillChapter.tsx`, `SpecSheetChapter.tsx`, `PurchaseSection.tsx`, `SiteChrome.tsx`.
- **Pipeline de Medios (`scripts/build-media.mjs`)**:
  - Recorta y nivela los 120 fotogramas WebP de la botella, extrae y ralentiza (0,5×) los tramos enfocados de `Aceite-liquido.mp4` sin el recogedor verde (`public/media/almazara.mp4`) y optimiza vídeo/foto de campo y etiqueta.
- **Verificación (`tests/e2e/ui-health.spec.ts`)**:
  - Suite Playwright Agent Eyes en `http://localhost:5174` (`ariaSnapshot`, `375x812` mobile, `1280x800` desktop, scrub en 20 pasos y `prefers-reduced-motion`).
