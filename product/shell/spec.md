# Application Shell Specification

## Overview
A mobile-first PWA shell with a fixed bottom tab bar (Discovery, Connections, Messages, Profile) and a slim top bar that surfaces only the section title plus a single contextual action (Privacy Mode toggle, New Message, Edit Profile). The shell is intentionally minimal — Gravity wants the radar map to dominate the viewport.

## Navigation Structure
- **Discovery** → Real-time proximity radar (Section 1)
- **Connections** → Chronological feed of past matches (Section 3)
- **Messages** → 1:1 conversations (Section 4)
- **Profile** → User's own profile and Settings entry (Sections 2, 5)

## Layout Pattern
Mobile-first, single column. Bottom tab bar (60px) is always visible on every section. Top app bar is 48px and shows {section title} on the left and {one icon button} on the right. Main content area fills the remaining viewport with safe-area padding for notched devices. On tablet/desktop widths (≥768px) the bottom tab bar promotes to a left-rail icon strip 72px wide and the content shifts right.
