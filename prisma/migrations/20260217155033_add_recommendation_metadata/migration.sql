-- AlterTable
ALTER TABLE "recommendation_balls" ADD COLUMN     "headline" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "recommendations" ADD COLUMN     "alternatives" JSONB,
ADD COLUMN     "confidenceLevel" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "confidenceMessage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seasonalPicks" JSONB,
ADD COLUMN     "tradeOffCallout" TEXT;
