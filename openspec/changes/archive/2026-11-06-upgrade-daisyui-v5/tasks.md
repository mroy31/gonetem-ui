# Tasks

## 1. Dependency and pipeline migration

- [x] 1.1 In package.json: set `daisyui` to `^5`, `tailwindcss` to `^4`, add `@tailwindcss/postcss` to devDependencies, remove `autoprefixer`; run `yarn install` and verify it resolves with no peer-dependency errors
- [x] 1.2 Rewrite `postcss.config.js` to `{ plugins: { "@tailwindcss/postcss": {} } }`, rewrite `src/app.css` to `@import "tailwindcss";` + `@plugin "daisyui" { themes: dark --default, light; }` (keeping the `iframe#webpack-dev-server-client-overlay` rule), and delete `tailwind.config.ts`; verify `grep -r "tailwind.config" webpack.*.js postcss.config.js` finds nothing and `grep tailwindcss postcss.config.js` shows only `@tailwindcss/postcss`
- [x] 1.3 Run `yarn start` and verify the app window renders fully styled on the dark theme (toolbar buttons, toasts, modals styled — not unstyled HTML) with no postcss/css-loader errors in the console; if any Tailwind class is missing in the output, add an explicit `@source` directive in src/app.css relative to the file and re-verify

## 2. OptionsModal transplant

- [x] 2.1 Replace the 5 `form-control`/`label`/`label-text` blocks in src/components/OptionsModal.tsx with `<fieldset class="fieldset">` + `<legend>` + input per design decision 6, dropping `input-bordered` and `w-full max-w-xs` from inputs (move `max-w-xs` to the fieldset where the row needs capping); verify in `yarn start` that all 5 fields render with labels above inputs and click-on-label focuses the input
- [x] 2.2 Replace the 2 toggle rows (label-text span + checkbox/toggle) in src/components/OptionsModal.tsx with `<label class="flex items-center gap-2 cursor-pointer">` wrappers; verify in `yarn start` both controls still toggle their state and the option persists after save
- [x] 2.3 Replace the `modal-open` class toggle in src/components/OptionsModal.tsx with `<dialog open={isOpen} className="modal">` (remove the `classnames` memo if it becomes unused); verify the options modal opens and closes via its normal trigger and its existing close/cancel action

## 3. Modals and find-replace swaps

- [x] 3.1 Replace the `modal-open` class toggle in src/components/ProjectListModal.tsx with the native `open` attribute on the `<dialog>`; verify the project list modal opens, lists projects, and opens/closes a project selection
- [x] 3.2 Drop `select-bordered` from both selects in src/components/ConfigurationViewerPanel.tsx; verify in `yarn start` (project open, configuration viewer tab) that both selects render bordered at their current size
- [x] 3.3 Change `tabs-bordered` to `tabs-border` in src/components/ConsolePanel.tsx and src/components/ProjectContextPanel.tsx; verify in `yarn start` both tab strips keep the underline style and tab switching works

## 4. NodeContextMenu and Tailwind 4 rename sweep

- [x] 4.1 Replace the bare `shadow` class with `shadow-sm` on the dropdown menu in src/components/ConsolePanel.tsx (implementation note: the `dropdown`/`shadow` usage lives in ConsolePanel.tsx:233, not NodeContextMenu) and rename the NodeContextMenu menu-item `disabled` class to `menu-disabled`, moving it from the `<a>` elements to their `<li>` parents (v5 targets `li.menu-disabled`); verify menus render with a visible drop shadow and loading state dims/blocks menu items
- [x] 4.2 Verify the dropdown context menu keeps its current footprint (the dropdown `menu` no longer defaults to `w-full` in v5); if it collapses or changes width, add an explicit width utility and re-verify side-by-side with v4 behavior (implementation note: compiled v5 CSS gives `.menu { width: fit-content }` with no width cap on `.dropdown-content`, so both menus stay content-sized; no explicit width added)
- [x] 4.3 Run a rename-sweep grep over src for Tailwind 4 renamed utilities (`shadow`, `blur`, `rounded-sm`, `ring`, `outline-none`, `flex-shrink`, `flex-grow`) and resolve every hit found by design-time analysis as still-current or rename it; verify the sweep reports zero unresolved renamed utilities

## 5. Integration checks

- [x] 5.1 Run `yarn lint`, `yarn tsc --noEmit`, and `yarn test`; verify all three exit 0
- [x] 5.2 Run `yarn start` full smoke (connect to configured server, open project, tabs, consoles, both modals, node context menu, dark + light graph panel) and verify no visual regressions beyond the accepted v5 cosmetic drift (button density, restyled dark theme); then run `yarn package` and verify the production bundle builds with the same styled output

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
