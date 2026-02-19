/**
 * RecommendationCard - Hero card for #1 recommendation
 * Displays on dark surface with full details
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MatchPercentage } from "./MatchPercentage";
import { PerformanceBreakdown } from "./PerformanceBreakdown";
import type { Recommendation } from "@/types/recommendation";
import type { Ball } from "@/types/ball";
import { FavoriteButton } from "@/components/common/favorite-button";
import { Trophy, ShoppingCart, BarChart3 } from "lucide-react";
import Image from "next/image";

interface RecommendationCardProps {
  recommendation: Recommendation;
  ball: Ball;
  rank: number;
  onCompare?: () => void;
  onViewDetails?: () => void;
}

export function RecommendationCard({
  recommendation,
  ball,
  rank,
  onCompare,
  onViewDetails,
}: RecommendationCardProps) {
  const isTopPick = rank === 1;

  return (
    <Card
      className={
        isTopPick
          ? "bg-slate-900 dark:bg-slate-950 border-slate-800 text-white"
          : "bg-white dark:bg-slate-900"
      }
    >
      <div className="p-6 space-y-6">
        {/* Header with badge and match percentage */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {isTopPick && (
                <Badge className="bg-green-600 hover:bg-green-600 text-white gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  Best Match
                </Badge>
              )}
              {ball.discontinued && (
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  Discontinued
                </Badge>
              )}
            </div>
            <h2 className="text-2xl font-bold">{recommendation.headline}</h2>
          </div>

          <div className="flex items-center gap-2">
            <FavoriteButton ballId={ball.id} className="text-white hover:text-red-400" />
            <MatchPercentage
              percentage={recommendation.matchPercentage}
              tier={recommendation.matchTier}
              size="lg"
            />
          </div>
        </div>

        {/* Ball image and details */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Ball image */}
          <div className="flex-shrink-0 w-32 h-32 relative bg-white rounded-lg overflow-hidden">
            {ball.imageUrl ? (
              <Image
                src={ball.imageUrl}
                alt={ball.name}
                fill
                className="object-contain p-4"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* Ball info */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-bold">{ball.name}</h3>
              <p
                className={
                  isTopPick ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
                }
              >
                {ball.manufacturer}
              </p>
              <p className="text-lg font-semibold mt-1">
                ${ball.pricePerDozen.toFixed(2)}/dozen
              </p>
            </div>

            {/* Available colors */}
            {ball.availableColors.length > 0 && (
              <div className="flex items-center gap-2">
                <span
                  className={
                    isTopPick ? "text-gray-400 text-sm" : "text-gray-600 dark:text-gray-400 text-sm"
                  }
                >
                  Available in:
                </span>
                <div className="flex gap-2">
                  {ball.availableColors.map((color) => (
                    <Badge
                      key={color}
                      variant="outline"
                      className={isTopPick ? "border-gray-600 text-gray-300" : ""}
                    >
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Why This Matches You */}
        {recommendation.explanation.whyThisMatches.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm uppercase tracking-wide">
              Why This Matches You
            </h4>
            <ul className="space-y-1.5">
              {recommendation.explanation.whyThisMatches.map((reason, idx) => (
                <li
                  key={idx}
                  className={
                    isTopPick
                      ? "text-gray-300 text-sm flex items-start gap-2"
                      : "text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2"
                  }
                >
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What You'll Gain */}
        {recommendation.explanation.whatYouGain.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm uppercase tracking-wide">
              What You'll Gain
            </h4>
            <ul className="space-y-1.5">
              {recommendation.explanation.whatYouGain.map((gain, idx) => (
                <li
                  key={idx}
                  className={
                    isTopPick
                      ? "text-gray-300 text-sm flex items-start gap-2"
                      : "text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2"
                  }
                >
                  <span className="text-teal-500 mt-0.5">•</span>
                  <span>{gain}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tradeoffs */}
        {recommendation.explanation.tradeoffs.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm uppercase tracking-wide">
              Trade-offs to Consider
            </h4>
            <ul className="space-y-1.5">
              {recommendation.explanation.tradeoffs.map((tradeoff, idx) => (
                <li
                  key={idx}
                  className={
                    isTopPick
                      ? "text-gray-300 text-sm flex items-start gap-2"
                      : "text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2"
                  }
                >
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>{tradeoff}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Performance Breakdown */}
        <PerformanceBreakdown
          scores={recommendation.categoryScores}
          className={isTopPick ? "text-white" : ""}
        />

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
          {onCompare && (
            <Button
              variant={isTopPick ? "outline" : "default"}
              size="sm"
              onClick={onCompare}
              className={
                isTopPick
                  ? "border-gray-600 text-white hover:bg-gray-800"
                  : ""
              }
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Compare
            </Button>
          )}
          {onViewDetails && (
            <Button
              variant={isTopPick ? "outline" : "default"}
              size="sm"
              onClick={onViewDetails}
              className={
                isTopPick
                  ? "border-gray-600 text-white hover:bg-gray-800"
                  : ""
              }
            >
              View Full Details
            </Button>
          )}
          {ball.productUrls.length > 0 && !ball.discontinued && (
            <Button
              variant={isTopPick ? "default" : "outline"}
              size="sm"
              asChild
              className={isTopPick ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <a
                href={ball.productUrls[0].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Where to Buy
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
