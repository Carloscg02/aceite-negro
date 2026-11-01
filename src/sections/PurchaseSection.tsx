import {
  catalogState,
  formatEuros,
  formatLiters,
  totalLiters,
  totalPriceCents,
  type SaleFormat,
} from '../domain/catalog';
import { buildWhatsAppUrl } from '../domain/contact';
import './PurchaseSection.css';

export interface Contact {
  whatsapp: string;
}

interface Props {
  formats: readonly SaleFormat[];
  contact: Contact;
}

const BRAND = 'Aceite Negro Picudo';

function WhatsAppIcon() {
  return (
    <svg
      className="whatsapp-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.82 14.01c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.83-.11-.42-.13-.97-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.4-.15-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2.01.89 2.15.07.15.12.31.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.3-.13.59.17.29.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.35 1.45.29.15.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.65-.15.27.1 1.7.8 1.99.94.29.15.48.22.56.34.07.12.07.7-.17 1.38z" />
    </svg>
  );
}

function formatSpec(format: SaleFormat): string {
  if (format.bottles === 1) {
    return `${format.bottleMl}\u00a0ml`;
  }
  return `${format.bottles} × ${format.bottleMl}\u00a0ml · ${formatLiters(totalLiters(format))}`;
}

function FormatRow({ format, index }: { format: SaleFormat; index: number }) {
  const soldOut = format.availability === 'sold_out';
  return (
    <li className="format-row" data-state={soldOut ? 'sold_out' : 'available'}>
      <div className="format-name">
        <span className="format-index mono" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="display">{format.name}</h3>
      </div>
      <p className="format-spec mono">{formatSpec(format)}</p>
      <div className="format-price-wrap">
        <p className="format-price display">{formatEuros(totalPriceCents(format))}</p>
        {soldOut && <span className="format-soldout mono">Agotada</span>}
      </div>
    </li>
  );
}

export function PurchaseSection({ formats, contact }: Props) {
  const state = catalogState(formats);
  const waHref = buildWhatsAppUrl(
    contact.whatsapp,
    `Hola, quería encargar ${BRAND}.`,
  );

  return (
    <section id="comprar" className="chapter purchase" aria-labelledby="comprar-title">
      <div className="container">
        <header className="chapter-head purchase-head">
          <p className="eyebrow">
            <b>03</b> — Comprar
          </p>
          <h2 id="comprar-title" className="display">
            En origen, por <em>botellas</em>.
          </h2>
          <p className="lede purchase-lede">
            Esta cosecha{' '}
            <strong className="purchase-highlight">
              se vende de forma presencial en la provincia de Jaén
            </strong>
            , por botellas sueltas o por cajas.{' '}
            <strong className="purchase-cta-note">Escríbenos por WhatsApp</strong> para reservar y acordar la
            entrega en mano.
          </p>
        </header>

        <div className="purchase-grid">
          <div className="purchase-formats">
            {state !== 'empty' && (
              <ol className="formats" aria-label="Formatos de venta">
                {formats.map((f, i) => (
                  <FormatRow key={f.id} format={f} index={i} />
                ))}
              </ol>
            )}

            {state === 'all_sold_out' && (
              <p className="purchase-notice" role="status">
                No quedan botellas disponibles de esta cosecha. Escríbenos por WhatsApp para consultar reservas.
              </p>
            )}
            {state === 'empty' && (
              <p className="purchase-notice" role="status">
                Consulta disponibilidad directamente por WhatsApp.
              </p>
            )}
          </div>

          <aside className="purchase-direct" aria-labelledby="encargo-directo-title">
            <p className="eyebrow">Trato directo · Jaén</p>
            <h3 id="encargo-directo-title" className="display purchase-direct-title">
              Reserva y entrega en mano en Jaén
            </h3>
            <p className="purchase-direct-copy">
              Indícanos cuántas botellas (cristal o PET) quieres encargar, o si escribes de parte de una tienda,
              restaurante o evento.
            </p>
            <div className="purchase-cta-group">
              <a
                className="btn btn--whatsapp"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                <span>Encargar por WhatsApp</span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <p className="whatsapp-notice mono">
                <span className="whatsapp-phone">{contact.whatsapp}</span>
                <span className="whatsapp-only">
                  Atendemos únicamente por mensaje de WhatsApp.
                </span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
