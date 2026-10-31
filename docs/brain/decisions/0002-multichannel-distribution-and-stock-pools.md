# ADR 0002: Estrategia Multicanal por Cupos Estancos y Hoja de Ruta de Plataformas Externas

- **Estado**: Aceptado
- **Fecha**: 2026-10-31

## 1. Contexto
Una web nueva no genera trafico organico inmediato por si sola, y captar trafico frio mediante anuncios de pago (Meta/Google Ads) tiene un CAC estimado (`12 € - 25 €` por pedido) que erosiona el margen en un lote unico finito de 3.000 botellas de 0,5L sin recurrencia plurianual. A la vez, programar integraciones por API con marketplaces para sincronizar stock en tiempo real seria sobreingenieria para ~500-1.000 pedidos totales.

## 2. Decision: Particion en Cupos Estancos (*Ring-Fenced Stock Pools*)
Elegir una web estatica (ADR 0001) **no limita la venta a un unico canal**. La sincronizacion multicanal se resuelve organizativamente dividiendo las 3.000 botellas (ej. 500 cajas de 6 botellas) en **cupos independientes** registrados en una hoja maestra ligera:
- **Pool 1 — Venta directa offline / conocidos / entorno cercano**: Cupo principal gestionado en mano.
- **Pool 2 — Web Propia D2C (Stripe Payment Links)**: Cupo acotado mediante el limite de pagos de cada enlace en Stripe + codigo QR en la contraetiqueta de cada botella entregada offline (`CAC = 0 €`).
- **Pool 3 — Plataformas externas B2C / B2B**: Cupos independientes cargados en el panel de cada plataforma.
- **Pool 4 — Colchon de seguridad en almacen**: Reserva para absorber roturas de transporte y reasignar cajas manualmente en 1 minuto al canal con mayor traccion.

**Regla de formato comercial online**: Priorizar **packs (2-3 uds) y cajas (6 botellas = 3L)** frente a botellas sueltas de 0,5L para diluir el coste logistico del vidrio (`~5-6 €` por envio).

## 3. Hoja de Ruta de Canales Complementarios (Post-Lanzamiento Web)

La web propia actua primero como **carta de presentacion de marca** (imprescindible antes de contactar distribuidores o plataformas) e incluira una llamada especifica para **Profesionales, Tiendas y Eventos (B2B/HORECA)**. Con la identidad lista, se evalua activar por fases:

1. **Correos Market (B2C Espana y Portugal — Prioridad Alta)**:
   - **Coste**: `0 €/mes` de cuota fija y `0%` de comision sobre el producto; monetiza aplicando sus tarifas reducidas de envio con Correos cuando se produce una venta.
2. **Mentta (B2C Alimentacion Gourmet y Directo del Productor — Prioridad Alta)**:
   - **Coste**: Sin cuota fija mensual de entrada; comision porcentual solo por venta cerrada. Publico cualificado que busca especificamente AOVE de cosecha/origen.
3. **Faire (Marketplace B2B para Tiendas Gourmet de Espana y Europa — Prioridad Media/Alta)**:
   - **Coste**: Alta gratuita (`0 €/mes`). Venta mayorista por cajas completas con cobro garantizado al productor (`~15%` comision + tarifa unica de apertura en tiendas descubiertas por Faire; **`0%` comision** usando el enlace propio *Faire Direct*).
4. **Comercializadoras y Tiendas Especializadas de AOVE (ej. `adeoliva.com`, tiendas delicatessen, HORECA)**:
   - **Operativa**: No son marketplaces de autorregistro, sino distribuidores gourmet con acuerdo comercial directo (contacto B2B, descuento habitual `20%-35%` sobre PVP para compra por cajas o envio desde origen).
5. **Amazon Espana (Canal Opcional — Evaluar solo con requisitos legales cubiertos)**:
   - **Modalidad obligatoria en caso de prueba**: **FBM (*Gestionado por el Vendedor*)**, manteniendo el stock en casa y enviando solo cuando entra pedido. Se **descarta FBA** (enviar pales a almacenes de Amazon) para evitar costes de envio previo, cuotas de almacenaje y penalizaciones por baja rotacion.
   - **Comisiones Amazon.es**: Plan Individual sin cuota mensual (`0,99 € + IVA` por venta; frente a `39 €/mes + IVA` del Plan Profesional) + **15% de comision por referencia** sobre el total cobrado (producto + envio) en articulos > 10-15 € + exigencia de embalaje homologado anti-rotura (`< 1%` de pedidos defectuosos).
   - **Requisitos legales previos (*Ungating* Alimentacion)**: Alta fiscal correspondiente, **Registro Sanitario (RGSEAA)**, codigo de barras **EAN/GTIN (GS1)**, analitica reglamentaria y etiquetado **EU FIC** en espanol (denominacion, pais de origen obligatorio, lote, consumo preferente y tabla nutricional).
