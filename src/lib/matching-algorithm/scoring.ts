import type { Ball, QuizData } from "./types";
import type { SpinLevel, LaunchLevel, FeelLevel } from "@/types/ball";

// ============================================================================
// 1. SWING SPEED MATCH (PRD v1.1 Section 3.1.3)
// ============================================================================

interface CompressionRange {
  min: number;
  max: number;
  constructions: string[];
}

/**
 * Maps ball speed to optimal compression range and construction types.
 * Uses overlapping ranges per PRD v1.1 table.
 */
function getCompressionRange(ballSpeed: number): CompressionRange {
  if (ballSpeed < 125) {
    return { min: 30, max: 70, constructions: ["2-piece", "3-piece"] };
  }
  if (ballSpeed <= 145) {
    return { min: 60, max: 90, constructions: ["3-piece", "4-piece"] };
  }
  if (ballSpeed <= 165) {
    return {
      min: 80,
      max: 105,
      constructions: ["3-piece", "4-piece", "5-piece"],
    };
  }
  // Over 165 mph
  return { min: 95, max: 110, constructions: ["4-piece", "5-piece"] };
}

/**
 * Scores compression match per PRD:
 * - Ball in range = 100%
 * - Within 10 pts of range = 75%
 * - Outside = 50%
 */
function scoreCompression(
  ballCompression: number,
  range: CompressionRange,
): number {
  if (ballCompression >= range.min && ballCompression <= range.max) {
    return 100;
  }

  const distanceBelow = range.min - ballCompression;
  const distanceAbove = ballCompression - range.max;
  const distance = Math.max(distanceBelow, distanceAbove);

  if (distance <= 10) {
    return 75;
  }

  return 50;
}

/**
 * Scores construction match per PRD:
 * - Exact match = 100%
 * - Adjacent type = 80%
 * - Two steps away = 60%
 */
function scoreConstruction(
  ballConstruction: string,
  idealConstructions: string[],
): number {
  const allTypes = ["2-piece", "3-piece", "4-piece", "5-piece"];

  if (idealConstructions.includes(ballConstruction)) {
    return 100;
  }

  // Find minimum distance to any ideal construction
  const ballIndex = allTypes.indexOf(ballConstruction);
  if (ballIndex === -1) return 60; // Unknown construction

  let minDistance = Infinity;
  for (const ideal of idealConstructions) {
    const idealIndex = allTypes.indexOf(ideal);
    if (idealIndex !== -1) {
      minDistance = Math.min(minDistance, Math.abs(ballIndex - idealIndex));
    }
  }

  if (minDistance === 1) return 80;
  return 60;
}

/**
 * Combined Swing Speed score = (Compression × 0.6) + (Construction × 0.4)
 */
export function scoreSwingSpeed(ball: Ball, ballSpeed: number): number {
  const range = getCompressionRange(ballSpeed);
  const compressionScore = scoreCompression(ball.compression, range);
  const constructionScore = scoreConstruction(
    ball.construction,
    range.constructions,
  );
  return compressionScore * 0.6 + constructionScore * 0.4;
}

// ============================================================================
// 2. PERFORMANCE PRIORITIES (PRD v1.1 Section 3.1.3)
// Sub-weights: Spin(40%) + Launch(30%) + Feel(30%)
// ============================================================================

const SPIN_LEVELS: SpinLevel[] = ["LOW", "LOW_MID", "MID", "MID_HIGH", "HIGH"];
const LAUNCH_LEVELS: LaunchLevel[] = ["LOW", "LOW_MID", "MID", "MID_HIGH", "HIGH"];
const FEEL_LEVELS: FeelLevel[] = ["VERY_SOFT", "SOFT", "MEDIUM", "FIRM"];

function spinDistance(a: SpinLevel, b: SpinLevel): number {
  return Math.abs(SPIN_LEVELS.indexOf(a) - SPIN_LEVELS.indexOf(b));
}

function launchDistance(a: LaunchLevel, b: LaunchLevel): number {
  return Math.abs(LAUNCH_LEVELS.indexOf(a) - LAUNCH_LEVELS.indexOf(b));
}

function feelDistance(a: FeelLevel, b: FeelLevel): number {
  return Math.abs(FEEL_LEVELS.indexOf(a) - FEEL_LEVELS.indexOf(b));
}

/**
 * Scores spin characteristics based on user feedback.
 * Each mismatch level reduces score by 25%.
 */
function scoreSpin(ball: Ball, quizData: QuizData): number {
  let total = 0;
  let factors = 0;

  // User wants more short game spin
  if (quizData.needShortGameSpin === "yes") {
    // Ball has High wedge spin = 100%, Mid = 75%, Low = 50%
    const wedgeScore = ball.wedgeSpin === "HIGH" ? 100
      : ball.wedgeSpin === "MID" ? 75
      : 50;
    total += wedgeScore;
    factors++;
  }

  // Current ball spin feedback
  if (quizData.currentBallSpin === "too_much_release") {
    // Needs MORE spin — ball with High wedge+iron spin = 100%
    if (ball.wedgeSpin === "HIGH" && (ball.ironSpin === "MID" || ball.ironSpin === "HIGH")) {
      total += 100;
    } else if (ball.wedgeSpin === "HIGH") {
      total += 75;
    } else if (ball.wedgeSpin === "MID") {
      total += 50;
    } else {
      total += 25;
    }
    factors++;
  } else if (quizData.currentBallSpin === "too_much_spin") {
    // Needs LESS spin — ball with Low/Mid wedge spin = 100%
    if (ball.wedgeSpin === "LOW") {
      total += 100;
    } else if (ball.wedgeSpin === "MID") {
      total += 75;
    } else {
      total += 50;
    }
    factors++;
  } else if (quizData.currentBallSpin === "just_right") {
    // Maintain similar spin — score based on wedge spin being mid-range or matching
    total += 80; // Neutral-good for any ball when spin is "just right"
    factors++;
  }

  // Not sure about short game spin — neutral scoring
  if (quizData.needShortGameSpin === "not_sure") {
    total += 75;
    factors++;
  }

  return factors > 0 ? total / factors : 75; // Default neutral if no spin data
}

/**
 * Scores launch profile match.
 * Exact match = 100%, one step off = 70%, two steps off = 40%
 */
function scoreLaunch(ball: Ball, quizData: QuizData): number {
  if (!quizData.approachTrajectory) return 75; // Neutral if not provided

  const userLevel = quizData.approachTrajectory.toUpperCase() as LaunchLevel;
  const dist = launchDistance(ball.launchProfile, userLevel);

  if (dist === 0) return 100;
  if (dist === 1) return 70;
  return 40;
}

/**
 * Scores feel match.
 * Exact match = 100%, one step off = 70%, two steps off = 40%
 * "Don't care" = 100% for all balls
 */
function scoreFeel(ball: Ball, quizData: QuizData): number {
  if (quizData.preferredFeel === "dont_care") return 100;

  const feelMap: Record<string, FeelLevel> = {
    very_soft: "VERY_SOFT",
    soft: "SOFT",
    medium_firm: "MEDIUM",
  };

  const userFeel = feelMap[quizData.preferredFeel];
  if (!userFeel) return 75;

  const dist = feelDistance(ball.feelRating, userFeel);

  if (dist === 0) return 100;
  if (dist === 1) return 70;
  return 40;
}

/**
 * Combined Performance score = Spin(40%) + Launch(30%) + Feel(30%)
 */
export function scorePerformance(ball: Ball, quizData: QuizData): number {
  const spinScore = scoreSpin(ball, quizData);
  const launchScore = scoreLaunch(ball, quizData);
  const feelScore = scoreFeel(ball, quizData);

  return spinScore * 0.4 + launchScore * 0.3 + feelScore * 0.3;
}

// ============================================================================
// 3. PREFERENCES (PRD v1.1 Section 3.1.3)
// Sub-weights: Price(50%) + Color(25%) + Durability(25%)
// ============================================================================

/**
 * Scores price match per PRD:
 * - In budget = 100%
 * - One tier below (cheaper) = 90%
 * - One tier above = 50%
 * - Two+ tiers above = 20%
 * - "Price not a factor" = 100%
 */
function scorePrice(pricePerDozen: number, budgetRange: string): number {
  if (budgetRange === "no_limit") return 100;

  // Budget tier boundaries
  const tiers = [
    { name: "budget", max: 20 },
    { name: "value", max: 35 },
    { name: "premium", max: 50 },
    { name: "tour_level", max: Infinity },
  ];

  const userTierIndex = tiers.findIndex((t) => t.name === budgetRange);
  if (userTierIndex === -1) return 50;

  // Determine which tier the ball price falls into
  let ballTierIndex = tiers.length - 1;
  for (let i = 0; i < tiers.length; i++) {
    if (pricePerDozen <= tiers[i].max) {
      ballTierIndex = i;
      break;
    }
  }

  const tierDiff = ballTierIndex - userTierIndex;

  if (tierDiff === 0) return 100; // In budget
  if (tierDiff < 0) return 90;   // Cheaper (one or more tiers below)
  if (tierDiff === 1) return 50;  // One tier above
  return 20;                      // Two+ tiers above
}

/**
 * Scores color availability per PRD:
 * - "White only": white available = 100%, else 0%
 * - "Open to colored": any = 100%
 * - "Open to graphics": any = 100%
 * - "Color/graphics required": non-white available = 100%, white only = 30%
 */
function scoreColor(
  availableColors: string[],
  preference: string,
): number {
  const colorsLower = availableColors.map((c) => c.toLowerCase());

  switch (preference) {
    case "white_only":
      return colorsLower.includes("white") ? 100 : 0;

    case "open_to_color":
    case "open_to_graphics":
      return 100;

    case "color_required": {
      const hasNonWhite = colorsLower.some((c) => c !== "white");
      return hasNonWhite ? 100 : 30;
    }

    default:
      return 100;
  }
}

/**
 * Scores durability per PRD:
 * - "Single round performance" = 100% for all
 * - "Multiple rounds": 4-5 = 100%, 3 = 70%, 1-2 = 40%
 * - "Cost per round": durability × 0.5 + price × 0.5
 */
function scoreDurability(
  durability: number,
  priority: string,
  pricePerDozen: number,
  budgetRange: string,
): number {
  if (priority === "single_round") return 100;

  if (priority === "multiple_rounds") {
    if (durability >= 4) return 100;
    if (durability === 3) return 70;
    return 40;
  }

  if (priority === "cost_per_round") {
    // Combined: durability score × 0.5 + price score × 0.5
    const durabilityScore = durability >= 4 ? 100 : durability === 3 ? 70 : 40;
    const priceScore = scorePrice(pricePerDozen, budgetRange);
    return durabilityScore * 0.5 + priceScore * 0.5;
  }

  return 75;
}

/**
 * Combined Preferences score = Price(50%) + Color(25%) + Durability(25%)
 */
export function scorePreferences(ball: Ball, quizData: QuizData): number {
  const priceScore = scorePrice(ball.pricePerDozen, quizData.budgetRange);
  const colorScore = scoreColor(
    ball.availableColors,
    quizData.colorPreference,
  );
  const durabilityScore = scoreDurability(
    ball.durability,
    quizData.durabilityPriority,
    ball.pricePerDozen,
    quizData.budgetRange,
  );

  return priceScore * 0.5 + colorScore * 0.25 + durabilityScore * 0.25;
}

// ============================================================================
// 4. PLAYING CONDITIONS (PRD v1.1 Section 3.1.3)
// ============================================================================

/**
 * Scores temperature/conditions match per PRD:
 * - Ball optimal matches user = 100%
 * - Ball rated "All" = 90%
 * - Mismatch by one range = 60%
 * - Mismatch by two ranges = 30%
 * - "Mixed" users: average of warm and cold suitability
 */
export function scorePlayingConditions(
  ball: Ball,
  quizData: QuizData,
): number {
  const userTemp = quizData.typicalTemperature;

  // Mixed/Year-round: average warm and cold scores
  if (userTemp === "mixed") {
    const warmScore = scoreTempMatch(ball, "warm");
    const coldScore = scoreTempMatch(ball, "cold");
    return (warmScore + coldScore) / 2;
  }

  return scoreTempMatch(ball, userTemp);
}

function scoreTempMatch(
  ball: Ball,
  userTemp: "warm" | "moderate" | "cold",
): number {
  const tempLevels = ["WARM", "MODERATE", "COLD"];
  const ballOptimal = ball.optimalTemp;

  // Ball rated for all conditions
  if (ballOptimal === "ALL") return 90;

  // Exact match
  if (ballOptimal === userTemp.toUpperCase()) return 100;

  // Calculate distance
  const userIndex = tempLevels.indexOf(userTemp.toUpperCase());
  const ballIndex = tempLevels.indexOf(ballOptimal);

  if (userIndex === -1 || ballIndex === -1) return 60;

  const distance = Math.abs(userIndex - ballIndex);

  if (distance === 1) return 60;
  return 30; // Two ranges apart

  // Cold suitability is used as tiebreaker (handled in ranking, not in base score)
}

// ============================================================================
// 5. CURRENT BALL ANALYSIS (PRD v1.1 Section 3.1.3)
// ============================================================================

/**
 * Scores how well a recommended ball addresses the user's current ball situation.
 * - Addresses stated issues = 100%
 * - Similar profile when "just right" = 100%
 * - Marginal improvement = 75%
 * - Lateral move = 50%
 * - Potential regression = 25%
 * - Don't know → weight redistributed (handled in weights.ts, score unused)
 */
export function scoreCurrentBall(
  ball: Ball,
  quizData: QuizData,
  allBalls: Ball[],
): number {
  // If no current ball, return 0 (weight will be 0 via redistribution)
  if (
    !quizData.currentBall ||
    quizData.currentBall.brand === "dont_know"
  ) {
    return 0;
  }

  const { brand, model } = quizData.currentBall;
  if (!brand || !model || brand === "other") {
    return 0;
  }

  const currentBallData = allBalls.find(
    (b) =>
      b.name.toLowerCase() === model.toLowerCase() &&
      b.manufacturer.toLowerCase() === brand.toLowerCase(),
  );

  // Current ball not in database — skip analysis
  if (!currentBallData) return 0;

  // Don't recommend the exact same ball if user has issues
  if (ball.id === currentBallData.id) {
    if (quizData.currentBallSpin === "just_right") return 100;
    return 25; // They have issues with it, don't recommend same ball
  }

  // User says spin is "just right" — find similar balls
  if (quizData.currentBallSpin === "just_right") {
    return scoreSimilarity(ball, currentBallData);
  }

  // User has issues — score how well this ball addresses them
  return scoreIssueAddressing(ball, currentBallData, quizData);
}

function scoreSimilarity(ball: Ball, currentBall: Ball): number {
  let similarity = 0;

  if (ball.construction === currentBall.construction) similarity += 25;
  if (ball.coverMaterial === currentBall.coverMaterial) similarity += 25;
  if (Math.abs(ball.compression - currentBall.compression) <= 10)
    similarity += 25;
  if (ball.wedgeSpin === currentBall.wedgeSpin) similarity += 15;
  if (ball.feelRating === currentBall.feelRating) similarity += 10;

  return similarity;
}

function scoreIssueAddressing(
  ball: Ball,
  currentBall: Ball,
  quizData: QuizData,
): number {
  let score = 50; // Base: lateral move

  if (quizData.currentBallSpin === "too_much_release") {
    // User needs MORE spin
    if (
      spinDistance(ball.wedgeSpin, "HIGH") <
      spinDistance(currentBall.wedgeSpin, "HIGH")
    ) {
      score += 25; // Better wedge spin
    }
    if (
      spinDistance(ball.ironSpin, "HIGH") <
      spinDistance(currentBall.ironSpin, "HIGH")
    ) {
      score += 15; // Better iron spin
    }
    // Check for regression in an area user didn't flag
    if (ball.durability < currentBall.durability - 1) {
      score -= 10;
    }
  } else if (quizData.currentBallSpin === "too_much_spin") {
    // User needs LESS spin
    if (
      spinDistance(ball.wedgeSpin, "LOW") <
      spinDistance(currentBall.wedgeSpin, "LOW")
    ) {
      score += 25;
    }
    if (
      spinDistance(ball.driverSpin, "LOW") <
      spinDistance(currentBall.driverSpin, "LOW")
    ) {
      score += 15;
    }
  }

  return Math.max(25, Math.min(100, score));
}

// Re-export helpers for testing
export {
  getCompressionRange,
  scoreCompression,
  scoreConstruction,
  scoreSpin,
  scoreLaunch,
  scoreFeel,
  scorePrice,
  scoreColor,
  scoreDurability,
  scoreTempMatch,
};
