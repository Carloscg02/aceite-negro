# Arquitectura de `aceite-negro`

## 1. Estilo Arquitectonico
Arquitectura en Capas (Layered Architecture — Frontend D2C Zero-Backend):
- **Capa de Presentacion (`src/components/`, `src/sections/`)**: Interfaz visual de marca, narrativa editorial y animaciones en React + TypeScript + Vite. Consume exclusivamente tokens semanticos de `docs/brain/design.md` y respeta `prefers-reduced-motion`.
- **Capa de Dominio de Catalogo y Conversion (`src/domain/`)**: Logica pura y tipada de formatos de venta (packs/cajas de botellas de 0.5L), precios, reglas de envio informativas, estados de disponibilidad (`available` / `sold_out`) y captacion B2B/HORECA. Sin dependencias de DOM para testeo rapido.
- **Capa de Configuracion y Enlaces Externos (`src/config/`)**: Mapeo declarativo hacia **Stripe Payment Links** (con limite maximo de pagos configurado en Stripe para bloqueo automatico sin stock) y canales de contacto directo.
- **Infraestructura de Despliegue**: Alojamiento estatico 100% gratuito en **Cloudflare Pages** (CDN global + SSL automatico). Ver [ADR 0001](decisions/0001-initial-architecture.md) para el camino de evolucion opcional con micro-backend en Oracle Cloud VPS.

---

## 2. Verification Commands
Comandos oficiales de verificacion ejecutados por el subagente constructor en cada ciclo:

- **Unit & Integration Tests (In-Loop TDD)**: `npm test`
  Ejecutado en cada iteracion red-green-refactor sobre los seams publicos.
- **Static / Lint Gate**: `npm run lint`
  Ejecutado como barrera de calidad estatica y tipado.
- **E2E / Browser UI Tests (Optional)**: `npx playwright test`
  Ejecutado al completar features que toquen interfaz de usuario o flujos end-to-end completos.
