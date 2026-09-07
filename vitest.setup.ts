import "@testing-library/jest-dom/vitest";

// jsdom does not implement matchMedia. KivoraProvider calls it whenever
// colorMode is "system" to detect the OS color scheme preference.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
