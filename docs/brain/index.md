# Cerebro del Proyecto: `aceite-negro`

> Mapa central de contexto del proyecto (Nivel 1). Consulta los documentos de Nivel 2 segun necesidad.

---

## 1. Identidad del Proyecto
- **Nombre**: `aceite-negro`
- **Objetivo**: Web D2C de marca para lote limitado de aceite de oliva (3.000 botellas 0.5L) con Stripe Payment Links y captacion multicanal/B2B
- **Stack Tecnologico**: `typescript, react, vite, stripe-payment-links, cloudflare-pages`
- **Dominio**: E-commerce D2C sin servidor, narrativa de marca gourmet, conversion web y distribucion multicanal por cupos

---

## 2. Documentos Centrales (Nivel 2)
- **[`architecture.md`](architecture.md)** - Diseno de capas, reglas de codigo y comandos de verificacion.
- **[`handoff.md`](handoff.md)** - Estado del turno actual y siguiente paso inmediato (maximo 30 lineas).
- **[`design.md`](design.md)** - Contrato UI «Almazara Nocturna»: tokens, tipografia, reglas Anti-Slop y estados obligatorios. Leer antes de tocar interfaz.
- **[`decisions/index.md`](decisions/index.md)** - Sub-indice de decisiones tecnicas irreversibles (ADRs). Consultar solo ante decisiones arquitectonicas.

---

## 3. Modulos del Sistema (`modules/`)
Registro de fichas tecnicas de cada modulo implementado en el proyecto.
- **[`modules/landing-scrollcraft.md`](modules/landing-scrollcraft.md)** - Landing ScrollCraft «Almazara Nocturna»: scrub 360° de botella, cuaderno documental de campo/almazara, ficha tecnica de etiqueta y compra por cajas (Stripe / WhatsApp).
