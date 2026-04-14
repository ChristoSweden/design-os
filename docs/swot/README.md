# SWOT Analyses

Continuous improvement docs for the three target apps plus Design OS itself.
Updated each iteration of the overnight loop started 2026-04-14.

## Apps covered

| App | Repo | Access | Status |
|---|---|---|---|
| Pilot-Speak 4.0 | `ChristoSweden/Pilot-Speak-4.0` | Private (no auth) | SWOT: external research only |
| Gravity (Gummifabriken) | `ChristoSweden/gravity-gummifabriken` | Public clone | SWOT: code-level |
| BeetleSense Platform | `ChristoSweden/beetlesense-platform` | Public clone | SWOT: code-level |
| Design OS | `ChristoSweden/design-os` | Full push access | SWOT + active improvements |

## Why improvements only land in Design OS

Commit signing in this environment is scoped to the Design OS repo
("missing source" error when signing in the cloned repos), so patches
cannot be pushed to the other three. They are analyzed here; any
code-level recommendations are captured as actionable markdown.

## Index

- [`design-os.md`](./design-os.md) — per-phase SWOT (Planning, Design, Export)
- [`gravity-gummifabriken.md`](./gravity-gummifabriken.md)
- [`beetlesense-platform.md`](./beetlesense-platform.md)
- [`pilot-speak-4.0.md`](./pilot-speak-4.0.md) — limited, no source access
- [`cross-cutting.md`](./cross-cutting.md) — themes across all four
