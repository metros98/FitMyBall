-- CreateEnum
CREATE TYPE "SpinLevel" AS ENUM ('LOW', 'MID', 'HIGH');

-- CreateEnum
CREATE TYPE "LaunchLevel" AS ENUM ('LOW', 'MID', 'HIGH');

-- CreateEnum
CREATE TYPE "FeelLevel" AS ENUM ('VERY_SOFT', 'SOFT', 'MEDIUM', 'FIRM');

-- CreateEnum
CREATE TYPE "TempLevel" AS ENUM ('WARM', 'MODERATE', 'COLD', 'ALL');

-- CreateEnum
CREATE TYPE "ComparisonLevel" AS ENUM ('BETTER', 'AS_EXPECTED', 'WORSE');

-- CreateEnum
CREATE TYPE "SpinComparison" AS ENUM ('MORE', 'AS_EXPECTED', 'LESS');

-- CreateEnum
CREATE TYPE "FeelComparison" AS ENUM ('SOFTER', 'AS_EXPECTED', 'FIRMER');

-- CreateTable
CREATE TABLE "balls" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "modelYear" INTEGER,
    "description" TEXT,
    "marketingCopy" TEXT,
    "construction" TEXT NOT NULL,
    "coverMaterial" TEXT NOT NULL,
    "coreMaterial" TEXT,
    "layers" INTEGER NOT NULL,
    "compression" INTEGER NOT NULL,
    "driverSpin" "SpinLevel" NOT NULL,
    "ironSpin" "SpinLevel" NOT NULL,
    "wedgeSpin" "SpinLevel" NOT NULL,
    "launchProfile" "LaunchLevel" NOT NULL,
    "feelRating" "FeelLevel" NOT NULL,
    "durability" INTEGER NOT NULL DEFAULT 3,
    "targetHandicapMin" INTEGER,
    "targetHandicapMax" INTEGER,
    "skillLevel" TEXT[],
    "pricePerDozen" DECIMAL(6,2) NOT NULL,
    "msrp" DECIMAL(6,2) NOT NULL,
    "availableColors" TEXT[],
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "discontinued" BOOLEAN NOT NULL DEFAULT false,
    "optimalTemp" "TempLevel" NOT NULL,
    "coldSuitability" INTEGER NOT NULL DEFAULT 3,
    "imageUrl" TEXT,
    "imageUrls" TEXT[],
    "manufacturerUrl" TEXT,
    "productUrls" JSONB[],
    "slug" TEXT NOT NULL,

    CONSTRAINT "balls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "passwordHash" TEXT,
    "handicap" DOUBLE PRECISION,
    "homeCourseName" TEXT,
    "homeLocation" TEXT,
    "preferredUnits" TEXT NOT NULL DEFAULT 'imperial',
    "optInMarketing" BOOLEAN NOT NULL DEFAULT false,
    "optInAnalytics" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "profileName" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "preferredFeel" TEXT,
    "budgetRange" TEXT,
    "colorPreference" TEXT,
    "typicalTemp" TEXT,
    "driverBallSpeed" INTEGER,
    "ironDistance8" INTEGER,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_sessions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "quizData" JSONB NOT NULL,
    "ipAddress" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT,

    CONSTRAINT "quiz_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "quizSessionId" TEXT NOT NULL,
    "algorithmVersion" TEXT NOT NULL DEFAULT '1.0',
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "saved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_balls" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "ballId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL,
    "swingSpeedScore" DOUBLE PRECISION NOT NULL,
    "performanceScore" DOUBLE PRECISION NOT NULL,
    "preferencesScore" DOUBLE PRECISION NOT NULL,
    "conditionsScore" DOUBLE PRECISION NOT NULL,
    "currentBallScore" DOUBLE PRECISION NOT NULL,
    "explanation" JSONB NOT NULL,

    CONSTRAINT "recommendation_balls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorite_balls" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "ballId" TEXT NOT NULL,

    CONSTRAINT "user_favorite_balls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tried_balls" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "ballId" TEXT NOT NULL,
    "rating" INTEGER,
    "notes" TEXT,
    "roundsPlayed" INTEGER,
    "wouldRecommend" BOOLEAN,
    "distanceVsExpected" "ComparisonLevel",
    "spinVsExpected" "SpinComparison",
    "feelVsExpected" "FeelComparison",

    CONSTRAINT "user_tried_balls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "balls_slug_key" ON "balls"("slug");

-- CreateIndex
CREATE INDEX "balls_manufacturer_idx" ON "balls"("manufacturer");

-- CreateIndex
CREATE INDEX "balls_compression_idx" ON "balls"("compression");

-- CreateIndex
CREATE INDEX "balls_pricePerDozen_idx" ON "balls"("pricePerDozen");

-- CreateIndex
CREATE INDEX "balls_discontinued_idx" ON "balls"("discontinued");

-- CreateIndex
CREATE INDEX "balls_slug_idx" ON "balls"("slug");

-- CreateIndex
CREATE INDEX "balls_manufacturer_pricePerDozen_idx" ON "balls"("manufacturer", "pricePerDozen");

-- CreateIndex
CREATE INDEX "balls_discontinued_construction_coverMaterial_idx" ON "balls"("discontinued", "construction", "coverMaterial");

-- CreateIndex
CREATE INDEX "balls_discontinued_driverSpin_wedgeSpin_feelRating_idx" ON "balls"("discontinued", "driverSpin", "wedgeSpin", "feelRating");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "user_profiles_userId_idx" ON "user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_profileName_key" ON "user_profiles"("userId", "profileName");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_sessions_shareToken_key" ON "quiz_sessions"("shareToken");

-- CreateIndex
CREATE INDEX "quiz_sessions_userId_idx" ON "quiz_sessions"("userId");

-- CreateIndex
CREATE INDEX "quiz_sessions_shareToken_idx" ON "quiz_sessions"("shareToken");

-- CreateIndex
CREATE INDEX "quiz_sessions_expiresAt_idx" ON "quiz_sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "quiz_sessions_userId_createdAt_idx" ON "quiz_sessions"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "recommendations_quizSessionId_key" ON "recommendations"("quizSessionId");

-- CreateIndex
CREATE INDEX "recommendations_userId_idx" ON "recommendations"("userId");

-- CreateIndex
CREATE INDEX "recommendations_createdAt_idx" ON "recommendations"("createdAt");

-- CreateIndex
CREATE INDEX "recommendation_balls_recommendationId_idx" ON "recommendation_balls"("recommendationId");

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_balls_recommendationId_ballId_key" ON "recommendation_balls"("recommendationId", "ballId");

-- CreateIndex
CREATE INDEX "user_favorite_balls_userId_idx" ON "user_favorite_balls"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorite_balls_userId_ballId_key" ON "user_favorite_balls"("userId", "ballId");

-- CreateIndex
CREATE INDEX "user_tried_balls_userId_idx" ON "user_tried_balls"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_tried_balls_userId_ballId_key" ON "user_tried_balls"("userId", "ballId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_sessions" ADD CONSTRAINT "quiz_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_quizSessionId_fkey" FOREIGN KEY ("quizSessionId") REFERENCES "quiz_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_balls" ADD CONSTRAINT "recommendation_balls_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_balls" ADD CONSTRAINT "recommendation_balls_ballId_fkey" FOREIGN KEY ("ballId") REFERENCES "balls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_balls" ADD CONSTRAINT "user_favorite_balls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_balls" ADD CONSTRAINT "user_favorite_balls_ballId_fkey" FOREIGN KEY ("ballId") REFERENCES "balls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tried_balls" ADD CONSTRAINT "user_tried_balls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tried_balls" ADD CONSTRAINT "user_tried_balls_ballId_fkey" FOREIGN KEY ("ballId") REFERENCES "balls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
