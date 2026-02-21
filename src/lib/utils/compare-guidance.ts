import type { Ball } from "@/types/ball";

export interface BallGuidance {
  ballId: string;
  ballName: string;
  bestFor: string[];
  standoutSpecs: string[];
}

/**
 * Generates guidance and recommendations for each ball in a comparison set.
 * Identifies each ball's strengths relative to the group.
 */
export function generateGuidance(balls: Ball[]): BallGuidance[] {
  if (balls.length === 0) return [];

  return balls.map((ball) => {
    const bestFor: string[] = [];
    const standoutSpecs: string[] = [];

    // Price comparison
    const cheapestPrice = Math.min(...balls.map((b) => b.pricePerDozen));
    const mostExpensivePrice = Math.max(...balls.map((b) => b.pricePerDozen));
    if (ball.pricePerDozen === cheapestPrice && balls.length > 1) {
      bestFor.push("Budget-conscious golfers");
      standoutSpecs.push(`Best value at $${ball.pricePerDozen}/doz`);
    } else if (ball.pricePerDozen === mostExpensivePrice && balls.length > 1) {
      standoutSpecs.push(`Premium option at $${ball.pricePerDozen}/doz`);
    }

    // Compression comparison
    const lowestCompression = Math.min(...balls.map((b) => b.compression));
    const highestCompression = Math.max(...balls.map((b) => b.compression));
    if (ball.compression === lowestCompression && balls.length > 1) {
      bestFor.push("Slower swing speeds");
      standoutSpecs.push(`Softest compression (${ball.compression})`);
    } else if (ball.compression === highestCompression && balls.length > 1) {
      bestFor.push("Faster swing speeds");
      standoutSpecs.push(`Firmest compression (${ball.compression})`);
    }

    // Feel comparison
    if (ball.feelRating === "VERY_SOFT" || ball.feelRating === "SOFT") {
      if (
        balls.filter((b) => b.feelRating === "VERY_SOFT" || b.feelRating === "SOFT")
          .length === 1
      ) {
        bestFor.push("Golfers who prioritize soft feel");
      }
    }

    // Spin comparison (wedge spin is usually most important)
    const hasHighWedgeSpin = ball.wedgeSpin === "HIGH";
    const highWedgeSpinCount = balls.filter((b) => b.wedgeSpin === "HIGH").length;
    if (hasHighWedgeSpin && highWedgeSpinCount === 1) {
      bestFor.push("Players seeking maximum greenside control");
      standoutSpecs.push("Highest wedge spin");
    }

    const hasLowDriverSpin = ball.driverSpin === "LOW";
    const lowDriverSpinCount = balls.filter((b) => b.driverSpin === "LOW").length;
    if (hasLowDriverSpin && lowDriverSpinCount === 1) {
      bestFor.push("Distance-focused players");
      standoutSpecs.push("Low driver spin for max distance");
    }

    // Durability comparison
    const highestDurability = Math.max(...balls.map((b) => b.durability));
    if (ball.durability === highestDurability && balls.length > 1) {
      if (balls.filter((b) => b.durability === highestDurability).length === 1) {
        bestFor.push("High-volume players");
        standoutSpecs.push(`Best durability rating (${ball.durability}/10)`);
      }
    }

    // Skill level mapping
    if (ball.skillLevel.includes("Beginner") && ball.skillLevel.length === 1) {
      bestFor.push("New golfers");
    } else if (
      ball.skillLevel.includes("Advanced") ||
      ball.skillLevel.includes("Tour")
    ) {
      if (
        !ball.skillLevel.includes("Beginner") &&
        !ball.skillLevel.includes("Intermediate")
      ) {
        bestFor.push("Low-handicap players");
      }
    }

    // Temperature suitability
    if (ball.optimalTemp === "COLD" || ball.coldSuitability >= 8) {
      const coldSuitableCount = balls.filter(
        (b) => b.optimalTemp === "COLD" || b.coldSuitability >= 8
      ).length;
      if (coldSuitableCount === 1) {
        bestFor.push("Cold weather play");
        standoutSpecs.push("Optimized for cold temperatures");
      }
    }

    // Construction/Cover highlights
    if (ball.coverMaterial === "Urethane") {
      const urethaneCount = balls.filter((b) => b.coverMaterial === "Urethane").length;
      if (urethaneCount === 1) {
        standoutSpecs.push("Premium urethane cover");
      }
    }

    // Multi-layer construction
    if (ball.layers >= 4) {
      const multiLayerCount = balls.filter((b) => b.layers >= 4).length;
      if (multiLayerCount === 1) {
        standoutSpecs.push(`${ball.layers}-layer construction`);
      }
    }

    // Color options
    if (ball.availableColors.length > 2) {
      const colorOptionsCount = balls.filter((b) => b.availableColors.length > 2)
        .length;
      if (colorOptionsCount === 1) {
        standoutSpecs.push(
          `Most color options (${ball.availableColors.join(", ")})`
        );
      }
    }

    // Default if no specific recommendations
    if (bestFor.length === 0) {
      bestFor.push("All-around performance");
    }

    if (standoutSpecs.length === 0) {
      standoutSpecs.push(`${ball.construction} construction with ${ball.feelRating.toLowerCase().replace("_", " ")} feel`);
    }

    return {
      ballId: ball.id,
      ballName: ball.name,
      bestFor,
      standoutSpecs,
    };
  });
}
