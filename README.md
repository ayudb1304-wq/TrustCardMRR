# TrustCard MRR

Embeddable, Stripe-verified MRR badges for founders. Built on the [TrustMRR](https://trustmrr.com) API.

## Tech Stack

- **Framework:** Next.js 15+ (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + daisyUI v5
- **Dynamic Images:** `next/og` (Satori)
- **Hosting:** Vercel (Edge Functions)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Clone the repo:

```bash
git clone https://github.com/your-username/TrustCardMRR.git
cd TrustCardMRR
```

2. Install dependencies:

```bash
npm install
```

3. Configure your environment:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and replace the placeholder with your real TrustMRR API key:

```
TRUSTMRR_API_KEY=tmrr_your_real_key_here
```

4. Start the dev server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── verify/[slug]/route.ts   # API proxy to TrustMRR
│   │   └── og/[slug]/route.tsx       # Dynamic OG image generation
│   ├── card/[slug]/page.tsx          # Public TrustCard page
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Dashboard / home
│   └── globals.css                   # Tailwind + daisyUI imports
├── components/
│   └── TrustCard.tsx                 # Reusable TrustCard widget
└── lib/
    └── trustmrr.ts                   # API types & helpers
```

## Key Routes

| Route | Purpose |
|---|---|
| `/` | Dashboard — enter slug, preview card, copy embed snippet |
| `/card/[slug]` | Public TrustCard page (iframe source) |
| `/api/verify/[slug]` | Server-side API proxy to TrustMRR |
| `/api/og/[slug]` | Dynamic OG image (PNG) for social previews |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TRUSTMRR_API_KEY` | Yes | Your TrustMRR API key (starts with `tmrr_`) |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

MIT
