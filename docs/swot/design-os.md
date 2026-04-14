# Design OS — SWOT (per phase)

Iteration: 1 (baseline) — 2026-04-14

Design OS is a Vite/React/TS product planning tool with 3 guided phases.
Each phase is treated here as a separate "app" for SWOT purposes.

---

## Phase 1 — Product Planning

**Files**:
`src/components/ProductPage.tsx` (~97 LOC),
`src/components/DataModelPage.tsx` (~120 LOC),
`src/components/SectionsPage.tsx` (~181 LOC),
`src/components/SectionPage.tsx` (~160 LOC),
`src/lib/product-loader.ts` (~199 LOC),
`src/lib/section-loader.ts` (~272 LOC).

### Strengths
- Markdown parsing regexes are clear and cohesive.
- Step indicator logic cleanly separates completion states.
- Build-time glob loaders remove runtime I/O overhead.
- Type definitions in `src/types/product.ts` and `src/types/section.ts` are precise.

### Weaknesses
- No input validation — `product-loader.ts` returns `null` silently on malformed markdown, users see nothing.
- `Record<string, unknown>` used for `data.json` — arbitrary untyped data permitted.
- Progress is recomputed on every render in `SectionsPage` (lines 41-53) — no memoization.
- No error boundaries — a single broken section crashes the page.
- No drafts / autosave — everything is file-sourced, no in-progress state.

### Opportunities
- Add JSON schema validation for `data.json` with helpful error messages.
- Memoize loader results in context to avoid repeated glob iteration.
- Add collision detection in `slugify()` (`product-loader.ts:28-34`).
- Add breadcrumb validation (roadmap section IDs must exist on disk).

### Threats
- **Slug collision**: `"foo bar"` and `"foo-bar"` both slug to `foo-bar`; silently overwrites.
- **Silent file-not-found**: missing `spec.md` or `data.json` is treated as optional.
- **Fragile shell flag parsing** (`section-loader.ts:135`): `shell: false` matched anywhere in the doc including comments.
- **Type erosion**: dynamic screen-design components have no prop typing — wrong props crash at render time.

---

## Phase 2 — Design System

**Files**:
`src/components/DesignPage.tsx` (~284 LOC),
`src/components/ShellDesignPage.tsx` (~242 LOC),
`src/components/ScreenDesignPage.tsx` (~370 LOC),
`src/lib/design-system-loader.ts` (~101 LOC),
`src/lib/shell-loader.ts` (~175 LOC).

### Strengths
- Polished responsive preview: device presets, drag-to-resize, 60+ Tailwind swatches.
- Proper Suspense boundaries for lazy-loaded screen designs.
- Cross-iframe theme sync via localStorage.
- Good loader/component separation.

### Weaknesses
- **Hardcoded 60-line Tailwind color map** (`DesignPage.tsx:12-35`) — no sync mechanism; silently stale when Tailwind updates.
- **Duplicate resize logic**: `ShellDesignPage` (18-55) and `ScreenDesignPage` (26-62) are nearly identical — DRY violation.
- **Untyped lazy imports**: `loadScreenDesignComponent()` returns `ComponentType` with no prop validation.
- **Console.log in production** (`shell-loader.ts:92-96`).
- **Missing error boundary** on lazy screen-design imports (Suspense catches but no retry UI).
- **React.lazy created inside render** — triggers `react-hooks/static-components` lint error (`ShellDesignPage:184-186`, `ScreenDesignPage:204, 240`).

### Opportunities
- Extract resize handler to `useResponsiveResize()` custom hook.
- Move `React.lazy` call outside render to eliminate state-reset bug.
- Remove stray `console.log` from `shell-loader.ts:92`.
- Wrap lazy components in an error boundary with retry UI.
- Validate screen-design props with a runtime schema.

### Threats
- **Memory leaks**: resize event listeners may remain attached on unmount-during-drag.
- **Iframe contract leakage**: no type contract between parent and preview frame.
- **`React.lazy` in render** causes component state resets — visible to users as flicker.
- **Undocumented shell spec regex** (`shell-loader.ts:52-62`): a typo in `"- Nav Item 1 → Section"` silently breaks navigation.

---

## Phase 3 — Export

**Files**: `src/components/ExportPage.tsx` (~315 LOC), plus `hasExportZip()` / `getExportZipUrl()` in `product-loader.ts`.

### Strengths
- Clean checklist validation with explicit required-field check.
- Status messaging adapts based on whether the zip exists.
- Simple glob-based zip URL resolution.

### Weaknesses
- **No actual export logic** — page only checks if the zip exists.
- **Stale detection**: `hasExportZip()` reflects build-time glob, not current filesystem.
- **No distinction** between missing optional pieces vs missing required pieces.
- **No integrity check** on zip contents.

### Opportunities
- Add incremental readiness indicator per artifact.
- File-mtime based freshness check without full rebuild.
- Export progress tracker if `/export-product` is long-running.
- Show diff of what changed since last export.

### Threats
- `/export-product` handler lives outside the codebase — silent failure if missing.
- Multi-part artifacts can be out of sync if generated piecemeal.
- No export versioning — no way to know what shipped or revert to a prior export.

---

## Cross-cutting (all phases)

- **State**: purely file-based, no Context/store, no persistence beyond localStorage theme.
- **Data flow**: unidirectional, each phase reloads independently — simple but wastes work.
- **Validation**: no Zod / io-ts; all parsing via regex + type assertions.
- **Tests**: none as of baseline (see `docs/quality/baseline-*.log`). Vitest is being added in iteration 1.
- **Lint baseline**: 9 errors, 1 warning (see `docs/quality/baseline-lint.log`).
