# Connections

## Overview
The chronological feed of people the user has messaged, been messaged by, or explicitly saved. Each connection card surfaces last-seen-near hints so the user can decide whether to re-ping someone who's nearby again.

## User Flows
- User taps the Connections tab → sees a list of past connections sorted by most recent activity.
- Each card shows avatar, name, last-seen-near hint ("3h ago, 90m away"), and a one-tap "Say hi" button if the connection is currently within 2km.
- Stale connections (no activity for 30 days) collapse into an "Older" group below the fold.
- Long-pressing a connection opens a sheet with "Pin to top", "Mute notifications", and "Remove".

## UI Requirements
- Cards are full-width with comfortable touch targets (min 56px tall).
- Last-seen-near hint uses warm amber when the person is within 1km, cool stone when farther.
- Empty state: "You haven't connected with anyone yet — open Discovery to find someone nearby."
- Each card should show the matched dimension (interest / intent / event) as a small chip so the user remembers why they connected.
