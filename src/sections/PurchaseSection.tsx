import type { ReactNode } from 'react';
import {
  catalogState,
  formatEuros,
  formatLiters,
  resolvePurchase,
  totalLiters,
  totalPriceCents,
  type SaleFormat,
} from '../domain/catalog';
import { buildMailtoUrl, buildWhatsAppUrl } from '../domain/contact';
import './PurchaseSection.css';

export interface Contact {
  whatsapp: string;
  email: string;
}

interface Props {
  formats: readonly SaleFormat[];
  contact: Contact;
}

const BRAND = 'Aceite Negro Picudo';

function FormatCta({ format, contact }: { format: SaleFormat; contact: Contact }): ReactNode {
  const state = resolvePurchase(format);
  const label = format.name.toLowerCase();

  if (state.kind === 'buyable') {
    return (
      <a className="btn" href={state.href} aria-label={`Comprar ${label}`}>
        Comprar <span className="arrow" aria-hidden="true">→</span>
      </a>
    );
  }

  if (state.kind === 'sold_out') {
    return (
      <button type="button" className="btn" disabled aria-label={`${format.name} agotada`}>
        Agotada
      </button>
    );
  }

  const text = `Hola, quería pedir una ${label} de ${BRAND} (${format.bottles} × ${format.bottleMl} ml).`;
  return (
    <a
      className="btn btn--ghost"
      href={buildWhatsAppUrl(contact.whatsapp, text)}
      aria-label={`Pedir ${label} por WhatsApp`}
    >
      Pedir por WhatsApp <span className="arrow" aria-hidden="true">→</span>
    </a>
  );
}

function FormatRow({ format, index, contact }: { format: SaleFormat; index: number; contact: Contact }) {
  const soldOut = format.availability === 'sold_out';
  return (
    <li className="format-row" data-state={soldOut ? 'sold_out' : 'available'}>
      <div className="format-name">
        <span className="format-index mono" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="display">{format.name}</h3>
      </div>
      <p className="format-spec mono">
        {`${format.bottles} × ${format.bottleMl} ml · ${formatLiters(totalLiters(format))}`}
      </p>
      <p className="format-unit mono">{`${formatEuros(format.unitPriceCents)} / botella`}</p>
      <p className="format-price display">{formatEuros(totalPriceCents(format))}</p>
      <div className="format-cta">
        <FormatCta format={format} contact={contact} />
      </div>
    </li>
  );
}

function DirectOrders({ contact }: { contact: Contact }) {
  const wa = (text: string) => buildWhatsAppUrl(contact.whatsapp, text);
  return (
    <section className="direct" aria-labelledby="directo-title">
      <div className="direct-head">
        <p className="eyebrow">Fuera de la web</p>
        <h3 id="directo-title" className="display">
          Pedidos directos
        </h3>
      </div>

      <div className="direct-col">
        <h4>Conocidos y pedidos en mano</h4>
        <p>Para encargos entre conocidos o recogida en mano, sin pasar por el pago online.</p>
        <div className="direct-links">
          <a
            className="link-line"
            href={wa(`Hola, quería encargar ${BRAND}.`)}
            aria-label="WhatsApp para pedidos en mano"
          >
            WhatsApp <span className="arrow" aria-hidden="true">→</span>
          </a>
          <a
            className="link-line"
            href={buildMailtoUrl(contact.email, `Encargo ${BRAND}`)}
            aria-label="Escribir un correo para pedidos en mano"
          >
            Correo <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="direct-col">
        <h4>Tiendas, restaurantes y eventos</h4>
        <p>Venta por cajas completas a establecimientos. Pide condiciones y disponibilidad del lote.</p>
        <div className="direct-links">
          <a
            className="link-line"
            href={wa(`Hola, escribo de un establecimiento y me interesa ${BRAND} por cajas.`)}
            aria-label="WhatsApp para establecimientos"
          >
            WhatsApp <span className="arrow" aria-hidden="true">→</span>
          </a>
          <a
            className="link-line"
            href={buildMailtoUrl(contact.email, `Pedido profesional ${BRAND}`)}
            aria-label="Escribir un correo para establecimientos"
          >
            Correo <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function PurchaseSection({ formats, contact }: Props) {
  const state = catalogState(formats);

  return (
    <section id="comprar" className="chapter purchase" aria-labelledby="comprar-title">
      <div className="container">
        <header className="chapter-head purchase-head">
          <p className="eyebrow">
            <b>05</b> — Comprar
          </p>
          <h2 id="comprar-title" className="display">
            Por <em>cajas</em>.
          </h2>
          <p className="lede">
            Botellas de 500 ml en cajas cerradas, para que el envío del vidrio compense.{' '}
            <strong>Pago con tarjeta a través de Stripe.</strong>
          </p>
        </header>

        {state !== 'empty' && (
          <ol className="formats" aria-label="Formatos de venta">
            {formats.map((f, i) => (
              <FormatRow key={f.id} format={f} index={i} contact={contact} />
            ))}
          </ol>
        )}

        {state === 'all_sold_out' && (
          <p className="purchase-notice" role="status">
            No quedan cajas disponibles en la web. Parte del lote se reparte fuera de internet: escríbenos.
          </p>
        )}
        {state === 'empty' && (
          <p className="purchase-notice" role="status">
            Los formatos de venta online se publicarán en breve. Mientras tanto, pide directamente.
          </p>
        )}

        <DirectOrders contact={contact} />
      </div>
    </section>
  );
}
