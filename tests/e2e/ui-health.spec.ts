import { expect, test, type Page } from '@playwright/test';

/** Paradas del giro documentadas en src/config/bottle.ts (centro de meseta → fotograma → texto). */
const STOPS = [
  { at: 0.01, frame: 0, text: 'Aceite Negro Picudo' },
  { at: 0.37, frame: 50, text: 'Variedades' },
  { at: 0.65, frame: 83, text: 'Contraetiqueta' },
  { at: 0.985, frame: 119, text: 'Formato' },
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
  });
  return errors;
}

const overflowOf = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

async function bottleGeometry(page: Page) {
  return page.evaluate(() => {
    const el = document.getElementById('botella')!;
    return { top: el.offsetTop, scrollable: el.offsetHeight - window.innerHeight };
  });
}

test.describe('Agent Eyes — UI Health & ScrollCraft (Puerto 5174)', () => {
  test('Desktop (1280x800): h1 único (botella) y un h2 en trazabilidad y compra, sin errores ni overflow', async ({
    page,
  }) => {
    const errors = collectErrors(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });

    const snapshot = await page.locator('body').ariaSnapshot();
    expect(snapshot).toContain('heading "Aceite Negro Picudo" [level=1]');
    expect(snapshot).toContain('heading "El lote es la fecha." [level=2]');
    expect(snapshot).toContain('heading "Por cajas." [level=2]');
    expect(snapshot).toContain('Caja de 6');
    expect(snapshot).toContain('Caja de 12');

    await expect(page.locator('#botella h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('#trazabilidad h2')).toHaveCount(1);
    await expect(page.locator('#comprar > .container > header h2')).toHaveCount(1);
    await expect(page.locator('main h2')).toHaveCount(2);

    // Pies de figura documentales compuestos en mono (CA-5).
    const captionFonts = await page
      .locator('#trazabilidad figcaption')
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).fontFamily));
    expect(captionFonts).toHaveLength(2);
    for (const font of captionFonts) expect(font).toContain('IBM Plex Mono');

    expect(await overflowOf(page)).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });

  test('Mobile (375x812): cero desbordamiento horizontal en cada movimiento y en la ficha abierta', async ({
    page,
  }) => {
    const errors = collectErrors(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'networkidle' });

    for (const id of ['botella', 'trazabilidad', 'comprar']) {
      await page.evaluate((sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'instant' });
      }, id);
      await page.waitForTimeout(120);
      expect(await overflowOf(page), `Overflow horizontal en móvil en #${id}`).toBeLessThanOrEqual(0);
    }

    await page.locator('#ficha summary').click();
    await expect(page.locator('#ficha')).toHaveAttribute('open', '');
    // Con la ficha abierta también en los anchos Android más estrechos habituales.
    for (const width of [375, 360, 320]) {
      await page.setViewportSize({ width, height: 812 });
      await page.waitForTimeout(80);
      expect(await overflowOf(page), `Overflow horizontal con la ficha abierta a ${width}px`).toBeLessThanOrEqual(0);
    }
    expect(errors).toEqual([]);
  });

  test('Signature Move: el giro avanza sin saltos y se detiene en cada parada con su anotación', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('#botella figure.bottle')).toHaveAttribute('data-status', 'ready', { timeout: 15_000 });
    const canvas = page.locator('#botella canvas.bottle-media');
    await expect(canvas).toBeVisible();

    const geometry = await bottleGeometry(page);
    expect(geometry.scrollable).toBeGreaterThan(500);

    // Pasos del 5 %: monótono y nunca más de 12 fotogramas por paso.
    let previousFrame = 0;
    const observed: number[] = [];
    for (let step = 0; step <= 20; step++) {
      await page.evaluate((y) => window.scrollTo(0, y), geometry.top + (step / 20) * geometry.scrollable);
      await page.waitForTimeout(260);
      const frame = Number((await canvas.getAttribute('data-frame')) ?? '0');
      expect(frame - previousFrame, `Retroceso en paso ${step}`).toBeGreaterThanOrEqual(0);
      expect(frame - previousFrame, `Salto brusco (>12 fotogramas) en paso ${step}`).toBeLessThanOrEqual(12);
      expect(await overflowOf(page)).toBeLessThanOrEqual(0);
      observed.push(frame);
      previousFrame = frame;
    }
    expect(observed[0]).toBe(0);
    expect(observed[observed.length - 1]).toBe(119);

    // Cada parada: la botella se asienta en su fotograma y se muestra su anotación.
    for (const stop of STOPS) {
      await page.evaluate((y) => window.scrollTo(0, y), geometry.top + stop.at * geometry.scrollable);
      await expect
        .poll(async () => Math.abs(Number(await canvas.getAttribute('data-frame')) - stop.frame), {
          message: `fotograma en la parada ${stop.text}`,
        })
        .toBeLessThanOrEqual(1);
      await expect(page.locator('#botella .annotation[data-active="true"]')).toContainText(stop.text);
    }
  });

  test('El bucle del aceite se reproduce silenciado y en bucle al entrar en pantalla', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });

    const video = page.locator('#trazabilidad video');
    await video.scrollIntoViewIfNeeded();
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0.3), { timeout: 10_000 })
      .toBe(true);
    expect(await video.evaluate((v: HTMLVideoElement) => v.muted && v.loop)).toBe(true);

    await page.getByRole('button', { name: /pausar vídeo/i }).click();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });

  test('«Ficha» en la cabecera despliega la ficha completa con la tabla nutricional', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('#ficha')).not.toHaveAttribute('open');
    await page.getByRole('navigation', { name: 'Capítulos' }).getByRole('link', { name: 'Ficha' }).click();
    await expect(page.locator('#ficha')).toHaveAttribute('open', '');
    await expect(page.getByRole('table', { name: 'Información nutricional por 100 g' })).toBeVisible();
    expect(await overflowOf(page), 'Overflow horizontal con la ficha abierta a 1280px').toBeLessThanOrEqual(0);

    // El caption ocupa todo el ancho de la tabla (no queda encajado en la primera columna).
    const widths = await page
      .locator('#ficha table')
      .evaluate((t) => [t.querySelector('caption')!.getBoundingClientRect().width, t.getBoundingClientRect().width]);
    expect(Math.abs(widths[0]! - widths[1]!)).toBeLessThanOrEqual(2);
  });

  test('prefers-reduced-motion: botella fija de frente y vídeo del aceite en pausa con póster', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('#botella figure.bottle')).toHaveAttribute('data-status', 'reduced');
    await expect(page.locator('#botella canvas')).toHaveCount(0);
    const front = page.locator('#botella img.bottle-media');
    await expect(front).toBeVisible();
    // Visible no basta: la imagen tiene que haberse cargado de verdad (no un recurso roto).
    await expect
      .poll(() => front.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);

    const video = page.locator('#trazabilidad video');
    await video.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    await expect(video).toHaveAttribute('poster', '/media/aceite-bucle-poster.jpg');
  });
});
