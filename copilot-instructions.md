# FitMyBall - Project Instructions

## What This Project Is

FitMyBall is an unbiased golf ball recommendation web app. Users take a 5-step quiz about their swing, preferences, and playing conditions, then receive ranked ball recommendations from a multi-brand database with match percentages and explanations. No manufacturer bias.

## Tech Stack

- **Framework:** Next.js 15+ (App Router) with TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** React Context (quiz flow) + TanStack Query (server state)
- **Forms:** React Hook Form + Zod validation
- **Database:** PostgreSQL 15+ with Prisma ORM
- **Auth:** NextAuth.js (Auth.js v5) — email/password + Google + Apple
- **Package Manager:** pnpm
- **Testing:** Vitest (unit/integration), Playwright (E2E)
- **Deployment:** Vercel

## Project Structure

```
fitmyball/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login, register, reset-password
│   │   ├── (main)/             # Homepage, quiz, results, compare, browse, profile
│   │   ├── api/                # API routes (quiz, recommendations, balls, users)
│   │   ├── layout.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── quiz/               # Quiz wizard components + steps/
│   │   ├── results/            # Recommendation cards, comparison, alternatives
│   │   ├── ball/               # Ball cards, details, spin chart
│   │   └── common/             # Header, footer, loading, error
│   ├── lib/
│   │   ├── matching-algorithm/ # Core algorithm (index, scoring, weights, filters, temperature)
│   │   ├── db/                 # Prisma client + reusable queries
│   │   ├── auth/               # NextAuth config
│   │   ├── validations/        # Zod schemas (quiz, ball, user)
│   │   └── utils/              # Helpers, formatting, constants
│   ├── types/                  # TypeScript types (ball, quiz, user, recommendation)
│   └── config/                 # Site metadata, app constants
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                 # Seed data with 50+ golf balls
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/images/balls/        # Ball product images
├── .env.local                  # Local env vars (never commit)
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Commands

```bash
pnpm install                    # Install dependencies
pnpm dev                        # Start dev server (localhost:3000)
pnpm build                      # Production build
pnpm lint                       # Run ESLint
pnpm type-check                 # TypeScript check (tsc --noEmit)
pnpm test:unit                  # Run Vitest unit tests
pnpm test:integration           # Run Vitest integration tests
pnpm test:e2e                   # Run Playwright E2E tests
pnpm prisma migrate dev         # Run DB migrations (development)
pnpm prisma migrate deploy      # Run DB migrations (production)
pnpm prisma generate            # Regenerate Prisma client
pnpm prisma studio              # Open Prisma database browser
pnpm prisma db seed             # Seed database with ball data
```

## Spec Files — READ THESE FIRST

All specifications are in `/docs`. **The PRD v1.1 is the source of truth when specs conflict.**

| File | Contains | Read When |
|------|----------|-----------|
| `docs/fitmyball-PRD.md` | Product requirements, algorithm scoring rubrics, acceptance criteria, API contract, edge cases | Building any feature, especially the algorithm |
| `docs/fitmyball-technical-spec.md` | Architecture, data flows, code patterns, deployment | Setting up project structure, API routes, state management |
| `docs/fitmyball-database-schema.md` | Prisma schema, seed data structure, queries, indexes | Database work, model changes, writing queries |
| `docs/fitmyball-ui-ux-wireframes.md` | Page layouts, component specs, responsive design | Building any UI component or page |

### Known Spec Differences (PRD v1.1 Wins)

The tech spec and DB schema were written against PRD v1.0. The PRD has since been updated to v1.1 with these changes that override the older specs:

- **Wizard is 5 steps, not 7.** Step 1 = Background + Priorities. Step 2 = Flight & Spin. Step 3 = Feel & Preferences. Step 4 = Playing Conditions & Performance Metrics. Step 5 = Review & Submit.
- **"Preferences Only" conditional logic:** Steps 2 and 4 show performance fields as optional (not hidden), with weight redistribution in the algorithm.
- **Algorithm scoring rubric:** PRD v1.1 section 3.1.3 has detailed scoring formulas for all 5 categories. Use these, not the simplified versions in the tech spec.
- **Compression-to-ball-speed mapping:** PRD v1.1 has a range-based table (not the point-based mapping in the tech spec's `mapBallSpeedToCompression`).
- **50% minimum match threshold** for displaying recommendations (not in tech spec).
- **Confidence Level system** (High/Medium/Low) is new in PRD v1.1.
- **Retailer links:** Ball model needs a `productUrls` field (array of `{ retailer, url, isAffiliate, affiliateUrl }`) — not yet in the DB schema. Add it.
- **Ball speed slider:** 100-200 mph range with "I don't know" checkbox (tech spec has 80-250).
- **Ball Comparison Tool is P1**, not P0. Build it after the core quiz/results flow works.

## Coding Conventions

### General
- TypeScript strict mode. No `any` types — use `unknown` and narrow.
- All components are functional with hooks. No class components.
- Use `async/await`, never raw `.then()` chains.
- Prefer named exports over default exports (except for Next.js pages).
- File names: kebab-case for files (`matching-algorithm.ts`), PascalCase for components (`BallCard.tsx`).

### Components
- One component per file. Co-locate component-specific types in the same file.
- Use shadcn/ui as the base. Extend, don't reinvent.
- All user-facing text should be accessible (proper labels, aria attributes, alt text).
- Mobile-first responsive design. Test at 375px, 768px, and 1280px.

### API Routes
- Validate all inputs with Zod schemas from `lib/validations/`.
- Return consistent error format: `{ error: string, details?: unknown }`.
- Use proper HTTP status codes (400 for validation, 401 for auth, 404 for not found, 500 for server errors).
- All database calls go through `lib/db/queries/` — never call Prisma directly in route handlers.

### Database
- Never modify `schema.prisma` without creating a migration.
- Use Prisma's `select` to limit fields — don't fetch entire rows when you only need a few fields.
- All queries that could return large result sets must be paginated.
- Use transactions for multi-step writes.

### Testing
- Algorithm logic: 80%+ unit test coverage. Test each scoring function independently.
- API routes: Integration test every endpoint with valid and invalid inputs.
- UI: E2E test the full quiz flow (start → complete → view results).
- Test file location mirrors source: `tests/unit/lib/matching-algorithm/scoring.test.ts`.

### Git
- Commit messages: `type: description` (e.g., `feat: add quiz step 1 component`, `fix: compression scoring edge case`, `test: algorithm unit tests`).
- Branch naming: `feat/quiz-wizard`, `fix/scoring-edge-case`, `chore/seed-data`.
- Don't commit `.env.local`, `node_modules`, or `.next`.

## Environment Variables

```bash
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/fitmyball"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth (required for social login, can skip in early dev)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional for V1
RESEND_API_KEY=""                    # Email sending
SENTRY_DSN=""                        # Error tracking
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=""      # Analytics
REDIS_URL=""                         # Caching (skip for V1)
```

## Build Order (Recommended Sequence)

Follow this order. Each step builds on the previous.

1. **Project scaffold** — Initialize Next.js, install deps, configure Tailwind + shadcn/ui, set up directory structure
2. **Database** — Set up Prisma schema, run initial migration, create seed file with 10+ balls for testing
3. **Auth scaffold** — NextAuth config with email/password provider (social login later)
4. **Matching algorithm** — Standalone module in `lib/matching-algorithm/` with unit tests. No UI dependency.
5. **Quiz wizard UI** — 5-step form with React Hook Form + Context, conditional logic for "Preferences Only"
6. **API routes** — POST /api/quiz/submit, GET /api/recommendations/[sessionId], GET /api/balls
7. **Results page** — Recommendation cards, match percentages, confidence level, alternatives
8. **Integration** — Wire quiz → API → results end-to-end
9. **Polish** — Error states, loading states, edge cases (section 10 of PRD), responsive design
10. **Account features** — Registration flows, saved data, profile, recommendation history
11. **Search & Browse** — Ball listing, filters, sorting (P1)
12. **Comparison Tool** — Side-by-side ball comparison (P1)

## Common Pitfalls to Avoid

- **Don't hardcode ball data in components.** All ball data comes from the database via API.
- **Don't skip Zod validation on API routes.** Every input must be validated server-side, even if the form validates client-side.
- **Don't put algorithm logic in the API route handler.** Keep it in `lib/matching-algorithm/` so it's testable independently.
- **Don't fetch all ball fields for list views.** Use Prisma `select` — card views only need id, name, manufacturer, price, image, compression.
- **Don't ignore the "Preferences Only" path.** It's a first-class flow, not an afterthought. The weight redistribution logic must work correctly.
- **Don't use `WidthType.PERCENTAGE` in any tables.** Use DXA units for consistent rendering.
