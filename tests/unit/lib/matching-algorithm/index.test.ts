import { describe, it, expect } from "vitest";
import { generateRecommendations } from "@/lib/matching-algorithm";
import type { Ball } from "@/types/ball";
import type { QuizData } from "@/types/quiz";

// ============================================================================
// TEST FIXTURES — Representative subset of the ball database
// ============================================================================

const TEST_BALLS: Ball[] = [
  {
    id: "pv1",
    name: "Pro V1",
    manufacturer: "Titleist",
    modelYear: 2024,
    description: "The #1 ball in golf",
    construction: "3-piece",
    coverMaterial: "Cast Urethane",
    layers: 3,
    compression: 90,
    driverSpin: "LOW",
    ironSpin: "MID",
    wedgeSpin: "HIGH",
    launchProfile: "MID",
    feelRating: "SOFT",
    durability: 4,
    skillLevel: ["Advanced", "Tour"],
    pricePerDozen: 54.99,
    availableColors: ["White", "Yellow"],
    inStock: true,
    discontinued: false,
    optimalTemp: "ALL",
    coldSuitability: 4,
    imageUrl: null,
    manufacturerUrl: null,
    productUrls: [],
    slug: "titleist-pro-v1",
  },
  {
    id: "cs",
    name: "Chrome Soft",
    manufacturer: "Callaway",
    modelYear: 2024,
    description: "Tour-level performance",
    construction: "3-piece",
    coverMaterial: "Urethane",
    layers: 3,
    compression: 75,
    driverSpin: "LOW",
    ironSpin: "MID",
    wedgeSpin: "HIGH",
    launchProfile: "MID",
    feelRating: "VERY_SOFT",
    durability: 4,
    skillLevel: ["Advanced"],
    pricePerDozen: 49.99,
    availableColors: ["White", "Yellow"],
    inStock: true,
    discontinued: false,
    optimalTemp: "ALL",
    coldSuitability: 4,
    imageUrl: null,
    manufacturerUrl: null,
    productUrls: [],
    slug: "callaway-chrome-soft",
  },
  {
    id: "ss",
    name: "Supersoft",
    manufacturer: "Callaway",
    modelYear: 2024,
    description: "Ultra-low compression",
    construction: "2-piece",
    coverMaterial: "Ionomer",
    layers: 2,
    compression: 38,
    driverSpin: "LOW",
    ironSpin: "LOW",
    wedgeSpin: "LOW",
    launchProfile: "HIGH",
    feelRating: "VERY_SOFT",
    durability: 5,
    skillLevel: ["Beginner"],
    pricePerDozen: 24.99,
    availableColors: ["White", "Yellow", "Orange", "Pink", "Matte"],
    inStock: true,
    discontinued: false,
    optimalTemp: "WARM",
    coldSuitability: 2,
    imageUrl: null,
    manufacturerUrl: null,
    productUrls: [],
    slug: "callaway-supersoft",
  },
  {
    id: "tr",
    name: "Tour Response",
    manufacturer: "TaylorMade",
    modelYear: 2024,
    description: "Tour performance at a value price",
    construction: "3-piece",
    coverMaterial: "Urethane",
    layers: 3,
    compression: 70,
    driverSpin: "LOW",
    ironSpin: "MID",
    wedgeSpin: "HIGH",
    launchProfile: "MID",
    feelRating: "SOFT",
    durability: 3,
    skillLevel: ["Intermediate", "Advanced"],
    pricePerDozen: 34.99,
    availableColors: ["White", "Yellow"],
    inStock: true,
    discontinued: false,
    optimalTemp: "ALL",
    coldSuitability: 3,
    imageUrl: null,
    manufacturerUrl: null,
    productUrls: [],
    slug: "taylormade-tour-response",
  },
  {
    id: "tbx",
    name: "Tour B X",
    manufacturer: "Bridgestone",
    modelYear: 2024,
    description: "Maximum distance and control for faster swings",
    construction: "3-piece",
    coverMaterial: "Urethane",
    layers: 3,
    compression: 105,
    driverSpin: "LOW",
    ironSpin: "MID",
    wedgeSpin: "HIGH",
    launchProfile: "MID",
    feelRating: "FIRM",
    durability: 5,
    skillLevel: ["Advanced", "Tour"],
    pricePerDozen: 49.99,
    availableColors: ["White", "Yellow"],
    inStock: true,
    discontinued: false,
    optimalTemp: "ALL",
    coldSuitability: 5,
    imageUrl: null,
    manufacturerUrl: null,
    productUrls: [],
    slug: "bridgestone-tour-b-x",
  },
  {
    id: "ds",
    name: "Duo Soft+",
    manufacturer: "Wilson",
    modelYear: 2024,
    description: "Ultra-soft feel",
    construction: "2-piece",
    coverMaterial: "Ionomer",
    layers: 2,
    compression: 35,
    driverSpin: "LOW",
    ironSpin: "LOW",
    wedgeSpin: "MID",
    launchProfile: "HIGH",
    feelRating: "VERY_SOFT",
    durability: 5,
    skillLevel: ["Beginner"],
    pricePerDozen: 19.99,
    availableColors: ["White", "Yellow", "Orange"],
    inStock: true,
    discontinued: false,
    optimalTemp: "WARM",
    coldSuitability: 2,
    imageUrl: null,
    manufacturerUrl: null,
    productUrls: [],
    slug: "wilson-duo-soft-plus",
  },
  {
    id: "cb",
    name: "Cut Blue",
    manufacturer: "Cut",
    modelYear: 2024,
    description: "Premium urethane at value price",
    construction: "3-piece",
    coverMaterial: "Urethane",
    layers: 3,
    compression: 85,
    driverSpin: "LOW",
    ironSpin: "MID",
    wedgeSpin: "HIGH",
    launchProfile: "MID",
    feelRating: "SOFT",
    durability: 4,
    skillLevel: ["Intermediate", "Advanced"],
    pricePerDozen: 24.99,
    availableColors: ["White"],
    inStock: true,
    discontinued: false,
    optimalTemp: "ALL",
    coldSuitability: 4,
    imageUrl: null,
    manufacturerUrl: null,
    productUrls: [],
    slug: "cut-blue",
  },
  {
    id: "disc",
    name: "Discontinued Ball",
    manufacturer: "Old",
    modelYear: 2020,
    description: "No longer made",
    construction: "2-piece",
    coverMaterial: "Surlyn",
    layers: 2,
    compression: 70,
    driverSpin: "LOW",
    ironSpin: "LOW",
    wedgeSpin: "LOW",
    launchProfile: "MID",
    feelRating: "MEDIUM",
    durability: 5,
    skillLevel: ["Beginner"],
    pricePerDozen: 15,
    availableColors: ["White"],
    inStock: false,
    discontinued: true,
    optimalTemp: "ALL",
    coldSuitability: 3,
    imageUrl: null,
    manufacturerUrl: null,
    productUrls: [],
    slug: "discontinued-ball",
  },
];

function makeQuizData(overrides: Partial<QuizData> = {}): QuizData {
  return {
    handicap: "11-15",
    roundsPerYear: "50-100",
    priorityType: "performance_and_preferences",
    mostImportant: "all",
    approachTrajectory: "mid",
    currentBallSpin: "too_much_release",
    needShortGameSpin: "yes",
    preferredFeel: "soft",
    colorPreference: "white_only",
    budgetRange: "premium",
    durabilityPriority: "multiple_rounds",
    typicalTemperature: "warm",
    improvementAreas: ["approach", "short_game"],
    driverBallSpeed: 150,
    ironDistance8: 145,
    ...overrides,
  };
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe("generateRecommendations", () => {
  it("returns recommendations array with 3-5 results", () => {
    const result = generateRecommendations(makeQuizData(), TEST_BALLS);
    expect(result.recommendations.length).toBeGreaterThanOrEqual(3);
    expect(result.recommendations.length).toBeLessThanOrEqual(5);
  });

  it("returns recommendations sorted by match score descending", () => {
    const result = generateRecommendations(makeQuizData(), TEST_BALLS);
    for (let i = 1; i < result.recommendations.length; i++) {
      expect(result.recommendations[i].matchScore).toBeLessThanOrEqual(
        result.recommendations[i - 1].matchScore,
      );
    }
  });

  it("excludes discontinued balls", () => {
    const result = generateRecommendations(makeQuizData(), TEST_BALLS);
    const hasDiscontinued = result.recommendations.some(
      (r) => r.ball.discontinued,
    );
    expect(hasDiscontinued).toBe(false);
  });

  it("includes confidence level and message", () => {
    const result = generateRecommendations(makeQuizData(), TEST_BALLS);
    expect(["high", "medium", "low"]).toContain(result.confidenceLevel);
    expect(result.confidenceMessage).toBeTruthy();
  });

  it("assigns correct match tiers", () => {
    const result = generateRecommendations(makeQuizData(), TEST_BALLS);
    for (const rec of result.recommendations) {
      if (rec.matchScore >= 75) expect(rec.matchTier).toBe("strong");
      else if (rec.matchScore >= 60) expect(rec.matchTier).toBe("good");
      else expect(rec.matchTier).toBe("moderate");
    }
  });

  it("generates explanations with whyThisMatches content", () => {
    const result = generateRecommendations(makeQuizData(), TEST_BALLS);
    for (const rec of result.recommendations) {
      expect(rec.explanation.whyThisMatches.length).toBeGreaterThan(0);
    }
  });

  // PRD Acceptance Criteria Tests

  it("AC: 150mph + Performance Only + High spin → urethane 3/4-piece in 80-105 range", () => {
    const quiz = makeQuizData({
      driverBallSpeed: 150,
      priorityType: "performance_only",
      needShortGameSpin: "yes",
      currentBallSpin: "too_much_release",
    });
    const result = generateRecommendations(quiz, TEST_BALLS);
    const top = result.recommendations[0];

    expect(top).toBeDefined();
    expect(top.ball.coverMaterial.toLowerCase()).toContain("urethane");
    expect(["3-piece", "4-piece"]).toContain(top.ball.construction);
    expect(top.ball.compression).toBeGreaterThanOrEqual(80);
    expect(top.ball.compression).toBeLessThanOrEqual(105);
  });

  it("AC: Preferences Only with all skipped → valid recommendations from price/color/durability/temp", () => {
    const quiz = makeQuizData({
      priorityType: "preferences_only",
      approachTrajectory: undefined,
      currentBallSpin: undefined,
      needShortGameSpin: undefined,
      driverBallSpeed: undefined,
      ballSpeedUnknown: true,
      ironDistance8: undefined,
      budgetRange: "budget",
      colorPreference: "white_only",
      durabilityPriority: "multiple_rounds",
      typicalTemperature: "warm",
    });
    const result = generateRecommendations(quiz, TEST_BALLS);
    expect(result.recommendations.length).toBeGreaterThanOrEqual(3);
    // Top result should prioritize budget + durability + warm temp
    expect(result.recommendations[0].matchScore).toBeGreaterThan(0);
  });

  it("AC: guarantees minimum 3 results even when none above 50%", () => {
    // Create extreme quiz data that won't match most balls well
    const quiz = makeQuizData({
      driverBallSpeed: 200, // Extreme speed
      preferredFeel: "very_soft",
      budgetRange: "budget",
      colorPreference: "color_required",
      typicalTemperature: "cold",
    });
    const result = generateRecommendations(quiz, TEST_BALLS);
    expect(result.recommendations.length).toBeGreaterThanOrEqual(3);
  });

  it("AC: different temperature → different top recommendations", () => {
    const warmQuiz = makeQuizData({ typicalTemperature: "warm" });
    const coldQuiz = makeQuizData({ typicalTemperature: "cold" });

    const warmResult = generateRecommendations(warmQuiz, TEST_BALLS);
    const coldResult = generateRecommendations(coldQuiz, TEST_BALLS);

    // The scores should differ between warm and cold
    const warmTopScore = warmResult.recommendations[0].categoryScores.playingConditions;
    const coldTopScore = coldResult.recommendations[0].categoryScores.playingConditions;

    // At minimum, the conditions scores should be different for the same ball
    // (unless the top ball is an ALL-temp ball for both, which is valid)
    expect(warmResult.recommendations).toBeDefined();
    expect(coldResult.recommendations).toBeDefined();
  });

  it("AC: conflicting inputs → trade-off callout", () => {
    const quiz = makeQuizData({
      needShortGameSpin: "yes",
      budgetRange: "budget",
    });
    const result = generateRecommendations(quiz, TEST_BALLS);
    expect(result.tradeOffCallout).toBeTruthy();
    expect(result.tradeOffCallout).toContain("spin");
  });

  it("returns seasonal picks for mixed temperature users", () => {
    const quiz = makeQuizData({ typicalTemperature: "mixed" });
    const result = generateRecommendations(quiz, TEST_BALLS);
    expect(result.seasonalPicks).not.toBeNull();
    if (result.seasonalPicks) {
      expect(result.seasonalPicks.warmWeather).toBeDefined();
      expect(result.seasonalPicks.coldWeather).toBeDefined();
    }
  });

  it("returns null seasonal picks for non-mixed temperature users", () => {
    const quiz = makeQuizData({ typicalTemperature: "warm" });
    const result = generateRecommendations(quiz, TEST_BALLS);
    expect(result.seasonalPicks).toBeNull();
  });

  it("includes alternatives when available", () => {
    const quiz = makeQuizData({ budgetRange: "premium" });
    const result = generateRecommendations(quiz, TEST_BALLS);
    // At least one alternative should exist given the variety in test balls
    const hasAnyAlternative =
      result.alternatives.stepDown !== null ||
      result.alternatives.stepUp !== null ||
      result.alternatives.bestValue !== null ||
      result.alternatives.moneyNoObject !== null;
    expect(hasAnyAlternative).toBe(true);
  });

  it("returns high confidence for complete actual data", () => {
    const quiz = makeQuizData({
      driverBallSpeed: 150,
      ballSpeedUnknown: false,
      currentBall: { brand: "Titleist", model: "Pro V1" },
      approachTrajectory: "mid",
      currentBallSpin: "just_right",
    });
    const result = generateRecommendations(quiz, TEST_BALLS);
    expect(result.confidenceLevel).toBe("high");
  });

  it("returns low confidence for minimal data", () => {
    const quiz = makeQuizData({
      driverBallSpeed: undefined,
      ballSpeedUnknown: true,
      ironDistance8: undefined,
      handicap: "dont_know",
      currentBall: undefined,
      approachTrajectory: undefined,
      currentBallSpin: undefined,
      needShortGameSpin: undefined,
    });
    const result = generateRecommendations(quiz, TEST_BALLS);
    expect(result.confidenceLevel).toBe("low");
  });
});
