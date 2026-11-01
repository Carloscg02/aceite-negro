import { useEffect, useRef } from 'react';
import { LABEL_ROWS, LOT_CODE, NUTRITION, PRODUCER } from '../config/label';
import { buildMailtoUrl } from '../domain/contact';
import type { Contact } from './PurchaseSection';
import './SiteChrome.css';

const NAV = [
  ['#trazabilidad', 'Trazabilidad'],
  ['#ficha', 'Ficha'],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <a className="wordmark" href="#botella" aria-label="Aceite Negro Picudo — inicio">
          Aceite Negro <em>Picudo</em>
        </a>
        <nav aria-label="Capítulos">
          <ul className="site-nav">
            {NAV.map(([href, label]) => (
              <li key={href} className="site-nav-link">
                <a href={href}>{label}</a>
              </li>
            ))}
            <li>
              <a className="btn btn--small" href="#comprar">
                Comprar
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

/** Despliega la ficha cuando cualquier enlace apunta a `#ficha` (o se llega con ese hash). */
function useOpenOnLink(ref: { current: HTMLDetailsElement | null }) {
  useEffect(() => {
    const open = () => {
      if (ref.current) ref.current.open = true;
    };
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('a[href="#ficha"]')) open();
    };
    const onHash = () => {
      if (window.location.hash === '#ficha') open();
    };
    onHash();
    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', onHash);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', onHash);
    };
  }, [ref]);
}

function SpecSheet() {
  const ref = useRef<HTMLDetailsElement | null>(null);
  useOpenOnLink(ref);
  return (
    <details id="ficha" ref={ref} className="ficha">
      <summary className="ficha-summary">
        <span className="eyebrow">Ficha completa</span>
        <span className="ficha-summary-text">Etiqueta e información nutricional</span>
        <span className="ficha-toggle" aria-hidden="true" />
      </summary>
      <div className="ficha-body">
        <dl className="ficha-label">
          {LABEL_ROWS.map(([k, v]) => (
            <div key={k} className="ficha-row">
              <dt className="eyebrow">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="ficha-nutrition">
          <table>
            <caption>
              <span className="ficha-caption">
                <span className="eyebrow">Información nutricional</span>
                <span className="eyebrow">{'por 100\u00a0g'}</span>
              </span>
            </caption>
            <tbody>
              {NUTRITION.map((row) => (
                <tr key={row.k} className={row.sub ? 'is-sub' : undefined}>
                  <th scope="row">{row.k}</th>
                  <td className="mono">{row.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="ficha-note mono">*VRN: valores de referencia de nutrientes.</p>
        </div>
      </div>
    </details>
  );
}

export function SiteFooter({ contact }: { contact: Contact }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="double-rule" aria-hidden="true" />
        <div className="footer-grid">
          <img
            className="footer-logo"
            src="/media/logo.jpg"
            width={480}
            height={542}
            loading="lazy"
            alt="Logotipo de Aceite Negro Picudo: cosecha temprana octubre 2026, aceite de oliva virgen extra"
          />
          <dl className="footer-legal">
            <div>
              <dt className="eyebrow">Productor</dt>
              <dd>{PRODUCER.legalName}</dd>
              <dd className="mono">{PRODUCER.taxId}</dd>
            </div>
            <div>
              <dt className="eyebrow">Registro sanitario</dt>
              <dd className="mono">{PRODUCER.sanitaryRegistry}</dd>
            </div>
            <div>
              <dt className="eyebrow">Lote</dt>
              <dd className="mono">{LOT_CODE}</dd>
              <dd>Producto de España</dd>
            </div>
            <div>
              <dt className="eyebrow">Contacto</dt>
              <dd>
                <a href={buildMailtoUrl(contact.email, 'Aceite Negro Picudo')}>{contact.email}</a>
              </dd>
            </div>
          </dl>
        </div>
        <SpecSheet />
        <p className="footer-base mono">© 2026 Aceite Negro Picudo · Cosecha temprana · Octubre 2026</p>
      </div>
    </footer>
  );
}
