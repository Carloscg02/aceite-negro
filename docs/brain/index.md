# Cerebro del Proyecto: `aceite-negro`

> Mapa central de contexto del proyecto (Nivel 1). Consulta los documentos de Nivel 2 segun necesidad.

---

## 1. Identidad del Proyecto
- **Nombre**: `aceite-negro`
- **Objetivo**: Web D2C de marca y venta de proximidad para lote de aceite de oliva Picudo y Carrasqueño (cosecha octubre 2026) con encargo directo por WhatsApp en Jaén.
- **Stack Tecnologico**: `typescript, react, vite, cloudflare-pages` (con soporte latente para `stripe-payment-links` en `domain/catalog.ts`).
- **Dominio y Producción**: `aceitenegropicudo.es` (DonDominio -> DNS en Cloudflare Free -> Cloudflare Pages en `main`).
- **Dominio de Negocio**: E-commerce D2C sin servidor, narrativa editorial gourmet, conversión por WhatsApp y trazabilidad por lote.

---

## 2. Documentos Centrales (Nivel 2)
- **[`architecture.md`](architecture.md)** - Diseño de capas, infraestructura de producción en Cloudflare, procedimientos de contingencia y comandos de verificación.
- **[`handoff.md`](handoff.md)** - Estado del turno actual y siguiente paso inmediato (maximo 30 lineas).
- **[`design.md`](design.md)** - Contrato UI «Almazara Nocturna» v2: recorrido en 3 movimientos, tokens, tipografia, regla de material documental, reglas Anti-Slop y estados obligatorios. Leer antes de tocar interfaz.
- **[`decisions/index.md`](decisions/index.md)** - Sub-indice de decisiones tecnicas irreversibles (ADRs). Consultar solo ante decisiones arquitectonicas.

---

## 3. Modulos del Sistema (`modules/`)
Registro de fichas tecnicas de cada modulo implementado en el proyecto.
- **[`modules/landing-scrollcraft.md`](modules/landing-scrollcraft.md)** - Landing «Almazara Nocturna» v2 (specs 001 → 002): botella 360° con paradas anotadas, trazabilidad (lote descifrado + foto de aceituna + bucle estabilizado del aceite), compra por cajas (Stripe / WhatsApp) y ficha plegada en el pie.
