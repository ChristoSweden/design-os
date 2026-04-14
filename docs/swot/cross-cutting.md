# Cross-cutting themes across all four apps

Iteration: 1 (baseline) — 2026-04-14

Looking at Design OS, Gravity (gummifabriken), BeetleSense Platform, and
(indirectly) Pilot-Speak 4.0, several patterns recur. The improvements
that matter most are the ones that fix the same weakness in more than
one codebase.

## Themes

### 1. Test coverage is universally thin

| App | Unit tests | E2E | Python | Strict TS |
|---|---|---|---|---|
| Design OS | 0 (being added now) | none | n/a | yes |
| Gravity | 8 files | none | n/a | yes |
| BeetleSense | 17 files / ~990 source | 7 Playwright suites | 2 files | yes |
| Pilot-Speak | unknown (no access) | ? | ? | ? |

Every project has "strict TS" as a strength and "few tests" as a weakness.
The gap between declared rigor and actual safety net is the biggest shared
risk.

**Recommendation**: adopt a floor-coverage policy that *blocks* merges,
not an aspirational threshold. Start low (30–40%) and ratchet.

### 2. Escape hatches erode the type system

BeetleSense has 358 `any`/`@ts-ignore`. Design OS uses
`Record<string, unknown>` for user-authored JSON. Gravity uses
`Record<string, unknown>` in edge-function plumbing. In each case the
types *look* strict but load-bearing data is untyped.

**Recommendation**: a shared runtime schema layer (Zod) at each boundary
— file load, edge-function response, user input. Zod is already in
BeetleSense's `packages/shared` and could be borrowed as a pattern.

### 3. Realtime / external-service fragility

- Gravity: Supabase Realtime → no error boundary, no reconnect backoff.
- BeetleSense: Stripe (189 refs, untested), offline sync with no conflict resolver.
- Design OS: lazy-imported screen components inside Suspense with no fallback on error.

**Recommendation**: a shared pattern — error boundary + retry + exponential
reconnect — applied around every external/lazy resource.

### 4. Linting is present but uneven

- Gravity has no ESLint at all.
- Design OS has ESLint with 9 baseline errors — not blocking CI.
- BeetleSense enforces `console.log: error` (good) but tolerates 358 `any`.

**Recommendation**: every repo should block merges on lint errors. The
smallest change per repo is wiring `eslint --max-warnings=0` into CI.

### 5. Validation / sanitization is mostly implicit

- Design OS parses user markdown with regex and returns `null` on failure (silent).
- Gravity has a `sanitize.ts` — good — but it's not pervasively called.
- BeetleSense trusts coordinate math and file uploads implicitly.

**Recommendation**: validate at boundaries. Every "load data" call site
should be paired with a schema, and every schema failure should produce
a user-visible error, not a silent null.

### 6. CI maturity varies dramatically

- BeetleSense: Lighthouse + axe + security + build + typecheck.
- Gravity: similar.
- Design OS: only what I can run locally here — no CI evidence.
- Pilot-Speak: unknown.

**Recommendation**: Design OS should adopt the Gravity/BeetleSense CI
template as a starting point (build, typecheck, lint, vitest, audit).

## Overnight improvement priorities

Given that only Design OS is writable in this environment, the priorities
collapse to things we *can* fix in Design OS while the SWOT docs for the
other apps gather follow-up work to be done when access returns:

1. Test infrastructure (Vitest + RTL) — landed this iteration.
2. Lint-zero baseline — 9 errors to clear.
3. First unit tests for pure functions (slugify, `cn`, spec parser).
4. Extract duplicated resize-handler hook in ShellDesignPage / ScreenDesignPage.
5. Fix `React.lazy` created inside render (ShellDesign + ScreenDesign).
6. Fix `setState in effect` in `PhaseWarningBanner`.
7. Remove debug `console.log` in `shell-loader.ts`.
8. Add JSON-schema validation for `data.json` files.
9. Error boundary + retry around lazy screen-design imports.
10. Add GitHub Actions CI (build + typecheck + lint + test).

The overnight loop will crank through these in order, committing per
step and re-running `lint`, `typecheck`, `build`, `test` each time.
