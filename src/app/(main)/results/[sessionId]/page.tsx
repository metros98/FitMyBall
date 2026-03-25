/**
 * Results Page - Display quiz recommendations
 * Route: /results/[sessionId]
 */

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TopBallCard } from "@/components/results/TopBallCard";
import { AlternativesSection } from "@/components/results/AlternativesSection";
import { SeasonalSection } from "@/components/results/SeasonalSection";
import { ResultsStagger } from "@/components/results/ResultsStagger";
import { getQuizSessionById, isSessionExpired } from "@/lib/db/queries/quiz-sessions";
import { getRecommendationBySessionId } from "@/lib/db/queries/recommendations";
import { getBallsByIds } from "@/lib/db/queries/balls";
import { SaveResultsButton } from "@/components/results/save-results-button";
import { Share2, Mail, RotateCcw, AlertCircle, CheckCircle, Info, Clock } from "lucide-react";
import Link from "next/link";

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
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-950 flex items-center justify-center">
            <Clock className="w-8 h-8 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-100">
              This Recommendation Has Expired
            </h1>
            <p className="text-slate-400">
              Recommendations are available for 30 days. Take a fresh quiz to
              get updated recommendations.
            </p>
          </div>
          <Button asChild>
            <Link href="/quiz">Retake Quiz</Link>
          </Button>
        </div>
      </div>
    );
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

  const isLowMatch = recommendation.recommendations[0]?.matchPercentage < 50;
  const topRecommendations = recommendation.recommendations.slice(
    0,
    isLowMatch ? 3 : 5,
  );

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
    <div className="min-h-screen bg-surface-base">
      {/* Header */}
      <section className="bg-surface-card border-b border-[#1E293B]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                  Your Fitting Results
                </h1>
                <p className="text-slate-400 mt-2">
                  Based on your swing, preferences, and playing conditions
                </p>
              </div>

              <Badge
                variant={confidenceBadgeVariant}
                className="gap-1.5"
                aria-label={`Confidence level: ${recommendation.confidenceLevel}`}
              >
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
              <SaveResultsButton sessionId={sessionId} />
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
          {/* Low-match alert */}
          {isLowMatch && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Based on your inputs, fewer balls matched strongly. Here are the
                closest options.
              </AlertDescription>
            </Alert>
          )}

          {/* Top Recommendations - Equal-size cards */}
          {topRecommendations.length > 0 && (
            <ResultsStagger index={0}>
              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">
                    Your Top Matches
                  </h2>
                  <p className="text-slate-400 mt-1">
                    Ranked by how well they fit your game
                  </p>
                </div>

                <div className="space-y-4">
                  {topRecommendations.map((rec, idx) => {
                    const ball = balls.get(rec.ballId);
                    if (!ball) return null;

                    return (
                      <TopBallCard
                        key={rec.ballId}
                        recommendation={rec}
                        ball={ball}
                        rank={idx + 1}
                      />
                    );
                  })}
                </div>
              </section>
            </ResultsStagger>
          )}

          {/* Alternatives Section */}
          <ResultsStagger index={1}>
            <AlternativesSection
              alternatives={recommendation.alternatives}
              balls={balls}
            />
          </ResultsStagger>

          {/* Seasonal Section */}
          <ResultsStagger index={2}>
            <SeasonalSection
              seasonalPicks={recommendation.seasonalPicks}
              balls={balls}
            />
          </ResultsStagger>
        </div>
      </div>
    </div>
  );
}
