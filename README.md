# Statto AI — Personal Football Predictions

Next.js app with AI-powered football match predictions using API-Football with fallback and caching.

## Requirements

- Node 20+
- Bun 1.2+ (or npm/yarn)
- API keys (free tiers):
  - API-Football: https://api-football.com
  - Football-Data.org: https://www.football-data.org (optional fallback)

## Setup

1. Copy `.env.local.example` to `.env.local` and fill in keys.
2. Install deps:

```bash
bun install
```

3. Run dev:

```bash
bun dev
```

Open http://localhost:3000

## Notes
- Caching is in-memory by default. Replace with Upstash Redis in `lib/cache/index.ts` for production.
- API routes proxy and cache third-party data to minimize usage.
- Prediction engine uses Poisson goals model and team stats.
