/**
 * Results Page - Display quiz recommendations
 * Route: /results/[sessionId]
 */

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RecommendationCard } from "@/components/results/RecommendationCard";
import { SecondaryBallCard } from "@/components/results/SecondaryBallCard";
import { AlternativesSection } from "@/components/results/AlternativesSection";
import { SeasonalSection } from "@/components/results/SeasonalSection";
import { getQuizSessionById, isSessionExpired } from "@/lib/db/queries/quiz-sessions";
import { getRecommendationBySessionId } from "@/lib/db/queries/recommendations";
import { getBallsByIds } from "@/lib/db/queries/balls";
import { Share2, Mail, RotateCcw, Save, AlertCircle, CheckCircle, Info } from "lucide-react";

interface ResultsPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = await params;

  // Direct DB calls — no HTTP self-fetch
  const session = await getQuizSessionById(sessionId);
  if (!session) {
    notFound();
  }

  if (isSessionExpired(session.createdAt)) {
    notFound();
  }

  const result = await getRecommendationBySessionId(sessionId);
  if (!result) {
    notFound();
  }

  const { response: recommendation, balls } = result;

  // Fetch any additional balls needed for alternatives/seasonal picks
  // that aren't already in the recommendation balls map
  const extraBallIds = [
    recommendation.alternatives.bestValue?.ballId,
    recommendation.alternatives.stepUp?.ballId,
    recommendation.alternatives.stepDown?.ballId,
    recommendation.alternatives.moneyNoObject?.ballId,
    recommendation.seasonalPicks?.warmWeather?.ballId,
    recommendation.seasonalPicks?.coldWeather?.ballId,
  ].filter((id): id is string => id != null && !balls.has(id));

  if (extraBallIds.length > 0) {
    const extraBalls = await getBallsByIds(extraBallIds);
    for (const ball of extraBalls) {
      balls.set(ball.id, ball);
    }
  }

  const topRecommendation = recommendation.recommendations[0];
  const secondaryRecommendations = recommendation.recommendations.slice(1, 5);
  const topBall = balls.get(topRecommendation.ballId);

  if (!topBall) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading ball data. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Confidence level styling
  const confidenceBadgeVariant =
    recommendation.confidenceLevel === "high"
      ? "default"
      : recommendation.confidenceLevel === "medium"
      ? "secondary"
      : "outline";

  const confidenceIcon =
    recommendation.confidenceLevel === "high" ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <Info className="w-4 h-4" />
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Your Fitting Results
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Based on your swing, preferences, and playing conditions
                </p>
              </div>

              <Badge variant={confidenceBadgeVariant} className="gap-1.5">
                {confidenceIcon}
                {recommendation.confidenceLevel.charAt(0).toUpperCase() +
                  recommendation.confidenceLevel.slice(1)}{" "}
                Confidence
              </Badge>
            </div>

            {/* Confidence message */}
            {recommendation.confidenceMessage && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>{recommendation.confidenceMessage}</AlertDescription>
              </Alert>
            )}

            {/* Trade-off callout */}
            {recommendation.tradeOffCallout && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{recommendation.tradeOffCallout}</AlertDescription>
              </Alert>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Results
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Email Me
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/quiz">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* #1 Recommendation - Hero Card on dark surface */}
          <section className="bg-slate-900 dark:bg-slate-950 rounded-xl p-6">
            <RecommendationCard
              recommendation={topRecommendation}
              ball={topBall}
              rank={1}
            />
          </section>

          {/* Secondary Recommendations */}
          {secondaryRecommendations.length > 0 && (
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Other Great Matches
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  These balls also fit your game well
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {secondaryRecommendations.map((rec, idx) => {
                  const ball = balls.get(rec.ballId);
                  if (!ball) return null;

                  return (
                    <SecondaryBallCard
                      key={rec.ballId}
                      recommendation={rec}
                      ball={ball}
                      rank={idx + 2}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* Alternatives Section */}
          <AlternativesSection
            alternatives={recommendation.alternatives}
            balls={balls}
          />

          {/* Seasonal Section */}
          <SeasonalSection
            seasonalPicks={recommendation.seasonalPicks}
            balls={balls}
          />
        </div>
      </div>
    </div>
  );
}
