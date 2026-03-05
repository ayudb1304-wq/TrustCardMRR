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

## Phase 8: Launch & Marketing

**Goal:** Get the first wave of users via the Marc Lou / TrustMRR community.

- [ ] Craft launch tweet with own TrustCard as proof
- [ ] Reply to Marc Lou's latest TrustMRR-related post with a demo
- [ ] Post on:
  - [ ] X/Twitter
  - [ ] Reddit (r/SaaS, r/microsaas, r/EntrepreneurRideAlong)
  - [ ] Product Hunt (optional, schedule for next week)
- [ ] Monitor analytics for first 48 hours
- [ ] Collect feedback and iterate

**Checkpoint 8:** First external founders have successfully embedded their TrustCards.

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
