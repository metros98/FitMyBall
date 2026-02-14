import type { QuizData, BallSpeedEstimate } from "./types";
import type { ConfidenceLevel } from "@/types/recommendation";

interface ConfidenceResult {
  level: ConfidenceLevel;
  message: string;
}

/**
 * Determines recommendation confidence level per PRD v1.1:
 *
 * High: actual ball speed + known current ball + all fields completed
 * Medium: ball speed estimated from 8-iron OR current ball unknown, most fields completed
 * Low: ball speed from handicap estimate, or multiple fields skipped
 */
export function calculateConfidence(
  quizData: QuizData,
  ballSpeedEstimate: BallSpeedEstimate,
): ConfidenceResult {
  const hasActualBallSpeed = !ballSpeedEstimate.isEstimated;
  const hasKnownCurrentBall =
    !!quizData.currentBall && quizData.currentBall.brand !== "dont_know";
  const hasTrajectory = !!quizData.approachTrajectory;
  const hasSpinFeedback = !!quizData.currentBallSpin;
  const hasIronDistance = !!quizData.ironDistance8 && quizData.ironDistance8 > 0;

  const optionalFieldsComplete = hasTrajectory && hasSpinFeedback;
  const speedFromHandicapOrDefault =
    ballSpeedEstimate.source === "handicap" ||
    ballSpeedEstimate.source === "default";

  // Count skipped fields
  const skippedFields = [
    !hasTrajectory,
    !hasSpinFeedback,
    !quizData.needShortGameSpin,
    !hasActualBallSpeed && !hasIronDistance,
  ].filter(Boolean).length;

  // Low: ball speed from handicap/default, or multiple fields skipped
  if (speedFromHandicapOrDefault || skippedFields >= 3) {
    return {
      level: "low",
      message:
        "Directional — provide swing data for more accurate results",
    };
  }

  // High: actual ball speed + known current ball + all fields
  if (hasActualBallSpeed && hasKnownCurrentBall && optionalFieldsComplete) {
    return {
      level: "high",
      message:
        "High confidence — we have strong data to match you",
    };
  }

  // Medium: everything else (estimated from 8-iron, or current ball unknown, etc.)
  return {
    level: "medium",
    message:
      "Good confidence — a few more details would sharpen this",
  };
}
