# Design Contract — `aceite-negro` · «Almazara Nocturna»

## 1. Aesthetic Direction
- **Arquetipo**: `warm-editorial` invertido a nocturno. Base = negro del logo y la etiqueta; acentos = oliva del ramo y hueso del logotipo. Elegancia por contención, no por ornamento.
- **Tesis**: la alta gama la ponen la tipografía, el aire y la botella 360°; la verdad casera la ponen los **datos reales de la etiqueta** (lote, RGSEAA, tabla nutricional) y el **metraje de móvil sin maquillar** tratado como cuaderno de campo (timecodes, pies de foto en mono). Cero eslóganes sentimentales.
- **Signature move**: la botella gira con el scroll dentro de un «foco de estudio» (`--light-pool`) que se disuelve en el negro. Fotogramas en `<canvas>` con `mix-blend-mode: multiply`: el blanco de estudio adopta el color del foco y los bordes mueren en `--surface`. Nunca recuadro, nunca vitrina.
- **Ornamento único**: doble filete fino oliva (eco de las líneas de «ACEITE DE OLIVA VIRGEN EXTRA»).

## 2. Design Tokens
| Token | Valor | Uso |
|---|---|---|
| `--surface` | `#0D0E0A` | Fondo base «negro aceituna» |
| `--surface-elevated` | `#15170F` | Bandas, filas de compra en hover |
| `--surface-paper` | `#ECE9DF` | Capítulo «Ficha» (eco tabla nutricional) |
| `--ink` | `#16170F` | Texto sobre `--surface-paper` |
| `--text-primary` | `#EDEBE3` | Hueso del logotipo |
| `--text-muted` | `#A19F8C` | Pies, metadatos (AA sobre `--surface`) |
| `--border-subtle` | `#2B2E1F` | Filetes y divisores |
| `--accent-primary` | `#8A9157` | Oliva del ramo (logo) — filetes, numerales |
| `--accent-oil` | `#BCC46A` | Verde del aceite recién hecho — foco/hover, máx. 5% |
| `--light-pool` | `#E7E3D6` | Centro del foco de la botella |
| `--danger-muted` | `#C08A6A` | Estado agotado / error (sin rojo chillón) |
- Radios: `--radius-none: 0` por defecto; `--radius-pill: 999px` solo botones. Sin sombras (`box-shadow` prohibido salvo `--focus-ring`).
- `--focus-ring: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent-oil)`.
- Grano: overlay SVG `feTurbulence` al 6% sobre vídeos para unificar metraje de móvil.

## 3. Typography & Spacing
- **Display**: `Cormorant Garamond` 400/500 + itálica (eco de la serif de la etiqueta). Tracking −0.01em, interlineado 0.95–1.05.
- **Texto/UI**: `Sora Variable` 300–500 (eco del logotipo geométrico). 16–18px, interlineado 1.6, medida 60ch.
- **Datos**: `IBM Plex Mono` 400/500, `font-variant-numeric: tabular-nums`, versalitas simuladas con `letter-spacing: 0.12em` + uppercase a 11–12px.
- Escala fluida: `--step--1 .8125rem` · `--step-0 1rem` · `--step-1 1.25rem` · `--step-2 clamp(1.75rem,3vw,2.5rem)` · `--step-3 clamp(2.5rem,6vw,4.75rem)` · `--step-4 clamp(3.5rem,11vw,9.5rem)`.
- Espaciado base 8px: `--space-1 4px` · `--space-2 8px` · `--space-3 16px` · `--space-4 24px` · `--space-5 40px` · `--space-6 64px` · `--space-7 104px` · `--space-8 168px`. Capítulos separados por `--space-8`.
- Rejilla 12 col, gutter `--space-4`, margen lateral `clamp(20px,5vw,72px)`; `max-width: 1320px`.

## 4. Component & Anti-Slop Rules
1. Prohibido: gradientes morados/cian, hero centrado + 3 tarjetas con iconos, glassmorphism, sombras difusas, emojis, iconos genéricos de stock, tarjetas con `border-radius` grande.
2. Prohibidos los clichés de copy: «familia humilde», «con todo nuestro cariño», «pasión», «tradición milenaria». Hablan los datos.
3. Solo tokens: ningún hex ni px suelto en componentes; todo vía `var(--*)` de `src/styles/tokens.css`.
4. Compra = filas editoriales tipo carta (formato · contenido · litros · precio en mono), no tarjetas SaaS. CTA píldora hueso sobre negro; hover invierte a `--accent-oil` en 180ms.
5. Estados obligatorios: secuencia de botella (`loading` póster con geometría final · `error` foto fija · `ready`), compra (`populated` · `sold_out` por formato · `empty`/todo agotado → contacto · `unconfigured` sin enlace Stripe → pedido por WhatsApp).
6. Movimiento: transiciones 150–220ms `cubic-bezier(.2,.7,.2,1)`; scrub con interpolación suave (lerp), sin saltos de fotograma; `prefers-reduced-motion` → botella fija de frente, vídeos en pausa con póster.
7. Vídeo de campo y almazara: siempre `muted playsinline`, recortados y graduados (sin el recogedor verde), con pie en mono y timecode real.
8. Accesibilidad: `h1` único, `h2` por capítulo, contraste AA, `:focus-visible` con `--focus-ring`, canvas con `role="img"` + `aria-label`.
9. Sin overflow horizontal a 375px y 1280px (`scrollWidth <= clientWidth`), verificado con Playwright (`ariaSnapshot`).
