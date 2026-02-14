import { describe, it, expect } from "vitest";
import {
  scoreSwingSpeed,
  scorePerformance,
  scorePreferences,
  scorePlayingConditions,
  scoreCurrentBall,
  getCompressionRange,
  scoreCompression,
  scoreConstruction,
  scorePrice,
  scoreColor,
  scoreDurability,
  scoreFeel,
  scoreLaunch,
} from "@/lib/matching-algorithm/scoring";
import type { Ball } from "@/types/ball";
import type { QuizData } from "@/types/quiz";

// ============================================================================
// TEST FIXTURES
// ============================================================================

function makeBall(overrides: Partial<Ball> = {}): Ball {
  return {
    id: "test-ball-1",
    name: "Test Ball",
    manufacturer: "Test",
    modelYear: 2024,
    description: "A test ball",
    construction: "3-piece",
    coverMaterial: "Urethane",
    layers: 3,
    compression: 90,
    driverSpin: "LOW",
    ironSpin: "MID",
    wedgeSpin: "HIGH",
    launchProfile: "MID",
    feelRating: "SOFT",
    durability: 4,
    skillLevel: ["Advanced"],
    pricePerDozen: 45,
    availableColors: ["White", "Yellow"],
    inStock: true,
    discontinued: false,
    optimalTemp: "ALL",
    coldSuitability: 4,
    imageUrl: null,
    manufacturerUrl: null,
    productUrls: [],
    slug: "test-ball-1",
    ...overrides,
  };
}

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
    ...overrides,
  };
}

// ============================================================================
// 1. SWING SPEED MATCH TESTS
// ============================================================================

describe("getCompressionRange", () => {
  it("returns 30-70 for under 125 mph", () => {
    const range = getCompressionRange(110);
    expect(range.min).toBe(30);
    expect(range.max).toBe(70);
    expect(range.constructions).toEqual(["2-piece", "3-piece"]);
  });

  it("returns 60-90 for 125-145 mph", () => {
    const range = getCompressionRange(135);
    expect(range.min).toBe(60);
    expect(range.max).toBe(90);
    expect(range.constructions).toEqual(["3-piece", "4-piece"]);
  });

  it("returns 80-105 for 145-165 mph", () => {
    const range = getCompressionRange(155);
    expect(range.min).toBe(80);
    expect(range.max).toBe(105);
    expect(range.constructions).toEqual(["3-piece", "4-piece", "5-piece"]);
  });

  it("returns 95-110 for over 165 mph", () => {
    const range = getCompressionRange(175);
    expect(range.min).toBe(95);
    expect(range.max).toBe(110);
    expect(range.constructions).toEqual(["4-piece", "5-piece"]);
  });
});

describe("scoreCompression", () => {
  it("returns 100 when ball compression is in range", () => {
    expect(scoreCompression(85, { min: 80, max: 105, constructions: [] })).toBe(
      100,
    );
  });

  it("returns 75 when within 10 points of range", () => {
    expect(scoreCompression(72, { min: 80, max: 105, constructions: [] })).toBe(
      75,
    );
  });

  it("returns 50 when outside 10 points of range", () => {
    expect(scoreCompression(60, { min: 80, max: 105, constructions: [] })).toBe(
      50,
    );
  });

  it("returns 75 when just 10 above range", () => {
    expect(
      scoreCompression(115, { min: 80, max: 105, constructions: [] }),
    ).toBe(75);
  });
});

describe("scoreConstruction", () => {
  it("returns 100 for exact match", () => {
    expect(scoreConstruction("3-piece", ["3-piece", "4-piece"])).toBe(100);
  });

  it("returns 80 for adjacent construction", () => {
    expect(scoreConstruction("2-piece", ["3-piece", "4-piece"])).toBe(80);
  });

  it("returns 60 for two steps away", () => {
    expect(scoreConstruction("2-piece", ["4-piece", "5-piece"])).toBe(60);
  });
});

describe("scoreSwingSpeed", () => {
  it("scores high for perfect compression + construction match", () => {
    const ball = makeBall({ compression: 90, construction: "3-piece" });
    const score = scoreSwingSpeed(ball, 155); // 80-105 range, 3/4/5-piece
    expect(score).toBe(100); // 100*0.6 + 100*0.4 = 100
  });

  it("scores lower for compression near range but wrong construction", () => {
    const ball = makeBall({ compression: 90, construction: "2-piece" });
    const score = scoreSwingSpeed(ball, 155); // 80-105 range, 3/4/5-piece
    // Compression: 100 (in range), Construction: 80 (adjacent)
    expect(score).toBe(100 * 0.6 + 80 * 0.4); // 92
  });

  it("scores low for mismatched compression and construction", () => {
    const ball = makeBall({ compression: 40, construction: "2-piece" });
    const score = scoreSwingSpeed(ball, 175); // 95-110 range, 4/5-piece
    // Compression: 50 (outside), Construction: 60 (2 steps away)
    expect(score).toBe(50 * 0.6 + 60 * 0.4); // 54
  });
});

// ============================================================================
// 2. PERFORMANCE PRIORITIES TESTS
// ============================================================================

describe("scoreLaunch", () => {
  it("returns 100 for exact trajectory match", () => {
    const ball = makeBall({ launchProfile: "HIGH" });
    expect(scoreLaunch(ball, makeQuizData({ approachTrajectory: "high" }))).toBe(
      100,
    );
  });

  it("returns 70 for one step off", () => {
    const ball = makeBall({ launchProfile: "MID" });
    expect(scoreLaunch(ball, makeQuizData({ approachTrajectory: "high" }))).toBe(
      70,
    );
  });

  it("returns 40 for two steps off", () => {
    const ball = makeBall({ launchProfile: "LOW" });
    expect(scoreLaunch(ball, makeQuizData({ approachTrajectory: "high" }))).toBe(
      40,
    );
  });

  it("returns 75 (neutral) when trajectory not provided", () => {
    const ball = makeBall({ launchProfile: "MID" });
    expect(
      scoreLaunch(ball, makeQuizData({ approachTrajectory: undefined })),
    ).toBe(75);
  });
});

describe("scoreFeel", () => {
  it("returns 100 for exact feel match", () => {
    const ball = makeBall({ feelRating: "SOFT" });
    expect(scoreFeel(ball, makeQuizData({ preferredFeel: "soft" }))).toBe(100);
  });

  it("returns 70 for one step off", () => {
    const ball = makeBall({ feelRating: "VERY_SOFT" });
    expect(scoreFeel(ball, makeQuizData({ preferredFeel: "soft" }))).toBe(70);
  });

  it("returns 40 for two steps off", () => {
    const ball = makeBall({ feelRating: "FIRM" });
    expect(scoreFeel(ball, makeQuizData({ preferredFeel: "soft" }))).toBe(40);
  });

  it("returns 100 for dont_care preference", () => {
    const ball = makeBall({ feelRating: "FIRM" });
    expect(scoreFeel(ball, makeQuizData({ preferredFeel: "dont_care" }))).toBe(
      100,
    );
  });
});

describe("scorePerformance", () => {
  it("scores high for ball matching all preferences", () => {
    const ball = makeBall({
      wedgeSpin: "HIGH",
      launchProfile: "MID",
      feelRating: "SOFT",
    });
    const quiz = makeQuizData({
      needShortGameSpin: "yes",
      approachTrajectory: "mid",
      preferredFeel: "soft",
      currentBallSpin: "too_much_release",
    });
    const score = scorePerformance(ball, quiz);
    expect(score).toBeGreaterThan(80);
  });

  it("scores low for ball mismatching all preferences", () => {
    const ball = makeBall({
      wedgeSpin: "LOW",
      launchProfile: "LOW",
      feelRating: "FIRM",
    });
    const quiz = makeQuizData({
      needShortGameSpin: "yes",
      approachTrajectory: "high",
      preferredFeel: "very_soft",
      currentBallSpin: "too_much_release",
    });
    const score = scorePerformance(ball, quiz);
    expect(score).toBeLessThan(60);
  });
});

// ============================================================================
// 3. PREFERENCES TESTS
// ============================================================================

describe("scorePrice", () => {
  it("returns 100 when price is in budget range", () => {
    expect(scorePrice(15, "budget")).toBe(100); // <$20
    expect(scorePrice(28, "value")).toBe(100); // $20-35
    expect(scorePrice(42, "premium")).toBe(100); // $35-50
    expect(scorePrice(55, "tour_level")).toBe(100); // $50+
  });

  it("returns 100 for price_not_a_factor", () => {
    expect(scorePrice(99, "no_limit")).toBe(100);
  });

  it("returns 90 when one tier cheaper", () => {
    expect(scorePrice(15, "value")).toBe(90); // Budget ball for value buyer
  });

  it("returns 50 when one tier above budget", () => {
    expect(scorePrice(28, "budget")).toBe(50); // Value ball for budget buyer
  });

  it("returns 20 when two+ tiers above budget", () => {
    expect(scorePrice(42, "budget")).toBe(20); // Premium for budget buyer
  });
});

describe("scoreColor", () => {
  it("returns 100 when white available for white_only", () => {
    expect(scoreColor(["White", "Yellow"], "white_only")).toBe(100);
  });

  it("returns 0 when white not available for white_only", () => {
    expect(scoreColor(["Yellow", "Orange"], "white_only")).toBe(0);
  });

  it("returns 100 for open_to_color (any ball)", () => {
    expect(scoreColor(["White"], "open_to_color")).toBe(100);
  });

  it("returns 100 for color_required when non-white available", () => {
    expect(scoreColor(["White", "Yellow"], "color_required")).toBe(100);
  });

  it("returns 30 for color_required when only white", () => {
    expect(scoreColor(["White"], "color_required")).toBe(30);
  });
});

describe("scoreDurability", () => {
  it("returns 100 for single_round priority (any durability)", () => {
    expect(scoreDurability(1, "single_round", 50, "premium")).toBe(100);
    expect(scoreDurability(5, "single_round", 50, "premium")).toBe(100);
  });

  it("scores by durability rating for multiple_rounds", () => {
    expect(scoreDurability(5, "multiple_rounds", 50, "premium")).toBe(100);
    expect(scoreDurability(4, "multiple_rounds", 50, "premium")).toBe(100);
    expect(scoreDurability(3, "multiple_rounds", 50, "premium")).toBe(70);
    expect(scoreDurability(2, "multiple_rounds", 50, "premium")).toBe(40);
  });

  it("combines durability and price for cost_per_round", () => {
    // High durability + in-budget price
    const score = scoreDurability(5, "cost_per_round", 42, "premium");
    // durability: 100 * 0.5 + price: 100 * 0.5 = 100
    expect(score).toBe(100);
  });
});

describe("scorePreferences", () => {
  it("scores high when all preferences match", () => {
    const ball = makeBall({
      pricePerDozen: 42,
      availableColors: ["White", "Yellow"],
      durability: 5,
    });
    const quiz = makeQuizData({
      budgetRange: "premium",
      colorPreference: "white_only",
      durabilityPriority: "multiple_rounds",
    });
    const score = scorePreferences(ball, quiz);
    expect(score).toBe(100);
  });

  it("scores low when price and color mismatch", () => {
    const ball = makeBall({
      pricePerDozen: 55,
      availableColors: ["Matte"],
      durability: 2,
    });
    const quiz = makeQuizData({
      budgetRange: "budget",
      colorPreference: "white_only",
      durabilityPriority: "multiple_rounds",
    });
    const score = scorePreferences(ball, quiz);
    expect(score).toBeLessThan(30);
  });
});

// ============================================================================
// 4. PLAYING CONDITIONS TESTS
// ============================================================================

describe("scorePlayingConditions", () => {
  it("returns 100 for exact temperature match", () => {
    const ball = makeBall({ optimalTemp: "WARM" });
    const score = scorePlayingConditions(
      ball,
      makeQuizData({ typicalTemperature: "warm" }),
    );
    expect(score).toBe(100);
  });

  it("returns 90 for ALL-temp ball", () => {
    const ball = makeBall({ optimalTemp: "ALL" });
    const score = scorePlayingConditions(
      ball,
      makeQuizData({ typicalTemperature: "warm" }),
    );
    expect(score).toBe(90);
  });

  it("returns 60 for one-range temperature mismatch", () => {
    const ball = makeBall({ optimalTemp: "MODERATE" });
    const score = scorePlayingConditions(
      ball,
      makeQuizData({ typicalTemperature: "cold" }),
    );
    expect(score).toBe(60);
  });

  it("returns 30 for two-range temperature mismatch", () => {
    const ball = makeBall({ optimalTemp: "WARM" });
    const score = scorePlayingConditions(
      ball,
      makeQuizData({ typicalTemperature: "cold" }),
    );
    expect(score).toBe(30);
  });

  it("averages warm and cold scores for mixed users", () => {
    const ball = makeBall({ optimalTemp: "ALL" });
    const score = scorePlayingConditions(
      ball,
      makeQuizData({ typicalTemperature: "mixed" }),
    );
    // ALL for warm = 90, ALL for cold = 90, average = 90
    expect(score).toBe(90);
  });

  it("penalizes warm-only ball for mixed users", () => {
    const ball = makeBall({ optimalTemp: "WARM" });
    const score = scorePlayingConditions(
      ball,
      makeQuizData({ typicalTemperature: "mixed" }),
    );
    // Warm = 100, Cold = 30 (two ranges apart), average = 65
    expect(score).toBe(65);
  });
});

// ============================================================================
// 5. CURRENT BALL ANALYSIS TESTS
// ============================================================================

describe("scoreCurrentBall", () => {
  const proV1 = makeBall({
    id: "pv1",
    name: "Pro V1",
    manufacturer: "Titleist",
    construction: "3-piece",
    coverMaterial: "Cast Urethane",
    compression: 90,
    wedgeSpin: "HIGH",
    ironSpin: "MID",
    feelRating: "SOFT",
    durability: 4,
  });

  const allBalls = [
    proV1,
    makeBall({
      id: "cs",
      name: "Chrome Soft",
      manufacturer: "Callaway",
      construction: "3-piece",
      coverMaterial: "Urethane",
      compression: 75,
      wedgeSpin: "HIGH",
      ironSpin: "MID",
    }),
    makeBall({
      id: "ss",
      name: "Supersoft",
      manufacturer: "Callaway",
      construction: "2-piece",
      coverMaterial: "Ionomer",
      compression: 38,
      wedgeSpin: "LOW",
    }),
  ];

  it("returns 0 when current ball is unknown", () => {
    const score = scoreCurrentBall(
      allBalls[1],
      makeQuizData({ currentBall: undefined }),
      allBalls,
    );
    expect(score).toBe(0);
  });

  it("returns 0 when current ball brand is dont_know", () => {
    const score = scoreCurrentBall(
      allBalls[1],
      makeQuizData({ currentBall: { brand: "dont_know", model: "" } }),
      allBalls,
    );
    expect(score).toBe(0);
  });

  it("returns high score for same ball when user says spin is just_right", () => {
    const score = scoreCurrentBall(
      proV1,
      makeQuizData({
        currentBall: { brand: "Titleist", model: "Pro V1" },
        currentBallSpin: "just_right",
      }),
      allBalls,
    );
    expect(score).toBe(100);
  });

  it("scores similarity for similar ball when spin is just_right", () => {
    const score = scoreCurrentBall(
      allBalls[1], // Chrome Soft — similar construction
      makeQuizData({
        currentBall: { brand: "Titleist", model: "Pro V1" },
        currentBallSpin: "just_right",
      }),
      allBalls,
    );
    // Same construction (25) + cover mismatch "Urethane" vs "Cast Urethane" (0) + compression 15pts apart (0) + same wedge spin (15) + same feel (10) = 50
    expect(score).toBeGreaterThanOrEqual(50);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("penalizes same ball when user has issues", () => {
    const score = scoreCurrentBall(
      proV1,
      makeQuizData({
        currentBall: { brand: "Titleist", model: "Pro V1" },
        currentBallSpin: "too_much_release",
      }),
      allBalls,
    );
    expect(score).toBe(25);
  });
});
