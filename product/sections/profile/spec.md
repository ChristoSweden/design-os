# Profile

## Overview
The user's own profile: avatar, headline, interests, current intent, and the privacy-mode toggle. Edits write through to live nearby radars within seconds.

## User Flows
- User taps the Profile tab → sees their own avatar, headline, interest chips, current intent, and three privacy-mode pills (Visible / Incognito / Off).
- Tapping any field opens an inline editor; saving writes through Supabase realtime so other nearby radars update without a refresh.
- The "Refine intent with AI" button rewrites a vague intent into a concrete one ("I'm a developer" → "Building bird-detection ML in Sweden, want to meet data engineers and field ecologists").
- Below the fold: account section with email, sign-out, and Settings entry point.

## UI Requirements
- Avatar at top with edit overlay on hover/long-press.
- Interest chips: removable on tap, "+ add" tile at the end.
- Intent textarea expands as the user types; AI-refine button sits below.
- Privacy mode pills are large, single-tap, and the active state is visually obvious from across the room (this is a privacy-critical control).
- Save state is auto, with a small "Saved" toast only on first save per session.
