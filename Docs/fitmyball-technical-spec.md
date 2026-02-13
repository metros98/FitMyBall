# FitMyBall - Technical Specification & Architecture

**Version:** 1.0  
**Date:** February 11, 2026  
**Status:** Draft for Development  
**Related Documents:** PRD v1.0

---

## 1. Executive Summary

This document defines the technical architecture, technology stack, and implementation details for the FitMyBall application. It provides the blueprint for development teams to build a scalable, performant, and maintainable web application.

### 1.1 Technical Goals

- **Performance:** Results in <2 seconds, quiz responses <200ms
- **Scalability:** Support 10,000+ concurrent users
- **Maintainability:** Modular architecture, clear separation of concerns
- **Extensibility:** Easy to add new balls, manufacturers, and features
- **Security:** Secure authentication, data encryption, GDPR compliance
- **Accessibility:** WCAG 2.1 AA compliant

---

## 2. Technology Stack

### 2.1 Recommended Stack (Modern Web Application)

#### **Frontend**
- **Framework:** Next.js 15+ (React 19+)
  - Rationale: Server-side rendering for SEO, API routes, excellent developer experience
  - Alternative: Remix or SvelteKit
- **Language:** TypeScript
  - Rationale: Type safety, better IDE support, reduced runtime errors
- **Styling:** Tailwind CSS + shadcn/ui components
  - Rationale: Rapid development, consistent design system, accessible components
- **State Management:** React Context + TanStack Query (React Query)
  - Rationale: Built-in caching, loading states, optimistic updates
- **Form Management:** React Hook Form + Zod
  - Rationale: Performance, validation, type safety

#### **Backend**
- **Runtime:** Node.js 20+ LTS
- **Framework:** Next.js API Routes (serverless functions)
  - Alternative: Express.js if separate backend needed
- **ORM:** Prisma
  - Rationale: Type-safe database access, migrations, great DX
  - Alternative: Drizzle ORM
- **Authentication:** NextAuth.js (Auth.js v5)
  - Rationale: Multiple providers, session management, secure

#### **Database**
- **Primary Database:** PostgreSQL 15+
  - Rationale: Relational data, full-text search, JSON support, mature
  - Hosting: Vercel Postgres, Supabase, or Railway
- **Caching Layer:** Redis (optional for V1, recommended for scale)
  - Use case: Session storage, ball database caching, rate limiting

#### **Hosting & Deployment**
- **Platform:** Vercel (recommended) or Netlify
  - Rationale: Zero-config Next.js deployment, edge functions, global CDN
  - Alternative: AWS Amplify, Railway, or self-hosted
- **Storage:** Vercel Blob or AWS S3 (for ball images)
- **CDN:** Built-in with Vercel/Netlify

#### **Development & DevOps**
- **Version Control:** Git + GitHub
- **Package Manager:** pnpm (faster than npm/yarn)
- **Testing:** 
  - Unit/Integration: Vitest
  - E2E: Playwright
- **CI/CD:** GitHub Actions
- **Monitoring:** Vercel Analytics + Sentry (error tracking)
- **Analytics:** Plausible or PostHog (privacy-focused)

### 2.2 Alternative Stack Options

#### **Option B: Traditional Separation**
- **Frontend:** React SPA (Vite)
- **Backend:** Express.js + PostgreSQL
- **Deployment:** Frontend (Netlify), Backend (Railway/Render)
- **When to use:** If you need backend logic separate from frontend team

#### **Option C: Full-Stack Framework**
- **Framework:** Remix (Full-stack React)
- **Database:** PostgreSQL + Prisma
- **Deployment:** Fly.io or Railway
- **When to use:** If you want better data loading patterns than Next.js

### 2.3 Recommended Choice

**Next.js + PostgreSQL + Vercel** for the following reasons:
- Single codebase (frontend + API)
- Excellent SEO out of the box
- Built-in API routes eliminate need for separate backend
- Vercel deployment is zero-config
- Great developer experience
- Easy to scale

---

## 3. System Architecture

### 3.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐   │
│  │  Browser   │  │   Mobile   │  │    Tablet           │   │
│  │  (Desktop) │  │  (Safari)  │  │   (Responsive)      │   │
│  └─────┬──────┘  └─────┬──────┘  └──────────┬──────────┘   │
└────────┼───────────────┼────────────────────┼──────────────┘
         │               │                    │
         └───────────────┴────────────────────┘
                         │
                    HTTPS/WSS
                         │
┌────────────────────────┼──────────────────────────────────┐
│                  CDN / Edge Network                        │
│                  (Vercel Edge Network)                     │
└────────────────────────┼──────────────────────────────────┘
                         │
┌────────────────────────┼──────────────────────────────────┐
│               Next.js Application Layer                    │
│  ┌──────────────────────────────────────────────────┐     │
│  │           Frontend (React Components)            │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │     │
│  │  │   Quiz   │  │  Results │  │  Comparison  │   │     │
│  │  │   Flow   │  │   Page   │  │     Tool     │   │     │
│  │  └──────────┘  └──────────┘  └──────────────┘   │     │
│  └──────────────────────────────────────────────────┘     │
│                         │                                  │
│  ┌──────────────────────────────────────────────────┐     │
│  │         API Routes (Backend Logic)               │     │
│  │  ┌──────────────┐  ┌─────────────────────────┐  │     │
│  │  │  Matching    │  │  User Management        │  │     │
│  │  │  Algorithm   │  │  (Auth, Profile)        │  │     │
│  │  └──────────────┘  └─────────────────────────┘  │     │
│  │  ┌──────────────┐  ┌─────────────────────────┐  │     │
│  │  │  Ball CRUD   │  │  Recommendation History │  │     │
│  │  └──────────────┘  └─────────────────────────┘  │     │
│  └──────────────────────────────────────────────────┘     │
└────────────────────────┼──────────────────────────────────┘
                         │
┌────────────────────────┼──────────────────────────────────┐
│                  Data Layer                                │
│  ┌──────────────────┐      ┌───────────────────────┐      │
│  │   PostgreSQL     │      │   Redis (Optional)    │      │
│  │   (Primary DB)   │      │   (Cache/Sessions)    │      │
│  │                  │      │                       │      │
│  │  • Balls         │      │  • Session Data       │      │
│  │  • Users         │      │  • Ball Cache         │      │
│  │  • Recommendations│     │  • Rate Limiting      │      │
│  │  • Profiles      │      │                       │      │
│  └──────────────────┘      └───────────────────────┘      │
└───────────────────────────────────────────────────────────┘
                         │
┌────────────────────────┼──────────────────────────────────┐
│              External Services                             │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   Email      │  │   Object     │  │   Analytics    │  │
│  │  (Resend)    │  │   Storage    │  │  (Plausible)   │  │
│  │              │  │  (S3/Blob)   │  │                │  │
│  └──────────────┘  └──────────────┘  └────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   Auth       │  │   Error      │  │   Monitoring   │  │
│  │ (NextAuth)   │  │  Tracking    │  │   (Vercel)     │  │
│  │              │  │  (Sentry)    │  │                │  │
│  └──────────────┘  └──────────────┘  └────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### 3.2 Application Architecture

#### **Directory Structure (Next.js App Router)**

```
fitmyball/
├── src/
│   ├── app/                          # App Router (Next.js 15+)
│   │   ├── (auth)/                   # Auth-related routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── reset-password/
│   │   ├── (main)/                   # Main application routes
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── quiz/
│   │   │   │   ├── page.tsx          # Quiz entry
│   │   │   │   ├── step/[id]/page.tsx # Dynamic steps
│   │   │   │   └── review/page.tsx   # Review before submit
│   │   │   ├── results/
│   │   │   │   └── [sessionId]/page.tsx
│   │   │   ├── compare/page.tsx      # Ball comparison tool
│   │   │   ├── browse/page.tsx       # Browse all balls
│   │   │   ├── ball/[id]/page.tsx    # Individual ball details
│   │   │   └── profile/              # User account pages
│   │   │       ├── page.tsx
│   │   │       ├── history/page.tsx
│   │   │       └── settings/page.tsx
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── quiz/
│   │   │   │   └── submit/route.ts
│   │   │   ├── recommendations/
│   │   │   │   ├── generate/route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── balls/
│   │   │   │   ├── route.ts          # GET all, POST new
│   │   │   │   ├── [id]/route.ts     # GET, PATCH, DELETE
│   │   │   │   └── search/route.ts
│   │   │   └── users/
│   │   │       └── [id]/route.ts
│   │   ├── layout.tsx                # Root layout
│   │   ├── error.tsx                 # Error boundary
│   │   └── not-found.tsx             # 404 page
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   ├── quiz/                     # Quiz-specific components
│   │   │   ├── QuizStep.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StepNavigation.tsx
│   │   │   └── steps/
│   │   │       ├── BackgroundStep.tsx
│   │   │       ├── PrioritiesStep.tsx
│   │   │       ├── FlightSpinStep.tsx
│   │   │       └── ...
│   │   ├── results/                  # Results page components
│   │   │   ├── RecommendationCard.tsx
│   │   │   ├── MatchPercentage.tsx
│   │   │   ├── ComparisonTable.tsx
│   │   │   ├── AlternativeOptions.tsx
│   │   │   └── SeasonalRecommendations.tsx
│   │   ├── common/                   # Shared components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorMessage.tsx
│   │   └── ball/                     # Ball display components
│   │       ├── BallCard.tsx
│   │       ├── BallDetails.tsx
│   │       └── SpinChart.tsx
│   │
│   ├── lib/                          # Utility functions & core logic
│   │   ├── matching-algorithm/       # Ball matching logic
│   │   │   ├── index.ts              # Main algorithm export
│   │   │   ├── scoring.ts            # Scoring calculations
│   │   │   ├── weights.ts            # Weight definitions
│   │   │   ├── filters.ts            # Filtering logic
│   │   │   └── temperature.ts        # Temperature adjustments
│   │   ├── db/                       # Database utilities
│   │   │   ├── index.ts              # Prisma client
│   │   │   └── queries/              # Reusable queries
│   │   │       ├── balls.ts
│   │   │       ├── users.ts
│   │   │       └── recommendations.ts
│   │   ├── auth/                     # Auth configuration
│   │   │   └── nextauth.ts
│   │   ├── validations/              # Zod schemas
│   │   │   ├── quiz.ts
│   │   │   ├── ball.ts
│   │   │   └── user.ts
│   │   └── utils/                    # Helper functions
│   │       ├── formatting.ts
│   │       ├── calculations.ts
│   │       └── constants.ts
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── ball.ts
│   │   ├── quiz.ts
│   │   ├── user.ts
│   │   └── recommendation.ts
│   │
│   └── config/                       # Configuration files
│       ├── site.ts                   # Site metadata
│       └── constants.ts              # App constants
│
├── prisma/                           # Database schema & migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                       # Seed data (initial balls)
│
├── public/                           # Static assets
│   ├── images/
│   │   └── balls/                    # Ball product images
│   └── icons/
│
├── tests/                            # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local                        # Environment variables
├── .env.example                      # Example env file
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

---

## 4. Data Flow & Architecture Patterns

### 4.1 User Flow: Quiz Completion

```
1. User lands on homepage
   ↓
2. Clicks "Find My Ball" → Navigate to /quiz
   ↓
3. Multi-step form (React Hook Form + Zod validation)
   ├─ Step 1: Background → State stored in React Context
   ├─ Step 2: Priorities → State updated
   ├─ Step 3: Flight/Spin → State updated
   ├─ Step 4: Feel/Preferences → State updated
   ├─ Step 5: Playing Conditions → State updated
   ├─ Step 6: Performance Metrics → State updated
   └─ Step 7: Review → Display all inputs
   ↓
4. User clicks "Get Recommendations"
   ↓
5. POST /api/quiz/submit
   {
     quizData: { ...all form inputs },
     userId?: string (if logged in)
   }
   ↓
6. Backend (API Route):
   ├─ Validate quiz data (Zod schema)
   ├─ Fetch all balls from database
   ├─ Run matching algorithm (see Section 5)
   ├─ Generate top 5 recommendations
   ├─ Calculate alternatives (step-up/down, seasonal)
   ├─ Save recommendation session to DB
   └─ Return recommendations + sessionId
   ↓
7. Redirect to /results/[sessionId]
   ↓
8. Results page fetches data:
   GET /api/recommendations/[sessionId]
   ↓
9. Display recommendations with TanStack Query caching
   ↓
10. User options:
    ├─ Save to account (if logged in)
    ├─ Generate shareable link
    ├─ Email results
    └─ Compare balls side-by-side
```

### 4.2 Data Fetching Strategy

**Using TanStack Query (React Query):**

```typescript
// Example: Fetching recommendations
const { data, isLoading, error } = useQuery({
  queryKey: ['recommendations', sessionId],
  queryFn: () => fetchApi(`/api/recommendations/${sessionId}`),
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 30, // 30 minutes
});

// Example: Fetching ball details
const { data: ball } = useQuery({
  queryKey: ['ball', ballId],
  queryFn: () => fetchApi(`/api/recommendations/${sessionId}`),
  staleTime: Infinity, // Ball data rarely changes
});

// Example: Searching balls
const { data: searchResults } = useQuery({
  queryKey: ['balls', 'search', filters],
  queryFn: () => fetchApi(`/api/recommendations/${sessionId}`),
  enabled: filters.query.length > 0, // Only search if query exists
});

// Shared fetch wrapper with error handling
const fetchApi = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};
```



**Server-Side Rendering (SSR) for SEO:**

```typescript
// app/ball/[id]/page.tsx
export async function generateMetadata({ params }: { params: { id: string } }) {
  const ball = await getBallById(params.id);
  return {
    title: `${ball.name} - FitMyBall`,
    description: `Find out if the ${ball.name} is right for your game. ${ball.compression} compression, ${ball.construction} construction.`,
  };
}

export default async function BallPage({ params }: { params: { id: string } }) {
  const ball = await getBallById(params.id);
  return <BallDetails ball={ball} />;
}
```

### 4.3 State Management Architecture

**Three-Tier State System:**

1. **Server State (TanStack Query)**
   - Ball database
   - User profile
   - Recommendations
   - Search results

2. **UI State (React Context - Quiz Flow Only)**
   - Quiz form data (multi-step wizard)
   - Current step
   - Validation errors

3. **Local Component State (useState)**
   - Form inputs
   - Modals/dialogs
   - UI toggles

**Why This Approach:**
- React Query handles caching, loading, error states automatically
- Context only for quiz (avoids prop drilling across 7 steps)
- No need for Redux/Zustand - Next.js + React Query is sufficient

---

## 5. Matching Algorithm - Detailed Specification

### 5.1 Algorithm Overview

The matching algorithm scores each ball (0-100) based on weighted criteria, then returns top recommendations.

**Core Function Signature:**

```typescript
interface QuizData {
  // Background
  currentBall?: { brand: string; model: string };
  handicap: string;
  roundsPerYear: string;
  
  // Priorities
  priorityType: 'performance' | 'performance_preferences' | 'preferences';
  mostImportant: 'short_game' | 'approach' | 'trajectory' | 'all';
  
  // Flight/Spin
  approachTrajectory: 'low' | 'mid' | 'high';
  currentBallSpin: 'too_much_release' | 'just_right' | 'too_much_spin';
  needShortGameSpin: 'yes' | 'no' | 'not_sure';
  
  // Feel/Preferences
  preferredFeel: 'very_soft' | 'soft' | 'medium' | 'firm' | 'dont_care';
  colorPreference: 'white_only' | 'open_to_color' | 'graphics_required';
  budgetRange: 'budget' | 'value' | 'premium' | 'tour_level' | 'no_limit';
  durabilityPriority: 'single_round' | 'multiple_rounds' | 'cost_per_round';
  
  // Playing Conditions
  typicalTemperature: 'warm' | 'moderate' | 'cold' | 'mixed';
  improvementAreas: string[]; // ['tee_distance', 'approach', 'short_game', etc.]
  
  // Metrics
  driverBallSpeed: number; // mph
  ironDistance8: number; // yards
}

interface Ball {
  id: string;
  name: string;
  manufacturer: string;
  construction: string;
  coverMaterial: string;
  compression: number;
  spinProfile: {
    driver: 'low' | 'mid' | 'high';
    iron: 'low' | 'mid' | 'high';
    wedge: 'low' | 'mid' | 'high';
  };
  launchCharacteristic: 'low' | 'mid' | 'high';
  feelRating: 'very_soft' | 'soft' | 'medium' | 'firm';
  pricePerDozen: number;
  availableColors: string[];
  targetHandicap: string;
  durability: number; // 1-5
  temperaturePerformance: {
    optimal: 'warm' | 'moderate' | 'cold' | 'all';
    coldSuitability: number; // 1-5
  };
}

interface MatchResult {
  ball: Ball;
  matchScore: number; // 0-100
  matchPercentage: number; // 0-100 (same as matchScore)
  categoryScores: {
    swingSpeedMatch: number;
    performancePriorities: number;
    preferences: number;
    playingConditions: number;
    currentBallAnalysis: number;
  };
  explanation: {
    whyThisMatches: string[];
    whatYouGain: string[];
    tradeoffs: string[];
  };
}

function matchBalls(quizData: QuizData, allBalls: Ball[]): MatchResult[] {
  // Implementation in next section
}
```

### 5.2 Scoring Algorithm - Step by Step

```typescript
function calculateMatchScore(ball: Ball, quizData: QuizData): number {
  let totalScore = 0;
  const weights = getWeights(quizData.priorityType);
  
  // 1. SWING SPEED MATCH (25% weight)
  const swingSpeedScore = scoreSwingSpeed(ball, quizData.driverBallSpeed);
  totalScore += swingSpeedScore * weights.swingSpeed;
  
  // 2. PERFORMANCE PRIORITIES (30% weight)
  const performanceScore = scorePerformance(ball, quizData);
  totalScore += performanceScore * weights.performance;
  
  // 3. PREFERENCES (20% weight)
  const preferencesScore = scorePreferences(ball, quizData);
  totalScore += preferencesScore * weights.preferences;
  
  // 4. PLAYING CONDITIONS (15% weight)
  const conditionsScore = scoreConditions(ball, quizData);
  totalScore += conditionsScore * weights.conditions;
  
  // 5. CURRENT BALL ANALYSIS (10% weight)
  const currentBallScore = scoreCurrentBall(ball, quizData);
  totalScore += currentBallScore * weights.currentBall;
  
  return Math.round(totalScore);
}

// Weight definitions based on user priority type
function getWeights(priorityType: string) {
  switch (priorityType) {
    case 'performance':
      return {
        swingSpeed: 0.30,    // 30%
        performance: 0.40,   // 40%
        preferences: 0.05,   // 5%
        conditions: 0.15,    // 15%
        currentBall: 0.10,   // 10%
      };
    case 'performance_preferences':
      return {
        swingSpeed: 0.25,    // 25%
        performance: 0.30,   // 30%
        preferences: 0.20,   // 20%
        conditions: 0.15,    // 15%
        currentBall: 0.10,   // 10%
      };
    case 'preferences':
      return {
        swingSpeed: 0.15,    // 15%
        performance: 0.15,   // 15%
        preferences: 0.40,   // 40%
        conditions: 0.20,    // 20%
        currentBall: 0.10,   // 10%
      };
    default:
      return {
        swingSpeed: 0.25,
        performance: 0.30,
        preferences: 0.20,
        conditions: 0.15,
        currentBall: 0.10,
      };
  }
}

// 1. SWING SPEED SCORING
function scoreSwingSpeed(ball: Ball, ballSpeed: number): number {
  // Compression matching based on ball speed
  // Rule: Lower ball speed needs lower compression
  
  const compressionTarget = mapBallSpeedToCompression(ballSpeed);
  const compressionDiff = Math.abs(ball.compression - compressionTarget);
  
  // Perfect match = 100, -5 points per 10 compression units away
  let score = 100 - (compressionDiff / 2);
  score = Math.max(0, Math.min(100, score));
  
  return score;
}

function mapBallSpeedToCompression(ballSpeed: number): number {
  if (ballSpeed < 120) return 60;  // Very slow swing
  if (ballSpeed < 135) return 70;  // Slow swing
  if (ballSpeed < 150) return 80;  // Moderate swing
  if (ballSpeed < 165) return 90;  // Above average
  if (ballSpeed < 175) return 100; // Fast swing
  return 105; // Tour-level swing
}

// 2. PERFORMANCE SCORING
function scorePerformance(ball: Ball, quizData: QuizData): number {
  let score = 0;
  let factors = 0;
  
  // Launch trajectory match
  if (ball.launchCharacteristic === quizData.approachTrajectory) {
    score += 100;
  } else if (isAdjacentLaunch(ball.launchCharacteristic, quizData.approachTrajectory)) {
    score += 70; // One level off is acceptable
  } else {
    score += 30; // Two levels off is poor match
  }
  factors++;
  
  // Spin needs
  if (quizData.needShortGameSpin === 'yes') {
    // High wedge spin is critical
    if (ball.spinProfile.wedge === 'high') {
      score += 100;
    } else if (ball.spinProfile.wedge === 'mid') {
      score += 50;
    } else {
      score += 0;
    }
    factors++;
  }
  
  // Current ball spin issue
  if (quizData.currentBallSpin === 'too_much_release') {
    // Needs more spin
    if (ball.spinProfile.iron === 'high' || ball.spinProfile.wedge === 'high') {
      score += 100;
    } else if (ball.spinProfile.iron === 'mid') {
      score += 60;
    } else {
      score += 20;
    }
    factors++;
  } else if (quizData.currentBallSpin === 'too_much_spin') {
    // Needs less spin
    if (ball.spinProfile.iron === 'low' || ball.spinProfile.driver === 'low') {
      score += 100;
    } else if (ball.spinProfile.iron === 'mid') {
      score += 60;
    } else {
      score += 20;
    }
    factors++;
  }
  
 
  
  return factors > 0 ? score / factors : 0;
}

// 3. PREFERENCES SCORING
function scorePreferences(ball: Ball, quizData: QuizData): number {
  let score = 0;
  let factors = 0;
  
  // Price match
  const budgetScore = scoreBudget(ball.pricePerDozen, quizData.budgetRange);
  score += budgetScore;
  factors++;
  
  // Color match
  const colorScore = scoreColor(ball.availableColors, quizData.colorPreference);
  score += colorScore;
  factors++;
  
  // Durability match
  if (quizData.durabilityPriority === 'multiple_rounds' || 
      quizData.durabilityPriority === 'cost_per_round') {
    if (ball.durability >= 4) {
      score += 100;
    } else if (ball.durability === 3) {
      score += 70;
    } else {
      score += 40;
    }
    factors++;
  }

  // Feel match
  if (quizData.preferredFeel !== 'dont_care') {
    if (ball.feelRating === quizData.preferredFeel) {
      score += 100;
    } else if (isAdjacentFeel(ball.feelRating, quizData.preferredFeel)) {
      score += 70;
    } else {
      score += 30;
    }
    factors++;
  }
  
  return factors > 0 ? score / factors : 0;
}

function scoreBudget(price: number, budgetRange: string): number {
  switch (budgetRange) {
    case 'budget':
      if (price < 20) return 100;
      if (price < 25) return 70;
      if (price < 30) return 40;
      return 0;
    case 'value':
      if (price >= 20 && price <= 35) return 100;
      if (price < 20) return 80;
      if (price <= 40) return 70;
      return 30;
    case 'premium':
      if (price >= 35 && price <= 50) return 100;
      if (price < 35) return 60;
      if (price <= 55) return 80;
      return 50;
    case 'tour_level':
      if (price >= 50) return 100;
      if (price >= 45) return 80;
      if (price >= 40) return 60;
      return 40;
    case 'no_limit':
      return 100; // Price doesn't matter
    default:
      return 50;
  }
}

function scoreColor(availableColors: string[], preference: string): number {
  switch (preference) {
    case 'white_only':
      return availableColors.includes('white') ? 100 : 0;
    case 'open_to_color':
      return 100; // Any color works
    case 'graphics_required':
      return availableColors.some(c => c.includes('graphic') || c.includes('pattern')) ? 100 : 0;
    default:
      return 100;
  }
}

// 4. PLAYING CONDITIONS SCORING
function scoreConditions(ball: Ball, quizData: QuizData): number {
  const temp = quizData.typicalTemperature;
  
  // Temperature match
  if (temp === 'mixed') {
    // All-weather balls preferred
    return ball.temperaturePerformance.optimal === 'all' ? 100 : 80;
  }
  
  if (temp === 'cold') {
    // Cold-weather optimized balls score higher
    const coldScore = ball.temperaturePerformance.coldSuitability * 20;
    return Math.min(100, coldScore);
  }
  
  if (ball.temperaturePerformance.optimal === temp || 
      ball.temperaturePerformance.optimal === 'all') {
    return 100;
  }
  
  return 70; // Not optimal but acceptable
}

// 5. CURRENT BALL ANALYSIS
function scoreCurrentBall(ball: Ball, quizData: QuizData): number {
  if (!quizData.currentBall) {
    return 50; // Neutral if no current ball specified
  }

  // If they're happy with current ball spin ("just right"),
  // recommend similar balls
  if (quizData.currentBallSpin === 'just_right') {
    if (ball.name === quizData.currentBall.model) {
      return 100; // Same ball is perfect match
    }
    // Compare actual attributes to find truly similar balls
    const currentBallData = allBalls.find(
      b => b.name === quizData.currentBall!.model
    );
    if (currentBallData) {
      let similarity = 0;
      if (ball.construction === currentBallData.construction) similarity += 30;
      if (ball.coverMaterial === currentBallData.coverMaterial) similarity += 25;
      if (Math.abs(ball.compression - currentBallData.compression) <= 10) similarity += 25;
      if (ball.spinProfile.wedge === currentBallData.spinProfile.wedge) similarity += 20;
      return similarity;
    }
    return 70;
  }

  // If they have issues, avoid current ball
  if (ball.name === quizData.currentBall.model) {
    return 0; // Don't recommend current ball if they have issues
  }

  return 50; // Neutral for other balls
}

// Helper functions
function isAdjacentLaunch(a: string, b: string): boolean {
  const levels = ['low', 'mid', 'high'];
  const indexA = levels.indexOf(a);
  const indexB = levels.indexOf(b);
  return Math.abs(indexA - indexB) === 1;
}

function isAdjacentFeel(a: string, b: string): boolean {
  const levels = ['very_soft', 'soft', 'medium', 'firm'];
  const indexA = levels.indexOf(a);
  const indexB = levels.indexOf(b);
  return Math.abs(indexA - indexB) === 1;
}
```

### 5.3 Generating Explanations

```typescript
function generateExplanation(ball: Ball, quizData: QuizData, scores: CategoryScores): Explanation {
  const whyThisMatches: string[] = [];
  const whatYouGain: string[] = [];
  const tradeoffs: string[] = [];
  
  // Swing speed match
  if (scores.swingSpeedMatch > 80) {
    whyThisMatches.push(
      `${ball.compression} compression perfectly matches your ${quizData.driverBallSpeed} mph ball speed`
    );
  }
  
  // Performance priorities
  if (quizData.needShortGameSpin === 'yes' && ball.spinProfile.wedge === 'high') {
    whyThisMatches.push('High wedge spin gives you the short game control you need');
  }
  
  if (quizData.currentBallSpin === 'too_much_release' && ball.spinProfile.iron === 'high') {
    whatYouGain.push('More spin to hold greens on approach shots');
  }
  
  // Budget considerations
  if (ball.pricePerDozen > 45 && quizData.budgetRange !== 'tour_level' && quizData.budgetRange !== 'no_limit') {
    tradeoffs.push('Premium price point - consider our value alternatives if cost is a concern');
  }
  
  // Durability
  if (ball.durability < 3 && quizData.durabilityPriority === 'multiple_rounds') {
    tradeoffs.push('Softer cover may show wear after multiple rounds - adds to feel but reduces durability');
  }
  
  return { whyThisMatches, whatYouGain, tradeoffs };
}
```

### 5.4 Alternative Recommendations

```typescript
function generateAlternatives(
  topRecommendation: MatchResult,
  allMatches: MatchResult[],
  quizData: QuizData
): Alternatives {
  return {
    stepDown: findStepDown(topRecommendation, allMatches),
    stepUp: findStepUp(topRecommendation, allMatches),
    bestValue: findBestValue(allMatches),
    warmWeather: quizData.typicalTemperature === 'mixed' 
      ? findWarmWeatherOption(allMatches) 
      : null,
    coldWeather: quizData.typicalTemperature === 'mixed' 
      ? findColdWeatherOption(allMatches) 
      : null,
  };
}

function findStepDown(top: MatchResult, all: MatchResult[]): MatchResult | null {
  // Find ball with similar performance but lower price
  const targetPrice = top.ball.pricePerDozen * 0.7; // 30% cheaper
  
  return all.find(match => 
    match.matchScore >= top.matchScore - 10 && // Within 10 points
    match.ball.pricePerDozen <= targetPrice &&
    match.ball.id !== top.ball.id
  ) || null;
}

function findStepUp(top: MatchResult, all: MatchResult[]): MatchResult | null {
  // Find premium ball with better performance
  return all.find(match => 
    match.matchScore > top.matchScore &&
    match.ball.pricePerDozen > top.ball.pricePerDozen &&
    match.ball.coverMaterial === 'urethane' // Tour-level cover
  ) || null;
}

function findBestValue(all: MatchResult[]): MatchResult {
  // Highest score per dollar
  return all.reduce((best, current) => {
    const currentValue = current.matchScore / current.ball.pricePerDozen;
    const bestValue = best.matchScore / best.ball.pricePerDozen;
    return currentValue > bestValue ? current : best;
  });
}

function findWarmWeatherOption(all: MatchResult[]): MatchResult | null {
  return all.find(match => 
    match.ball.temperaturePerformance.optimal === 'warm' ||
    match.ball.temperaturePerformance.optimal === 'all'
  ) || null;
}

function findColdWeatherOption(all: MatchResult[]): MatchResult | null {
  return all
    .filter(match => match.ball.temperaturePerformance.coldSuitability >= 4)
    .sort((a, b) => b.matchScore - a.matchScore)[0] || null;
}
```

---

## 6. API Design

### 6.1 API Routes Specification

#### **POST /api/quiz/submit**

Submit quiz data and generate recommendations.

**API Versioning:**
```
All routes are prefixed with `/api/v1/`. Example: `/api/v1/quiz/submit`.
This enables non-breaking API evolution for future mobile apps or partner integrations.
```

**Request Body:**
```typescript
{
  quizData: QuizData;
  userId?: string; // Optional, if user is logged in
  saveToAccount?: boolean; // Default: true if userId present
}
```

**Response:**
```typescript
{
  sessionId: string;
  recommendations: MatchResult[];
  alternatives: Alternatives;
  timestamp: string;
}
```

**Status Codes:**
- 201: Created (returns sessionId + Location header)
- 400: Invalid quiz data
- 500: Server error

---

#### **GET /api/v1/recommendations/[sessionId]**

Retrieve previously generated recommendations.

**Response:**
```typescript
{
  sessionId: string;
  quizData: QuizData;
  recommendations: MatchResult[];
  alternatives: Alternatives;
  createdAt: string;
}
```

**Status Codes:**
- 200: Success
- 404: Session not found
- 410: Session expired (>30 days)

---

#### **GET /api/v1/balls**

Fetch all balls with optional filtering.

**Query Parameters:**
- `manufacturer`: string (optional)
- `minPrice`: number (optional)
- `maxPrice`: number (optional)
- `compression`: number (optional)
- `construction`: string (optional)
- `color`: string (optional)
- `sortBy`: 'price' | 'compression' | 'name' (default: 'name')
- `sortOrder`: 'asc' | 'desc' (default: 'asc')
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)

**Response:**
```typescript
{
  balls: Ball[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

#### **GET /api/v1/balls/[id]**

Get single ball details.

**Response:**
```typescript
{
  ball: Ball;
}
```

**Status Codes:**
- 200: Success
- 404: Ball not found

---

#### **GET /api/v1/balls/search**

Search balls by name or manufacturer.

**Query Parameters:**
- `q`: string (required, min 2 characters)
- `limit`: number (default: 10, max: 20)

**Response:**
```typescript
{
  results: Ball[];
  query: string;
}
```

---

#### **POST /api/v1/users/[id]/recommendations**

Save recommendation to user account (authenticated).

**Request Body:**
```typescript
{
  sessionId: string;
}
```

**Response:**
```typescript
{
  saved: boolean;
  recommendationId: string;
}
```

---

#### **GET /api/v1/users/[id]/history**

Get user's recommendation history (authenticated).

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response:**
```typescript
{
  history: Array<{
    id: string;
    createdAt: string;
    topRecommendation: string; // Ball name
    sessionId: string;
  }>;
  pagination: PaginationInfo;
}
```

---

### 6.2 Authentication Flow

**Using NextAuth.js (Auth.js v5):**

```typescript
// lib/auth/nextauth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
```

---

## 7. Security & Privacy

### 7.1 Security Measures

**Authentication:**
- Password hashing: bcrypt with salt rounds >= 12
- JWT tokens with secure httpOnly cookies
- CSRF protection via NextAuth
- Rate limiting on auth endpoints (5 attempts per 15 minutes)

```
// NOTE: Credentials provider + JWT strategy means sessions cannot be
// revoked server-side. If session revocation is needed (e.g., account
// compromise), implement a token blocklist via Redis or switch to
// database-backed sessions for the Credentials provider.
```

**Data Protection:**
- HTTPS only (enforced)
- Environment variables for secrets (never in code)
- SQL injection protection (Prisma parameterized queries)
- XSS protection (React escapes by default)
- Content Security Policy headers

**API Security:**
- Rate limiting: 100 requests per minute per IP
- Quiz submission rate limiting: 10 requests per minute per IP
- Input validation with Zod on all endpoints
- Sanitize user inputs
- Authenticated endpoints require valid session

### 7.2 Privacy & Compliance

**GDPR Compliance:**
- Cookie consent banner
- Privacy policy
- Data export functionality
- Account deletion (hard delete all user data)
- No third-party trackers without consent

**Data Retention:**
- Guest sessions: 30 days, then deleted
- User accounts: Retained until account deletion
- Audit logs: 90 days

**Analytics:**
- Use privacy-focused analytics (Plausible, no cookies)
- No personally identifiable information (PII) in analytics
- Aggregate data only

---

## 8. Performance Optimization

### 8.1 Frontend Optimization

**Code Splitting:**
```typescript
// Dynamic imports for heavy components
const BallComparison = dynamic(() => import('@/components/ball/BallComparison'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Client-side only if interactive
});
```

**Image Optimization:**
```typescript
// Using Next.js Image component
import Image from 'next/image';

<Image
  src={`/images/balls/${ball.id}.webp`}
  alt={ball.name}
  width={300}
  height={300}
  loading="lazy"
  placeholder="blur"
/>
```

**Bundle Size:**
- Tree-shaking with ESM
- Remove unused Tailwind classes (PurgeCSS)
- Compress with Brotli
- Target bundle: <200KB initial JS

### 8.2 Backend Optimization

**Database Optimization:**
```typescript
// Prisma indexes
model Ball {
  id           String @id @default(cuid())
  manufacturer String
  compression  Int
  pricePerDozen Decimal @db.Decimal(5, 2)
  
  @@index([manufacturer])
  @@index([compression])
  @@index([pricePerDozen])
  @@index([manufacturer, pricePerDozen])
}
```

**Caching Strategy:**
```typescript
// Redis caching for ball database (if using Redis)
async function getAllBalls(): Promise<Ball[]> {
  const cacheKey = 'balls:all';
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from DB
  const balls = await prisma.ball.findMany();
  
  // Cache for 1 hour
  await redis.set(cacheKey, JSON.stringify(balls), 'EX', 3600);
  
  return balls;
}
```

**Algorithm Optimization:**
- Pre-calculate static data (compression mappings)
- Use Set/Map for O(1) lookups instead of array.find
- Parallelize independent calculations
- Limit to top 20 matches before detailed scoring

---

## 9. Testing Strategy

### 9.1 Unit Tests (Vitest)

```typescript
// lib/matching-algorithm/scoring.test.ts
import { describe, it, expect } from 'vitest';
import { scoreSwingSpeed, mapBallSpeedToCompression } from './scoring';

describe('Swing Speed Scoring', () => {
  it('should return 100 for perfect compression match', () => {
    const ball = { compression: 90 };
    const ballSpeed = 160; // Maps to 90 compression
    expect(scoreSwingSpeed(ball, ballSpeed)).toBe(100);
  });

  it('should penalize compression mismatch', () => {
    const ball = { compression: 70 };
    const ballSpeed = 175; // Maps to 105 compression
    const score = scoreSwingSpeed(ball, ballSpeed);
    expect(score).toBeLessThan(100);
    expect(score).toBeGreaterThan(0);
  });
});

describe('Ball Speed to Compression Mapping', () => {
  it('should map low ball speed to low compression', () => {
    expect(mapBallSpeedToCompression(115)).toBe(60);
  });

  it('should map high ball speed to high compression', () => {
    expect(mapBallSpeedToCompression(180)).toBe(105);
  });
});
```

### 9.2 Integration Tests

```typescript
// app/api/quiz/submit/route.test.ts
import { describe, it, expect } from 'vitest';
import { POST } from './route';

describe('POST /api/quiz/submit', () => {
  it('should return recommendations for valid quiz data', async () => {
    const request = new Request('http://localhost/api/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({
        quizData: {
          // ... valid quiz data
        },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('sessionId');
    expect(data).toHaveProperty('recommendations');
    expect(data.recommendations).toHaveLength(5);
  });

  it('should return 400 for invalid quiz data', async () => {
    const request = new Request('http://localhost/api/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({
        quizData: {
          // ... incomplete data
        },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

### 9.3 E2E Tests (Playwright)

```typescript
// tests/e2e/quiz-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete quiz flow generates recommendations', async ({ page }) => {
  await page.goto('/');
  
  // Click "Find My Ball" button
  await page.click('text=Find My Ball');
  await expect(page).toHaveURL('/quiz');
  
  // Step 1: Background
  await page.selectOption('select[name="handicap"]', '11-15');
  await page.selectOption('select[name="roundsPerYear"]', '50-100');
  await page.click('text=Next');
  
  // Step 2-6: Fill out remaining steps
  // ... (fill each step)
  
  // Step 7: Review and submit
  await page.click('text=Get Recommendations');
  
  // Wait for results page
  await expect(page).toHaveURL(/\/results\/[a-zA-Z0-9]+/);
  
  // Verify recommendations displayed
  const recommendations = await page.locator('.recommendation-card');
  await expect(recommendations).toHaveCount(5);
  
  // Verify match percentage shown
  const firstMatch = recommendations.first();
  await expect(firstMatch.locator('.match-percentage')).toBeVisible();
});
```

### 9.4 Test Coverage Goals

- Unit tests: 80%+ coverage for algorithm logic
- Integration tests: All API endpoints
- E2E tests: Critical user flows (quiz, results, comparison)

---

## 10. Deployment & DevOps

### 10.1 Environment Variables

```bash
# .env.example

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fitmyball"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="fitmyball.com"

# Sentry (Error Tracking)
SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"

# Redis (Optional)
REDIS_URL="redis://localhost:6379"

# Object Storage (Optional)
S3_BUCKET_NAME="golf-ball-images"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="xxxxx"
S3_SECRET_ACCESS_KEY="xxxxx"
```

### 10.2 Deployment Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run linter
        run: pnpm lint
      
      - name: Run type check
        run: pnpm type-check
      
      - name: Run unit tests
        run: pnpm test:unit
      
      - name: Run integration tests
        run: pnpm test:integration

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 10.3 Database Migrations

```bash
# Development
pnpm prisma migrate dev --name add_temperature_fields

# Production
pnpm prisma migrate deploy
```

### 10.4 Monitoring & Alerting

**Vercel Analytics:**
- Page load times
- Web Vitals (LCP, FID, CLS)
- Geographic distribution

**Sentry Error Tracking:**
- JavaScript errors
- API errors
- Performance monitoring

**Custom Alerts:**
- API response time > 2 seconds
- Error rate > 1%
- Database connection issues

---

## 11. Scalability Considerations

### 11.1 Current Architecture Scaling

**Vertical Scaling (Initial 10K users):**
- Vercel serverless functions auto-scale
- Database: Increase PostgreSQL instance size
- No code changes needed

**Horizontal Scaling (10K-100K users):**
- Add Redis caching layer
- Database read replicas
- CDN for static assets (already on Vercel)

### 11.2 Future Scaling Options

**100K+ Users:**
- Separate read/write databases
- Full-text search with Elasticsearch
- Dedicated caching layer (Redis Cluster)
- Microservices architecture (if needed)
  - Ball matching service
  - User service
  - Recommendation service

---

## 12. Open Technical Decisions

### 12.1 Questions for Review

1. **Database Choice:**
   - PostgreSQL (recommended) vs MySQL?
   - Self-hosted vs managed (Supabase, Vercel Postgres)?

2. **Caching:**
   - Start without Redis (simpler) or include from V1?
   - Use in-memory caching initially?

3. **Image Storage:**
   - Local public folder vs S3/Blob Storage?
   - Image optimization strategy?

4. **Analytics:**
   - Plausible (privacy-focused, paid) vs PostHog (open-source)?

5. **Email Provider:**
   - Resend (modern, good DX) vs SendGrid (established)?

---

## 13. Next Steps

After approval of this technical spec:

1. **Database Schema Design** (Document 3)
   - Prisma schema definition
   - Sample data structure
   - Migration strategy

2. **UI/UX Design Document** (Document 4)
   - User flows
   - Wireframes
   - Component specifications

3. **Development Kickoff**
   - Set up repository
   - Initialize Next.js project
   - Configure Prisma + database
   - Install dependencies

---

## Document Control

**Created by:** Technical Team  
**Last Updated:** February 11, 2026  
**Next Review:** Post-Database Schema completion  
**Distribution:** Development Team, DevOps Team

**Change Log:**
- v1.0 (Feb 11, 2026): Initial technical specification
