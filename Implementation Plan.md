# TrustCard MRR — Implementation Plan

> A step-by-step execution plan with checkpoints.
> Update statuses as you complete each item: `[ ]` → `[x]`

---

## Phase 0: Project Scaffold & Environment

**Goal:** A running Next.js 15 dev server with Tailwind CSS + daisyUI, connected to version control.

- [x] Initialize Next.js 15+ project (App Router, TypeScript, `src/` directory)
- [x] Install and configure Tailwind CSS
- [x] Install and configure daisyUI
- [x] Create `.env.local` with `TRUSTMRR_API_KEY=tmrr_your_key_here`
- [x] Verify `npm run dev` starts without errors
- [x] Update `README.md` with setup instructions

**Checkpoint 0:** The default Next.js welcome page renders at `localhost:3000` with daisyUI classes working.

---

## Phase 1: API Connection & Data Layer

**Goal:** Securely proxy TrustMRR API calls through a server-side route and return formatted startup data.

- [x] Create API proxy route at `app/api/verify/[slug]/route.ts`
  - Reads `TRUSTMRR_API_KEY` from environment
  - Calls `GET https://trustmrr.com/api/v1/startups/{slug}` with Bearer token
  - Returns only: `revenue.mrr`, `growth30d`, `activeSubscriptions`, `paymentProvider`, `name`
- [x] Add response caching headers (Edge Cache 60s) to avoid rate-limit hits
- [x] Create a shared `lib/trustmrr.ts` module with:
  - Type definitions for API response (`TrustMRRStartup`)
  - Helper: `formatCents(cents: number) → string` — converts USD cents to `$X,XXX.XX`
  - Helper: `formatGrowth(pct: number) → string` — returns `+X.X%` or `-X.X%`
- [x] Test with a real or mocked slug via `curl http://localhost:3000/api/verify/your-slug`

**Checkpoint 1:** `GET /api/verify/{slug}` returns a clean JSON object with formatted MRR, growth, and subscription data. No API key is ever exposed to the client.

---

## Phase 2: TrustCard Widget Component

**Goal:** A polished, self-contained React component that renders the verification badge.

- [x] Create `components/TrustCard.tsx`
  - Displays startup name, `$X,XXX MRR` in bold
  - Green `+X%` growth pill (red if negative)
  - Active subscribers count
  - "Stripe Verified" (or dynamic provider) badge with checkmark icon
  - "Verified by TrustMRR" footer text
  - Metal tier badge (Bronze/Silver/Gold/Platinum) based on MRR slabs
  - Uses 21st.dev MetallicBusinessCard as the visual base
- [x] Build a demo page at `app/card/[slug]/page.tsx` that fetches data server-side and renders the card
- [x] Make the card responsive (looks great at 320px–400px width)
- [x] Add a light/dark theme variant (MetallicBusinessCard supports `mode` prop)

**Checkpoint 2:** Visiting `/card/your-slug` renders a beautiful, self-contained trust badge with live data.

---

## Phase 3: Dynamic OG Image Generation

**Goal:** A route that renders the TrustCard as a PNG image for social media previews.

- [x] Create `app/api/og/[slug]/route.tsx` using `next/og` (`ImageResponse`)
  - Fetches startup data from internal proxy
  - Renders TrustCard-style layout as JSX (Satori-compatible subset)
  - Returns PNG with `Cache-Control: public, max-age=3600`
- [x] Add `<meta property="og:image">` to the card page pointing to this route
- [x] Add Twitter card meta tags (`twitter:card=summary_large_image`)
- [x] Test by pasting the URL into the Twitter Card Validator / OpenGraph debugger

**Checkpoint 3:** Sharing a `/card/your-slug` URL on X/Twitter shows a rich preview with the live MRR card image.

---

## Phase 4: Embed Snippet Generator (Dashboard)

**Goal:** A simple page where founders enter their slug and get an embeddable code snippet.

- [x] Create the dashboard page at `app/page.tsx` (home page)
  - Input field for TrustMRR slug
  - Live preview of the TrustCard
  - "Copy Embed Code" button
- [x] Generate two embed formats:
  - **iframe:** `<iframe src="https://your-domain/card/{slug}" ...>`
  - **Script tag:** `<script src="https://your-domain/embed.js" data-slug="{slug}"></script>`
- [x] Create `public/embed.js` — a lightweight script that injects the iframe into the host page
- [x] Style the dashboard: clean hero section, input, preview, and snippet area

**Checkpoint 4:** A founder can visit the homepage, type their slug, see a live preview, and copy a working embed snippet.

---

## Phase 5: Viral Loop & Social Sharing

**Goal:** Built-in virality through social sharing and organic backlinks.

- [x] Add "Share to X" button on the dashboard and card page
  - Opens Twitter intent: `https://twitter.com/intent/tweet?text=...&url=...`
  - Pre-filled text: "Just verified my revenue with TrustCard! 🚀"
  - URL points to the OG image route for rich preview
- [x] Add "Get your TrustCard →" link at the bottom of every embedded widget
  - Links back to the homepage with a UTM tag for tracking
- [x] Add "Powered by TrustCard" footer to the iframe embed view

**Checkpoint 5:** Clicking "Share to X" opens a pre-filled tweet with the dynamic OG image. Every embed includes a backlink to drive organic traffic.

---

## Phase 6: Polish, Testing & Edge Cases

**Goal:** Production-grade error handling, loading states, and accessibility.

- [x] Handle API errors gracefully:
  - Invalid slug → friendly "Startup not found" message (alert-info)
  - Rate limited → "Too many requests" with retry button (alert-warning)
  - Network failure → generic error with retry button (alert-error)
- [x] Add loading skeleton to the TrustCard component (`TrustCardSkeleton.tsx`)
- [x] Accessibility: proper ARIA labels, keyboard navigation, contrast ratios
  - `aria-label` on form, input, all buttons (including icon-only)
  - `aria-selected` on embed format tabs
  - `aria-hidden` on decorative SVGs
  - Semantic `<nav>` with `aria-label` for navbar
  - Custom 404 page (`not-found.tsx`)
- [x] Test embed on:
  - [ ] Framer
  - [ ] Webflow
  - [x] Plain HTML page (`public/test-embed.html`)
  - [ ] WordPress (optional)
- [ ] Lighthouse audit: aim for 90+ on Performance, Accessibility, Best Practices

**Checkpoint 6:** The app handles all failure modes gracefully and the embed works across major website builders.

---

## Phase 7: Deployment to Vercel

**Goal:** Live production URL, environment configured, ready for launch.

- [ ] Push final code to GitHub
- [ ] Connect repo to Vercel
- [ ] Set `TRUSTMRR_API_KEY` in Vercel Environment Variables
- [ ] Configure custom domain (optional)
- [ ] Verify all routes work in production:
  - [ ] Homepage / Dashboard
  - [ ] `/card/{slug}`
  - [ ] `/api/verify/{slug}`
  - [ ] `/api/og/{slug}`
- [ ] Run final Lighthouse audit on production URL

**Checkpoint 7:** The app is live at a public URL. All routes respond correctly. OG images render in social previews.

---

## Phase 8: Launch & Marketing ✅

**Goal:** Get the first wave of users via the Marc Lou / TrustMRR community.

- [x] Craft launch tweet with own TrustCard as proof
- [x] Reply to Marc Lou's latest TrustMRR-related post with a demo
- [x] Post on:
  - [x] X/Twitter
  - [x] Reddit (r/SaaS, r/microsaas, r/EntrepreneurRideAlong)
  - [ ] Product Hunt (optional, schedule for next week)
- [x] Monitor analytics for first 48 hours
- [x] Collect feedback and iterate

**Checkpoint 8:** First external founders have successfully embedded their TrustCards.

---

## Phase 9: Conversion & Engagement Optimizations

**Goal:** Maximize the landing page's ability to convert a cold visitor into an active user within 30 seconds.

### 9.1 — "Zero-Click" Dynamic Hero Preview (AHA Moment #1) ✅

Currently the landing page requires a user to enter their slug before they see anything. Fix this with a featured founder card that loads instantly.

- [x] Hardcode a "Featured Founder" card (e.g. `marclou` slug) directly into the Hero section
- [x] Card must be visible the millisecond the page loads (server-side fetch or static data)
- [x] Add subtle label like "Featured Founder" above the card
- [x] Ensure the hero card does not interfere with the existing slug input flow

**Why it works:** Shifts the visitor's brain from "What is this?" to "I want my startup to look like that" instantly.

### 9.2 — "Live Search" Real-Time Preview (AHA Moment #2)

Don't make them wait for a "Dashboard" — show their card as they type.

- [ ] As the user types their slug, debounce-fetch and update a preview card in real-time on the landing page
- [ ] Show a loading skeleton while fetching
- [ ] Remove the explicit "Generate" button (or make it optional) — the preview updates automatically
- [ ] Handle errors inline (invalid slug, rate limit) without disrupting the typing flow

**Why it works:** Seeing their own live MRR data formatted into a beautiful card in under 2 seconds is the ultimate hook.

### 9.3 — Immediate "Copy-Paste" Embed Code (AHA Moment #3)

The moment they see their card, give them the embed code immediately.

- [ ] Display the iframe/script embed code right next to the generated preview (no separate step)
- [ ] Keep the tab selector (iframe / script tag) and copy button
- [ ] Embed code appears as soon as the card data loads — zero extra clicks
- [ ] Include a short "Paste this anywhere on your site" hint

**Why it works:** Reduces friction between "discovery" and "implementation." If they can see their card and have it live on their site in 30 seconds, they are hooked.

### 9.4 — Viral Social Proof: "Hall of Fame" (FOMO)

Show other founders already using TrustCard to build trust.

- [ ] Below the main input section, display 3–5 "Live Now" cards from real startups
- [ ] Use a curated list of slugs (hardcoded or fetched at build time)
- [ ] Add a section heading like "Live Now — Founders building in public"
- [ ] Cards should be compact / smaller than the main preview
- [ ] Optionally link each card to its `/card/{slug}` page

**Why it works:** Creates FOMO — if other founders are already using "Verify-in-Public," the visitor will feel behind if they don't join.

**Checkpoint 9:** A first-time visitor sees a featured card instantly, gets a live preview as they type, receives embed code immediately, and sees social proof from other founders — all without clicking a single button.

---

## Quick Reference: Key Routes

| Route | Purpose |
|---|---|
| `/` | Dashboard — slug input, preview, snippet generator |
| `/card/[slug]` | Public TrustCard page (also used as iframe source) |
| `/api/verify/[slug]` | Server-side API proxy to TrustMRR |
| `/api/og/[slug]` | Dynamic OG image generation (PNG) |

## Key Technical Constraints

| Constraint | Detail |
|---|---|
| Rate Limit | 20 requests per window — use Edge Cache aggressively |
| Currency | All API values in USD cents — divide by 100 |
| API Key Security | Never expose `tmrr_` key client-side |
| OG Image | Must use Satori-compatible JSX (no `<img>` with external URLs without fetching) |
