/**
 * AlternativesSection - Shows best value, step up, step down, and money-no-object alternatives
 */

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RecommendationResponse } from "@/types/recommendation";
import type { Ball } from "@/types/ball";
import { DollarSign, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import Image from "next/image";

interface AlternativesSectionProps {
  alternatives: RecommendationResponse["alternatives"];
  balls: Map<string, Ball>;
}

const alternativeConfig = {
  bestValue: {
    icon: DollarSign,
    title: "Best Value",
    subtitle: "Similar performance, lower price",
    color: "text-green-600",
    bgColor: "bg-green-600/10",
  },
  stepUp: {
    icon: TrendingUp,
    title: "Step Up",
    subtitle: "Even better performance",
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
  },
  stepDown: {
    icon: TrendingDown,
    title: "Step Down",
    subtitle: "More budget-friendly option",
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
  },
  moneyNoObject: {
    icon: Sparkles,
    title: "Money No Object",
    subtitle: "Ultimate performance",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
  },
};

export function AlternativesSection({ alternatives, balls }: AlternativesSectionProps) {
  const hasAnyAlternatives = Object.values(alternatives).some((alt) => alt !== null);

  if (!hasAnyAlternatives) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Alternative Options
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Other balls worth considering based on your priorities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.entries(alternatives) as Array<[keyof typeof alternatives, typeof alternatives[keyof typeof alternatives]]>).map(
          ([type, alt]) => {
            if (!alt) return null;

            const ball = balls.get(alt.ballId);
            if (!ball) return null;

            const config = alternativeConfig[type];
            const Icon = config.icon;

            return (
              <Card key={type} className="overflow-hidden">
                <div className={`p-3 ${config.bgColor}`}>
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    <div>
                      <h3 className={`font-semibold text-sm ${config.color}`}>
                        {config.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {config.subtitle}
                  </p>
                </div>

                <div className="p-4 space-y-4">
                  {/* Ball image */}
                  <div className="aspect-square relative bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                    {ball.imageUrl ? (
                      <Image
                        src={ball.imageUrl}
                        alt={ball.name}
                        fill
                        className="object-contain p-4"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Ball info */}
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-bold text-base line-clamp-1">
                        {ball.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {ball.manufacturer}
                      </p>
                    </div>

                    <p className="text-lg font-semibold">
                      ${ball.pricePerDozen.toFixed(2)}
                    </p>

                    <Badge variant="outline" className="text-xs">
                      {Math.round(alt.matchPercentage)}% match
                    </Badge>

                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {alt.reason}
                    </p>

                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          }
        )}
      </div>
    </section>
  );
}
