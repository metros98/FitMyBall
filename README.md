# FitMyBall

An unbiased golf ball recommendation engine. Golfers complete a 5-step quiz about their swing, preferences, and playing conditions, then receive ranked recommendations from a 50+ ball cross-brand database with match percentages, confidence levels, and personalized explanations.

No manufacturer bias. No upselling. Just data.

## Features

**Core Quiz & Recommendations**
- 5-step wizard collecting swing metrics, feel preferences, playing conditions, and budget
- Conditional logic: "Preferences Only" path hides performance fields or marks them optional
- Weighted matching algorithm (5 categories: swing speed, performance, preferences, conditions, current ball analysis)
- Weight redistribution when data is missing (e.g. unknown ball speed, preferences-only mode)
- Ball speed estimation fallback chain: user input → 8-iron distance → handicap proxy
- 50% match threshold with fallback to top 3 if fewer qualify
- Confidence level system (High / Medium / Low) based on data completeness
- Trade-off callouts when user inputs conflict (e.g. tour spin + budget under $20)

**Results Page**
- Top 3–5 recommendations ranked by match score with color-coded tiers
- "Why this matches you" bullet points per ball
- Alternatives: step-down, step-up, best value, money-no-object
- Seasonal picks (warm / cold weather) for year-round players
- Where to Buy retailer links per ball

**Browse & Compare**
- Full ball catalog with filtering (brand, construction, compression, color, price) and sorting
- Side-by-side comparison of 2–4 balls with a radar chart (driver / iron / wedge spin)

**User Accounts**
- Email/password auth via NextAuth.js (Auth.js v5)
- Recommendation history and saved favorites
- Tried balls log with personal ratings and notes
- Seasonal profiles (e.g. separate summer and winter setups)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), TypeScript strict mode |
| Styling | Tailwind CSS v4, shadcn/ui |
| State | React Context (quiz flow), TanStack Query v5 (server state) |
| Forms | React Hook Form + Zod v4 |
| Database | PostgreSQL 15+, Prisma ORM v6 |
| Auth | Auth.js v5 (NextAuth), bcryptjs |
| Charts | Recharts |
| Testing | Vitest (unit), Playwright (E2E) |
| Deployment | Vercel |

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, register, reset-password
│   ├── (main)/          # Homepage, quiz, results, browse, compare, profile
│   └── api/             # 20 API routes (quiz, recommendations, balls, users)
├── components/
│   ├── quiz/            # 5-step wizard + context + navigation
│   ├── results/         # Recommendation cards, alternatives, seasonal picks
│   ├── browse/          # Ball catalog with filters
│   ├── compare/         # Comparison table + radar chart
│   ├── profile/         # Dashboard, favorites, tried balls, settings
│   └── ui/              # shadcn/ui base components (30+)
├── lib/
│   ├── matching-algorithm/  # Core algorithm: scoring, weights, confidence, explanations
│   ├── db/queries/          # Prisma query layer (never called directly in routes)
│   ├── auth/                # NextAuth config + edge-safe variant for middleware
│   ├── query/               # TanStack Query hooks and key factory
│   └── validations/         # Zod schemas for all inputs
└── types/               # Shared TypeScript types
prisma/
├── schema.prisma        # Full data model (Ball, User, QuizSession, Recommendation, etc.)
└── seed.ts              # 48 balls across 10 manufacturers
tests/
└── unit/lib/matching-algorithm/  # Algorithm unit tests (scoring, weights, confidence)
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy `.env.example` to `.env.local` and set the required values:
   ```bash
   cp .env.example .env.local
   ```
4. Set up the database:
   ```bash
   pnpm prisma:migrate
   pnpm prisma:seed
   ```
5. Start the dev server:
   ```bash
   pnpm dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/fitmyball"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""   # openssl rand -base64 32

# Optional
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

## Commands

```bash
pnpm dev                  # Start dev server
pnpm build                # Production build (runs prisma generate first)
pnpm lint                 # ESLint
pnpm type-check           # tsc --noEmit
pnpm test:unit            # Vitest unit tests
pnpm test:e2e             # Playwright E2E tests
pnpm prisma:migrate       # Run DB migrations (dev)
pnpm prisma:seed          # Seed 48 balls
pnpm prisma:studio        # Open Prisma Studio
```

## Algorithm Overview

The matching algorithm lives entirely in `src/lib/matching-algorithm/` and is independent of the API layer.

**Scoring categories and default weights:**

| Category | Weight | Key inputs |
|---|---|---|
| Swing Speed Match | 25% | Driver ball speed → compression range |
| Performance Priorities | 30% | Spin profile, launch, feel |
| Preferences | 20% | Budget, color, durability |
| Playing Conditions | 15% | Temperature range |
| Current Ball Analysis | 10% | Stated issues with current ball |

Weights redistribute automatically when data is missing. See PRD v1.1 section 3.1.3 for full scoring rubrics.

## Documentation

- [PRD v1.1](./Docs/fitmyball-PRD-v1.1.md) — Product requirements and algorithm spec
- [Technical Spec](./Docs/fitmyball-technical-spec.md) — Architecture and data flows
- [Database Schema](./Docs/fitmyball-database-schema.md) — Data models and queries
- [UI/UX Design](./Docs/fitmyball-ui-ux-design-v2.md) — Design system and wireframes

## License

MIT
