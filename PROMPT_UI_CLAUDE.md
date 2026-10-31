# Contexto y Brief de UI para `aceite-negro` (Worktree Paralelo `claude-ui` — Puerto `5174`)

> **⚠️ REGLA CRÍTICA DE AISLAMIENTO EN PARALELO (LEER ANTES DE EMPEZAR):**
> 1. **Directorio de trabajo obligatorio (`Worktree`):** Otro agente está trabajando simultáneamente en el directorio raíz `/home/carlos/aceite-negro` (rama `argon-ui`, puerto `5173`). **TÚ DEBES TRABAJAR EXCLUSIVAMENTE DENTRO DE ESTE WORKTREE:**
>    **`/home/carlos/aceite-negro/.worktrees/claude-ui`** (rama `claude-ui`).
>    - Si el usuario ha abierto este chat desde el proyecto raíz `/home/carlos/aceite-negro`, apunta todas tus herramientas (`read_file`, `write_file`, `edit_file`, `run_command` y `compass --path`) a `/home/carlos/aceite-negro/.worktrees/claude-ui/...` y **NUNCA modifiques archivos fuera de `.worktrees/claude-ui/`**.
>    - Si el usuario ha abierto directamente `/home/carlos/aceite-negro/.worktrees/claude-ui` como workspace, ese ya es tu directorio raíz.
> 2. **Puerto exclusivo obligatorio (`5174`):** Configura desde el inicio Vite (`vite.config.ts` con `server: { port: 5174, strictPort: true }` y `preview: { port: 5174 }`), `package.json` y Playwright (`playwright.config.ts` apuntando a `http://localhost:5174`) en el **puerto `5174`**, para que tu servidor (`http://localhost:5174`) pueda correr a la vez que el del otro modelo (`http://localhost:5173`) sin colisión de puertos.
> 3. **Verificación inicial de Compass:** Comprueba con `compass status --path /home/carlos/aceite-negro/.worktrees/claude-ui` que el arnés está en estado `HEALTHY` y que `Contrato UI (design.md)` figura todavía como `No requerido / Inactivo`.

---

## 1. Resumen del Contexto de Negocio y Arquitectura Ya Acordada (No reabrir)

Ya hemos completado el onboarding de `compass-harness` (`compass init --apply`) y tomado las decisiones base de negocio y arquitectura (documentadas en `docs/brain/architecture.md` y en los ADRs `0001` y `0002` dentro de tu worktree):

1. **El Producto y Lote Real:**
   - Comercializamos una producción limitada de **1.500 litros de Aceite de Oliva Virgen Extra (AOVE) de cosecha temprana (Octubre 2026)**, envasados en **3.000 botellas de 0,5 L (500 ml)** bajo la marca **«Aceite Negro Picudo»** (variedades *Picudo y Carrasqueño*).
   - Buena parte de estos 1.500 L se va a vender en persona a conocidos y gente cercana fuera de internet.
   - En la web **NO quiero un contador público de stock**, únicamente que cuando no haya stock disponible no se puedan hacer pedidos.

2. **Arquitectura Elegida: Opción A (100% Frontend Estático + Stripe Payment Links, Zero-Backend):**
   - No vamos a construir backend ni base de datos propia en esta fase.
   - Construiremos únicamente el **Frontend (`React + TypeScript + Vite`)** pensado para desplegarse gratis en **Cloudflare Pages**.
   - La compra online se hará mediante botones de formatos cerrados (packs/cajas de botellas) que redirigen a **Stripe Payment Links** (donde Stripe controla el límite máximo de pagos para bloquear compras si se agota el cupo asignado a la web).
   - La distribución complementaria futura en otras plataformas (Correos Market, Mentta, Faire, tiendas gourmet como Adeoliva o Amazon FBM por cupos independientes) ya ha quedado documentada en `docs/brain/decisions/0002-multichannel-distribution-and-stock-pools.md`.

---

## 2. Lo que quiero que hagas ahora: Diseño de la UI, `DESIGN.md` y Especificación (`spec.md`)

Vamos a iniciar el desarrollo de la landing page desde cero para nuestra marca de Aceite de Oliva dentro del harness, partiendo de tu propia perspectiva creativa y de diseño.

### A. Contexto de Producto y Activos Disponibles en `docs/resources/`
Inspecciona visualmente estos archivos reales que tienes en `/home/carlos/aceite-negro/.worktrees/claude-ui/docs/resources/`:

* **Activo de Animación (*Signature Move*):**
  - `docs/resources/aceite-negro-video.mp4` — Vídeo 360° nítido de la botella de aceite girando sobre su propio eje (generado con IA a partir de una foto por delante y otra por detrás de la botella real sobre fondo claro de estudio).
* **Activos de Marca y Etiqueta:**
  - `docs/resources/foto-logo.jpeg` — Imagen del logo oficial.
  - `docs/resources/foto-etiqueta.jpeg` — Etiqueta completa con todos los datos reales del aceite (variedades, cosecha temprana octubre 2026, tabla nutricional, registro sanitario, lote, productor, 500 ml).
* **Fotos de la Botella en Estático:**
  - `docs/resources/foto-botella-gemini-delante.jpeg` — Foto de la botella por delante con fondo claro limpio.
  - `docs/resources/foto-botella-delante-sin-editar.jpeg` — Foto original sin editar.
* **Vídeos y Fotos Caseros del Campo y de la Cooperativa (a valorar cómo integrarlos):**
  - `docs/resources/Aceite-liquido.mp4` — Vídeo grabado con el móvil donde se ve el aceite recién hecho cayendo en la cooperativa de mi padre. Al estar grabado con móvil sin enfocar del todo y verse arriba un recogedor verde tiene difícil encaje si se pone en bruto, **pero tiene partes muy aprovechables (especialmente entre los segundos `00:05.5–00:08.0` y `00:14.5–00:17.5`) donde la cámara enfoca hacia abajo y se ve el chorro de aceite verde cayendo y haciendo ondas en la cubeta**.
  - `docs/resources/foto-olivos.jpeg`, `docs/resources/video-trabajo-campo-olivos.mp4` y `docs/resources/video-trabajo-campo-olivos-2.mp4` — Fotos y vídeos grabados con el móvil de los trabajadores en el campo vareando los olivos y las aceitunas sobre los fardos.

---

### B. Directiva de Estilo, Balance Artesanal y Definición de `DESIGN.md` (Sublimación Visual)

1. **Sublimación a partir del Logo y la Botella:**
   - Toma el logo (`foto-logo.jpeg`) y la etiqueta (`foto-etiqueta.jpeg`) como punto de partida para identificar la identidad de la marca (colores base, símbolos, carácter), pero **no repliques un estilo visual básico o plano**.
   - Eleva el diseño hacia una estética **editorial, artesanal y de alta gama (*premium feel*)**.
   - En el vídeo 3D de la botella (`aceite-negro-video.mp4`), busca que la botella se integre de forma limpia y orgánica con el fondo de la página (evitando meter el vídeo dentro de una "vitrina" o recuadro pegado artificial).

2. **El Balance Clave que Busco en la Web (Elegancia + Producto Familiar de Particulares):**
   - Quiero conseguir un balance en la página entre **la elegancia, los tonos de la etiqueta y el vídeo 3D de la botella**, y a la vez **esa imagen cercana y casera de lo que es este humilde producto hecho por particulares: una familia y 3 trabajadores en el campo y la cooperativa de mi padre**.
   - **Restricción crítica de tono:** **NO quiero eslóganes baratos apelando a la sentimentalidad** de que *"somos una familia humilde"*, ni frases lacrimógenas o clichés publicitarios. Quiero conseguir esa mezcla de alta gama y verdad casera **a través de la propia UI, la composición, la forma de presentar los datos reales y el encaje visual de los recursos**.

3. **Construcción del Contrato de Diseño (`docs/brain/design.md` / `DESIGN.md`):**
   - Siguiendo la skill `.compass/skills/ui-design/SKILL.md` (máximo 80 líneas para pasar `compass check`), define desde tu propia perspectiva:
     - Paleta de colores refinada (tonos orgánicos, olivas, dorados sutiles y neutros cálidos derivados del logo y del vídeo).
     - Tipografía editorial elegante con jerarquía visual cuidada.
     - Espaciados amplios y microinteracciones suaves (estilo Apple/Stripe).
     - Directivas explícitas **Anti-Slop** (evitar sombras pesadas genéricas o layouts SaaS estándar).

---

### C. Activación del Enfoque `ScrollCraft` (Experiencia Guiada por Scroll)

* Estructura la landing page como una experiencia interactiva guiada por el scroll.
* **Signature Move:** Vincula la secuencia de fotogramas del vídeo 360° de la botella (`docs/resources/aceite-negro-video.mp4`) al porcentaje de desplazamiento de la página (`scrollTop` / *video frame scrub*), logrando que la botella gire fluidamente conforme el usuario desplaza la pantalla.
* Define la **jornada de lectura del usuario (*Scroll Journey*)**, los titulares clave y las secciones de la página (incluyendo la sección final de compra por packs/cajas con enlaces preparados para Stripe Payment Links y opción de contacto directo para pedidos de conocidos/locales/B2B).

---

### D. Verificación Autónoma de Calidad ("Agent Eyes")

* Antes de dar cualquier componente o la landing por completada durante la implementación, deberás ejecutar la suite de inspección con Playwright (`ariaSnapshot` y chequeo de viewport responsive a `375px` en mobile y `1280px` en desktop) sobre el servidor en el **puerto `5174`**.
* Deberás inspeccionar que la animación de la botella no desborde el ancho del documento (`scrollWidth <= clientWidth`) ni genere saltos bruscos al hacer scroll.

---

## 3. Cómo quiero que procedas desde aquí

1. Analiza por tu cuenta los activos de `docs/resources/` dentro de `/home/carlos/aceite-negro/.worktrees/claude-ui` y plantéame tu enfoque de diseño (o hazme las preguntas puntuales que necesites para cerrar el *Scroll Journey* y los formatos de venta).
2. Genera tu `docs/brain/design.md` dentro de `/home/carlos/aceite-negro/.worktrees/claude-ui` (y enlázalo en su `docs/brain/index.md` verificando con `compass check --path /home/carlos/aceite-negro/.worktrees/claude-ui`).
3. Abre el flujo SDD en `specs/` (`spec.md` → `plan.md` → `tasks.md`), impleméntalo en tu worktree (`claude-ui`) y deja el servidor levantado en `http://localhost:5174` para poder compararlo en vivo con el puerto `5173`.
