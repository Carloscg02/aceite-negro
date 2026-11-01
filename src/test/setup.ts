import '@testing-library/jest-dom/vitest';

// Fronteras del navegador que jsdom no implementa (únicos mocks permitidos).
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
if (!('IntersectionObserver' in window)) {
  Object.defineProperty(window, 'IntersectionObserver', { value: IO, writable: true });
}

HTMLCanvasElement.prototype.getContext = (() => null) as unknown as HTMLCanvasElement['getContext'];
