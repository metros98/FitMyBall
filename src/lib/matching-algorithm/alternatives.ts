import type { Ball, QuizData, MatchResult } from "./types";
import type {
  AlternativeRecommendation,
  SeasonalPick,
} from "@/types/recommendation";

/**
 * Finds a step-down alternative: similar performance at lower price.
 */
export function findStepDown(
  topResult: MatchResult,
  allResults: MatchResult[],
): AlternativeRecommendation | null {
  const targetPrice = topResult.ball.pricePerDozen * 0.7;

  const candidate = allResults.find(
    (r) =>
      r.ball.id !== topResult.ball.id &&
      r.matchScore >= topResult.matchScore - 15 &&
      r.ball.pricePerDozen <= targetPrice,
  );

  if (!candidate) return null;

  const savings = (
    topResult.ball.pricePerDozen - candidate.ball.pricePerDozen
  ).toFixed(2);

  return {
    ballId: candidate.ball.id,
    ballName: candidate.ball.name,
    manufacturer: candidate.ball.manufacturer,
    matchPercentage: candidate.matchScore,
    reason: `Similar performance, saves $${savings}/dozen`,
  };
}

/**
 * Finds a step-up alternative: better performance at higher price.
 */
export function findStepUp(
  topResult: MatchResult,
  allResults: MatchResult[],
): AlternativeRecommendation | null {
  const candidate = allResults.find(
    (r) =>
      r.ball.id !== topResult.ball.id &&
      r.matchScore > topResult.matchScore &&
      r.ball.pricePerDozen > topResult.ball.pricePerDozen &&
      r.ball.coverMaterial.toLowerCase().includes("urethane"),
  );

  if (!candidate) return null;

  const extraCost = (
    candidate.ball.pricePerDozen - topResult.ball.pricePerDozen
  ).toFixed(2);

  return {
    ballId: candidate.ball.id,
    ballName: candidate.ball.name,
    manufacturer: candidate.ball.manufacturer,
    matchPercentage: candidate.matchScore,
    reason: `+$${extraCost}/dozen for enhanced performance`,
  };
}

/**
 * Finds the best value option: highest match score under $30.
 */
export function findBestValue(
  allResults: MatchResult[],
): AlternativeRecommendation | null {
  const valueOptions = allResults
    .filter((r) => r.ball.pricePerDozen < 30)
    .sort((a, b) => b.matchScore - a.matchScore);

  const candidate = valueOptions[0];
  if (!candidate) return null;

  return {
    ballId: candidate.ball.id,
    ballName: candidate.ball.name,
    manufacturer: candidate.ball.manufacturer,
    matchPercentage: candidate.matchScore,
    reason: `Best match under $30/dozen at $${candidate.ball.pricePerDozen}`,
  };
}

/**
 * Finds the best absolute match ignoring price.
 * Only relevant if it differs from the top recommendation.
 */
export function findMoneyNoObject(
  topResult: MatchResult,
  allResults: MatchResult[],
  quizData: QuizData,
): AlternativeRecommendation | null {
  // Re-score without price weight? For simplicity, find the highest-scoring
  // ball that is different from top and has premium construction.
  const premium = allResults
    .filter(
      (r) =>
        r.ball.id !== topResult.ball.id &&
        r.ball.coverMaterial.toLowerCase().includes("urethane"),
    )
    .sort((a, b) => b.matchScore - a.matchScore);

  const candidate = premium[0];
  if (!candidate || candidate.matchScore <= topResult.matchScore) return null;

  return {
    ballId: candidate.ball.id,
    ballName: candidate.ball.name,
    manufacturer: candidate.ball.manufacturer,
    matchPercentage: candidate.matchScore,
    reason: "Best absolute match ignoring price",
  };
}

/**
 * Finds seasonal picks for "Mixed/Year-round" users.
 */
export function findSeasonalPicks(
  allResults: MatchResult[],
  quizData: QuizData,
): { warmWeather: SeasonalPick | null; coldWeather: SeasonalPick | null } | null {
  if (quizData.typicalTemperature !== "mixed") return null;

  // Warm weather pick: balls optimized for warm or all conditions
  const warmCandidate = allResults
    .filter(
      (r) =>
        r.ball.optimalTemp === "WARM" || r.ball.optimalTemp === "ALL",
    )
    .sort((a, b) => b.matchScore - a.matchScore)[0];

  // Cold weather pick: balls with high cold suitability
  const coldCandidate = allResults
    .filter((r) => r.ball.coldSuitability >= 4)
    .sort((a, b) => b.matchScore - a.matchScore)[0];

  return {
    warmWeather: warmCandidate
      ? {
          ballId: warmCandidate.ball.id,
          ballName: warmCandidate.ball.name,
          manufacturer: warmCandidate.ball.manufacturer,
          reason: "Optimized for warm weather performance (70\u00B0F+)",
        }
      : null,
    coldWeather: coldCandidate
      ? {
          ballId: coldCandidate.ball.id,
          ballName: coldCandidate.ball.name,
          manufacturer: coldCandidate.ball.manufacturer,
          reason: "Best cold weather performance (below 50\u00B0F)",
        }
      : null,
  };
}
