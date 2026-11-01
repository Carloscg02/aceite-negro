# Spec 001 — Landing ScrollCraft «Almazara Nocturna»

## 1. Contexto
Landing D2C para el lote único de **Aceite Negro Picudo** (AOVE, Picudo y Carrasqueño, cosecha temprana octubre 2026, 3.000 botellas de 500 ml). Arquitectura Zero-Backend (ADR 0001): React + TS + Vite estático en Cloudflare Pages; compra vía Stripe Payment Links (Stripe limita el cupo web, ADR 0002). Contrato visual: `docs/brain/design.md`.

## 2. Requisitos Funcionales
- **RF-1 Scroll Journey** en 5 capítulos: (1) Botella 360° ligada al scroll con anotaciones de datos reales, (2) Campo — cuaderno documental con vídeo/foto de vareo, (3) Almazara — chorro de aceite recién hecho, (4) Ficha — datos de etiqueta y tabla nutricional, (5) Comprar + contacto directo; pie con datos legales de etiqueta.
- **RF-2 Signature move**: la secuencia de fotogramas del vídeo 360° se dibuja en `<canvas>` según el progreso de scroll del capítulo 1, fundida con el foco de luz (sin recuadro).
- **RF-3 Formatos de venta**: Caja 6 (6 × 500 ml = 3 L) y Caja 12 (12 × 500 ml = 6 L) a 10 €/botella → 60 € y 120 €. Precios y enlaces Stripe declarados en `src/config/`; enlaces vía variables `VITE_STRIPE_LINK_CAJA_6` / `VITE_STRIPE_LINK_CAJA_12`.
- **RF-4 Disponibilidad**: sin contador público de stock. Un formato `sold_out` no permite comprar; sin enlace Stripe válido (`unconfigured`) el CTA deriva a pedido por WhatsApp prellenado.
- **RF-5 Contacto directo**: WhatsApp + email (placeholders configurables) para conocidos, pedidos locales y profesionales (tiendas, HORECA).
- **RF-6 Servidor de desarrollo y preview en el puerto `5174`** (`strictPort: true`).

## 3. Criterios de Aceptación
- **CA-1** `frameIndexForProgress` mapea progreso 0→primer fotograma, 1→último, clampa fuera de rango y es monótono.
- **CA-2** `scrollProgress` devuelve 0 antes del capítulo, 1 al final, lineal en medio, y nunca NaN con alturas degeneradas.
- **CA-3** `activeAnnotation` devuelve la anotación cuyo rango contiene el progreso (o la última válida en el borde 1).
- **CA-4** Catálogo: Caja 6 = 3 L y 60 €, Caja 12 = 6 L y 120 €; precios formateados `es-ES` («60 €», «10 € / botella»).
- **CA-5** `resolvePurchase`: `buyable` solo con URL `https://buy.stripe.com/…`; `sold_out` prioriza sobre enlace; otro caso → `unconfigured` con fallback WhatsApp.
- **CA-6** `catalogState`: `empty` sin formatos, `all_sold_out` si todos agotados, `populated` en otro caso.
- **CA-7** `buildWhatsAppUrl` genera `https://wa.me/<dígitos>?text=<encoded>`; `buildMailtoUrl` codifica asunto y cuerpo.
- **CA-8** Sección Comprar renderiza los 4 estados (populated, sold_out por formato, empty/all_sold_out → contacto, unconfigured → WhatsApp) con roles accesibles.
- **CA-9** Secuencia de botella: estado `loading` (póster con geometría final), `ready`, `error` (foto fija) y `reduced-motion` (fotograma frontal estático).
- **CA-10** Agent Eyes (Playwright, `http://localhost:5174`): `ariaSnapshot` con `h1` único y `h2` por capítulo; `scrollWidth <= clientWidth` a 375px y 1280px; 0 errores de consola; durante scroll incremental el fotograma avanza sin saltos > 12 fotogramas por paso de 5% y sin overflow.
- **CA-11** `npm test`, `npm run lint` y `compass check` terminan con exit 0.

## 4. Seams preliminares
- `src/lib/scrub.ts` (funciones puras de scroll → fotograma/anotación).
- `src/domain/catalog.ts` y `src/domain/contact.ts` (lógica de venta y enlaces).
- Componente `<PurchaseSection formats contact />` (render de estados vía Testing Library).
- Componente `<BottleSequence />` vía prop `status` inyectable para estados.
- Página completa vía Playwright (`tests/e2e/ui-health.spec.ts`).

## 5. Fuera de alcance
Backend, carrito propio, contador de stock, analítica, i18n, despliegue real en Cloudflare.
