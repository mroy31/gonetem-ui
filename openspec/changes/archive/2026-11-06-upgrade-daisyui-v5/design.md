# Design

## Context

See proposal.md - Why. Current state at time of planning:

- Tailwind 3.4 pipeline: `postcss.config.js` runs `tailwindcss` + `autoprefixer`; `tailwind.config.ts` registers the daisyUI plugin with an empty theme config; `src/app.css` uses the three `@tailwind` directives plus a webpack-dev-server overlay rule.
- Webpack renderer CSS rule: `[style-loader, css-loader, postcss-loader]` (webpack executes right-to-left, so postcss-loader sees the source first).
- Theming: `data-theme="dark"` on `<html>` (src/index.html), `data-theme="light"` scoped to the graph panel (ProjectGraph.tsx:369). No custom theme definitions anywhere; no `var(--daisy*)` usage in code.
- Both modals are real `<dialog>` elements toggled by a `modal-open` class built with `classnames`.
- Electron 43 (Chromium ≥ 140): oklch/color-mix/nesting supported; no browserslist gymnastics needed.
- daisyUI class usage verified by grep: the breaking-change surface is exactly the list in proposal.md. Tests never assert class names.

## Goals / Non-Goals

**Goals:**
- daisyUI 5 + Tailwind 4 rendering through webpack with the same app behavior
- Deterministic, minimal theme output (only the two themes actually used)
- Every removed v4 class replaced by its documented v5 equivalent, nothing else changed

**Non-Goals:**
- Visual polish, theme customization, adopting new v5 components (dock, fieldset theming beyond the transplant, FAB, etc.)
- Migrating to Tailwind CLI or Vite; keeping the webpack + postcss-loader pipeline shape
- Replacing `classnames` usage patterns beyond what the modal change requires
- Running the `@tailwindcss/upgrade` codemod (see Decisions)

## Decisions

1. **Manual migration, not `npx @tailwindcss/upgrade`.** The tool rewrites `tailwind.config.js`/CSS mechanically, but our config is 20 lines with no theme extensions, and the renamed classes it would scan for are a known, grepped list. The tool would also fight the daisyUI plugin removal. Alternative considered: run it then fix conflicts — rejected for a surface this small.

2. **PostCSS: `@tailwindcss/postcss`, drop `autoprefixer`.** `postcss.config.js` becomes `{ plugins: { "@tailwindcss/postcss": {} } }`. Tailwind 4 vendors via Lightning CSS internally; autoprefixer has nothing left to do for this project (app.css is the only PostCSS input). Loader array order in `webpack.renderer.config.js` stays untouched — right-to-left execution still runs postcss first, so `@import "tailwindcss"` and `@plugin "daisyui"` are expanded before css-loader sees any `@import`.

3. **`src/app.css` becomes:**
   ```css
   @import "tailwindcss";
   @plugin "daisyui" {
     themes: dark --default, light;
   }

   iframe#webpack-dev-server-client-overlay{display:none!important}
   ```
   Pinning themes (instead of loading all ~36) keeps CSS output small and prevents an unstyled-theme foot-gun. Tailwind 4 auto-detects source files from the build cwd; if dev-server output ever misses classes, the escape hatch is an explicit `@source` directive — noted, not pre-applied.

4. **`tailwind.config.ts` is deleted, not bridged.** Tailwind 4 ignores it without `@config`; leaving a dead config invites drift. Nothing in it (empty `theme.extend`, plugin registration) has a CSS-first equivalent that matters.

5. **Modals: `open` attribute, not `showModal()`.** Replacing the `modal-open` class with `<dialog open={isOpen} className="modal">` is the minimal swap and matches today's exact show/hide timing. Imperative `showModal()`/`close()` is more idiomatic (inert background, Esc handling) but changes behavior semantics — out of scope for a mechanical migration.

6. **OptionsModal transplant:** each of the 5 labeled fields becomes `<fieldset class="fieldset"><legend>…</legend><input class="input" …></fieldset>`. The 2 inline toggle rows (label-text + checkbox/toggle) become plain `<label class="flex items-center gap-2 cursor-pointer">` wrappers — the closest structural equivalents of today's `label.label.cursor-pointer` rows. `input-bordered` is dropped (border is v5 default); `w-full max-w-xs` is dropped from inputs because v5's default input width is exactly 20rem — where a field must cap a row, `max-w-xs` moves to the fieldset. This preserves current visual width with fewer classes.

7. **Class swaps are pure replacements:** `tabs-bordered` → `tabs-border`, `select-bordered` dropped, bare `shadow` → `shadow-sm` (TW4 scale rename), dropdown `menu` given whatever explicit width restores its current footprint (verify with the running app, e.g. `w-52`).

## Risks / Trade-offs

- [Tailwind 4 silently renamed utility scales (shadow/blur/rounded/ring/flex-shrink)] → Grep confirmed one occurrence (`shadow` in NodeContextMenu); implementation re-runs `rg '\b(shadow|blur|rounded-sm|ring|outline-none|flex-shrink|flex-grow)\b' src --type ts --type tsx`-style sweep before declaring done.
- [css-loader chokes on bare `@import "tailwindcss"` if loader order is ever changed] → Loader order untouched; `yarn start` smoke right after the pipeline swap, before component edits, so any bundling failure is isolated.
- [daisyUI 5.6 button rewrite + v5 dark theme change alter toolbar density] → Accepted per proposal (mechanical scope); noted so it isn't "fixed" mid-migration.
- [Tailwind 4 auto content-detection misses files in `yarn make` prod build] → Same CSS pipeline in dev and prod configs; smoke both `yarn start` and `yarn package`.
- [OptionsModal transplant is the only non-mechanical edit; risk of behavior drift (labels no longer wrapping inputs breaks focus/click-to-focus)] → Fieldset/`legend`+explicit input association or wrapping `<label>` both keep click-to-focus; verify all 7 fields tab and click-focus during smoke.

## Migration Plan

Ordered so each step is independently verifiable: pipeline → verify renders → class surgery file by file → lint/tsc/tests → dev+prod smoke. Rollback is a single `git revert` of the branch/commits; no data or persistent state is involved.

## Open Questions

- Whether Tailwind auto-detection needs an explicit `@source` for the production webpack context — resolvable at smoke time without changing the plan.
