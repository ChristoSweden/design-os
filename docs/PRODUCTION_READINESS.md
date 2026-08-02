# Production readiness

This public repository retains the upstream MIT license and the original Brian Casel / Builder Methods attribution. Those notices are release invariants and must not be removed from redistributed copies.

## Automated candidate gate

Every proposed release must pass:

```text
npm ci
npm run check
npm audit --omit=dev --audit-level=high
```

The gate covers lint, TypeScript, the production build, attribution/license invariants, and high-severity production dependency advisories.

## Human and operational gates

The following remain **NOT VERIFIED** until recorded for a specific release:

- local maintainer and security-response ownership for this GitHub copy;
- whether this repository is an intentional maintained fork, mirror, or deployment source;
- keyboard, screen-reader, 200% zoom, reduced-motion, light/dark, mobile and wide-screen checks;
- exported package integrity and compatibility in a separate target codebase;
- deployed URL, exact commit-to-deployment match and browser console/network evidence;
- monitoring, alert receipt, support, backup/restore and rollback ownership;
- privacy review for any user-provided planning content or third-party fonts/assets.

## Release decision

`NOT VERIFIED` - CI and release-contract controls are present in this candidate branch, but no remote CI run or production deployment has been proven.

### Local qualification result - 2026-08-02

- TypeScript project build step: passed.
- Attribution/license release contract: passed.
- Lint: failed with nine errors and one warning in the upstream application, including dynamic component creation, effect state updates and fast-refresh export boundaries.
- Production build: blocked before bundling because managed Windows policy denies the Vite/esbuild subprocess (`spawn EPERM`).
- Dependency remediation reduced the audit from six high findings to two high React Router findings. The remaining advisory has no non-breaking fix available through `npm audit fix`; a framework upgrade/migration must be qualified separately.

These failures remain enforced by CI and are not bypassed. This candidate is **NO-GO** until a clean Linux CI run proves lint, build and the dependency gate.
