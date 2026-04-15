# Discovery Radar

## Overview
The home screen of Gravity. A real-time proximity radar shows nearby members as concentric rings of dots, ranked by combined match score. Tapping a dot opens an intro pane with the matched dimension, headline, and one-tap message action.

## User Flows
- User opens the app → sees themselves at the centre of the radar with concentric rings showing 50m / 250m / 1km / 2km bands.
- Each nearby member appears as a colour-coded dot, weighted by match score (warm = strong, cool = weak).
- Tapping a dot opens a half-sheet with avatar, headline, intent excerpt, the dimension that triggered the match, and a "Send intro" button.
- "Send intro" picks a templated opener (mentioning the matched dimension) and lets the user edit before sending.
- The user can drag a slider to expand the radius up to 2km; the radar re-queries on release.
- A "Go incognito" pill in the top-right immediately hides the user from other radars and dims their own dots.

## UI Requirements
- Centre puck shows the user's avatar with a subtle pulsing ring indicating "broadcasting".
- Concentric rings labelled with their distance (50m, 250m, 1km, 2km) in mono.
- Dots are draggable along their ring to reveal a tooltip with headline + match score.
- Heat colour scale runs from amber (high match) through teal (medium) to neutral stone (low).
- Empty state: when there are no nearby members, show "Nobody on Gravity within 2km right now — try again at the meetup tonight."
- Loading state: skeleton rings with a shimmer animation; never block the entire screen.
- Error state: GPS denied → bright amber banner with a "Pick your zone" fallback that lets the user manually select a city/venue.

## Configuration
- shell: true
