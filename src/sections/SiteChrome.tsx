import { buildMailtoUrl } from '../domain/contact';
import type { Contact } from './PurchaseSection';
import './SiteChrome.css';

const NAV = [
  ['#campo', 'Campo'],
  ['#almazara', 'Almazara'],
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
              <dd>Juan Carlos Cano Carrillo y otro C.B</dd>
              <dd className="mono">E23312572</dd>
            </div>
            <div>
              <dt className="eyebrow">Registro sanitario</dt>
              <dd className="mono">N.RGSEAA 40.044510/J</dd>
            </div>
            <div>
              <dt className="eyebrow">Lote</dt>
              <dd className="mono">JCCC141026</dd>
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
        <p className="footer-base mono">© 2026 Aceite Negro Picudo · Cosecha temprana · Octubre 2026</p>
      </div>
    </footer>
  );
}
