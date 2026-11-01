# Módulo: Landing (`001-landing-scrollcraft` → `002-landing-compacta`)

## 1. Propósito
Landing D2C estática («Almazara Nocturna» v2) para el lote único de **Aceite Negro Picudo**: 3.000 botellas × 500 ml = 1.500 L, variedades Picudo y Carrasqueño, cosecha temprana de octubre de 2026. La página se recorre en 3 movimientos:
1. Botella 360° guiada por el scroll, con 4 paradas anotadas.
2. Trazabilidad: el lote descifrado y el material casero tratado como documento.
3. Compra presencial en Jaén por botellas de 500 ml (cristal 13 € / PET 10 €) con encargo directo vía WhatsApp (`+34 670 94 14 88`, solo mensajes).

La ficha completa de la etiqueta va plegada en el pie.

## 2. Mapa de Archivos y Seams
- **Lib (`src/lib/`)**:
  - `scrub.ts`: `scrollProgress`, `frameIndexForProgress`, `lerp`, `activeAnnotation`, `frameForProgress` (paradas con meseta y tramos `smoothstep`), `annotationsForStops`, `passThroughProgress`, `rotationDegrees`.
  - `frames.ts`: `frameUrl`, `loadOrder`, `nearestAvailable`.
- **Dominio (`src/domain/`)**: `catalog.ts` (precios, litros, estados de compra), `contact.ts` (WhatsApp y mailto) y `lot.ts` (`parseLot`: iniciales + DDMMAA + día de la semana; devuelve `null` si la fecha es imposible).
- **Config (`src/config/`)**:
  - `site.ts`: formatos, precio, enlaces de Stripe y contacto.
  - `bottle.ts`: `BOTTLE_STOPS` en los fotogramas 0, 50, 83 y 119, medidos sobre el vídeo, más las anotaciones.
  - `label.ts`: datos literales de la etiqueta (lote, productor, filas, tabla nutricional y definición).
  - `bottle-frames.json`: se genera automáticamente.
- **Presentación**:
  - `BottleChapter` + `BottleSequence`: canvas con `multiply` sobre el foco y un HUD con las marcas de cada parada.
  - `TraceabilityChapter`:
    - El lote como `<dl>`.
    - Fig. 01: la foto, con zoom ligado a `--p` mediante `useViewportProgress`.
    - Fig. 02: `AmbientVideo`, una mirilla WebM/MP4 que carga solo al entrar en viewport y tiene botón de pausa.
    - La cita de la etiqueta.
  - `PurchaseSection`.
  - `SiteChrome`: cabecera, y pie con los datos legales y un `<details id="ficha">` que se abre desde cualquier enlace `#ficha`.
- **Medios**: `scripts/build-media.mjs` (pasos `botella | aceite | aceituna | logo`) + `scripts/lib/stabilize.mjs` (seguimiento por plantilla, semejanza por fotograma y recorte bilineal).
- **Verificación**:
  - 90 tests de Vitest en 10 ficheros.
  - `tests/e2e/ui-health.spec.ts`, con 6 tests de Playwright:
    - Jerarquía `h1`/`h2`.
    - Sin overflow a 1280, 375, 360 y 320, también con la ficha abierta.
    - Giro sin saltos y con su parada en cada fotograma configurado.
    - Bucle del aceite que se reproduce y se puede pausar.
    - Ficha.
    - `prefers-reduced-motion`.

## 3. Decisiones de la v2
- El material de móvil nunca va a pantalla completa ni en marco. Se usa recortado al detalle, graduado a la paleta y disuelto en `--surface`, con un pie en mono que da el número de figura y el timecode real.
- Para el aceite se descartó `vidstab`, porque las ondas lo hacían derivar. La estabilización es propia y no añade dependencias nativas.
- `botella` sobrescribe los fotogramas en su sitio, porque borrar la carpeta deja a un `npm run dev` en marcha sirviendo `index.html` en lugar de los WebP.
