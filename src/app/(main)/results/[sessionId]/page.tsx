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
import type { RecommendationDetailResponse } from "@/types/api";
import type { Ball } from "@/types/ball";
import { Share2, Mail, RotateCcw, Save, AlertCircle, CheckCircle, Info } from "lucide-react";

interface ResultsPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

async function getRecommendationData(sessionId: string): Promise<{
  data: RecommendationDetailResponse;
  balls: Map<string, Ball>;
} | null> {
  try {
    // Fetch recommendation data from API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/recommendations/${sessionId}`;
    
    const res = await fetch(url, {
      cache: "no-store", // Always get fresh data
    });
    
    if (!res.ok) {
      return null;
    }

    const data: RecommendationDetailResponse = await res.json();

    // Collect all ball IDs we need to fetch
    const ballIds = new Set<string>();
    data.recommendation.recommendations.forEach((rec) => ballIds.add(rec.ballId));
    
    if (data.recommendation.alternatives.bestValue) {
      ballIds.add(data.recommendation.alternatives.bestValue.ballId);
    }
    if (data.recommendation.alternatives.stepUp) {
      ballIds.add(data.recommendation.alternatives.stepUp.ballId);
    }
    if (data.recommendation.alternatives.stepDown) {
      ballIds.add(data.recommendation.alternatives.stepDown.ballId);
    }
    if (data.recommendation.alternatives.moneyNoObject) {
      ballIds.add(data.recommendation.alternatives.moneyNoObject.ballId);
    }
    if (data.recommendation.seasonalPicks?.warmWeather) {
      ballIds.add(data.recommendation.seasonalPicks.warmWeather.ballId);
    }
    if (data.recommendation.seasonalPicks?.coldWeather) {
      ballIds.add(data.recommendation.seasonalPicks.coldWeather.ballId);
    }

    // Fetch all ball details in parallel
    const ballPromises = Array.from(ballIds).map(async (id) => {
      const ballUrl = `${baseUrl}/api/balls/${id}`;
      const ballRes = await fetch(ballUrl, {
        cache: "force-cache", // Ball data can be cached
      });
      if (ballRes.ok) {
        const response = await ballRes.json() as { ball: Ball };
        return response.ball;
      }
      return null;
    });

    const ballsArray = await Promise.all(ballPromises);
    const balls = new Map<string, Ball>();
    ballsArray.forEach((ball) => {
      if (ball) {
        balls.set(ball.id, ball);
      }
    });

    return { data, balls };
  } catch (error) {
    console.error("Error fetching recommendation data:", error);
    return null;
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = await params;
  
  const result = await getRecommendationData(sessionId);

  if (!result) {
    notFound();
  }

  const { data, balls } = result;
  const { recommendation } = data;
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
