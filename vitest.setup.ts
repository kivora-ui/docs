import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// @testing-library/react only auto-registers its afterEach(cleanup) when it
// finds a global test-framework hook. This project doesn't enable Vitest's
// `test.globals`, so it never finds one — without this, a render() in one
// test leaks into the next test in the same file (only visible once a file
// has more than one test that renders).
afterEach(cleanup);

// jsdom does not implement ResizeObserver, and two independent consumers need
// it: @kivora/nextjs's Player observes its root element on mount to detect a
// "small" (mobile) layout — without a stub the effect throws ReferenceError
// and the test fails before any assertion runs — and recharts'
// ResponsiveContainer (via ChartContainer) needs a measured size before it
// renders an <svg> at all, which it skips silently.
//
// jsdom has no layout engine, so every element measures 0x0 and a stub that
// only no-ops leaves the chart at 0x0 (recharts then warns "The width(0) and
// height(0) of chart should be greater than 0" and renders nothing). The stub
// therefore reports a fixed viewport-ish size for whatever it observes, so a
// responsive component behaves as it would in a real browser.
const OBSERVED_WIDTH = 1024;
const OBSERVED_HEIGHT = 768;

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserverStub implements ResizeObserver {
    private readonly callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }

    observe(target: Element) {
      const contentRect = {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: OBSERVED_WIDTH,
        bottom: OBSERVED_HEIGHT,
        width: OBSERVED_WIDTH,
        height: OBSERVED_HEIGHT,
        toJSON: () => ({}),
      };
      this.callback(
        [{ target, contentRect } as unknown as ResizeObserverEntry],
        this as unknown as ResizeObserver
      );
    }

    unobserve() {}
    disconnect() {}
  };
}

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
