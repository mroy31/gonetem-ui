# Proposal

## Why

The app is on daisyUI 4.12 with Tailwind CSS 3.4. daisyUI 5 is the current major line (4.x is frozen at v4.daisyui.com), and daisyUI 5 requires Tailwind CSS 4. Staying on the retired line accumulates tooling drift; upgrading now keeps the styling stack supported and unlocks the rest of the modernization already underway (TS-ready tsconfig, ESLint core config helpers).

## What Changes

- Upgrade `daisyui` 4.12 → ^5 and `tailwindcss` 3.4 → ^4 (mandatory chain: daisyUI 5 requires Tailwind 4).
- Replace the JS-based Tailwind/daisyUI configuration with Tailwind 4's CSS-first setup: `tailwind.config.ts` is removed, `src/app.css` moves from `@tailwind` directives to `@import "tailwindcss"; @plugin "daisyui" { themes: dark --default, light; }`.
- Swap the PostCSS pipeline: `tailwindcss` plugin + `autoprefixer` → `@tailwindcss/postcss`.
- Migrate removed/renamed daisyUI 4 classes that the codebase actually uses:
  - `form-control`, `label`, `label-text` (removed in v5) → `fieldset`/`legend`/`label` pattern in `OptionsModal.tsx` (mechanical transplant of the documented v5 replacement; 5 labeled fields + 2 toggle rows)
  - `input-bordered`, `select-bordered` (removed; borders are default) dropped from `OptionsModal.tsx` and `ConfigurationViewerPanel.tsx`
  - `tabs-bordered` → `tabs-border` in `ConsolePanel.tsx` and `ProjectContextPanel.tsx`
  - `modal-open` class (used on `<dialog>` elements in `OptionsModal.tsx`/`ProjectListModal.tsx`) → native `open` attribute
  - Tailwind 4 shadow-scale rename: bare `shadow` (NodeContextMenu) → `shadow-sm`
  - Dropdown `menu` no longer defaults to `w-full` (v5) — adjust sizing on the context menu/dropdown menus as needed
- Scope is strictly mechanical: no visual redesign. Cosmetic differences introduced by v5's restyled dark theme and 5.6 button rewrite are accepted as expected.

## Capabilities

### New Capabilities

None. This is a styling-infrastructure upgrade; no spec-level behavior is introduced or changed.

### Modified Capabilities

None. The application keeps behaving as specified: the same screens, modals, tabs, and settings fields, styled through the upgraded pipeline. Cosmetic drift is accepted and not spec-relevant. Per the schema guidance, this change sets `skip_specs: true` in `.openspec.yaml` because no requirement changes (see `verification-infrastructure` and functional specs, none of which constrain class names, themes, or styling internals — confirmed by inspection).

## Impact

- Dependencies (`package.json`, `yarn.lock`): `daisyui` ^5, `tailwindcss` ^4, add `@tailwindcss/postcss`, drop `tailwindcss` PostCSS plugin usage and `autoprefixer` (Tailwind 4 handles vendor prefixing).
- Config files: `tailwind.config.ts` deleted; `postcss.config.js` rewritten; `src/app.css` rewritten (2 directives + plugin block + existing dev-overlay rule kept).
- Components (class/attribute surgery only): `OptionsModal.tsx` (largest: fieldset transplant), `ProjectListModal.tsx`, `ConfigurationViewerPanel.tsx`, `ConsolePanel.tsx`, `ProjectContextPanel.tsx`, `NodeContextMenu.tsx`.
- Build: webpack renderer CSS rule (`style-loader`/`css-loader`/`postcss-loader`) unchanged in shape; postcss-loader now loads `@tailwindcss/postcss` — loader ordering (postcss before css-loader) must be preserved.
- Not affected: tests (no class-name assertions anywhere), Electron 43 runtime (supports oklch/color-mix), gRPC/proto layer, i18n.
- Risk to manage: Tailwind 4 silently renames utility scales (shadow/blur/rounded); a targeted grep found only one occurrence (`shadow`), to be re-verified during implementation.
