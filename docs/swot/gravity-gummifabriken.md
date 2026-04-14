# Gravity (gummifabriken) — SWOT

Iteration: 1 (baseline) — 2026-04-14
Repo: `ChristoSweden/gravity-gummifabriken` (public, cloned to `/home/user/apps/gravity-gummifabriken`).
Access: read-only — cannot push improvements (commit signing scoped to Design OS).

## Summary

Proximity-based professional networking PWA ("opportunity through proximity").
Uses real-time location to surface meaningful connections nearby with a
multi-faceted matching algorithm. Event-mode for venue networking.

**Stack**: React 19.2.4, Vite 6.2.0, TypeScript (strict), Tailwind 4, Supabase
(PostgreSQL + Auth + Realtime + Edge Functions), Gemini + OpenAI,
PostHog + Sentry, Workbox PWA, Vitest + RTL.

---

## Strengths

- **Strict TypeScript** across the codebase.
- **Comprehensive CI/CD**: build, typecheck, `pnpm audit`, TruffleHog secret scan, Lighthouse CI, axe-core a11y.
- **Precise proximity engine**: proximity boost (50m → 1.5×), recency boost, smart caching in `profileService`.
- **Multi-faceted matching**: interest + intent + proximity + recency, tokenized.
- **Resilience patterns**: request dedup, in-memory TTL cache, `withRetry` / `withTimeout` helpers.
- **Privacy-first**: location privacy options, push toggles, incognito mode.
- **PWA-ready**: Workbox + Web App Manifest.
- **Zero TODO/FIXME/HACK comments** — strong discipline.
- **Centralized error codes** (e.g. `DB-001`).

## Weaknesses

- **No ESLint/Prettier config** — style not enforced in a strict-TS codebase.
- **Sparse test coverage**: 8 test files covering ~22 services + 23 pages. No E2E, minimal component tests.
- **Single custom hook** (`useLocation`) — hooks layer is underdeveloped.
- **RLS workarounds**: profileService has two-step UPDATE/INSERT because upsert fails silently under RLS — undocumented.
- **Lockfile drift**: `package-lock.json` committed but CI uses `pnpm` — either CI is wrong or lockfile should be `pnpm-lock.yaml`.
- **Realtime fragility**: no error boundaries around Supabase realtime subscriptions — a disconnect breaks discovery radar silently.
- **Analytics tight coupling**: PostHog + Sentry initialised directly in `App.tsx` — provider swap is high-friction.

## Opportunities

1. **Add ESLint + Prettier**, wire into existing CI (quick win).
2. **Raise service test coverage** to ≥60% — matchingService and locationService are the priority (business-critical).
3. **Playwright E2E** for the three critical flows: onboard → discover → connect.
4. **Document RLS rules** inline in schema comments.
5. **Matching algorithm versioning** — tag the scoring function so future changes are traceable.
6. **Bundle size monitoring** in CI (23 lazy pages + 22 services = latent bloat risk).
7. **Realtime error boundary** with reconnect backoff.

## Threats

- **Privacy regulation** (GDPR/CCPA): location tracking consent flow + retention policy need audit.
- **Realtime outages**: Supabase realtime down ⇒ discovery radar stops; no graceful degradation.
- **Matching drift**: silent changes to the scoring function can break UX expectations overnight.
- **Cold-start performance**: lazy pages + services may blow past Lighthouse budgets as features accrue.
- **Dependency freshness**: `happy-dom 20.8.9` and similar deps need periodic audit.

## Actionable recommendations (if push access is later granted)

| # | Change | File(s) | Effort |
|---|---|---|---|
| 1 | Add `.eslintrc` with typescript-eslint strict preset | root | S |
| 2 | Add Playwright smoke: onboard + discover | `e2e/` | M |
| 3 | Wrap realtime subscriptions in error boundary + reconnect | `services/*` | M |
| 4 | Unify lockfile on pnpm | root | S |
| 5 | Extract analytics init to `lib/analytics.ts`, inject via context | `App.tsx` | M |
| 6 | Tag matching fn with version constant + unit tests per version | `services/matchingService.ts` | M |

## Non-code quality signals observed

- Tailwind design tokens appear well-curated (copper/cream palette, documented in `DESIGN.md`).
- Deliberate "no glassmorphism" stance for perf + clarity.
- Phased build philosophy (MVP → Engagement → Optimization) is articulated in docs.
