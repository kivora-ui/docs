import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// @testing-library/react only auto-registers its afterEach(cleanup) when it
// finds a global test-framework hook. This project doesn't enable Vitest's
// `test.globals`, so it never finds one — without this, a render() in one
// test leaks into the next test in the same file (only visible once a file
// has more than one test that renders).
afterEach(cleanup);

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
