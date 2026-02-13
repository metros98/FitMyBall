# FitMyBall

Unbiased golf ball recommendation web app. Users take a 5-step quiz about their swing, preferences, and playing conditions, then receive ranked ball recommendations from a multi-brand database with match percentages and explanations.

## Tech Stack

- **Framework:** Next.js 15+ (App Router) with TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** React Context (quiz flow) + TanStack Query (server state)
- **Forms:** React Hook Form + Zod validation
- **Database:** PostgreSQL 15+ with Prisma ORM
- **Auth:** NextAuth.js (Auth.js v5)
- **Package Manager:** pnpm
- **Testing:** Vitest (unit/integration), Playwright (E2E)
- **Deployment:** Vercel

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

3. Copy `.env.example` to `.env.local` and fill in your environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Set up the database:
   ```bash
   pnpm prisma generate
   pnpm prisma migrate dev
   pnpm prisma db seed
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Commands

```bash
pnpm dev                    # Start dev server (localhost:3000)
pnpm build                  # Production build
pnpm start                  # Start production server
pnpm lint                   # Run ESLint
pnpm type-check             # TypeScript check
pnpm test:unit              # Run Vitest unit tests
pnpm test:integration       # Run Vitest integration tests
pnpm test:e2e               # Run Playwright E2E tests
pnpm prisma:generate        # Generate Prisma client
pnpm prisma:migrate         # Run DB migrations (development)
pnpm prisma:studio          # Open Prisma database browser
pnpm prisma:seed            # Seed database with ball data
```

## Project Structure

See [CLAUDE.md](./CLAUDE.md) for complete project structure and coding conventions.

## Documentation

- [PRD v1.1](./Docs/fitmyball-PRD-v1.1.md) - Product requirements
- [Technical Spec](./Docs/fitmyball-technical-spec.md) - Architecture
- [Database Schema](./Docs/fitmyball-database-schema.md) - Data models
- [UI/UX Design](./Docs/fitmyball-ui-ux-design-v2.md) - Design system
- [CLAUDE.md](./CLAUDE.md) - Development guide

## License

MIT
