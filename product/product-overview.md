# Gravity

## Description
Gravity is a proximity-based professional networking app that turns "happens to be in the same room" into "actually met someone useful." Real-time location plus shared interests, intents, and event participation surface the right people nearby — at conferences, coworking spaces, meetups, or just walking down the street.

## Problems & Solutions

### Problem 1: Conference networking is high-volume, low-signal
Most networking happens by accident — you bump into someone at the coffee bar, exchange cards, and never follow up. By the time you scan a badge or remember a name, the moment is gone. Gravity replaces accident with intent: it shows you, in real time, which nearby people share an interest you care about and an explicit looking-for need that matches what you offer.

### Problem 2: "Who else is here?" is unanswerable
Walk into a coworking space and you have no idea whether the other twenty people are designers, founders, students, or recruiters. Gravity surfaces a privacy-respecting radar of nearby members with their headline, intent, and a one-tap message option, so the room becomes legible.

### Problem 3: Existing networking apps optimise for global, not local
LinkedIn is great for searching the world. It is terrible for "who is within 50 metres right now and would care that I'm building an embedded ML platform." Gravity is the opposite: it does nothing global. Everything it shows is grounded in physical proximity and the freshness of your last location ping.

### Problem 4: Privacy is usually all-or-nothing
Most location-aware apps either share everything or share nothing. Gravity ships with three privacy modes (Visible, Incognito, Off) and a per-session "go visible for the next 90 minutes" toggle for events, so users can opt in for a specific moment without committing forever.

## Key Features
- Real-time proximity radar with adjustable radius (50m – 2km)
- Multi-faceted match score: shared interests + intent overlap + proximity boost + recency boost
- Three-tier privacy controls (Visible / Incognito / Off) plus 90-minute event mode
- 1-tap intro messages with templated openers based on the matched dimension
- Event mode: when a venue is registered as an event, the radar respects the venue's polygon instead of a fixed radius
- Connections feed: anyone you've messaged or marked surfaces in a chronological list with last-seen-near hints
- AI-suggested intent text that tightens "I'm a developer" into "I'm building bird-detection ML for forestry; want to talk to data engineers and ecologists"
- PWA: installable, offline-aware, push-notified
