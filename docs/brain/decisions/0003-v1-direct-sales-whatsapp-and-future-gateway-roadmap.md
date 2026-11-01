# ADR 0003: Venta Directa en Jaén vía WhatsApp (v1) y Hoja de Ruta de Pasarela de Pagos

- **Estado**: Aceptado
- **Fecha**: 2026-11-01
- **Decisión Relacionada**: Complementa y modula [ADR 0001](0001-initial-architecture.md)

## 1. Contexto
En [ADR 0001](0001-initial-architecture.md) se planteó inicialmente el uso de Stripe Payment Links para venta online por cajas cerradas. Sin embargo, para la primera versión (v1) de la campaña de cosecha de octubre 2026, la realidad comercial del productor (Juan Carlos Cano Carrillo) se rige por:
1. **Canal de proximidad**: La totalidad del reparto inicial se realiza presencialmente en la provincia de Jaén (entorno cercano, conocidos, boca a boca y establecimientos de la zona).
2. **Formato individual**: Se necesita vender tanto botellas sueltas de 500 ml (13 € en cristal, 10 € en PET) como pedidos mayores a convenir, sin forzar al comprador a adquirir cajas completas de 6 o 12 unidades.
3. **Fricción operativa innecesaria**: Habilitar pasarela de cobro online para un reparto que es en mano exigiría comisiones de pasarela, logística de paquetería para vidrio frágil y soporte administrativo sin aportar valor al comprador local.

## 2. Decisión para la v1
- Se lanza la v1 orientada a **imagen de marca premium, exclusividad artesanal y trato directo**.
- El canal de conversión es exclusivamente **contacto vía WhatsApp directo con el productor** (+34 670 94 14 88, solo mensajes).
- Precios públicos y transparentes en la web: **13 € botella de cristal (500 ml)** y **10 € botella de PET (500 ml)**.
- Se elimina cualquier pasarela de pago activa y correos ficticios en la interfaz pública.

## 3. Hoja de Ruta de Pasarela de Pagos (Capacidad Latente)
Para que una hipotética ampliación futura no quede olvidada ni bloqueada:
1. **El código de dominio ya está preparado**: `src/domain/catalog.ts` conserva la lógica pura de formatos (`SaleFormat`), cálculo de litros/precios y `resolvePurchase(format)` con soporte para `paymentLink` (`https://buy.stripe.com/...`).
2. **Activación sin refactorizar**: Si en una futura cosecha se decide abrir venta nacional con envíos por mensajería y cobro online:
   - Bastará con reintroducir los formatos de cajas cerradas (ej. Caja de 6 / Caja de 12) en `src/config/site.ts`.
   - Proporcionar las URLs de los enlaces en las variables de entorno `VITE_STRIPE_LINK_*`.
   - La lógica de `resolvePurchase` activará automáticamente los botones de compra directa con Stripe sin tocar la estructura del frontend.
3. **Si nunca se implementa**: El sistema no arrastra deuda técnica ni dependencias externas; funciona de manera 100% estática, gratuita y autónoma en Cloudflare Pages.

## 4. Consecuencias
- **Positivas**: Cero fricción para el productor y el cliente de Jaén, cero comisiones bancarias, experiencia de usuario adaptada a la realidad física de la cosecha.
- **Riesgos mitigados**: Queda formalmente archivado en este ADR el camino exacto para activar Stripe sin necesidad de mantener notas provisionales en el handoff.
