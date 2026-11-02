# Arquitectura de `aceite-negro`

## 1. Estilo Arquitectonico
Arquitectura en Capas (Layered Architecture — Frontend D2C Zero-Backend):
- **Capa de Presentacion (`src/components/`, `src/sections/`)**: Interfaz visual de marca, narrativa editorial y animaciones en React + TypeScript + Vite. Consume exclusivamente tokens semanticos de `docs/brain/design.md` y respeta `prefers-reduced-motion`.
- **Capa de Dominio de Catalogo y Conversion (`src/domain/`)**: Logica pura y tipada de formatos de venta (botellas de 500 ml cristal / PET, litros, calculo de precios y estados de compra). Sin dependencias de DOM para testeo rapido.
- **Capa de Configuracion y Enlaces Externos (`src/config/`)**: Enlace directo a WhatsApp del productor (`+34 670 94 14 88`), formatos públicos y soporte latente para Stripe Payment Links (`VITE_STRIPE_LINK_*`).
- **Infraestructura de Despliegue**: Alojamiento estatico 100% gratuito en **Cloudflare Pages** (CDN global + SSL automatico). Ver [ADR 0001](decisions/0001-initial-architecture.md) y [ADR 0003](decisions/0003-v1-direct-sales-whatsapp-and-future-gateway-roadmap.md) para la hoja de ruta opcional con pasarela de cobro o micro-backend.

---

## 2. Infraestructura y Operaciones (Producción)

### Topología Activa (v1)
```
[ Usuario / Navegador ]
          │ (HTTPS)
          ▼
┌────────────────────────────────────────────────────────┐
│ Cloudflare (Edge Network & DNS autoritativo gratuito)  │
│  - Dominio: aceitenegropicudo.es                       │
│  - Certificado SSL universal automático                │
│  - Protección anti-DDoS y caché perimetral             │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Cloudflare Pages (Hosting estático serverless gratuito) │
│  - Proyecto: aceite-negro                              │
│  - Repositorio: Carloscg02/aceite-negro (rama: main)   │
│  - Build command: npm run build                        │
│  - Output directory: dist                              │
│  - Node.js runtime: NODE_VERSION = 20                  │
│  - URL interna: https://aceite-negro.pages.dev        │
└────────────────────────────────────────────────────────┘
```

### Inventario de Servicios y Proveedores
| Componente | Proveedor | Cuenta / Entorno | Coste |
|---|---|---|---|
| **Registro de Dominio `.es`** | [DonDominio](https://www.dondominio.com/) | `aceitenegropicudo.es` (renovación anual) | ~8,50 € / año |
| **DNS y Seguridad** | [Cloudflare](https://dash.cloudflare.com/) | Plan Free (delegado desde DonDominio con Nameservers) | 0,00 € / mes |
| **Hosting Frontend y SSL** | [Cloudflare Pages](https://pages.cloudflare.com/) | Proyecto `aceite-negro` conectado a GitHub | 0,00 € / mes |
| **Código Fuente y CI** | GitHub | `Carloscg02/aceite-negro` | 0,00 € / mes |

### Ciclo de Despliegue (Continuous Deployment)
1. Cualquier commit o merge que entre en la rama `main` en GitHub dispara automáticamente un webhook de despliegue en Cloudflare Pages.
2. Cloudflare Pages ejecuta `npm run build` en un contenedor con Node 20 y publica los archivos generados en `dist/` a su red mundial en ~30-45 segundos.
3. El despliegue es atómico: no existe tiempo de inactividad (*zero downtime*) y permite rollback instantáneo en 1 clic desde el dashboard de Cloudflare si fuera necesario.

### Procedimientos de Mantenimiento y Contingencia
- **Renovación del dominio**: DonDominio avisa por email a Carlos con 30 días de antelación. Si la autorrenovación está activa, se renueva automáticamente.
- **Si se cambia de registrador en el futuro**: Solo es necesario transferir el dominio o apuntar los servidores DNS al nuevo proveedor; la web y el hosting en Cloudflare Pages no sufren cambios.
- **Si se cambia de hosting en el futuro (ej. Vercel, Netlify o VPS propio)**: Basta con cambiar el registro CNAME o A en la pestaña **DNS** de Cloudflare apuntando al nuevo servidor.
- **Si se añade un micro-backend o pasarela de pagos**: Consultar [ADR 0001](decisions/0001-initial-architecture.md) y [ADR 0003](decisions/0003-v1-direct-sales-whatsapp-and-future-gateway-roadmap.md).

---

## 3. Verification Commands
Comandos oficiales de verificacion ejecutados por el subagente constructor en cada ciclo:

- **Unit & Integration Tests (In-Loop TDD)**: `npm test`
  Ejecutado en cada iteracion red-green-refactor sobre los seams publicos.
- **Static / Lint Gate**: `npm run lint`
  Ejecutado como barrera de calidad estatica y tipado.
- **E2E / Browser UI Tests (Optional)**: `npx playwright test`
  Ejecutado al completar features que toquen interfaz de usuario o flujos end-to-end completos.
