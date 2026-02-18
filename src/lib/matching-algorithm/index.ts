import type { Ball, QuizData, MatchResult, AlgorithmOutput, CategoryScores } from "./types";
import { getMatchTier } from "@/types/recommendation";
import { calculateWeights } from "./weights";
import { resolveBallSpeed } from "./ball-speed";
import {
  scoreSwingSpeed,
  scorePerformance,
  scorePreferences,
  scorePlayingConditions,
  scoreCurrentBall,
} from "./scoring";
import { calculateConfidence } from "./confidence";
import { filterBalls } from "./filters";
import {
  generateExplanation,
  generateHeadline,
  detectTradeOffCallout,
} from "./explanations";
import {
  findStepDown,
  findStepUp,
  findBestValue,
  findMoneyNoObject,
  findSeasonalPicks,
} from "./alternatives";

const MIN_DISPLAY_THRESHOLD = 50;
const MIN_RESULTS = 3;
const MAX_RESULTS = 5;

/**
 * Scores a single ball against the user's quiz data.
 */
function scoreBall(
  ball: Ball,
  quizData: QuizData,
  allBalls: Ball[],
  ballSpeed: number,
): { matchScore: number; categoryScores: CategoryScores } {
  const weights = calculateWeights(quizData);

  const categoryScores: CategoryScores = {
    swingSpeedMatch: scoreSwingSpeed(ball, ballSpeed),
    performancePriorities: scorePerformance(ball, quizData),
    preferences: scorePreferences(ball, quizData),
    playingConditions: scorePlayingConditions(ball, quizData),
    currentBallAnalysis: scoreCurrentBall(ball, quizData, allBalls),
  };

  const matchScore = Math.round(
    categoryScores.swingSpeedMatch * weights.swingSpeed +
      categoryScores.performancePriorities * weights.performance +
      categoryScores.preferences * weights.preferences +
      categoryScores.playingConditions * weights.conditions +
      categoryScores.currentBallAnalysis * weights.currentBall,
  );

  return { matchScore, categoryScores };
}

/**
 * Main algorithm entry point.
 * Takes quiz data and all balls, returns ranked recommendations with
 * explanations, alternatives, and confidence level.
 */
export function generateRecommendations(
  quizData: QuizData,
  allBalls: Ball[],
): AlgorithmOutput {
  // 1. Resolve ball speed (fallback chain)
  const ballSpeedEstimate = resolveBallSpeed(quizData);

  // 2. Pre-filter balls
  const eligibleBalls = filterBalls(allBalls);

  // 3. Score all balls
  const scoredBalls: MatchResult[] = eligibleBalls.map((ball) => {
    const { matchScore, categoryScores } = scoreBall(
      ball,
      quizData,
      allBalls,
      ballSpeedEstimate.speed,
    );

    const explanation = generateExplanation(
      ball,
      quizData,
      categoryScores,
      ballSpeedEstimate,
    );

    const headline = generateHeadline(ball, quizData, matchScore);

    return {
      ball,
      matchScore,
      matchTier: getMatchTier(matchScore),
      categoryScores,
      explanation,
      headline,
    };
  });

  // 4. Sort by match score descending, with cold suitability as tiebreaker
  // for cold/mixed temperature users
  scoredBalls.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    if (
      quizData.typicalTemperature === "cold" ||
      quizData.typicalTemperature === "mixed"
    ) {
      return b.ball.coldSuitability - a.ball.coldSuitability;
    }
    return 0;
  });

  // 5. Apply 50% threshold with minimum 3 results guarantee
  let recommendations: MatchResult[];
  const aboveThreshold = scoredBalls.filter(
    (r) => r.matchScore >= MIN_DISPLAY_THRESHOLD,
  );

  if (aboveThreshold.length >= MIN_RESULTS) {
    recommendations = aboveThreshold.slice(0, MAX_RESULTS);
  } else {
    // Show all above threshold plus next-best to reach minimum 3
    recommendations = scoredBalls.slice(
      0,
      Math.max(MIN_RESULTS, aboveThreshold.length),
    );
  }

  // 6. Calculate confidence level
  const { level: confidenceLevel, message: confidenceMessage } =
    calculateConfidence(quizData, ballSpeedEstimate);

  // 7. Detect trade-off callouts
  const tradeOffCallout = detectTradeOffCallout(quizData);

  // 8. Find alternatives (using full sorted list, not just top 5)
  const topResult = recommendations[0];
  const alternatives = topResult
    ? {
        stepDown: findStepDown(topResult, scoredBalls),
        stepUp: findStepUp(topResult, scoredBalls),
        bestValue: findBestValue(scoredBalls),
        moneyNoObject: findMoneyNoObject(topResult, scoredBalls, quizData),
      }
    : {
        stepDown: null,
        stepUp: null,
        bestValue: null,
        moneyNoObject: null,
      };

  // 9. Find seasonal picks for "Mixed" users
  const seasonalPicks = findSeasonalPicks(scoredBalls, quizData);

  return {
    confidenceLevel,
    confidenceMessage,
    recommendations,
    tradeOffCallout,
    alternatives,
    seasonalPicks,
  };
}

// Re-export sub-modules for direct access
export { calculateWeights } from "./weights";
export { resolveBallSpeed } from "./ball-speed";
export { calculateConfidence } from "./confidence";
export { filterBalls } from "./filters";
export {
  scoreSwingSpeed,
  scorePerformance,
  scorePreferences,
  scorePlayingConditions,
  scoreCurrentBall,
} from "./scoring";
