# ADR 0001: Arquitectura D2C Zero-Backend con Cloudflare Pages y Stripe Payment Links

- **Estado**: Aceptado
- **Fecha**: 2026-10-31
- **Estilo Acordado**: `layered` (SPA Estatica en `React + TypeScript + Vite`)

## 1. Contexto
El proyecto `aceite-negro` nace para comercializar una produccion limitada de **1.500 litros de aceite de oliva envasados en 3.000 botellas de 0,5L** bajo cinco pilares: practicidad, simplicidad, efectividad de ventas, reutilizacion de infraestructura conocida (`rental-handler` / Arrendis) y coste fijo tendente a `0,00 €/mes`.

Condicionantes reales de negocio confirmados:
1. Buena parte de las 3.000 botellas se vendera fuera de internet (venta directa a conocidos y entorno cercano), lo que haria que cualquier base de datos online requiriese igualmente ajustes manuales.
2. No se esperan picos masivos de compras concurrentes por segundo.
3. **No se desea mostrar un contador publico de stock** en la web, pero **es obligatorio impedir que un cliente pague si el cupo disponible se ha agotado**.

## 2. Opciones Evaluadas
- **Opcion A (Elegida — Zero-Backend Estatico + Stripe Payment Links)**:
  Frontend en `React + TypeScript + Vite` alojado gratis en **Cloudflare Pages**. Cada formato cerrado de compra (ej. Pack de 3 botellas, Caja de 6 botellas) enlaza a su **Stripe Payment Link** (con Apple Pay, Google Pay, validacion de direccion postal y telefono). El control anti-rotura de stock se delega en la funcion nativa de Stripe **Limit the number of payments** (`restrictions.completed_sessions.limit`), que desactiva automaticamente el enlace y muestra mensaje de agotado al alcanzar el cupo asignado.
- **Opcion B (Descartada en Fase 1 — Frontend + Micro-Backend `FastAPI + SQLite` en Oracle VPS)**:
  Replicar el stack completo de `rental-handler` para gestionar carrito libre multi-formato y bolsa comun de botellas via webhooks de Stripe. Se descarta inicialmente por anadir complejidad operativa innecesaria (Docker, servidor, webhooks) para el volumen online previsto.

## 3. Decision y Camino de Evolucion Futura
Se adopta la **Opcion A (Zero-Backend)** para dedicar el 100% del esfuerzo inicial a la identidad visual, animacion de marca y conversion comercial con coste fijo `0,00 €/mes` (solo comision por venta cobrada en Stripe: `~1,5% + 0,25 €` en tarjetas UE).

**Nota de infraestructura para evolucion futura a Opcion B (auditoria de `/home/carlos/rental-handler`)**:
Si en el futuro se requiere carrito dinamico o inventario compartido en base de datos, el frontend no cambia y se anade o bien una *Cloudflare Pages Function* serverless, o bien un contenedor `FastAPI + SQLite` en el VPS ARM de Oracle Cloud. Dado que en ese VPS el contenedor `caddy` de `arrendis` **ya ocupa los puertos `80` y `443` del host**, el nuevo backend **no debe levantar otro Caddy en 80/443**, sino unirse a una red Docker compartida con el `Caddyfile` existente (`api.<dominio>.es { reverse_proxy aceite-backend:8000 }`) o exponerse mediante `cloudflared`.

## 4. Consecuencias
- **Positivas**: Cero mantenimiento de servidores/BBDD, despliegue instantaneo en CDN global, maxima conversion movil (Apple Pay / Google Pay) e imposibilidad de cobrar pedidos sin stock cuando se alcanza el limite del Payment Link.
- **Trade-offs**: La compra se estructura en botones de formatos cerrados (packs/cajas) en lugar de un carrito mezclador libre, y reajustar el cupo entre ventas presenciales y web se realiza en segundos desde la app movil/panel de Stripe.
