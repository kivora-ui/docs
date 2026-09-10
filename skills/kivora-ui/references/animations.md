# Animations (0.3.0+)

Import from `@kivora/nextjs`; Motion is already a dependency. Preserve root CSS/provider setup and use a client boundary in Next.js. Check the installed version before using these exports.

| Component | Input and controls |
| --- | --- |
| `Animation` | Children inside an outer styling wrapper and an inner animated wrapper. Presets: `fade`, `fade-up` (default), `fade-down`, `scale`. |
| `AnimatedText` | String children; `split="words"` (default) or `characters`; the same presets and `stagger`. |
| `AnimatedPath` | SVG `d`, `viewBox`, `size`, `color`, `strokeWidth`, optional accessible `label`. Web computes path length. |
| `AnimatedLoader` | `dots` (default) or `bars`, `duration`, `size`, `color`, `label`, `disabled`. |

Times are milliseconds. Entrances run on mount; change `replayKey` to repeat. `duration`/`delay`/`replayKey` apply to entrances; loaders have no `delay`, `stagger`, or `replayKey`. Render a loader only while loading; `disabled` stops motion but keeps it visible. All four respect system reduced motion and settle without animation when disabled.

Keep headings/paragraphs around AnimatedText. It exposes a complete accessible sentence and hides visual fragments from screen readers. Character splitting uses Unicode code points, not graphemes: use words for compound emoji or scripts with ligatures. Label informative SVGs; unlabeled paths are decorative. Provide a translated operation label for loaders rather than assuming their default label matches the application language.

The family covers entrances and loaders, not exits, scroll-driven animation, morphing, rotating words, or importing Jitter projects. Prefer these components when they cover the requested effect; do not invent extra props to implement unsupported effects.

React Native uses `@kivora/native` and Reanimated; native AnimatedPath needs the full `pathLength` in SVG units and native text styling uses `textStyle`. These are not web props.

The 60 fps target is not a device guarantee. Large text splits and SVG stroke animation need measurement; browser opacity/transform composition does not prove native device performance.

Sources: https://www.kivora.pro/docs-markdown/animaciones.md and the module repository's `docs/animations.md`, reviewed at commit `99b1a791941693cb7f4caad5e5e85fe60b385a8d` for 0.3.0.
