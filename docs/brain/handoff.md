# Handoff del Proyecto: `aceite-negro` (v1 en producción)

- **Dónde estamos (2026-11-02)**: **v1 cerrada y funcionando en internet** en `aceitenegropicudo.es` (Cloudflare Pages + DNS DonDominio).
  - **Identidad & Botella 360°**: 4 paradas (`Picudo 75% / Carrasqueño 25%`, `72 g monoinsaturada`, `500 ml`), HUD depurado solo con Rotación y Formato, sello oficial IGP Aceite de Jaén integrado, y tipografía de marca `Syne Variable` (`--font-brand`) en el wordmark de la cabecera.
  - **Pie de página**: Integrado el logotipo definitivo oficial (`logo-definitivo.jpg`, 780x949 px tras sanear márgenes muertos) adaptado con `mix-blend-mode: lighten` y ajustado a `--footer-logo-w: 250px;` (250x304 px en viewport, ~235x288 px de dibujo visible).
  - **Variedad & Trazabilidad**: «La aceituna picuda» de la sierra sur de Jaén, cita de pequeña explotación familiar en frío, lote descifrado (`JCCC141026`) y bucle estabilizado del aceite en almazara.
  - **Canal de venta en Jaén**: botellas de 500 ml (**Cristal 13 €** / **PET 10 €**), botón blanco en cabecera y CTA WhatsApp (+34 689 09 11 31, solo mensajes) para reserva y entrega en mano en Jaén.
  - **Ficha técnica / Etiqueta**: 100% validada frente a etiqueta física (`Juan Carlos Cano Carrillo`, `E23312572`, `40.044510/J`).
  - **Hoja de ruta pasarela online**: formalmente archivada en `docs/brain/decisions/0003-v1-direct-sales-whatsapp-and-future-gateway-roadmap.md`.
  - **Guías técnicas**: `guides/001-landing-scrollcraft-GUIDE.md` y `guides/002-frontend-under-the-hood-para-desarrolladores-backend-GUIDE.md` (frontend explicada para ingenieros backend).
  - **Salud del código**: 86 tests Vitest, ESLint, TypeScript, Vite build y 6 tests E2E Playwright en verde.

- **Objetivo de la siguiente sesión**:
  1. **Estrategia de ramas `develop` / `main`** (estilo Arrendis): `main` blindada como producción estable; todos los cambios se desarrollarán en `develop`.
  2. **CI con GitHub Actions** (`.github/workflows/ci.yml`): automatizar en cada push/PR a `develop` y `main` las 4 barreras de calidad (lint/tsc, vitest, build y Playwright E2E).
  3. Crear y publicar la rama `develop` para iniciar el nuevo ciclo de trabajo protegido.
