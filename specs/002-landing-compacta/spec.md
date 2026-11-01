# Spec 002 — Landing compacta: botella → trazabilidad → compra

## 1. Contexto
Revisión de la 001 tras el feedback de Carlos (2026-11-01): el giro 360° de la botella funciona; los capítulos de Campo, Almazara y Ficha no. El metraje de móvil a gran tamaño, con luz de día lavada, rompe la paleta nocturna, y la ficha de etiqueta a página completa no vende. Decisión: página más corta, sin los vídeos del vareo, con el material casero tratado como **documento pequeño** y la verdad contada con **datos reales** (el lote), no con eslóganes.

## 2. Requisitos Funcionales
- **RF-1 Recorrido en 3 movimientos**: (1) Botella 360° con paradas anotadas, (2) Trazabilidad: lote descifrado + díptico aceituna/aceite + cita de la etiqueta, (3) Comprar. La ficha completa (datos de etiqueta y tabla nutricional) queda **plegada en el pie** (`<details id="ficha">`).
- **RF-2 Paradas del giro**: el scroll lleva la botella por 4 ángulos con asentamiento suave (frente → canto → contraetiqueta → frente). Cada parada muestra un dato: presentación, variedades, contraetiqueta (72 g/100 g, vitamina E, enlace a la ficha) y formato (500 ml, cajas, precio, «Ver cajas»).
- **RF-3 Lote descifrado**: el código del lote (`LOT_CODE = 'JCCC141026'`, en `src/config/label.ts` junto al resto de datos de etiqueta) se descompone en iniciales del productor y fecha (14 · 10 · 26 → día de la semana, octubre, 2026).
- **RF-4 Díptico documental**: Fig. 01 foto fija del montón de aceituna (gradación oliva, zoom lento ligado al scroll); Fig. 02 bucle del aceite cayendo en la cubeta, **recortado, estabilizado, a ⅓ de velocidad y sin costura**, en mirilla circular. Ambos con pie en mono.
- **RF-5 Medios**: `npm run media` regenera el bucle y la foto desde `docs/resources/` (sin dependencias nativas nuevas). Se retiran del sitio los vídeos de vareo, almazara y la foto de etiqueta.
- **RF-6** Se mantienen compra (RF-3/4/5 de la 001), puerto `5174` y contacto directo.

## 3. Criterios de Aceptación
- **CA-1** `frameForProgress` recorre las paradas: devuelve el fotograma exacto de cada parada, mantiene las mesetas, suaviza entre paradas (más lento que lineal al salir de una parada), es monótona con paradas monótonas, clampa fuera de [0,1] y nunca devuelve NaN.
- **CA-2** Configuración del giro: con las paradas reales, el fotograma no avanza más de 12 por cada 5 % de scroll, empieza en 0, termina en el último fotograma y la anotación activa en cada parada es la suya.
- **CA-3** `passThroughProgress` vale 0 cuando el elemento asoma por abajo, 1 cuando sale por arriba, es lineal entre medias y nunca NaN.
- **CA-4** `parseLot('JCCC141026')` → iniciales `JCCC`, día 14 (`miércoles`), mes 10 (`octubre`), año 2026; códigos mal formados o fechas imposibles → `null`.
- **CA-5** Capítulo Trazabilidad: `h2` propio, lote descifrado con su lectura (productor, día de la semana, octubre, 2026), foto con `alt` descriptivo, vídeo del aceite `muted`/`loop`/`playsinline` con póster y nombre accesible, que se reproduce al entrar en pantalla y se puede pausar (WCAG 2.2.2); pies numerados con timecode real del original y compuestos en mono.
- **CA-6** Pie: los datos legales (productor, RGSEAA, lote) quedan a la vista; la ficha completa está plegada por defecto y contiene la tabla «Información nutricional» y los datos de etiqueta; el enlace «Ficha» la despliega.
- **CA-7** Agent Eyes (Playwright, `:5174`): `h1` único (título del movimiento botella) y un `h2` en cada uno de los otros dos movimientos (trazabilidad, compra); 0 overflow a 375 y 1280 (también con la ficha abierta); 0 errores de consola; scrub monótono sin saltos > 12 fotogramas por paso de 5 % llegando al último fotograma, con parada en cada fotograma configurado y su anotación; `prefers-reduced-motion` → botella fija (imagen cargada) y vídeo del aceite en pausa con póster.
- **CA-8** `npm test`, `npm run lint` y `npm run build` terminan con exit 0; cero hex fuera de `tokens.css`.
- **CA-9** Medios (verificación manual con Prueba Observada en `tasks.md`): `npm run media` termina con exit 0 sin reiniciar el servidor de desarrollo; el bucle del aceite es cuadrado 480×480, dura < 4 s, cierra sin costura y su error de seguimiento máximo es < 8; regenerar produce ficheros idénticos (md5).

## 4. Seams
- `src/lib/scrub.ts` (`frameForProgress`, `passThroughProgress`) · `src/domain/lot.ts` (`parseLot`) · `src/config/bottle.ts` (paradas + anotaciones).
- Componentes `<TraceabilityChapter>` y `<SiteFooter>` vía Testing Library; página completa vía Playwright.

## 5. Fuera de alcance
Créditos con nombres reales del equipo y datos de finca (pendientes de que Carlos los facilite), nuevo rodaje, Stripe real.
