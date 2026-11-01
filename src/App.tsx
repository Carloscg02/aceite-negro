import { CONTACT, SALE_FORMATS } from './config/site';
import { LOT_CODE, PRODUCER } from './config/label';
import { BottleChapter } from './sections/BottleChapter';
import { PurchaseSection } from './sections/PurchaseSection';
import { SiteFooter, SiteHeader } from './sections/SiteChrome';
import { TraceabilityChapter } from './sections/TraceabilityChapter';

export function App() {
  return (
    <>
      <a className="skip-link" href="#comprar">
        Ir a comprar
      </a>
      <SiteHeader />
      <main>
        <BottleChapter />
        <TraceabilityChapter lotCode={LOT_CODE} producer={PRODUCER.person} />
        <PurchaseSection formats={SALE_FORMATS} contact={CONTACT} />
      </main>
      <SiteFooter contact={CONTACT} />
    </>
  );
}
