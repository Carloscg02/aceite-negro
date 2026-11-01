import { expect, test } from '@playwright/test';

test.describe('Agent Eyes — UI Health & ScrollCraft (Puerto 5174)', () => {
  test('Desktop (1280x800): ariaSnapshot, jerarquía h1->h2, cero errores de consola y cero overflow', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });

    const snapshot = await page.locator('body').ariaSnapshot();
    expect(snapshot).toContain('heading "Aceite Negro Picudo" [level=1]');
    expect(snapshot).toContain('heading "Octubre, aceituna verde." [level=2]');
    expect(snapshot).toContain('heading "El aceite, recién hecho." [level=2]');
    expect(snapshot).toContain('heading "Todo lo que dice la etiqueta." [level=2]');
    expect(snapshot).toContain('heading "Por cajas." [level=2]');
    expect(snapshot).toContain('Caja de 6');
    expect(snapshot).toContain('Caja de 12');

    await expect(page.locator('h1')).toHaveCount(1);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });

  test('Mobile (375x812): cero desbordamiento horizontal en todos los capítulos y cero errores', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
    });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'networkidle' });

    for (const id of ['botella', 'campo', 'almazara', 'ficha', 'comprar']) {
      await page.evaluate((sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'instant' });
      }, id);
      await page.waitForTimeout(120);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `Overflow horizontal en móvil en #${id}`).toBeLessThanOrEqual(0);
    }

    expect(errors).toEqual([]);
  });

  test('Signature Move (Scroll Scrub 360°): avance progresivo sin saltos bruscos ni overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });

    const figure = page.locator('#botella figure.bottle');
    await expect(figure).toHaveAttribute('data-status', 'ready', { timeout: 15_000 });

    const canvas = page.locator('#botella canvas.bottle-media');
    await expect(canvas).toBeVisible();

    const geometry = await page.evaluate(() => {
      const el = document.getElementById('botella')!;
      return {
        top: el.offsetTop,
        scrollable: el.offsetHeight - window.innerHeight,
      };
    });
    expect(geometry.scrollable).toBeGreaterThan(500);

    let previousFrame = 0;
    const framesObserved: number[] = [];

    // Pasos incrementales del 5 % (20 pasos de 0 % a 100 %): máximo teórico ~6 fotogramas/paso (120 * 0.05).
    for (let step = 0; step <= 20; step++) {
      const progress = step / 20;
      const targetY = geometry.top + progress * geometry.scrollable;
      await page.evaluate((y) => window.scrollTo(0, y), targetY);
      // Dejamos asentar la interpolación suave (lerp) durante unos frames de animación (~260ms).
      await page.waitForTimeout(260);

      const currentFrame = Number((await canvas.getAttribute('data-frame')) ?? '0');
      const delta = currentFrame - previousFrame;
      expect(delta, `Retroceso en paso ${step}`).toBeGreaterThanOrEqual(0);
      expect(delta, `Salto brusco (>12 fotogramas) en paso ${step}`).toBeLessThanOrEqual(12);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);

      framesObserved.push(currentFrame);
      previousFrame = currentFrame;
    }

    expect(framesObserved[0]).toBe(0);
    expect(framesObserved[framesObserved.length - 1]).toBeGreaterThanOrEqual(115);
  });

  test('prefers-reduced-motion: desactiva el canvas y muestra vista frontal estática', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('#botella figure.bottle')).toHaveAttribute('data-status', 'reduced');
    await expect(page.locator('#botella canvas')).toHaveCount(0);
    await expect(page.locator('#botella img.bottle-media')).toBeVisible();
  });
});
