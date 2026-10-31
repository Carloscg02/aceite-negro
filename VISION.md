# Contexto y Visión del Proyecto (vision.md)

**Objetivo del negocio:**
Tengo un stock limitado de 1.500 litros de aceite de oliva envasado en 3.000 botellas de 0.5L. Busco crear una estrategia de venta online para darle salida a esta producción. La idea es tener una web propia atractiva para venta directa, pero soy consciente de que el tráfico orgánico es difícil, por lo que contemplo apoyarme en plataformas y marketplaces ya establecidos (como Amazon o plataformas gourmet) para generar volumen. 

**Contexto Técnico y Recursos:**
*   **Mis conocimientos:** Frontend en JavaScript/React, y Backend en Python o Node.js (Express). Experiencia básica en bases de datos con SQLite.
*   **Infraestructura disponible:** Dispongo de un VPS gratuito de Oracle (hasta 24GB de RAM) apoyado en Cloudflare.
*   **⚠️ ACCIÓN REQUERIDA (INVESTIGACIÓN DE INFRAESTRUCTURA):** Antes de proponer una arquitectura, debes explorar y analizar cómo está configurado actualmente mi proyecto "arrendis" en el directorio `/home/carlos/rental-handler/`. 
    1. Lee primero el archivo `/home/carlos/rental-handler/docs/plan_despliegue_produccion.md` como base teórica.
    2. A continuación, revisa los archivos de configuración reales dentro del directorio `rental-handler/` (archivos de despliegue, proxys, Docker, etc.), ya que la implementación final puede diferir del plan original.
    Úsalo como contexto exacto de mi entorno actual para ver qué podemos aprovechar de esta configuración para el nuevo proyecto.

**Dilemas Arquitectónicos y de Negocio (A resolver por el agente):**
No tengo tomada ninguna decisión técnica sobre la arquitectura final. Las siguientes son solo reflexiones iniciales; **no te ciñas exclusivamente a ellas si existe un camino mejor**. Necesito que investigues y definas la solución óptima:

1.  **Enfoque de la Web Propia:** 
    *   *Idea inicial A:* Hacer solo un frontend estático (React) servido en el VPS y delegar carrito, pagos y control de stock a enlaces de pago de Stripe.
    *   *Idea inicial B:* Crear un Full-Stack (React + Python/Node + SQLite) alojado en el VPS para tener base de datos propia.
2.  **Gestión Multicanal y Sincronización:** 
    *   Mi gran duda es cómo integrar la venta en mi landing page con la venta en marketplaces de alto tráfico sin perder el control del stock. 
    *   Si optamos por servicios externos descentralizados (como Stripe), no sé cómo se comunicaría ese stock con Amazon u otros marketplaces.
    *   Si centralizamos, no sé si la complejidad de programar integraciones (APIs) compensa para un lote de 3.000 botellas, o si existen enfoques organizativos/físicos más simples.

**Instrucciones para el agente:**
Actúa como mi Tech Lead y estratega de e-commerce. Tu objetivo principal es investigar y proponerme la solución arquitectónica y de negocio **óptima**, basándote estrictamente en estos cinco pilares:
1. **Practicidad:** Que se pueda desarrollar e iterar rápido.
2. **Simplicidad:** Evitar sobreingeniería para un lote de 3.000 unidades.
3. **Efectividad de ventas:** El enfoque técnico no debe entorpecer la conversión ni la captación en marketplaces.
4. **Reutilización de infraestructura:** Aprovechar al máximo el VPS de Oracle y la configuración de red que ya poseo en `rental-handler`.
5. **Minimización de costes:** Priorizar herramientas gratuitas o que solo cobren comisión por venta (coste fijo tendente a cero).

Analiza mi infraestructura, evalúa mis conocimientos y define la hoja de ruta técnica y de flujo de ventas definitiva.