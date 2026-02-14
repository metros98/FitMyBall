import { describe, it, expect } from "vitest";
import { calculateConfidence } from "@/lib/matching-algorithm/confidence";
import type { QuizData } from "@/types/quiz";
import type { BallSpeedEstimate } from "@/lib/matching-algorithm/types";

function makeQuizData(overrides: Partial<QuizData> = {}): QuizData {
  return {
    handicap: "11-15",
    roundsPerYear: "50-100",
    priorityType: "performance_and_preferences",
    mostImportant: "all",
    approachTrajectory: "mid",
    currentBallSpin: "just_right",
    needShortGameSpin: "not_sure",
    preferredFeel: "soft",
    colorPreference: "white_only",
    budgetRange: "premium",
    durabilityPriority: "multiple_rounds",
    typicalTemperature: "warm",
    improvementAreas: ["approach"],
    driverBallSpeed: 150,
    ironDistance8: 145,
    currentBall: { brand: "Titleist", model: "Pro V1" },
    ...overrides,
  };
}

describe("calculateConfidence", () => {
  it("returns high confidence with actual ball speed, known current ball, and all fields", () => {
    const ballSpeed: BallSpeedEstimate = {
      speed: 150,
      isEstimated: false,
      source: "actual",
    };
    const result = calculateConfidence(makeQuizData(), ballSpeed);
    expect(result.level).toBe("high");
    expect(result.message).toContain("High confidence");
  });

  it("returns medium confidence with 8-iron estimated ball speed", () => {
    const ballSpeed: BallSpeedEstimate = {
      speed: 148,
      isEstimated: true,
      source: "eight_iron",
    };
    const result = calculateConfidence(makeQuizData(), ballSpeed);
    expect(result.level).toBe("medium");
  });

  it("returns medium confidence with unknown current ball", () => {
    const ballSpeed: BallSpeedEstimate = {
      speed: 150,
      isEstimated: false,
      source: "actual",
    };
    const result = calculateConfidence(
      makeQuizData({ currentBall: undefined }),
      ballSpeed,
    );
    expect(result.level).toBe("medium");
  });

  it("returns low confidence when ball speed estimated from handicap", () => {
    const ballSpeed: BallSpeedEstimate = {
      speed: 142.5,
      isEstimated: true,
      source: "handicap",
    };
    const result = calculateConfidence(makeQuizData(), ballSpeed);
    expect(result.level).toBe("low");
    expect(result.message).toContain("Directional");
  });

  it("returns low confidence when ball speed is default", () => {
    const ballSpeed: BallSpeedEstimate = {
      speed: 135,
      isEstimated: true,
      source: "default",
    };
    const result = calculateConfidence(makeQuizData(), ballSpeed);
    expect(result.level).toBe("low");
  });

  it("returns low confidence when multiple fields are skipped", () => {
    const ballSpeed: BallSpeedEstimate = {
      speed: 148,
      isEstimated: true,
      source: "eight_iron",
    };
    const result = calculateConfidence(
      makeQuizData({
        approachTrajectory: undefined,
        currentBallSpin: undefined,
        needShortGameSpin: undefined,
        ironDistance8: undefined,
      }),
      ballSpeed,
    );
    expect(result.level).toBe("low");
  });
});
