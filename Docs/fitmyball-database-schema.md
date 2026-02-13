# FitMyBall - Database Schema & Data Models

**Version:** 1.0  
**Date:** February 11, 2026  
**Status:** Draft for Development  
**Related Documents:** PRD v1.0, Technical Spec v1.0

---

## 1. Executive Summary

This document defines the complete database schema, data models, and relationships for the FitMyBall application. Using PostgreSQL with Prisma ORM, the schema supports all features outlined in the PRD while maintaining scalability, data integrity, and query performance.

### 1.1 Database Overview

- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Total Tables:** 7 core tables + NextAuth tables
- **Key Features:** 
  - Relational integrity with foreign keys
  - Full-text search on ball names
  - Optimized indexes for common queries
  - Soft deletes for user data
  - Timestamp tracking on all tables

---

## 2. Complete Prisma Schema

### 2.1 Full Schema Definition

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// BALL DATA
// ============================================================================

model Ball {
  id                String   @id @default(cuid())
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Basic Info
  name              String
  manufacturer      String
  modelYear         Int?     // e.g., 2024
  description       String?  @db.Text
  marketingCopy     String?  @db.Text
  
  // Construction
  construction      String   // "2-piece", "3-piece", "4-piece", "5-piece"
  coverMaterial     String   // "Ionomer", "Urethane", "Cast Urethane", "Surlyn"
  coreMaterial      String?  // "Rubber", "Polybutadiene", etc.
  layers            Int      // 2, 3, 4, or 5
  
  // Performance Characteristics
  compression       Int      // 40-110+
  
  // Spin Profile (stored as enum values)
  driverSpin        SpinLevel
  ironSpin          SpinLevel
  wedgeSpin         SpinLevel
  
  // Launch Characteristics
  launchProfile     LaunchLevel
  
  // Feel
  feelRating        FeelLevel
  
  // Durability (1-5 scale)
  durability        Int      @default(3)
  
  // Target Player
  targetHandicapMin  Int?   // null means "all"
  targetHandicapMax  Int?   // null means "all"
  skillLevel        String[] // ["Beginner", "Intermediate", "Advanced", "Tour"]
  
  // Pricing
  pricePerDozen     Decimal  @db.Decimal(6, 2)
  msrp              Decimal  @db.Decimal(6, 2)    // Manufacturer suggested retail price
  
  // Availability
  availableColors   String[] // ["White", "Yellow", "Orange", "Pink", "Matte", "Graphic"]
  inStock           Boolean  @default(true)
  discontinued      Boolean  @default(false)
  
  // Temperature Performance
  optimalTemp       TempLevel
  coldSuitability   Int      @default(3) // 1-5 scale
  
  // Media
  imageUrl          String?
  imageUrls         String[] // Multiple product images
  
  // External Links
  manufacturerUrl   String?
  
  // SEO
  slug              String   @unique // URL-friendly name
  
  // Relationships
  recommendations   RecommendationBall[]
  userFavorites     UserFavoriteBall[]
  userTriedBalls    UserTriedBall[]
  
  // Indexes for common queries
  @@index([manufacturer])
  @@index([compression])
  @@index([pricePerDozen])
  @@index([manufacturer, pricePerDozen])
  @@index([discontinued])
  @@map("balls")
  @@index([discontinued, construction, coverMaterial])
  @@index([discontinued, driverSpin, wedgeSpin, feelRating])
}

// ============================================================================
// ENUMS FOR BALL CHARACTERISTICS
// ============================================================================

enum SpinLevel {
  LOW
  MID
  HIGH
}

enum LaunchLevel {
  LOW
  MID
  HIGH
}

enum FeelLevel {
  VERY_SOFT
  SOFT
  MEDIUM
  FIRM
}

enum TempLevel {
  WARM      // 70°F and above
  MODERATE  // 50-70°F
  COLD      // Below 50°F
  ALL       // All conditions
}

// ============================================================================
// USER MANAGEMENT & AUTHENTICATION
// ============================================================================

model User {
  id                String    @id @default(cuid())
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Auth Info
  email             String    @unique
  emailVerified     DateTime?
  name              String?
  passwordHash      String?   // Null if OAuth only
  
  // Profile Info
  handicap           Float?  // Actual numeric handicap, e.g. 14.2
  homeCourseName    String?
  homeLocation      String?   // City, State
  
  // Preferences
  preferredUnits    String    @default("imperial") // "imperial" or "metric"
  
  // Privacy
  optInMarketing    Boolean   @default(false)
  optInAnalytics    Boolean   @default(true)
  
  // Soft delete
  deletedAt         DateTime?
  
  // Relationships
  accounts          Account[]
  sessions          Session[]
  quizSessions      QuizSession[]
  recommendations   Recommendation[]
  favoriteBalls     UserFavoriteBall[]
  triedBalls        UserTriedBall[]
  profiles          UserProfile[]
  
  @@index([email])
  @@map("users")
}

model UserProfile {
  id                String   @id @default(cuid())
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Profile Type (for seasonal profiles)
  profileName       String   // "Summer Setup", "Winter Setup", "Default"
  isDefault         Boolean  @default(false)
  
  // Saved Quiz Preferences
  preferredFeel     String?
  budgetRange       String?
  colorPreference   String?
  typicalTemp       String?
  
  // Performance Metrics
  driverBallSpeed   Int?     // mph
  ironDistance8     Int?     // yards
  
  @@unique([userId, profileName])
  @@index([userId])
  @@map("user_profiles")
}

// ============================================================================
// QUIZ & RECOMMENDATIONS
// ============================================================================

model QuizSession {
  id                String   @id @default(cuid())
  createdAt         DateTime @default(now())
  expiresAt         DateTime // 30 days from creation
  
  // User (optional - null for guest sessions)
  userId            String?
  user              User?    @relation(fields: [userId], references: [id], onDelete: NoAction)
  
  // Quiz Data (stored as JSON)
  quizData          Json     // All quiz responses
  
  // IP address for rate limiting (guests only)
  ipAddress         String?
  
  // Session metadata
  completed         Boolean  @default(false)
  shareToken        String?  @unique // For shareable links
  
  // Relationships
  recommendation    Recommendation?
  
  @@index([userId])
  @@index([shareToken])
  @@index([expiresAt])
  @@map("quiz_sessions")
}

model Recommendation {
  id                String      @id @default(cuid())
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  
  // Links
  userId            String?
  user              User?       @relation(fields: [userId], references: [id], onDelete: NoAction)
  
  quizSessionId     String      @unique
  quizSession       QuizSession @relation(fields: [quizSessionId], references: [id], onDelete: Cascade)
  
  // Recommendation Results (top 5 balls with scores)
  recommendedBalls  RecommendationBall[]
  
  // Algorithm metadata
  algorithmVersion  String      @default("1.0")
  
  // User actions
  viewed            Boolean     @default(false)
  saved             Boolean     @default(false)
  
  @@index([userId])
  @@index([createdAt])
  @@map("recommendations")
}

model RecommendationBall {
  id                String         @id @default(cuid())
  
  recommendationId  String
  recommendation    Recommendation @relation(fields: [recommendationId], references: [id], onDelete: Cascade)
  
  ballId            String
  ball              Ball           @relation(fields: [ballId], references: [id], onDelete: Cascade)
  
  // Ranking
  rank              Int            // 1-5 (1 = top recommendation)
  matchScore        Float          // 0-100
  
  // Category Scores
  swingSpeedScore   Float
  performanceScore  Float
  preferencesScore  Float
  conditionsScore   Float
  currentBallScore  Float
  
  // Explanation (stored as JSON)
  explanation       Json           // { whyThisMatches: [], whatYouGain: [], tradeoffs: [] }
  
  @@unique([recommendationId, ballId])
  @@index([recommendationId])
  @@map("recommendation_balls")
}

// ============================================================================
// USER BALL INTERACTIONS
// ============================================================================

model UserFavoriteBall {
  id                String   @id @default(cuid())
  createdAt         DateTime @default(now())
  
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  ballId            String
  ball              Ball     @relation(fields: [ballId], references: [id], onDelete: Cascade)
  
  @@unique([userId, ballId])
  @@index([userId])
  @@map("user_favorite_balls")
}

model UserTriedBall {
  id                String   @id @default(cuid())
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  ballId            String
  ball              Ball     @relation(fields: [ballId], references: [id], onDelete: Cascade)
  
  // User Experience
  rating            Int?     // 1-5 stars
  notes             String?  @db.Text
  roundsPlayed      Int?     // How many rounds with this ball
  wouldRecommend    Boolean?
  
  // Performance feedback (optional)
  enum ComparisonLevel {
    BETTER
    AS_EXPECTED
    WORSE
  }

  enum SpinComparison {
    MORE
    AS_EXPECTED
    LESS
  }

  enum FeelComparison {
    SOFTER
    AS_EXPECTED
    FIRMER
  }

  
  @@unique([userId, ballId])
  @@index([userId])
  @@map("user_tried_balls")
}

// ============================================================================
// NEXTAUTH TABLES (Standard NextAuth Schema)
// ============================================================================

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

---

## 3. Table Descriptions & Rationale

### 3.1 Ball Table

**Purpose:** Core ball database storing all golf ball specifications and characteristics.

**Key Design Decisions:**
- **Enums for Spin/Launch/Feel:** Ensures data consistency, prevents typos
- **Array fields (colors, skill levels):** PostgreSQL array support for multiple values
- **Slug field:** SEO-friendly URLs (`/ball/titleist-pro-v1` instead of `/ball/abc123`)
- **Soft delete (discontinued):** Keep historical data for old recommendations
- **Multiple images:** Primary + additional product shots

**Indexes:**
- `manufacturer`: Browse by brand
- `compression`: Filter by compression range
- `pricePerDozen`: Sort by price, filter by budget
- `manufacturer + pricePerDozen`: Combined brand + price filtering
- `slug`: Fast URL lookups
- `discontinued`: Exclude discontinued balls from results

### 3.2 User & Authentication Tables

**Purpose:** User accounts, authentication, and profile management.

**Key Design Decisions:**
- **Soft delete (deletedAt):** GDPR compliance - mark deleted but retain for analytics
- **Optional passwordHash:** Supports both OAuth and email/password
- **UserProfile separate table:** Allows multiple profiles per user (summer/winter setups)
- **Marketing opt-in:** Explicit consent for communications

**NextAuth Tables:**
- Standard NextAuth schema for OAuth + credentials
- No modifications needed to default schema

### 3.3 Quiz & Recommendation Tables

**Purpose:** Store quiz responses, generate recommendations, track user history.

**Key Design Decisions:**
- **QuizSession stores raw JSON:** Flexible schema, can evolve without migrations
- **30-day expiration:** Automatic cleanup of guest sessions
- **shareToken:** Generate shareable links for guest users
- **RecommendationBall junction table:** Stores detailed scoring for each recommended ball
- **Algorithm version tracking:** Ability to re-run with updated algorithm

**Why JSON for quizData:**
```json
{
  "currentBall": {
    "brand": "Titleist",
    "model": "Pro V1"
  },
  "handicap": "11-15",
  "roundsPerYear": "50-100",
  "priorityType": "performance_preferences",
  "driverBallSpeed": 155,
  // ... all other quiz fields
}
```
- Flexibility: Add new questions without schema changes
- Complete audit trail: Exactly what user submitted
- Easy to deserialize into TypeScript types

### 3.4 User Ball Interaction Tables

**Purpose:** Track which balls users have favorited and tried.

**Key Design Decisions:**
- **UserFavoriteBall:** Simple favorites/wishlist
- **UserTriedBall:** Rich feedback about actual experience
- **Comparison feedback fields:** "Better/Worse than expected" provides data for algorithm improvement
- **Unique constraint:** User can only favorite/try each ball once

---

## 4. Data Types & TypeScript Interfaces

### 4.1 TypeScript Types (Generated from Prisma)

```typescript
// types/ball.ts
import { Ball, SpinLevel, LaunchLevel, FeelLevel, TempLevel } from '@prisma/client';

export type { Ball, SpinLevel, LaunchLevel, FeelLevel, TempLevel };

// Extended type with relationships
export type BallWithDetails = Ball & {
  _count?: {
    recommendations: number;
    userFavorites: number;
  };
};

// Ball creation input
export type CreateBallInput = Omit<Ball, 'id' | 'createdAt' | 'updatedAt'>;

// Ball filter params
export interface BallFilterParams {
  manufacturer?: string;
  minPrice?: number;
  maxPrice?: number;
  minCompression?: number;
  maxCompression?: number;
  construction?: string;
  coverMaterial?: string;
  color?: string;
  targetHandicap?: string;
  discontinued?: boolean;
  sortBy?: 'name' | 'pricePerDozen' | 'compression' | 'manufacturer';
  sortOrder?: 'asc' | 'desc';
}

// Ball search result
export interface BallSearchResult {
  ball: Ball;
  relevance: number;
}
```

```typescript
// types/quiz.ts
export interface QuizData {
  // Background
  currentBall?: {
    brand: string;
    model: string;
  };
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
  preferredFeel: 'very_soft' | 'soft' | 'medium_firm' | 'dont_care';
  colorPreference: 'white_only' | 'open_to_color' | 'graphics_required';
  budgetRange: 'budget' | 'value' | 'premium' | 'tour_level' | 'no_limit';
  durabilityPriority: 'single_round' | 'multiple_rounds' | 'cost_per_round';
  
  // Playing Conditions
  typicalTemperature: 'warm' | 'moderate' | 'cold' | 'mixed';
  improvementAreas: string[];
  
  // Metrics
  driverBallSpeed: number;
  ironDistance8: number;
}

export interface QuizSessionWithRelations extends QuizSession {
  user?: User;
  recommendation?: RecommendationWithBalls;
}
```

```typescript
// types/recommendation.ts
import { Recommendation, RecommendationBall, Ball } from '@prisma/client';

export type RecommendationWithBalls = Recommendation & {
  recommendedBalls: Array<RecommendationBall & { ball: Ball }>;
  quizSession: QuizSession;
};

export interface MatchResult {
  ball: Ball;
  matchScore: number;
  rank: number;
  categoryScores: {
    swingSpeedScore: number;
    performanceScore: number;
    preferencesScore: number;
    conditionsScore: number;
    currentBallScore: number;
  };
  explanation: {
    whyThisMatches: string[];
    whatYouGain: string[];
    tradeoffs: string[];
  };
}

export interface AlternativeRecommendations {
  stepDown?: MatchResult;
  stepUp?: MatchResult;
  bestValue: MatchResult;
  warmWeather?: MatchResult;
  coldWeather?: MatchResult;
}
```

---

## 5. Sample Data & Seed Script

### 5.1 Seed Data Structure

```typescript
// prisma/seed.ts
import { PrismaClient, SpinLevel, LaunchLevel, FeelLevel, TempLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (development only)
  await prisma.recommendationBall.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.quizSession.deleteMany();
  await prisma.userTriedBall.deleteMany();
  await prisma.userFavoriteBall.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.ball.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ========================================
  // SEED GOLF BALLS
  // ========================================
  
  console.log('⛳ Creating golf balls...');

  const balls = await Promise.all([
    // TITLEIST
    prisma.ball.create({
      data: {
        name: 'Pro V1',
        manufacturer: 'Titleist',
        modelYear: 2024,
        slug: 'titleist-pro-v1',
        description: 'The #1 ball in golf, delivering total performance with optimal flight and consistent spin.',
        construction: '3-piece',
        coverMaterial: 'Cast Urethane',
        layers: 3,
        compression: 90,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        targetHandicap: '0-20',
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 54.99,
        msrp: 54.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/titleist-pro-v1.webp',
        manufacturerUrl: 'https://www.titleist.com/golf-balls/pro-v1',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'Pro V1x',
        manufacturer: 'Titleist',
        modelYear: 2024,
        slug: 'titleist-pro-v1x',
        description: 'High flight, spin, and stopping power for players who prefer a firmer feel.',
        construction: '4-piece',
        coverMaterial: 'Cast Urethane',
        layers: 4,
        compression: 98,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.MEDIUM,
        durability: 4,
        targetHandicap: '0-15',
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 54.99,
        msrp: 54.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/titleist-pro-v1x.webp',
        manufacturerUrl: 'https://www.titleist.com/golf-balls/pro-v1x',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'AVX',
        manufacturer: 'Titleist',
        modelYear: 2024,
        slug: 'titleist-avx',
        description: 'Premium performance with exceptionally soft feel and low spin on long shots.',
        construction: '3-piece',
        coverMaterial: 'Cast Urethane',
        layers: 3,
        compression: 80,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.LOW,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.LOW,
        feelRating: FeelLevel.VERY_SOFT,
        durability: 3,
        targetHandicap: '0-20',
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 49.99,
        msrp: 49.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.WARM,
        coldSuitability: 3,
        imageUrl: '/images/balls/titleist-avx.webp',
        manufacturerUrl: 'https://www.titleist.com/golf-balls/avx',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'Tour Speed',
        manufacturer: 'Titleist',
        modelYear: 2024,
        slug: 'titleist-tour-speed',
        description: 'Tour-proven distance and short game control with a penetrating flight.',
        construction: '3-piece',
        coverMaterial: 'Cast Urethane',
        layers: 3,
        compression: 85,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        targetHandicap: '10-25',
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 44.99,
        msrp: 44.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/titleist-tour-speed.webp',
        manufacturerUrl: 'https://www.titleist.com/golf-balls/tour-speed',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'TruFeel',
        manufacturer: 'Titleist',
        modelYear: 2024,
        slug: 'titleist-trufeel',
        description: 'Soft feel with consistent ball flight for improved scoring.',
        construction: '2-piece',
        coverMaterial: 'Ionomer',
        layers: 2,
        compression: 60,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.LOW,
        wedgeSpin: SpinLevel.MID,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.VERY_SOFT,
        durability: 5,
        targetHandicap: 'All',
        skillLevel: ['Beginner', 'Intermediate'],
        pricePerDozen: 24.99,
        msrp: 24.99,
        availableColors: ['White', 'Yellow', 'Matte'],
        inStock: true,
        optimalTemp: TempLevel.WARM,
        coldSuitability: 2,
        imageUrl: '/images/balls/titleist-trufeel.webp',
        manufacturerUrl: 'https://www.titleist.com/golf-balls/trufeel',
      },
    }),

    // CALLAWAY
    prisma.ball.create({
      data: {
        name: 'Chrome Soft',
        manufacturer: 'Callaway',
        modelYear: 2024,
        slug: 'callaway-chrome-soft',
        description: 'Tour-level performance with exceptional feel and greenside control.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 75,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.VERY_SOFT,
        durability: 4,
        targetHandicap: '0-20',
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 49.99,
        msrp: 49.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/callaway-chrome-soft.webp',
        manufacturerUrl: 'https://www.callawaygolf.com/golf-balls/chrome-soft',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'Chrome Soft X',
        manufacturer: 'Callaway',
        modelYear: 2024,
        slug: 'callaway-chrome-soft-x',
        description: 'High launch, low spin off the tee with exceptional workability.',
        construction: '4-piece',
        coverMaterial: 'Urethane',
        layers: 4,
        compression: 90,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        targetHandicap: '0-15',
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 49.99,
        msrp: 49.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/callaway-chrome-soft-x.webp',
        manufacturerUrl: 'https://www.callawaygolf.com/golf-balls/chrome-soft-x',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'Supersoft',
        manufacturer: 'Callaway',
        modelYear: 2024,
        slug: 'callaway-supersoft',
        description: 'Ultra-low compression for maximum distance and soft feel.',
        construction: '2-piece',
        coverMaterial: 'Ionomer',
        layers: 2,
        compression: 38,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.LOW,
        wedgeSpin: SpinLevel.LOW,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.VERY_SOFT,
        durability: 5,
        targetHandicap: 'All',
        skillLevel: ['Beginner', 'Intermediate'],
        pricePerDozen: 24.99,
        msrp: 24.99,
        availableColors: ['White', 'Yellow', 'Orange', 'Pink', 'Matte'],
        inStock: true,
        optimalTemp: TempLevel.WARM,
        coldSuitability: 2,
        imageUrl: '/images/balls/callaway-supersoft.webp',
        manufacturerUrl: 'https://www.callawaygolf.com/golf-balls/supersoft',
      },
    }),

    // TAYLORMADE
    prisma.ball.create({
      data: {
        name: 'TP5',
        manufacturer: 'TaylorMade',
        modelYear: 2024,
        slug: 'taylormade-tp5',
        description: 'Complete tee-to-green performance with Tour Flight Dimple Pattern.',
        construction: '5-piece',
        coverMaterial: 'Cast Urethane',
        layers: 5,
        compression: 85,
        driverSpin: SpinLevel.MID,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        targetHandicap: '0-15',
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 49.99,
        msrp: 49.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/taylormade-tp5.webp',
        manufacturerUrl: 'https://www.taylormadegolf.com/TP5-Golf-Balls',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'TP5x',
        manufacturer: 'TaylorMade',
        modelYear: 2024,
        slug: 'taylormade-tp5x',
        description: 'Higher launch and more spin than TP5 for players seeking maximum distance.',
        construction: '5-piece',
        coverMaterial: 'Cast Urethane',
        layers: 5,
        compression: 97,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.MEDIUM,
        durability: 4,
        targetHandicap: '0-15',
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 49.99,
        msrp: 49.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/taylormade-tp5x.webp',
        manufacturerUrl: 'https://www.taylormadegolf.com/TP5x-Golf-Balls',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'Tour Response',
        manufacturer: 'TaylorMade',
        modelYear: 2024,
        slug: 'taylormade-tour-response',
        description: 'Tour performance at a value price with 100% urethane cover.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 70,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 3,
        targetHandicap: '10-25',
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 34.99,
        msrp: 34.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 3,
        imageUrl: '/images/balls/taylormade-tour-response.webp',
        manufacturerUrl: 'https://www.taylormadegolf.com/Tour-Response-Golf-Balls',
      },
    }),

    // BRIDGESTONE
    prisma.ball.create({
      data: {
        name: 'Tour B X',
        manufacturer: 'Bridgestone',
        modelYear: 2024,
        slug: 'bridgestone-tour-b-x',
        description: 'Maximum distance and control for players with faster swing speeds.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 105,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.FIRM,
        durability: 5,
        targetHandicap: '0-10',
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 49.99,
        msrp: 49.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 5,
        imageUrl: '/images/balls/bridgestone-tour-b-x.webp',
        manufacturerUrl: 'https://www.bridgestonegolf.com/en-us/golf-balls/tour-b-x',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'Tour B RX',
        manufacturer: 'Bridgestone',
        modelYear: 2024,
        slug: 'bridgestone-tour-b-rx',
        description: 'Enhanced feel and distance for moderate swing speeds.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 76,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        targetHandicap: '10-20',
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 44.99,
        msrp: 44.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/bridgestone-tour-b-rx.webp',
        manufacturerUrl: 'https://www.bridgestonegolf.com/en-us/golf-balls/tour-b-rx',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'e12 Contact',
        manufacturer: 'Bridgestone',
        modelYear: 2024,
        slug: 'bridgestone-e12-contact',
        description: 'Maximum distance with soft feel and straight ball flight.',
        construction: '3-piece',
        coverMaterial: 'Ionomer',
        layers: 3,
        compression: 60,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.LOW,
        wedgeSpin: SpinLevel.MID,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 5,
        targetHandicap: 'All',
        skillLevel: ['Beginner', 'Intermediate'],
        pricePerDozen: 29.99,
        msrp: 29.99,
        availableColors: ['White', 'Matte'],
        inStock: true,
        optimalTemp: TempLevel.MODERATE,
        coldSuitability: 3,
        imageUrl: '/images/balls/bridgestone-e12.webp',
        manufacturerUrl: 'https://www.bridgestonegolf.com/en-us/golf-balls/e12-contact',
      },
    }),

    // SRIXON
    prisma.ball.create({
      data: {
        name: 'Z-Star',
        manufacturer: 'Srixon',
        modelYear: 2024,
        slug: 'srixon-z-star',
        description: 'Tour-level performance with exceptional greenside spin and control.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 88,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        targetHandicap: '0-15',
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 44.99,
        msrp: 44.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/srixon-z-star.webp',
        manufacturerUrl: 'https://www.srixon.com/golf-balls/z-star',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'Z-Star XV',
        manufacturer: 'Srixon',
        modelYear: 2024,
        slug: 'srixon-z-star-xv',
        description: 'Maximum distance with firmer feel for higher swing speeds.',
        construction: '4-piece',
        coverMaterial: 'Urethane',
        layers: 4,
        compression: 102,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.MEDIUM,
        durability: 4,
        targetHandicap: '0-10',
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 44.99,
        msrp: 44.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 5,
        imageUrl: '/images/balls/srixon-z-star-xv.webp',
        manufacturerUrl: 'https://www.srixon.com/golf-balls/z-star-xv',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'Q-Star Tour',
        manufacturer: 'Srixon',
        modelYear: 2024,
        slug: 'srixon-q-star-tour',
        description: 'Tour performance at a value price with soft urethane cover.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 72,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 3,
        targetHandicap: '10-25',
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 34.99,
        msrp: 34.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 3,
        imageUrl: '/images/balls/srixon-q-star-tour.webp',
        manufacturerUrl: 'https://www.srixon.com/golf-balls/q-star-tour',
      },
    }),

    // VICE
    prisma.ball.create({
      data: {
        name: 'Pro Plus',
        manufacturer: 'Vice',
        modelYear: 2024,
        slug: 'vice-pro-plus',
        description: 'Tour-level performance with exceptional distance and control.',
        construction: '4-piece',
        coverMaterial: 'Cast Urethane',
        layers: 4,
        compression: 95,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.MEDIUM,
        durability: 4,
        targetHandicap: '0-15',
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 34.95,
        msrp: 34.95,
        availableColors: ['White', 'Yellow', 'Neon', 'Graphic'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/vice-pro-plus.webp',
        manufacturerUrl: 'https://www.vicegolf.com/pro-plus',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'Tour',
        manufacturer: 'Vice',
        modelYear: 2024,
        slug: 'vice-tour',
        description: 'Premium 3-piece ball offering tour performance at value pricing.',
        construction: '3-piece',
        coverMaterial: 'Cast Urethane',
        layers: 3,
        compression: 80,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        targetHandicap: '10-25',
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 29.95,
        msrp: 29.95,
        availableColors: ['White', 'Yellow', 'Neon', 'Graphic'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/vice-tour.webp',
        manufacturerUrl: 'https://www.vicegolf.com/tour',
      },
    }),

    // CUT GOLF
    prisma.ball.create({
      data: {
        name: 'Blue',
        manufacturer: 'Cut',
        modelYear: 2024,
        slug: 'cut-blue',
        description: 'Premium urethane ball with exceptional value and performance.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 85,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        targetHandicap: '10-25',
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 24.99,
        msrp: 24.99,
        availableColors: ['White'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/cut-blue.webp',
        manufacturerUrl: 'https://www.cutgolf.com/blue',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'Grey',
        manufacturer: 'Cut',
        modelYear: 2024,
        slug: 'cut-grey',
        description: 'Mid-compression ball designed for moderate swing speeds.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 75,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        targetHandicap: '15-30',
        skillLevel: ['Intermediate'],
        pricePerDozen: 24.99,
        msrp: 24.99,
        availableColors: ['White'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 3,
        imageUrl: '/images/balls/cut-grey.webp',
        manufacturerUrl: 'https://www.cutgolf.com/grey',
      },
    }),

    // SNELL
    prisma.ball.create({
      data: {
        name: 'MTB-X',
        manufacturer: 'Snell',
        modelYear: 2024,
        slug: 'snell-mtb-x',
        description: 'Tour-caliber performance designed for better players.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 90,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.MEDIUM,
        durability: 4,
        targetHandicap: '0-15',
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 31.99,
        msrp: 31.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/snell-mtb-x.webp',
        manufacturerUrl: 'https://www.snellgolf.com/mtb-x',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'MTB Black',
        manufacturer: 'Snell',
        modelYear: 2024,
        slug: 'snell-mtb-black',
        description: 'Softer feel with excellent greenside spin and control.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 75,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        targetHandicap: '10-25',
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 31.99,
        msrp: 31.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/snell-mtb-black.webp',
        manufacturerUrl: 'https://www.snellgolf.com/mtb-black',
      },
    }),

    // WILSON
    prisma.ball.create({
      data: {
        name: 'Duo Soft+',
        manufacturer: 'Wilson',
        modelYear: 2024,
        slug: 'wilson-duo-soft-plus',
        description: 'Ultra-soft feel with enhanced greenside control.',
        construction: '2-piece',
        coverMaterial: 'Ionomer',
        layers: 2,
        compression: 35,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.LOW,
        wedgeSpin: SpinLevel.MID,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.VERY_SOFT,
        durability: 5,
        targetHandicap: 'All',
        skillLevel: ['Beginner', 'Intermediate'],
        pricePerDozen: 19.99,
        msrp: 19.99,
        availableColors: ['White', 'Yellow', 'Orange'],
        inStock: true,
        optimalTemp: TempLevel.WARM,
        coldSuitability: 2,
        imageUrl: '/images/balls/wilson-duo-soft-plus.webp',
        manufacturerUrl: 'https://www.wilson.com/duo-soft-plus',
      },
    }),

    // MAXFLI
    prisma.ball.create({
      data: {
        name: 'Tour X',
        manufacturer: 'Maxfli',
        modelYear: 2024,
        slug: 'maxfli-tour-x',
        description: 'Tour-level performance with exceptional value.',
        construction: '4-piece',
        coverMaterial: 'Urethane',
        layers: 4,
        compression: 90,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        targetHandicap: '0-20',
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 34.99,
        msrp: 34.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: '/images/balls/maxfli-tour-x.webp',
        manufacturerUrl: 'https://www.maxfligolf.com/tour-x',
      },
    }),
    
    prisma.ball.create({
      data: {
        name: 'SoftFli',
        manufacturer: 'Maxfli',
        modelYear: 2024,
        slug: 'maxfli-softfli',
        description: 'Incredibly soft feel with straight ball flight.',
        construction: '2-piece',
        coverMaterial: 'Ionomer',
        layers: 2,
        compression: 40,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.LOW,
        wedgeSpin: SpinLevel.LOW,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.VERY_SOFT,
        durability: 5,
        targetHandicap: 'All',
        skillLevel: ['Beginner', 'Intermediate'],
        pricePerDozen: 17.99,
        msrp: 17.99,
        availableColors: ['White', 'Matte'],
        inStock: true,
        optimalTemp: TempLevel.WARM,
        coldSuitability: 2,
        imageUrl: '/images/balls/maxfli-softfli.webp',
        manufacturerUrl: 'https://www.maxfligolf.com/softfli',
      },
    }),
  ]);

  console.log(`✅ Created ${balls.length} golf balls`);

  // ========================================
  // SEED TEST USERS
  // ========================================
  
  console.log('👤 Creating test users...');

  const testUser1 = await prisma.user.create({
    data: {
      email: 'test@fitmyball.com',
      name: 'Test User',
      passwordHash: await bcrypt.hash('password123', 12),
      handicap: '15',
      homeCourseName: 'Pebble Beach',
      homeLocation: 'Monterey, CA',
      emailVerified: new Date(),
    },
  });

  const testUser2 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Golfer',
      passwordHash: await bcrypt.hash('password123', 12),
      handicap: '8',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created 2 test users');

  // ========================================
  // SEED USER PROFILES
  // ========================================
  
  console.log('📋 Creating user profiles...');

  await prisma.userProfile.create({
    data: {
      userId: testUser1.id,
      profileName: 'Summer Setup',
      isDefault: true,
      preferredFeel: 'soft',
      budgetRange: 'premium',
      colorPreference: 'white_only',
      typicalTemp: 'warm',
      driverBallSpeed: 155,
      ironDistance8: 150,
    },
  });

  await prisma.userProfile.create({
    data: {
      userId: testUser1.id,
      profileName: 'Winter Setup',
      isDefault: false,
      preferredFeel: 'medium_firm',
      budgetRange: 'value',
      colorPreference: 'open_to_color',
      typicalTemp: 'cold',
      driverBallSpeed: 150,
      ironDistance8: 145,
    },
  });

  console.log('✅ Created user profiles');

  // ========================================
  // SEED USER BALL INTERACTIONS
  // ========================================
  
  console.log('⭐ Creating user favorites and tried balls...');

  // Favorites
  await prisma.userFavoriteBall.createMany({
    data: [
      { userId: testUser1.id, ballId: balls[0].id }, // Pro V1
      { userId: testUser1.id, ballId: balls[5].id }, // Chrome Soft
      { userId: testUser1.id, ballId: balls[15].id }, // Z-Star
    ],
  });

  // Tried balls with reviews
  await prisma.userTriedBall.createMany({
    data: [
      {
        userId: testUser1.id,
        ballId: balls[0].id, // Pro V1
        rating: 5,
        notes: 'Excellent all-around ball. Great feel and spin control.',
        roundsPlayed: 12,
        wouldRecommend: true,
        distanceVsExpected: ComparisonLevel?,
        spinVsExpected: SpinComparison?,
        feelVsExpected: FeelComparison?,
      },
      {
        userId: testUser1.id,
        ballId: balls[7].id, // Supersoft
        rating: 3,
        notes: 'Too soft for my swing speed. Not enough spin around greens.',
        roundsPlayed: 3,
        wouldRecommend: false,
        distanceVsExpected: 'As Expected',
        spinVsExpected: 'Less',
        feelVsExpected: 'Softer',
      },
    ],
  });

  console.log('✅ Created user interactions');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 5.2 Running the Seed Script

```bash
# Development
pnpm prisma db seed

# Reset database and reseed
pnpm prisma migrate reset

# Production (one-time initial seed)
NODE_ENV=production pnpm prisma db seed
```

---

## 6. Database Queries & Common Operations

### 6.1 Ball Queries

```typescript
// lib/db/queries/balls.ts
import { prisma } from '@/lib/db';
import type { BallFilterParams } from '@/types/ball';

export async function getAllBalls() {
  return prisma.ball.findMany({
    where: {
      discontinued: false,
    },
    orderBy: {
      manufacturer: 'asc',
    },
  });
}

export async function getBallById(id: string) {
  return prisma.ball.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          recommendations: true,
          userFavorites: true,
        },
      },
    },
  });
}

export async function getBallBySlug(slug: string) {
  return prisma.ball.findUnique({
    where: { slug },
  });
}

export async function searchBalls(query: string) {
  return prisma.ball.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { manufacturer: { contains: query, mode: 'insensitive' } },
      ],
      discontinued: false,
    },
    take: 10,
  });
}

export async function filterBalls(filters: BallFilterParams) {
  const where: any = { discontinued: false };

  if (filters.manufacturer) {
    where.manufacturer = filters.manufacturer;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.pricePerDozen = {};
    if (filters.minPrice !== undefined) where.pricePerDozen.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.pricePerDozen.lte = filters.maxPrice;
  }

  if (filters.minCompression !== undefined || filters.maxCompression !== undefined) {
    where.compression = {};
    if (filters.minCompression !== undefined) where.compression.gte = filters.minCompression;
    if (filters.maxCompression !== undefined) where.compression.lte = filters.maxCompression;
  }

  if (filters.construction) {
    where.construction = filters.construction;
  }

  if (filters.color) {
    where.availableColors = { has: filters.color };
  }

  return prisma.ball.findMany({
    where,
    orderBy: { [filters.sortBy || 'name']: filters.sortOrder || 'asc' },
  });
}
```

### 6.2 Recommendation Queries

```typescript
// lib/db/queries/recommendations.ts
import { prisma } from '@/lib/db';

export async function createRecommendation(
  quizSessionId: string,
  userId: string | null,
  recommendedBalls: Array<{
    ballId: string;
    rank: number;
    matchScore: number;
    categoryScores: any;
    explanation: any;
  }>
) {
  return prisma.recommendation.create({
    data: {
      quizSessionId,
      userId,
      algorithmVersion: '1.0',
      recommendedBalls: {
        create: recommendedBalls.map((rb) => ({
          ballId: rb.ballId,
          rank: rb.rank,
          matchScore: rb.matchScore,
          swingSpeedScore: rb.categoryScores.swingSpeedScore,
          performanceScore: rb.categoryScores.performanceScore,
          preferencesScore: rb.categoryScores.preferencesScore,
          conditionsScore: rb.categoryScores.conditionsScore,
          currentBallScore: rb.categoryScores.currentBallScore,
          explanation: rb.explanation,
        })),
      },
    },
    include: {
      recommendedBalls: {
        include: {
          ball: true,
        },
        orderBy: {
          rank: 'asc',
        },
      },
      quizSession: true,
    },
  });
}

export async function getRecommendationBySessionId(sessionId: string) {
  const quizSession = await prisma.quizSession.findUnique({
    where: { id: sessionId },
    include: {
      recommendation: {
        include: {
          recommendedBalls: {
            include: {
              ball: true,
            },
            orderBy: {
              rank: 'asc',
            },
          },
        },
      },
    },
  });

  return quizSession?.recommendation;
}

export async function getUserRecommendationHistory(userId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [recommendations, total] = await Promise.all([
    prisma.recommendation.findMany({
      where: { userId },
      include: {
        recommendedBalls: {
          where: { rank: 1 }, // Only top recommendation
          include: {
            ball: true,
          },
        },
        quizSession: {
          select: {
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.recommendation.count({ where: { userId } }),
  ]);

  return {
    recommendations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

### 6.3 Quiz Session Queries

```typescript
// lib/db/queries/quiz-sessions.ts
import { prisma } from '@/lib/db';
import type { QuizData } from '@/types/quiz';

export async function createQuizSession(
  quizData: QuizData,
  userId?: string,
  ipAddress?: string
) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

  return prisma.quizSession.create({
    data: {
      userId,
      quizData: quizData as any,
      ipAddress,
      expiresAt,
      completed: true,
      shareToken: generateShareToken(), // Implement this helper
    },
  });
}

export async function getQuizSessionById(id: string) {
  return prisma.quizSession.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      recommendation: {
        include: {
          recommendedBalls: {
            include: {
              ball: true,
            },
            orderBy: {
              rank: 'asc',
            },
          },
        },
      },
    },
  });
}

export async function getQuizSessionByShareToken(token: string) {
  return prisma.quizSession.findUnique({
    where: { shareToken: token },
    include: {
      recommendation: {
        include: {
          recommendedBalls: {
            include: {
              ball: true,
            },
            orderBy: {
              rank: 'asc',
            },
          },
        },
      },
    },
  });
}

// lib/db/queries/maintenance.ts
export async function cleanupExpiredGuestSessions() {
  return prisma.quizSession.deleteMany({
    where: {
      userId: null,          // Guest sessions only
      expiresAt: { lt: new Date() },
    },
  });
}

// Run via cron job (e.g., Vercel Cron) daily at 3 AM

// Helper function
import { randomBytes } from 'crypto';

function generateShareToken(): string {
  return randomBytes(16).toString('base64url');
```

---

## 7. Migrations Strategy

### 7.1 Initial Migration

```bash
# Create initial migration
pnpm prisma migrate dev --name init

# This generates:
# prisma/migrations/YYYYMMDDHHMMSS_init/migration.sql
```

### 7.2 Schema Changes Workflow

```bash
# 1. Modify schema.prisma
# 2. Create migration
pnpm prisma migrate dev --name add_new_field

# 3. Review generated SQL in migrations/
# 4. Test migration locally
# 5. Commit migration file to git
# 6. Deploy to production
pnpm prisma migrate deploy
```

### 7.3 Example Migrations

**Adding a new field:**
```prisma
// Before
model Ball {
  name String
}

// After
model Ball {
  name String
  subtitle String? // New field
}
```

```bash
pnpm prisma migrate dev --name add_ball_subtitle
```

**Adding a new table:**
```prisma
model BallReview {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  
  ballId    String
  ball      Ball     @relation(fields: [ballId], references: [id])
  
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  rating    Int
  comment   String   @db.Text
  
  @@unique([ballId, userId])
  @@index([ballId])
}
```

### 7.4 Rollback Strategy

```bash
# Rollback last migration (development only)
pnpm prisma migrate reset

# Production rollback requires manual SQL
# 1. Identify migration to rollback
# 2. Write reverse migration SQL
# 3. Apply manually or create down migration
```

---

## 8. Database Optimization

### 8.1 Index Strategy

**Indexes Already Defined in Schema:**
```prisma
// Ball table
@@index([manufacturer])           // Browse by brand
@@index([compression])             // Filter by compression
@@index([pricePerDozen])           // Sort by price
@@index([manufacturer, pricePerDozen]) // Combined filter
@@index([slug])                    // URL lookups
@@index([discontinued])            // Filter active balls

// User table
@@index([email])                   // Login lookups

// QuizSession table
@@index([userId])                  // User's sessions
@@index([shareToken])              // Share link lookups
@@index([expiresAt])               // Cleanup queries
@@index([createdAt])
@@index([userId, createdAt])       // "show me my recent quizzes" queries

// Recommendation table
@@index([userId])                  // User's history
@@index([createdAt])               // Recent recommendations
```

### 8.2 Query Performance Tips

**Use select to limit fields:**
```typescript
// Bad - fetches all fields
const balls = await prisma.ball.findMany();

// Good - only fetch needed fields
const balls = await prisma.ball.findMany({
  select: {
    id: true,
    name: true,
    manufacturer: true,
    pricePerDozen: true,
  },
});
```

**Use pagination:**
```typescript
const balls = await prisma.ball.findMany({
  skip: (page - 1) * limit,
  take: limit,
});
```

**Batch operations:**
```typescript
// Bad - N queries
for (const ball of balls) {
  await prisma.ball.update({ where: { id: ball.id }, data: { ... } });
}

// Good - single transaction
await prisma.$transaction(
  balls.map(ball => 
    prisma.ball.update({ where: { id: ball.id }, data: { ... } })
  )
);
```

### 8.3 Connection Pooling

```typescript
// lib/db/index.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## 9. Data Backup & Recovery

### 9.1 Backup Strategy

**Automated Backups (Production):**
- Daily automated backups via hosting provider (Vercel Postgres, Supabase)
- Point-in-time recovery available
- 30-day retention minimum

**Manual Backup:**
```bash
# Export database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore database
psql $DATABASE_URL < backup_20260211.sql
```

### 9.2 Data Export (GDPR)

```typescript
// Export user data
export async function exportUserData(userId: string) {
  const [user, profiles, favorites, tried, recommendations] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.userProfile.findMany({ where: { userId } }),
    prisma.userFavoriteBall.findMany({ 
      where: { userId },
      include: { ball: true },
    }),
    prisma.userTriedBall.findMany({ 
      where: { userId },
      include: { ball: true },
    }),
    prisma.recommendation.findMany({ 
      where: { userId },
      include: { 
        recommendedBalls: { include: { ball: true } },
        quizSession: true,
      },
    }),
  ]);

  return {
    user,
    profiles,
    favorites,
    tried,
    recommendations,
    exportedAt: new Date().toISOString(),
  };
}
```

---

## 10. Open Questions

### 10.1 Database Hosting Decision

**Options:**
1. **Vercel Postgres** (Recommended)
   - Pros: Zero-config with Vercel, auto-scaling
   - Cons: More expensive at scale
   
2. **Supabase**
   - Pros: Free tier, PostgreSQL + real-time features
   - Cons: Separate from Vercel (extra latency)
   
3. **Railway/Render**
   - Pros: Good pricing, simple setup
   - Cons: Another service to manage

**Recommendation:** Start with Vercel Postgres for simplicity, migrate to Supabase if cost becomes issue.

### 10.2 Full-Text Search

**Question:** Use PostgreSQL built-in full-text search or external service?

**Options:**
1. PostgreSQL `ts_vector` (built-in)
2. Algolia (best UX, expensive)
3. Meilisearch (self-hosted, open source)

**Recommendation:** Start with Prisma `contains` queries (good enough for V1), add full-text search in V2 if needed.

---

## 11. Next Steps

After approval of this database schema:

1. **UI/UX Design Document** (Document 4 - Final)
   - User flow diagrams
   - Wireframes for all pages
   - Component specifications
   - Responsive design guidelines

2. **Development Begins**
   - Initialize Next.js project
   - Set up Prisma with this schema
   - Run initial migration
   - Seed database with sample balls

---

## Document Control

**Created by:** Database Team  
**Last Updated:** February 11, 2026  
**Next Review:** Post-UI/UX Design completion  
**Distribution:** Development Team, Backend Team

**Change Log:**
- v1.0 (Feb 11, 2026): Initial database schema document
