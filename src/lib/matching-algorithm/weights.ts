import type { QuizData, WeightConfig } from "./types";

// Default weights per PRD v1.1 section 3.1.3
const DEFAULT_WEIGHTS: WeightConfig = {
  swingSpeed: 0.25,
  performance: 0.30,
  preferences: 0.20,
  conditions: 0.15,
  currentBall: 0.10,
};

/**
 * Determines whether the user skipped performance fields.
 * "Skipped" means the user selected "Preferences Only" AND left
 * the optional performance fields (ball speed, trajectory, spin feedback) blank.
 */
function hasSkippedPerformanceFields(quizData: QuizData): boolean {
  if (quizData.priorityType !== "preferences_only") return false;

  const hasNoBallSpeed =
    !quizData.driverBallSpeed && quizData.ballSpeedUnknown !== false;
  const hasNoTrajectory = !quizData.approachTrajectory;
  const hasNoSpinFeedback = !quizData.currentBallSpin;

  return hasNoBallSpeed && hasNoTrajectory && hasNoSpinFeedback;
}

/**
 * Determines whether the current ball is unknown.
 */
function isCurrentBallUnknown(quizData: QuizData): boolean {
  return !quizData.currentBall || quizData.currentBall.brand === "dont_know";
}

/**
 * Calculates the weight configuration based on user priority type and data completeness.
 *
 * PRD v1.1 weight redistribution rules:
 * - Default: SS=25%, PP=30%, Pref=20%, PC=15%, CB=10%
 * - "Preferences Only" with skipped fields: redistribute SS(25%) + PP(30%)
 *   proportionally across Pref(~55%) and PC(~40%), CB stays 10%
 * - Current ball unknown: redistribute CB(10%) proportionally across remaining 4
 * - Both conditions: Pref becomes ~64.7%, PC becomes ~35.3%
 */
export function calculateWeights(quizData: QuizData): WeightConfig {
  const skippedPerformance = hasSkippedPerformanceFields(quizData);
  const unknownCurrentBall = isCurrentBallUnknown(quizData);

  // Case: Both preferences-only with skipped fields AND unknown current ball
  if (skippedPerformance && unknownCurrentBall) {
    // All weight goes to Preferences and Conditions
    // Proportional: Pref was 20, Conditions was 15 → ratio 20:15 = 4:3
    // Total = 100%, split: Pref = 4/7 ≈ 57.1%, Conditions = 3/7 ≈ 42.9%
    // But PRD says ~64.7% and ~35.3% — this is Pref=55%/(55%+40%) and PC=40%/(55%+40%)
    // which comes from first redistributing SS+PP into Pref+PC, then redistributing CB
    const prefsAfterFirst = 0.55; // ~55% after SS+PP redistribution
    const conditionsAfterFirst = 0.40; // ~40% after SS+PP redistribution
    // Now redistribute currentBall (10% was already 0 in first step, but the
    // PRD calculates it as: from the "Preferences Only" weights, CB was still 10%,
    // now redistribute that 10% proportionally across Pref and Conditions)
    const totalRemaining = prefsAfterFirst + conditionsAfterFirst;
    return {
      swingSpeed: 0,
      performance: 0,
      preferences: prefsAfterFirst / totalRemaining,
      conditions: conditionsAfterFirst / totalRemaining,
      currentBall: 0,
    };
  }

  // Case: "Preferences Only" with skipped performance fields
  if (skippedPerformance) {
    // Redistribute SS(25%) + PP(30%) proportionally across Pref and Conditions
    // Original Pref=20%, Conditions=15% → ratio 20:15 = 4:3
    // 55% redistributed: Pref gets 55%*(4/7) ≈ 31.4%, Conditions gets 55%*(3/7) ≈ 23.6%
    // Plus originals: Pref = 20% + 31.4% ≈ 51.4%? No —
    // PRD says: "Preferences becomes ~55%, Playing Conditions becomes ~40%, CB remains 10%"
    // So it's a direct statement, not a proportional calc from originals.
    return {
      swingSpeed: 0,
      performance: 0,
      preferences: 0.55,
      conditions: 0.35,
      currentBall: 0.10,
    };
  }

  // Case: Unknown current ball only
  if (unknownCurrentBall) {
    // Redistribute CB(10%) proportionally across the remaining 4 categories
    // SS=25, PP=30, Pref=20, PC=15 → total=90 → each gets +10%*(original/90)
    const total = DEFAULT_WEIGHTS.swingSpeed + DEFAULT_WEIGHTS.performance +
      DEFAULT_WEIGHTS.preferences + DEFAULT_WEIGHTS.conditions;
    return {
      swingSpeed: DEFAULT_WEIGHTS.swingSpeed / total,
      performance: DEFAULT_WEIGHTS.performance / total,
      preferences: DEFAULT_WEIGHTS.preferences / total,
      conditions: DEFAULT_WEIGHTS.conditions / total,
      currentBall: 0,
    };
  }

  // Default weights
  return { ...DEFAULT_WEIGHTS };
}

export { DEFAULT_WEIGHTS };
