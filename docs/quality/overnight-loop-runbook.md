# Overnight Continuous Improvement Loop

Started: 2026-04-14 (user asleep, unrestricted mandate).
Branch: `claude/continuous-testing-quality-v9duJ`
Scope: `design-os` only (the other three target repos cannot be pushed to — see `docs/swot/README.md`).

## What each loop iteration does

1. **Sync**: fetch remote, rebase branch on origin.
2. **Baseline**: run `npm run lint`, `npx tsc -b`, `npm run build`, `npm test`. Save logs into `docs/quality/iter-<n>-*.log`.
3. **Check on external repos**: re-probe `/home/user/apps/Pilot-Speak-4.0` to see if it's been cloned in; if so, run the SWOT pipeline on it.
4. **Pick next improvement** from the priority list in `docs/swot/cross-cutting.md` → "Overnight improvement priorities".
5. **Implement it** in the smallest coherent diff. Only touch files the improvement requires.
6. **Add a test** for the change if it touches runtime behavior.
7. **Re-run lint + typecheck + build + test**. If anything regresses, revert the change and queue a follow-up item instead of pressing on.
8. **Update SWOT docs** if the change invalidates a weakness bullet.
9. **Commit** with a clear `iter(N): <change>` message and push with retries.
10. **Sleep until next loop tick**.

## Priority queue (live — mutate as you go)

Items marked with `[x]` are done; `[ ]` are pending. Add new items as you discover them.

- [x] Vitest + RTL infrastructure (iter 1)
- [x] First pure-function tests (`cn`, `parseProductOverview`, `parseProductRoadmap`) (iter 1)
- [x] Lint zero (9 → 0 errors) (iter 1)
- [x] `React.lazy` caches moved out of render (iter 1)
- [x] `setState in effect` fixed in `PhaseWarningBanner` (iter 1)
- [x] Debug `console.log` removed from `shell-loader` (iter 1)
- [x] Extract `useResponsiveResize()` hook — dedupe `ShellDesignPage` and `ScreenDesignPage` drag logic (iter 2)
- [x] Error boundary around lazy screen-design renders (iter 3) — own `LazyLoadErrorBoundary` with retry, applied to ScreenDesign + ShellPreview
- [ ] Add JSON schema validation for `data.json` (introduce Zod)
- [x] Tests for `section-loader.parseSpec` (title fallback, bullet parsing, shell:false case-insensitivity, true vs false, non-bullet rejection) (iter 5)
- [x] Tests for `shell-loader.parseShellSpec` (iter 8)
- [x] `design-system-loader`: extracted pure `parseColorTokens` / `parseTypographyTokens` validators + 12 unit tests (iter 9)
- [x] Tests for `data-model-loader` (entity + relationship parsing) (iter 7)
- [x] Slugify collision detection in `product-loader` — exposed `slugify` + new `disambiguateSlugs`, roadmap parser uses it (iter 4)
- [x] Roadmap ↔ filesystem section-ID integrity check: new `checkSectionIntegrity()` helper + 6 tests (iter 10).
- [x] Visible warning on SectionsPage: new `SectionIntegrityWarning` component wired into SectionsPage with 4 component tests (iter 11).
- [x] GitHub Actions CI: `.github/workflows/ci.yml` runs lint (`--max-warnings=0`) + typecheck + test + build on push to main and claude/** branches, plus PRs to main (iter 6)
- [ ] Remove the `eslint-disable-next-line react-hooks/static-components` comments in `ScreenDesignPage` and `ShellDesignPage` by switching to eagerly-created module-level lazy components (possible only once the parameterized cache can be flattened — may not be feasible)
- [ ] Add prop validation to dynamically loaded screen designs (Zod or simple shape check)
- [x] `DesignPage` — Tailwind color map extracted to `src/lib/tailwind-colors.ts` as typed config + `getTailwindSwatch()` helper + 8 unit tests (iter 12)
- [ ] Split `buttonVariants` and `badgeVariants` into their own files if they need to be exported later (currently unused, so deferred)
- [ ] Audit and upgrade: `baseline-browser-mapping` is stale per lint output
- [x] Scope "shell: false" detection to the Configuration section only — prevents prose/code mentions from silently disabling the app shell (iter 13)
- [ ] Silent-failure audit: every parser that returns `null` should surface a user-visible warning
- [ ] Dark-mode visual regression check (manual for now, Playwright later)

## Rules

- **Never** skip pre-commit hooks (`--no-verify`) or disable signing.
- **Never** force-push.
- **Never** widen scope beyond the picked item.
- If `npm test` fails after a change: revert, don't "fix forward".
- If `tsc` errors after a change: fix or revert before committing.
- If a lint error reappears: fix properly — no new blanket suppressions.

## Coverage trajectory

| Iter | Test files | Tests | Lint errors | TS errors | Build |
|---|---|---|---|---|---|
| baseline | 0 | 0 | 9 | 0 | ✅ |
| 1 | 2 | 13 | 0 | 0 | ✅ |
| 2 | 3 | 19 | 0 | 0 | ✅ |
| 3 | 4 | 24 | 0 | 0 | ✅ |
| 4 | 4 | 33 | 0 | 0 | ✅ |
| 5 | 5 | 43 | 0 | 0 | ✅ |
| 6 | 5 | 43 | 0 | 0 | ✅ |
| 7 | 6 | 50 | 0 | 0 | ✅ |
| 8 | 7 | 57 | 0 | 0 | ✅ |
| 9 | 8 | 69 | 0 | 0 | ✅ |
| 10 | 8 | 75 | 0 | 0 | ✅ |
| 11 | 9 | 79 | 0 | 0 | ✅ |
| 12 | 10 | 87 | 0 | 0 | ✅ |
| 13 | 10 | 89 | 0 | 0 | ✅ |

## Metadata

- Node: `18.x` / `20.x` (whichever the harness provides)
- Vitest: `4.1.x`
- Testing Library: `16.x`
