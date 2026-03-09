# UI/UX Overhaul – Task Checklist

## Phase 1: Architecture – Side-Navigation Layout

- [x] Create a DashboardLayout component with a responsive sidebar.
- [x] Update `src/app/(main)/layout.tsx` to distinguish between "App" views (with sidebar) and "Landing" views.
- [x] Add route group `(app)` under `(main)` for `/dashboard`, `/claim`, `/integrations`.
- [x] Create `src/app/(main)/(app)/layout.tsx` that renders DashboardLayout (sidebar + content).
- [x] Move `(main)/dashboard/` → `(main)/(app)/dashboard/`.
- [x] Move `(main)/claim/` → `(main)/(app)/claim/`.
- [x] Move `(main)/integrations/` → `(main)/(app)/integrations/`.

## Phase 2: Landing Page Overhaul

- [x] Redesign landing into multi-section page:
  - [x] Hero Section (value prop + primary CTA).
  - [x] Social Proof Section (Metal Tiers).
  - [x] How it Works (Claim → Verify → Embed).
  - [x] FAQ section + Footer integration.
- [x] Keep guest search on landing; dashboard remains login-only.

## Phase 3: Dashboard Reliability & Polishing

- [x] Empty state when no startups (CTA: Claim your first startup).
- [x] Quick Action cards (Claim a startup, View integrations).
- [x] Stats Overview (total verified revenue, active embeds/cards).
- [x] Optional: `GET /api/dashboard/stats` for aggregates.

## Phase 4: Mobile-First Polish

- [x] Sidebar collapses to drawer or bottom-nav on mobile.
- [x] Touch targets and spacing audit on landing and dashboard.
- [ ] Manual viewport test: no horizontal scroll; drawer/nav works.

## Verification

- [ ] Landing allows guest search; Manage requires login and shows sidebar UI.
- [ ] Sidebar uses Tailwind sticky/fixed to avoid layout shift.
