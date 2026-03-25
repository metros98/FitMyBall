/**
 * TopBallCard - Equal-size card for all top 5 recommendations
 * Desktop: horizontal layout with performance bars on the right
 * Mobile: stacked layout with compact performance (name + percentage, no bars)
 */

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchPercentage } from "./MatchPercentage";
import { PerformanceBreakdown } from "./PerformanceBreakdown";
import { FavoriteButton } from "@/components/common/favorite-button";
import { CompareButton } from "@/components/compare/compare-button";
import type { Recommendation } from "@/types/recommendation";
import type { Ball } from "@/types/ball";
import type { CategoryScores } from "@/types/recommendation";
import { Trophy, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface TopBallCardProps {
  recommendation: Recommendation;
  ball: Ball;
  rank: number;
  onViewDetails?: () => void;
}

const categoryLabels: Partial<Record<keyof CategoryScores, string>> = {
  swingSpeedMatch: "Swing Speed",
  performancePriorities: "Performance",
  preferences: "Preferences",
  playingConditions: "Conditions",
};

export function TopBallCard({
  recommendation,
  ball,
  rank,
}: TopBallCardProps) {
  const isTopPick = rank === 1;

  const categories = Object.entries(categoryLabels) as Array<
    [keyof CategoryScores, string]
  >;

  return (
    <Card className="bg-surface-card border-slate-800 text-white">
      <div className="p-5">
        {/* Desktop: horizontal layout */}
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Left side: ball info */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Header row: rank + badges + match ring */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="font-mono text-xs">
                  #{rank}
                </Badge>
                {isTopPick && (
                  <Badge className="bg-green-600 hover:bg-green-600 text-white gap-1">
                    <Trophy className="w-3 h-3" />
                    Best Match
                  </Badge>
                )}
                {ball.discontinued && (
                  <Badge variant="outline" className="border-amber-500 text-amber-500 text-xs">
                    Discontinued
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <FavoriteButton ballId={ball.id} className="text-white hover:text-red-400" />
                <CompareButton
                  ball={{ id: ball.id, name: ball.name }}
                  variant="icon"
                />
              </div>
            </div>

            {/* Ball image + details row */}
            <div className="flex gap-4">
              {/* Ball image */}
              <div className="flex-shrink-0 w-20 h-20 relative bg-white rounded-lg overflow-hidden">
                {ball.imageUrl ? (
                  <Image
                    src={ball.imageUrl}
                    alt={ball.name}
                    fill
                    className="object-contain p-3"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>

              {/* Ball info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-base truncate">{ball.name}</h3>
                    <p className="text-sm text-gray-400">{ball.manufacturer}</p>
                    <p className="text-base font-semibold mt-0.5">
                      ${ball.pricePerDozen.toFixed(2)}/doz
                    </p>
                  </div>
                  <MatchPercentage
                    percentage={recommendation.matchPercentage}
                    tier={recommendation.matchTier}
                    size="sm"
                  />
                </div>

                {/* Key features */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {ball.compression} comp
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {ball.layers}-pc
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {ball.coverMaterial}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Top reason */}
            {recommendation.explanation.whyThisMatches[0] && (
              <p className="text-sm text-gray-300 line-clamp-2">
                {recommendation.explanation.whyThisMatches[0]}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <CompareButton
                ball={{ id: ball.id, name: ball.name }}
                variant="button"
                className="border-gray-600 text-white hover:bg-gray-800 text-xs"
              />
              {ball.productUrls.length > 0 && !ball.discontinued && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-gray-600 text-white hover:bg-gray-800 text-xs"
                >
                  <a
                    href={ball.productUrls[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                    Buy
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Right side: Performance breakdown */}
          {/* Desktop: full bars */}
          <div className="hidden lg:block w-64 flex-shrink-0 border-l border-slate-700 pl-6 self-center">
            <PerformanceBreakdown
              scores={recommendation.categoryScores}
              className="text-white"
            />
          </div>

          {/* Mobile: compact list (name + percentage, no bars) */}
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-700">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Performance Breakdown
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {categories.map(([key, label]) => {
                const score = Math.round(recommendation.categoryScores[key]);
                return (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 text-xs">{label}</span>
                    <span className="font-medium text-slate-100 tabular-nums text-xs">
                      {score}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
