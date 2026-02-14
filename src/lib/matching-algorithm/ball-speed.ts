import type { QuizData, BallSpeedEstimate } from "./types";
import type { HandicapRange } from "@/types/quiz";

/**
 * Estimates ball speed from 8-iron carry distance.
 * PRD v1.1 mapping (range midpoints used):
 * - 100-115 yds → ~115-125 mph → midpoint 120
 * - 115-130 yds → ~125-140 mph → midpoint 132.5
 * - 130-150 yds → ~140-155 mph → midpoint 147.5
 * - 150-170 yds → ~155-170 mph → midpoint 162.5
 * - 170-200 yds → ~170-190 mph → midpoint 180
 */
export function estimateFromEightIron(distance: number): number {
  if (distance < 100) return 115;
  if (distance <= 115) return linearInterpolate(100, 115, 115, 125, distance);
  if (distance <= 130) return linearInterpolate(115, 130, 125, 140, distance);
  if (distance <= 150) return linearInterpolate(130, 150, 140, 155, distance);
  if (distance <= 170) return linearInterpolate(150, 170, 155, 170, distance);
  if (distance <= 200) return linearInterpolate(170, 200, 170, 190, distance);
  return 190;
}

/**
 * Estimates ball speed from handicap range.
 * PRD v1.1 mapping (range midpoints used):
 * - 0-5 → ~155-170 mph → midpoint 162.5
 * - 6-10 → ~145-160 mph → midpoint 152.5
 * - 11-15 → ~135-150 mph → midpoint 142.5
 * - 16-20 → ~125-140 mph → midpoint 132.5
 * - 21-30 → ~115-130 mph → midpoint 122.5
 * - 30+ → ~105-120 mph → midpoint 112.5
 */
export function estimateFromHandicap(handicap: HandicapRange): number {
  switch (handicap) {
    case "0-5":
      return 162.5;
    case "6-10":
      return 152.5;
    case "11-15":
      return 142.5;
    case "16-20":
      return 132.5;
    case "21-30":
      return 122.5;
    case "30+":
      return 112.5;
    case "dont_know":
      return 135; // Median fallback
  }
}

/**
 * Resolves the user's ball speed using the fallback chain:
 * 1. Actual ball speed (if provided and not marked unknown)
 * 2. Estimate from 8-iron distance
 * 3. Estimate from handicap
 * 4. Default median (135 mph)
 */
export function resolveBallSpeed(quizData: QuizData): BallSpeedEstimate {
  // 1. Actual ball speed provided
  if (
    quizData.driverBallSpeed &&
    quizData.driverBallSpeed > 0 &&
    !quizData.ballSpeedUnknown
  ) {
    return {
      speed: quizData.driverBallSpeed,
      isEstimated: false,
      source: "actual",
    };
  }

  // 2. Estimate from 8-iron distance
  if (quizData.ironDistance8 && quizData.ironDistance8 > 0) {
    return {
      speed: Math.round(estimateFromEightIron(quizData.ironDistance8)),
      isEstimated: true,
      source: "eight_iron",
    };
  }

  // 3. Estimate from handicap
  if (quizData.handicap && quizData.handicap !== "dont_know") {
    return {
      speed: estimateFromHandicap(quizData.handicap),
      isEstimated: true,
      source: "handicap",
    };
  }

  // 4. Default median
  return {
    speed: 135,
    isEstimated: true,
    source: "default",
  };
}

function linearInterpolate(
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  x: number,
): number {
  return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
}
