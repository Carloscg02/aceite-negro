# Design Contract — `aceite-negro` · «Almazara Nocturna» v2 (landing compacta)

## 1. Aesthetic Direction
- **Arquetipo**: `warm-editorial` invertido a nocturno. Base = negro del logo y la etiqueta; acentos = oliva del ramo y hueso del logotipo. Elegancia por contención, no por ornamento.
- **Tesis**: la alta gama la ponen la tipografía, el aire y la botella 360°; la verdad casera la ponen los **datos reales de la etiqueta** (el lote descifrado, RGSEAA, tabla nutricional) y el **material de móvil tratado como documento pequeño**. Cero eslóganes sentimentales.
- **Recorrido en 3 movimientos**: (1) botella 360° con 4 paradas anotadas (frente · canto · contraetiqueta · frente) → (2) Trazabilidad: «El lote es la fecha» + díptico aceituna/aceite + definición de la etiqueta → (3) compra por cajas. La ficha completa vive plegada en el pie.
- **Signature move**: la botella gira con el scroll dentro de un «foco de estudio» (`--light-pool`) que se disuelve en el negro y **se detiene** en cada parada; el numeral de cada anotación es el ángulo real que marca el HUD.
- **Regla de disolución**: nada va en marco. Botella, foto y vídeo emergen del negro (`multiply`, máscaras con `--feather` / `--lens-solid`).
- **Ornamento único**: doble filete fino oliva (eco de las líneas de «ACEITE DE OLIVA VIRGEN EXTRA»).

## 2. Design Tokens
| Token | Valor | Uso |
|---|---|---|
| `--surface` | `#0D0E0A` | Fondo base «negro aceituna» |
| `--surface-elevated` | `#15170F` | Filas de compra en hover |
| `--text-primary` | `#EDEBE3` | Hueso del logotipo |
| `--text-muted` | `#A19F8C` | Pies, metadatos (AA sobre `--surface`) |
| `--border-subtle` | `#2B2E1F` | Filetes y divisores |
| `--accent-primary` | `#8A9157` | Oliva del ramo — filetes, numerales, iniciales del lote |
| `--accent-oil` | `#BCC46A` | Verde del aceite recién hecho — foco/hover, máx. 5% |
| `--light-pool` | `#E7E3D6` | Centro del foco de la botella |
| `--danger-muted` | `#C08A6A` | Estado agotado / error (sin rojo chillón) |
- `--surface-paper` / `--ink` / `--ink-muted` / `--border-paper` quedan en reserva (la ficha ya no es un capítulo de papel).
- Material documental: `--feather 22%` (borde que se funde de la foto), `--lens-solid 58%` (mirilla), `--zoom-base 1.02` + `--zoom-range 0.12` (acercamiento lento ligado al scroll vía `--p`).
- Radios: `--radius-none: 0` por defecto; `--radius-pill: 999px` solo botones. Sin sombras (`box-shadow` prohibido salvo `--focus-ring`).
- `--focus-ring: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent-oil)`. Grano SVG al 6% sobre foto y vídeo.

## 3. Typography & Spacing
- **Display**: `Cormorant Garamond` 400/500 + itálica (eco de la serif de la etiqueta). Tracking −0.01em, interlineado 0.95–1.05.
- **Texto/UI**: `Sora Variable` 300–500 (eco del logotipo geométrico). 16–18px, interlineado 1.6, medida 60ch.
- **Datos**: `IBM Plex Mono` 400/500, `tabular-nums`; versalitas simuladas (`letter-spacing: 0.12em` + uppercase, 11–12px). El lote se compone en mono a `--step-3`.
- Escala fluida: `--step--1 .8125rem` · `--step-0 1rem` · `--step-1 1.25rem` · `--step-2 clamp(1.75rem,3vw,2.5rem)` · `--step-3 clamp(2.5rem,6vw,4.75rem)` · `--step-4 clamp(3.5rem,11vw,9.5rem)`.
- Espaciado base 8px: `--space-1 4px` … `--space-8 168px`. Capítulos separados por `--chapter-pad` (= `--space-7`): página corta.
- Rejilla 12 col, gutter `--space-4`, margen lateral `clamp(20px,5vw,72px)`; `max-width: 1320px`. Trazabilidad en zigzag (texto | foto · mirilla | cita).

## 4. Component & Anti-Slop Rules
1. Prohibido: gradientes morados/cian, hero centrado + 3 tarjetas con iconos, glassmorphism, sombras difusas, emojis, iconos de stock, tarjetas con `border-radius` grande.
2. Prohibidos los clichés de copy: «familia humilde», «con todo nuestro cariño», «pasión», «tradición milenaria». Hablan los datos (lote, fecha, variedades, cifras).
3. Solo tokens: ningún hex ni px suelto en componentes; todo vía `var(--*)` de `src/styles/tokens.css`.
4. Compra = filas editoriales tipo carta (formato · contenido · litros · precio en mono), no tarjetas SaaS. CTA píldora hueso sobre negro; hover a `--accent-oil` en 180ms.
5. Estados obligatorios: botella (`loading` póster con geometría final · `error` foto fija · `ready` · `reduced`), compra (`populated` · `sold_out` por formato · `empty`/todo agotado → contacto · `unconfigured` → WhatsApp), lote ilegible → se muestra el código tal cual, sin inventar lectura.
6. Movimiento: transiciones 150–220ms `cubic-bezier(.2,.7,.2,1)`; giro con paradas suavizadas (≤ 12 fotogramas por 5 % de scroll) + lerp; `prefers-reduced-motion` → botella fija de frente, vídeo en póster, foto sin zoom.
7. **Material de móvil**: nunca a pantalla completa ni en marco. Solo foto fija o bucle corto, recortado al detalle (sin recogedor verde ni personas), estabilizado, graduado a la paleta y disuelto en `--surface`. Siempre `muted loop playsinline`, botón de pausa y pie en mono: número de figura + timecode real del original.
8. Accesibilidad: `h1` único (título del movimiento botella) y un `h2` en Trazabilidad y en Compra, contraste AA, `:focus-visible` con `--focus-ring`, canvas con `role="img"` + `aria-label`, lote como `<dl>` etiquetado.
9. Sin overflow horizontal a 375px y 1280px (`scrollWidth <= clientWidth`), verificado con Playwright (`ariaSnapshot`).
