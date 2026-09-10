# Themes and color modes

`KivoraProvider colorMode="system"` follows the user's preference; `light` and `dark` select a mode. The provider updates the document's `dark` class. Avoid nesting providers with conflicting color modes.

Apply CSS overrides after the Kivora stylesheet and use semantic token pairs:

```css
:root {
  --color-primary: #a03872;
  --color-primary-foreground: #ffffff;
}

.dark {
  --color-primary: #f2a5cf;
  --color-primary-foreground: #301023;
}
```

Check text contrast, focus, hover, and disabled states in both modes. Preserve the application's typography.

`themeOverrides` changes the theme object returned by `useKivoraTheme`; it does not generate CSS variables. If code consumes both the context theme and CSS, keep the representations aligned. Do not assume changing `themeOverrides` recolors every component.

Portals may render under `body`. Apply shared tokens at document level or use the component's supported portal container so dialogs and menus receive a scoped palette.

See https://www.kivora.pro/docs-markdown/temas.md for the maintained theme guide.

## Shared theme helpers and responsive layout

`@kivora/theme` exports `lightTheme`, `darkTheme`, `mergeTheme`, `breakpoints`, `getBreakpoint`, `resolveColorMode`, and `cn`. It exports neither a Tailwind preset nor an object named `tokens`. Add it as a direct dependency when importing it in application code.

`mergeTheme(base, overrides)` merges theme data; it does not apply browser styles. `resolveColorMode(mode, systemMode)` is pure and does not read device preferences. `cn` combines conditional classes and resolves Tailwind conflicts; it does not generate CSS.

Shared breakpoints are mobile 0, tablet 768, desktop 1024. `getBreakpoint(width)` is pure and registers no resize listener; use the web `useBreakpoint` hook for reactive decisions. Without a Tailwind compiler, use CSS media queries for custom responsive styles instead of assuming arbitrary responsive classes are included in compiled Kivora CSS.

Source: the module repository's `packages/theme/README.md` and `docs/responsive.md`.
