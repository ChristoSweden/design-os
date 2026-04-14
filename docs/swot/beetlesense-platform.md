# BeetleSense Platform — SWOT

Iteration: 1 (baseline) — 2026-04-14
Repo: `ChristoSweden/beetlesense-platform` (public, cloned to `/home/user/apps/beetlesense-platform`).
Access: read-only — cannot push improvements (commit signing scoped to Design OS).

## Summary

Forest intelligence platform for Swedish forestry: bark-beetle detection,
forest-health monitoring, timber-volume estimation, AI-powered advice. Three
user roles (forest owners, drone pilots, inspectors). Currently v2.7.0 on
Vercel.

**Stack**: React 19, TypeScript 5.7 (strict), Vite 6, Tailwind 4, Zustand,
i18next, MapLibre GL, Three.js · Supabase (Postgres + PostGIS + Auth +
Storage + Edge Functions) · Node workers with BullMQ + Redis · Python 3.12
FastAPI + ONNX Runtime + GeoPandas/Rasterio for inference · Turborepo +
pnpm 9 monorepo · Sentry + PostHog (EU) + Vercel Analytics · Stripe.

---

## Strengths

- **Monorepo discipline**: Turborepo + pnpm workspaces, shared `packages/shared` with Zod schemas.
- **Full-stack type safety** via shared Zod schemas; `strict: true` everywhere.
- **Accessibility in CI**: Lighthouse + axe-core run on every PR.
- **Security posture**: `pnpm audit`, TruffleHog secret scanning, Sentry.
- **Offline-first**: push notifications, offline sync, data caching.
- **Geospatial depth**: PostGIS, SWEREF99 TM coordinate system, MapLibre.
- **i18n + regional compliance**: Swedish primary, PostHog EU endpoint.
- **No `console.log` leakage** (rule enforced).
- **E2E suite exists**: 7 Playwright test suites (auth, pilot, inspector, sensor, offline, etc.).

## Weaknesses

- **Sparse unit tests**: 17 test files against ~990 TS/TSX source files (~1.7%). Coverage thresholds (60% stmts / 50% branch) are aspirational, not enforced as gates.
- **358 `any` / `@ts-ignore` escapes** — high for a strict-TS codebase.
- **Python inference under-tested**: 2 test files for ML + geospatial code.
- **Stripe is untested**: 189 refs, no dedicated tests — revenue path is fragile.
- **19 TODO/FIXME/HACK** comments — manageable but not tracked.
- **Demo mill data** (SDC/VIOL) still hardcoded per `AGENTS.md`.
- **Deploy is date-triggered, no feature flags** — no canary or gradual rollout.

## Opportunities

1. **Expand Stripe E2E coverage** first — highest-value untested path.
2. **Incremental unit tests** for the Python inference modules (pytest + snapshot).
3. **Set `@typescript-eslint/no-explicit-any: error`** and gradually burn down the 358 instances.
4. **Adopt feature flags** (Supabase-native or LaunchDarkly) to decouple deploy from release.
5. **Bundle-size CI check** — Tailwind 4 + Three.js + MapLibre is heavy; rollup-visualizer already configured, just needs a CI gate.
6. **Coordinate-math unit tests** — SWEREF99 ↔ WGS84 conversions are a classic footgun.
7. **Replace demo mill integrations** with real SDC/VIOL data — direct revenue unlock.

## Threats

- **Type safety erosion**: 358 escape hatches will hide real bugs as the codebase grows.
- **Geospatial bugs**: PostGIS + SWEREF99 errors are quiet and expensive to diagnose.
- **Offline sync divergence**: no documented conflict-resolution strategy between offline and online state.
- **Nordic lock-in**: Swedish forestry regulations (e.g. Avverkningsanmälan) are woven into UI — expansion = refactor.
- **No staging**: hardcoded deploy-trigger date with no blue-green.
- **Dependency patch cadence** unclear for Stripe / Supabase / Sentry pins.

## Actionable recommendations (if push access is later granted)

| # | Change | Area | Effort |
|---|---|---|---|
| 1 | Stripe E2E: checkout → subscribe → cancel | `apps/web/e2e` | M |
| 2 | Python pytest for SWEREF99 coord math + ONNX inference smoke | `apps/inference` | M |
| 3 | `no-explicit-any: error` + scripted codemod pass | root eslint | L |
| 4 | Bundle-size CI gate using rollup-visualizer output | CI yaml | S |
| 5 | Extract feature-flag abstraction over Supabase config | `packages/shared` | M |
| 6 | Replace demo SDC/VIOL mill data with real integration stubs | `apps/web` + edge fns | L |

## Non-code quality signals observed

- `AGENTS.md` acknowledges demo-data tech debt — self-aware project.
- Accessibility-first CI is rare and praiseworthy.
- `console.log: error` rule indicates a team that cares about production hygiene.
- Shared Zod schemas in a dedicated package is textbook correct for a monorepo.
