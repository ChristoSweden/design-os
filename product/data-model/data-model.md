# Data Model

## Entities

### User
A Gravity member. Has an immutable `id`, a mutable `headline`, a `privacyMode`, and a soft-deletable `deletedAt`. Owns one Profile and many Connections.

### Profile
The public-facing details that other users see in the radar: `displayName`, `avatarUrl`, `interests` (string array, normalised), `intent` (free text, AI-tightened), and `currentLocation` (geo point, refreshed at most every 30s).

### Connection
A directed edge between two users with `state` (pending, accepted, dismissed), the `dimension` that triggered the match (interest / intent / event / proximity-only), and a `firstSeenAt` timestamp.

### Message
1:1 only, never group. Carries `senderId`, `recipientId`, `body`, `sentAt`, and an optional `seedTemplate` indicating which canned opener was used, if any.

### Event
A venue with a `polygon` (GeoJSON), `startsAt`, `endsAt`, and a `joinMode` (open / invite-only). When a user is inside the polygon during the event window the radar uses the polygon as the search bound instead of the radius preference.

### LocationPing
An append-only stream of `(userId, lat, lng, timestamp, accuracyMeters)` rows. The matching engine reads only the latest ping per user; older rows are TTL'd after 24h.

## Relationships

- A User has one Profile.
- A User has many Connections (as `userId` and as `otherUserId`).
- A Connection belongs to exactly two Users.
- A User has many Messages (as sender and as recipient).
- A Message belongs to exactly two Users (sender + recipient).
- An Event has many Users (via "currently inside polygon").
- A User has many LocationPings.
- The matching engine joins User → Profile → latest LocationPing to compute candidate sets.
