import { describe, it, expect } from "vitest";
import {
  resolveBallSpeed,
  estimateFromEightIron,
  estimateFromHandicap,
} from "@/lib/matching-algorithm/ball-speed";
import type { QuizData } from "@/types/quiz";

function makeQuizData(overrides: Partial<QuizData> = {}): QuizData {
  return {
    handicap: "11-15",
    roundsPerYear: "50-100",
    priorityType: "performance_and_preferences",
    mostImportant: "all",
    preferredFeel: "soft",
    colorPreference: "white_only",
    budgetRange: "premium",
    durabilityPriority: "multiple_rounds",
    typicalTemperature: "warm",
    improvementAreas: ["approach"],
    ...overrides,
  };
}

describe("estimateFromEightIron", () => {
  it("returns ~120 for 107 yard carry (low end)", () => {
    const speed = estimateFromEightIron(107);
    expect(speed).toBeGreaterThanOrEqual(115);
    expect(speed).toBeLessThanOrEqual(125);
  });

  it("returns ~132 for 122 yard carry (mid-low)", () => {
    const speed = estimateFromEightIron(122);
    expect(speed).toBeGreaterThanOrEqual(125);
    expect(speed).toBeLessThanOrEqual(140);
  });

  it("returns ~147 for 140 yard carry (mid)", () => {
    const speed = estimateFromEightIron(140);
    expect(speed).toBeGreaterThanOrEqual(140);
    expect(speed).toBeLessThanOrEqual(155);
  });

  it("returns ~162 for 160 yard carry (mid-high)", () => {
    const speed = estimateFromEightIron(160);
    expect(speed).toBeGreaterThanOrEqual(155);
    expect(speed).toBeLessThanOrEqual(170);
  });

  it("returns ~180 for 185 yard carry (high)", () => {
    const speed = estimateFromEightIron(185);
    expect(speed).toBeGreaterThanOrEqual(170);
    expect(speed).toBeLessThanOrEqual(190);
  });

  it("handles below minimum (100 yards)", () => {
    expect(estimateFromEightIron(90)).toBe(115);
  });

  it("handles above maximum (200 yards)", () => {
    expect(estimateFromEightIron(210)).toBe(190);
  });
});

describe("estimateFromHandicap", () => {
  it("maps 0-5 handicap to ~162.5 mph", () => {
    expect(estimateFromHandicap("0-5")).toBe(162.5);
  });

  it("maps 6-10 handicap to ~152.5 mph", () => {
    expect(estimateFromHandicap("6-10")).toBe(152.5);
  });

  it("maps 11-15 handicap to ~142.5 mph", () => {
    expect(estimateFromHandicap("11-15")).toBe(142.5);
  });

  it("maps 16-20 handicap to ~132.5 mph", () => {
    expect(estimateFromHandicap("16-20")).toBe(132.5);
  });

  it("maps 21-30 handicap to ~122.5 mph", () => {
    expect(estimateFromHandicap("21-30")).toBe(122.5);
  });

  it("maps 30+ handicap to ~112.5 mph", () => {
    expect(estimateFromHandicap("30+")).toBe(112.5);
  });

  it("maps dont_know to median 135 mph", () => {
    expect(estimateFromHandicap("dont_know")).toBe(135);
  });
});

describe("resolveBallSpeed", () => {
  it("uses actual ball speed when provided and not marked unknown", () => {
    const result = resolveBallSpeed(
      makeQuizData({ driverBallSpeed: 155, ballSpeedUnknown: false }),
    );
    expect(result.speed).toBe(155);
    expect(result.isEstimated).toBe(false);
    expect(result.source).toBe("actual");
  });

  it("falls back to 8-iron estimate when ball speed unknown", () => {
    const result = resolveBallSpeed(
      makeQuizData({
        driverBallSpeed: undefined,
        ballSpeedUnknown: true,
        ironDistance8: 145,
      }),
    );
    expect(result.isEstimated).toBe(true);
    expect(result.source).toBe("eight_iron");
    expect(result.speed).toBeGreaterThanOrEqual(140);
    expect(result.speed).toBeLessThanOrEqual(160);
  });

  it("falls back to handicap estimate when both ball speed and iron distance unknown", () => {
    const result = resolveBallSpeed(
      makeQuizData({
        driverBallSpeed: undefined,
        ballSpeedUnknown: true,
        ironDistance8: undefined,
        handicap: "6-10",
      }),
    );
    expect(result.isEstimated).toBe(true);
    expect(result.source).toBe("handicap");
    expect(result.speed).toBe(152.5);
  });

  it("falls back to default median when everything is unknown", () => {
    const result = resolveBallSpeed(
      makeQuizData({
        driverBallSpeed: undefined,
        ballSpeedUnknown: true,
        ironDistance8: undefined,
        handicap: "dont_know",
      }),
    );
    expect(result.isEstimated).toBe(true);
    expect(result.source).toBe("default");
    expect(result.speed).toBe(135);
  });

  it("treats ball speed of 0 as not provided", () => {
    const result = resolveBallSpeed(
      makeQuizData({
        driverBallSpeed: 0,
        ironDistance8: 140,
      }),
    );
    expect(result.source).toBe("eight_iron");
  });
});
