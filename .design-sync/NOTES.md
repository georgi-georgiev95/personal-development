# design-sync notes

## Repo shape

This repo is an app (Vite SPA), not a published component-library package.
`src/shared/ui-kit/` is the design system, but there's no `dist/` build that
exports it as a standalone bundle — the app's own `dist/` is the built SPA.
To feed the converter, a dedicated library build was added:

- `vite.config.lib.ts` — builds `src/shared/ui-kit/index.ts` in `cjs` format
  (NOT `iife`/`umd` with a global named `UiKit` — that collides with the
  converter's own `window.UiKit` wrapper variable and silently clobbers it
  back to `undefined`; `cjs` avoids the collision entirely) to
  `dist-ds-lib/ui-kit.cjs`, plus the compiled CSS (Linaria) to
  `dist-ds-lib/personal-development.css`.
- `tsconfig.ds-lib.json` — emits declaration-only `.d.ts` for the same entry
  to `dist-ds-lib/types/...` (excludes `.test.*`/`.stories.*`, which don't
  type-check standalone).
- `scripts/build-ds-lib.sh` — runs both, then writes `dist-ds-lib/package.json`
  (`name: "ui-kit"`, `types: "types/src/shared/ui-kit/index.d.ts"`) so the
  converter's `exportedNames()`/`findTypesRoot()` (which walk up from
  `--entry` to the nearest `package.json` with a `name`, and read its
  `types` field) find real declarations instead of falling through to the
  repo root's stray `.d.ts` files.
- `cfg.buildCmd` points at that script.

## Re-sync risks

- **The app's real `package.json` (`personal-development`) is never
  modified** — `dist-ds-lib/package.json` is a synthetic stub written fresh
  by `build-ds-lib.sh` every run. Don't add a `types`/`main` field to the
  real root `package.json` for this purpose; it isn't needed and would leak
  into the app's own tooling.
- **`Auth/ProfileModal`** is excluded via `titleMap: {"Auth/ProfileModal":
null}` — it's an app feature component that happens to live under a
  `*.stories.ts` file storybook picks up, not part of the reusable ui-kit.
  If more app-only stories get added outside `src/shared/ui-kit/`, they'll
  need the same treatment (or scope stories to `src/shared/ui-kit/**` in a
  dedicated storybook config).
- **`[GENERAL]` dark-surface dependency**: `Text` (tone `default`/`muted`)
  and `Skeleton` (shimmer overlay) are both designed against the app's
  `#030304` background and render illegible/invisible on the converter's
  default white card page. Fixed via owned previews
  (`.design-sync/previews/Text.tsx`, `Skeleton.tsx`) that wrap the story
  JSX in a `background: '#030304'` div — NOT via a global CSS change,
  because the card HTML template hardcodes `body{background:#fff}` inline
  (later in document order than any linked stylesheet), so bundling the
  app's `reset.css` into `cssEntry` has no effect on card rendering. Any
  _new_ ui-kit component added later should be checked against a white
  background first; if it's illegible, copy the same `Wrap` pattern.
- **`Modal` renders via `createPortal(..., document.body)`** — closed by
  default in both stories (interactive `useState`), so the generated
  preview (mirroring the story's initial closed state) is `[RENDER_THIN]`.
  Fixed via an owned preview (`.design-sync/previews/Modal.tsx`) that
  renders it with `open` hardcoded `true`, plus `cfg.overrides.Modal.cardMode:
"single"` for the portal/grid-overflow case. Storybook's own reference
  screenshot for these stories only shows the trigger button (never
  auto-opened) — this is the "gated reference" case: graded `match` by
  judging the opened component alone, not by pixel-diffing against the
  closed-button reference.
- **JetBrains Mono** is fetched from Google Fonts at runtime in the app
  (`index.html` `<link>`), not shipped as a local font file. A `latin`-subset
  woff2 was downloaded once into `.design-sync/fonts/JetBrainsMono.woff2`
  with a matching `@font-face` in `.design-sync/fonts/jetbrains-mono.css`,
  wired via `cfg.extraFonts`. If the DS ever adds a second weight/style that
  visibly differs (currently one variable-ish file covers 400/600 the CDN
  served identically), re-fetch and widen the `font-weight` range.
- **Storybook scans `src/**`** (`.storybook/main.ts` `stories`glob), so any
new`_.stories._`file anywhere in the app becomes a sync candidate by
default — worth a periodic check that`titleMap` still excludes anything
  non-ui-kit.
