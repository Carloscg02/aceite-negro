# Handoff del Proyecto: `aceite-negro` (rama `claude-ui-v2`)

- **Dónde estamos (2026-11-01)**: `claude-ui-v2` lista con la primera tanda de retoques de Carlos aprobada.
  - **Apertura**: `Recogida temprana · Octubre 2026` (eliminadas cifras de litros/lotes en hero).
  - **Botella**: paradas ajustadas a `Picudo 75% y Carrasqueño 25%` y `72 g de grasa monoinsaturada` (sin superposiciones ni subtítulos pequeños).
  - **Capítulo 2 y Menú**: renombrado a **«Variedad»**; sección dedicada a **«La aceituna picuda»** con foto a 440px y texto natural sin artificios. Pie de vídeo: `Nuestro aceite en la almazara` centrado, y cabecera `UNA PEQUEÑA EXPLOTACIÓN FAMILIAR`.
  - **Ficha técnica / Etiqueta**: **100% validada** por Carlos. Datos nutricionales y legales verificados frente a la etiqueta física de Juan Carlos Cano Carrillo (`E23312572`, `40.044510/J`, lote `JCCC141026`).
  - **Salud del código**: 88 tests Vitest, ESLint, TypeScript, Vite build y 6 tests E2E Playwright en verde.

- **Situación y Decisión Estratégica para la Sección de Venta (v1)**:
  - **Propósito de la v1**: web orientada a **imagen de marca y venta de proximidad a conocidos / boca a boca**.
  - **Sin Stripe en v1**: descartada la pasarela de pago online en esta fase inicial para simplificar el lanzamiento.
  - **Canal de venta**: exclusivamente mediante **contacto vía WhatsApp** con su padre (Juan Carlos, el productor).
  - **Venta presencial en Jaén**: la recogida y entrega es presencial en la provincia de Jaén.
  - **Formato por botellas (no limitado a cajas)**: al ser venta presencial y vía WhatsApp, desaparece la restricción de vender únicamente por cajas completas; se puede vender por **botellas individuales** o packs a convenir.
  - **Futura ampliación (no incompatible)**: en el futuro se podrá activar venta online nacional con cajas cerradas (6/12), portes y Stripe. Ambas modalidades coexistirán sin problemas.

- **Objetivo de la siguiente sesión (en nuevo chat)**:
  1. Rediseñar la sección de venta (`src/sections/PurchaseSection.tsx`) y los CTAs de la web para presentar claramente la **venta presencial y encargo en Jaén vía WhatsApp por botellas**, transmitiendo exclusividad artesanal.
  2. Configurar el teléfono real de WhatsApp en `src/config/site.ts`.
  3. Dejar la web 100% funcional y verificada para su publicación final en internet y merge a `main`.
