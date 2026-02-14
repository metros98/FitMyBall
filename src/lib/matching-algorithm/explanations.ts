import type { Ball, QuizData, CategoryScores, Explanation } from "./types";
import type { BallSpeedEstimate } from "./types";

/**
 * Generates personalized "Why this ball" explanations for a recommendation.
 */
export function generateExplanation(
  ball: Ball,
  quizData: QuizData,
  scores: CategoryScores,
  ballSpeedEstimate: BallSpeedEstimate,
): Explanation {
  const whyThisMatches: string[] = [];
  const whatYouGain: string[] = [];
  const tradeoffs: string[] = [];

  // Swing speed match explanation
  if (scores.swingSpeedMatch >= 80) {
    const speedText = ballSpeedEstimate.isEstimated
      ? "your estimated ball speed"
      : `your ${ballSpeedEstimate.speed} mph ball speed`;
    whyThisMatches.push(
      `${ball.compression} compression is well-matched to ${speedText}`,
    );
  } else if (scores.swingSpeedMatch >= 60) {
    whyThisMatches.push(
      `${ball.compression} compression is an acceptable match for your swing speed`,
    );
  }

  // Spin match explanation
  if (quizData.needShortGameSpin === "yes" && ball.wedgeSpin === "HIGH") {
    whyThisMatches.push(
      "High wedge spin gives you the short game control you need",
    );
  }

  if (
    quizData.currentBallSpin === "too_much_release" &&
    ball.wedgeSpin === "HIGH"
  ) {
    whatYouGain.push("More spin to hold greens on approach shots");
  }

  if (
    quizData.currentBallSpin === "too_much_spin" &&
    (ball.wedgeSpin === "LOW" || ball.wedgeSpin === "MID")
  ) {
    whatYouGain.push(
      "Reduced spin for better distance control and less ballooning",
    );
  }

  // Launch profile
  if (
    quizData.approachTrajectory &&
    ball.launchProfile === quizData.approachTrajectory.toUpperCase()
  ) {
    whyThisMatches.push(
      `${ball.launchProfile.toLowerCase()} launch matches your preferred trajectory`,
    );
  }

  // Feel explanation
  if (quizData.preferredFeel !== "dont_care" && scores.performancePriorities >= 70) {
    const feelNames: Record<string, string> = {
      VERY_SOFT: "very soft",
      SOFT: "soft",
      MEDIUM: "medium",
      FIRM: "firm",
    };
    whyThisMatches.push(
      `${feelNames[ball.feelRating] || ball.feelRating} feel aligns with your preference`,
    );
  }

  // Price explanation
  if (scores.preferences >= 80) {
    whyThisMatches.push(
      `$${ball.pricePerDozen}/dozen fits within your budget`,
    );
  }

  // Temperature explanation
  if (scores.playingConditions >= 90) {
    if (quizData.typicalTemperature === "cold" && ball.coldSuitability >= 4) {
      whyThisMatches.push(
        "Performs well in cold weather conditions",
      );
    } else if (quizData.typicalTemperature === "mixed") {
      whyThisMatches.push("Versatile across different temperature conditions");
    }
  }

  // Construction explanation
  if (ball.coverMaterial.toLowerCase().includes("urethane")) {
    whatYouGain.push(
      `${ball.coverMaterial} cover provides premium greenside spin and control`,
    );
  }

  // Tradeoffs
  if (
    ball.pricePerDozen > 45 &&
    quizData.budgetRange !== "tour_level" &&
    quizData.budgetRange !== "no_limit"
  ) {
    tradeoffs.push(
      "Premium price point — consider our value alternatives if cost is a concern",
    );
  }

  if (ball.durability <= 2 && quizData.durabilityPriority === "multiple_rounds") {
    tradeoffs.push(
      "Softer cover may show wear after multiple rounds — trades durability for feel",
    );
  }

  if (
    ball.coverMaterial.toLowerCase().includes("ionomer") &&
    quizData.needShortGameSpin === "yes"
  ) {
    tradeoffs.push(
      "Ionomer cover provides less greenside spin than urethane alternatives",
    );
  }

  // Limit to 3-4 bullet points for whyThisMatches
  return {
    whyThisMatches: whyThisMatches.slice(0, 4),
    whatYouGain: whatYouGain.slice(0, 3),
    tradeoffs: tradeoffs.slice(0, 3),
  };
}

/**
 * Generates a one-sentence headline for a recommendation.
 */
export function generateHeadline(
  ball: Ball,
  quizData: QuizData,
  matchScore: number,
): string {
  const strengths: string[] = [];

  if (ball.wedgeSpin === "HIGH") strengths.push("short game spin");
  if (ball.feelRating === "VERY_SOFT" || ball.feelRating === "SOFT")
    strengths.push("soft feel");
  if (ball.durability >= 4) strengths.push("durability");
  if (ball.pricePerDozen < 30) strengths.push("value");
  if (ball.coldSuitability >= 4) strengths.push("all-weather performance");

  if (strengths.length === 0) {
    return `A solid all-around match for your game at ${matchScore}%`;
  }

  const strengthList = strengths.slice(0, 2).join(" and ");
  return `Great match for ${strengthList}`;
}

/**
 * Detects conflicting inputs and generates trade-off callout text.
 * Returns null if no conflicts detected.
 */
export function detectTradeOffCallout(quizData: QuizData): string | null {
  // Tour-level spin with budget pricing
  if (
    quizData.needShortGameSpin === "yes" &&
    quizData.budgetRange === "budget"
  ) {
    return (
      "You asked for maximum short game spin under $20/dozen. " +
      "These goals are in tension — urethane covers that deliver maximum spin typically start at $35+. " +
      "We've optimized for the best spin you can get at your budget, and what you'd gain by stepping up."
    );
  }

  // Wants soft feel but high spin (less common conflict, but possible with firm high-spin balls)
  if (
    quizData.preferredFeel === "very_soft" &&
    quizData.currentBallSpin === "too_much_spin"
  ) {
    return (
      "You want a very soft feel but less spin — " +
      "softer balls tend to generate more spin. " +
      "We've found the best compromise between feel and spin control."
    );
  }

  // Durability + premium feel
  if (
    quizData.durabilityPriority === "multiple_rounds" &&
    quizData.preferredFeel === "very_soft"
  ) {
    return (
      "You want both maximum durability and very soft feel. " +
      "Softer covers tend to scuff faster. " +
      "We've balanced both priorities in our recommendations."
    );
  }

  return null;
}
