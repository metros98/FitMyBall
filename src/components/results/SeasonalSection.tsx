/**
 * SeasonalSection - Shows warm and cold weather ball recommendations
 */

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RecommendationResponse } from "@/types/recommendation";
import type { Ball } from "@/types/ball";
import { Sun, Snowflake } from "lucide-react";
import Image from "next/image";

interface SeasonalSectionProps {
  seasonalPicks: RecommendationResponse["seasonalPicks"];
  balls: Map<string, Ball>;
}

export function SeasonalSection({ seasonalPicks, balls }: SeasonalSectionProps) {
  if (!seasonalPicks || (!seasonalPicks.warmWeather && !seasonalPicks.coldWeather)) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Seasonal Recommendations
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Optimize your performance across different weather conditions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warm Weather */}
        {seasonalPicks.warmWeather && balls.get(seasonalPicks.warmWeather.ballId) && (
          <Card>
            <div className="bg-orange-500/10 p-3">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-orange-600">Warm Weather</h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Optimized for 70°F and above
              </p>
            </div>

            <div className="p-4 space-y-4">
              {(() => {
                const ball = balls.get(seasonalPicks.warmWeather!.ballId)!;
                return (
                  <>
                    <div className="flex gap-4">
                      <div className="w-24 h-24 relative bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {ball.imageUrl ? (
                          <Image
                            src={ball.imageUrl}
                            alt={ball.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-base">{ball.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {ball.manufacturer}
                        </p>
                        <p className="text-lg font-semibold">
                          ${ball.pricePerDozen.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {seasonalPicks.warmWeather!.reason}
                    </p>

                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </>
                );
              })()}
            </div>
          </Card>
        )}

        {/* Cold Weather */}
        {seasonalPicks.coldWeather && balls.get(seasonalPicks.coldWeather.ballId) && (
          <Card>
            <div className="bg-blue-500/10 p-3">
              <div className="flex items-center gap-2">
                <Snowflake className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-600">Cold Weather</h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Maintains feel below 50°F
              </p>
            </div>

            <div className="p-4 space-y-4">
              {(() => {
                const ball = balls.get(seasonalPicks.coldWeather!.ballId)!;
                return (
                  <>
                    <div className="flex gap-4">
                      <div className="w-24 h-24 relative bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {ball.imageUrl ? (
                          <Image
                            src={ball.imageUrl}
                            alt={ball.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-base">{ball.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {ball.manufacturer}
                        </p>
                        <p className="text-lg font-semibold">
                          ${ball.pricePerDozen.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {seasonalPicks.coldWeather!.reason}
                    </p>

                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </>
                );
              })()}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
