import { describe, it, expect } from "vitest";
import { calculateWeights, DEFAULT_WEIGHTS } from "@/lib/matching-algorithm/weights";
import type { QuizData } from "@/types/quiz";

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

describe("calculateWeights", () => {
  it("returns default weights for standard inputs", () => {
    const weights = calculateWeights(makeQuizData());
    expect(weights).toEqual(DEFAULT_WEIGHTS);
  });

  it("default weights sum to 1.0", () => {
    const weights = calculateWeights(makeQuizData());
    const sum =
      weights.swingSpeed +
      weights.performance +
      weights.preferences +
      weights.conditions +
      weights.currentBall;
    expect(sum).toBeCloseTo(1.0);
  });

  it("redistributes for 'Preferences Only' with skipped performance fields", () => {
    const weights = calculateWeights(
      makeQuizData({
        priorityType: "preferences_only",
        approachTrajectory: undefined,
        currentBallSpin: undefined,
        needShortGameSpin: undefined,
        driverBallSpeed: undefined,
        ballSpeedUnknown: true,
      }),
    );

    expect(weights.swingSpeed).toBe(0);
    expect(weights.performance).toBe(0);
    expect(weights.preferences).toBeCloseTo(0.55);
    expect(weights.conditions).toBeCloseTo(0.35);
    expect(weights.currentBall).toBeCloseTo(0.1);

    const sum =
      weights.swingSpeed +
      weights.performance +
      weights.preferences +
      weights.conditions +
      weights.currentBall;
    expect(sum).toBeCloseTo(1.0);
  });

  it("redistributes for unknown current ball", () => {
    const weights = calculateWeights(
      makeQuizData({
        currentBall: undefined,
      }),
    );

    expect(weights.currentBall).toBe(0);
    // SS=25/90, PP=30/90, Pref=20/90, PC=15/90
    expect(weights.swingSpeed).toBeCloseTo(0.2778, 3);
    expect(weights.performance).toBeCloseTo(0.3333, 3);
    expect(weights.preferences).toBeCloseTo(0.2222, 3);
    expect(weights.conditions).toBeCloseTo(0.1667, 3);

    const sum =
      weights.swingSpeed +
      weights.performance +
      weights.preferences +
      weights.conditions +
      weights.currentBall;
    expect(sum).toBeCloseTo(1.0);
  });

  it("redistributes for unknown current ball (brand is dont_know)", () => {
    const weights = calculateWeights(
      makeQuizData({
        currentBall: { brand: "dont_know", model: "" },
      }),
    );

    expect(weights.currentBall).toBe(0);
    expect(weights.swingSpeed).toBeGreaterThan(0.25);
  });

  it("redistributes for both preferences-only + unknown current ball", () => {
    const weights = calculateWeights(
      makeQuizData({
        priorityType: "preferences_only",
        approachTrajectory: undefined,
        currentBallSpin: undefined,
        needShortGameSpin: undefined,
        driverBallSpeed: undefined,
        ballSpeedUnknown: true,
        currentBall: undefined,
      }),
    );

    expect(weights.swingSpeed).toBe(0);
    expect(weights.performance).toBe(0);
    expect(weights.currentBall).toBe(0);
    // Pref ≈ 57.9%, Conditions ≈ 42.1% (55/(55+40) and 40/(55+40))
    expect(weights.preferences).toBeCloseTo(0.5789, 3);
    expect(weights.conditions).toBeCloseTo(0.4211, 3);

    const sum =
      weights.swingSpeed +
      weights.performance +
      weights.preferences +
      weights.conditions +
      weights.currentBall;
    expect(sum).toBeCloseTo(1.0);
  });

  it("does not redistribute when preferences_only but performance fields ARE filled", () => {
    const weights = calculateWeights(
      makeQuizData({
        priorityType: "preferences_only",
        approachTrajectory: "high",
        currentBallSpin: "too_much_release",
        driverBallSpeed: 140,
      }),
    );

    // Should get default weights since fields were filled
    expect(weights).toEqual(DEFAULT_WEIGHTS);
  });
});
