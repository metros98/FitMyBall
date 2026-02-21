"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { generateGuidance } from "@/lib/utils/compare-guidance";
import type { Ball } from "@/types/ball";

interface GuidanceSectionProps {
  balls: Ball[];
}

export function GuidanceSection({ balls }: GuidanceSectionProps) {
  if (balls.length === 0) {
    return null;
  }

  const guidance = generateGuidance(balls);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {guidance.map((item) => (
        <Card key={item.ballId}>
          <CardHeader>
            <CardTitle className="text-base">{item.ballName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Best For */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                Best for:
              </h4>
              <ul className="space-y-1">
                {item.bestFor.map((rec, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Standout Specs */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                Standout specs:
              </h4>
              <ul className="space-y-1">
                {item.standoutSpecs.map((spec, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
