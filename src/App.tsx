import { CONTACT, SALE_FORMATS } from './config/site';
import { BottleChapter } from './sections/BottleChapter';
import { FieldChapter } from './sections/FieldChapter';
import { MillChapter } from './sections/MillChapter';
import { PurchaseSection } from './sections/PurchaseSection';
import { SiteFooter, SiteHeader } from './sections/SiteChrome';
import { SpecSheetChapter } from './sections/SpecSheetChapter';

export function App() {
  return (
    <>
      <a className="skip-link" href="#comprar">
        Ir a comprar
      </a>
      <SiteHeader />
      <main>
        <BottleChapter />
        <FieldChapter />
        <MillChapter />
        <SpecSheetChapter />
        <PurchaseSection formats={SALE_FORMATS} contact={CONTACT} />
      </main>
      <SiteFooter contact={CONTACT} />
    </>
  );
}
