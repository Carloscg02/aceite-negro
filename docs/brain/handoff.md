# Handoff del Proyecto: `aceite-negro` (rama `claude-ui-v2`)

- **Dónde estamos (2026-11-01)**: `claude-ui-v2` lista con todos los retoques de Carlos implementados, incluida la sección de venta v1 por WhatsApp.
  - **Apertura**: `Recogida temprana · Octubre 2026`.
  - **Botella**: paradas ajustadas a `Picudo 75% y Carrasqueño 25%`, `72 g de grasa monoinsaturada` y `500 ml` (`Botella de cristal (13 €) o PET (10 €). Venta presencial en Jaén.`).
  - **Capítulo 2 (`Variedad`)**: sección dedicada a **«La aceituna picuda»**, «El lote es la fecha» (`JCCC141026`) y bucle estabilizado del aceite (`Nuestro aceite en la almazara`).
  - **Capítulo 3 (`Comprar`)**: rediseñado en «Camino 2» (`En origen, por botellas.`) con los dos formatos de 500 ml (**Botella de cristal — 13 €** y **Botella de PET — 10 €**), botón único con logo SVG de WhatsApp (`+34 670 94 14 88`, mensaje predeterminado `Hola, quería encargar Aceite Negro Picudo.`) y aviso explícito de **solo mensajes por WhatsApp (no llamadas)**. Menú superior integrado con `VARIEDAD · FICHA · COMPRAR`. Eliminado cualquier correo electrónico ficticio en compra y pie de página.
  - **Ficha técnica / Etiqueta**: **100% validada** frente a la etiqueta física de Juan Carlos Cano Carrillo (`E23312572`, `40.044510/J`, lote `JCCC141026`).
  - **Salud del código**: Tests Vitest, ESLint, TypeScript, Vite build y tests E2E Playwright en verde.

- **Siguiente paso**:
  - Hacer merge de `claude-ui-v2` a `main` y publicar la v1 en producción (Cloudflare Pages).
  - La hoja de ruta de pasarela de cobro online queda documentada como capacidad latente en `docs/brain/decisions/0003-v1-direct-sales-whatsapp-and-future-gateway-roadmap.md`.
