# Plan 001 — Landing ScrollCraft

## 1. Architecture Alignment
Capas de `docs/brain/architecture.md`:
- **Presentación** `src/sections/` (capítulos) + `src/components/` (BottleSequence, AmbientVideo, DoubleRule, Grain). Solo tokens de `src/styles/tokens.css` (espejo de `design.md`).
- **Dominio** `src/domain/catalog.ts`, `src/domain/contact.ts` — puros, sin DOM.
- **Lib** `src/lib/scrub.ts` — matemática de scroll pura; `src/hooks/useScrollProgress.ts` y `useReducedMotion.ts` como adaptadores DOM finos.
- **Config** `src/config/site.ts` — formatos, precio unitario, contacto, enlaces Stripe desde `import.meta.env`.
- **Activos** `scripts/build-media.mjs` (ffmpeg-static) genera `public/media/`: 120 fotogramas WebP recortados y nivelados (blanco de estudio → 255 para multiply), clips `almazara.mp4` (tramos 5.5–8.0 s y 14.5–17.5 s, recortados sin recogedor, ralentizados ×0.5) y `campo.mp4`, pósters JPG y fotos optimizadas. Los activos generados se versionan.

## 2. ADR Gate
`decisions/index.md`: ADR 0001 (estático + Stripe Payment Links) y 0002 (cupos) se respetan. No se introduce backend ni estado servidor. Sin ADR nuevo: canvas + frames es detalle de presentación.

## 3. UI / Frontend Gate
`design.md` activo. `E2E / Browser UI Tests` = `npx playwright test` ya declarado → Tarea 1 incluye bootstrap real de Playwright (chromium, `baseURL http://localhost:5174`, `webServer` en 5174 con `reuseExistingServer`).

## 4. Interfaces (contratos de seams)
```ts
// src/lib/scrub.ts
clamp(v: number, min: number, max: number): number
scrollProgress(rectTop: number, sectionHeight: number, viewportHeight: number): number // 0..1
frameIndexForProgress(progress: number, frameCount: number): number               // 0..frameCount-1
lerp(from: number, to: number, t: number): number
interface Annotation { id: string; from: number; to: number }
activeAnnotation(progress: number, list: Annotation[]): string | null
// src/domain/catalog.ts
type Availability = 'available' | 'sold_out'
interface SaleFormat { id: string; name: string; bottles: number; bottleMl: number;
  unitPriceCents: number; paymentLink: string | null; availability: Availability }
totalLiters(f): number; totalPriceCents(f): number; formatEuros(cents): string; formatLiters(l): string
type PurchaseState = { kind: 'buyable'; href: string } | { kind: 'sold_out' } | { kind: 'unconfigured' }
resolvePurchase(f): PurchaseState
catalogState(list): 'empty' | 'all_sold_out' | 'populated'
// src/domain/contact.ts
buildWhatsAppUrl(phone: string, text: string): string
buildMailtoUrl(email: string, subject: string, body?: string): string
```

## 5. Seams bajo Prueba (Vitest + Testing Library / Playwright)
| Seam | Detecta | No detecta |
|---|---|---|
| `scrub.ts` | mapeo progreso→fotograma, bordes, NaN | fluidez real de pintado |
| `catalog.ts`/`contact.ts` | precios, litros, estados de compra, URLs | aspecto visual |
| `<PurchaseSection>` | 4 estados y CTAs accesibles | estética |
| `<BottleSequence status>` | estados loading/error/ready/reduced | decodificación real de WebP |
| Playwright `ui-health` | aria tree, overflow 375/1280, consola, scrub sin saltos | gusto estético (revisión humana) |

Mocks solo en fronteras: `matchMedia`, `IntersectionObserver` y `HTMLCanvasElement.getContext` en jsdom.

## 6. Verificación
`npm test` (vitest run) · `npm run lint` (eslint + `tsc --noEmit`) · `npx playwright test` · `compass check --path .`
