// Recommendation output types — matches PRD v1.1 API contract

export type ConfidenceLevel = "high" | "medium" | "low";
export type MatchTier = "strong" | "good" | "moderate";

export const MATCH_TIER_THRESHOLDS = { strong: 75, good: 60 } as const;

export function getMatchTier(score: number): MatchTier {
  if (score >= MATCH_TIER_THRESHOLDS.strong) return "strong";
  if (score >= MATCH_TIER_THRESHOLDS.good) return "good";
  return "moderate";
}

export interface CategoryScores {
  swingSpeedMatch: number;
  performancePriorities: number;
  preferences: number;
  playingConditions: number;
  currentBallAnalysis: number;
}

export interface Explanation {
  whyThisMatches: string[];
  whatYouGain: string[];
  tradeoffs: string[];
}

export interface Recommendation {
  ballId: string;
  ballName: string;
  manufacturer: string;
  matchPercentage: number;
  matchTier: MatchTier;
  categoryScores: CategoryScores;
  explanation: Explanation;
  headline: string;
}

export interface AlternativeRecommendation {
  ballId: string;
  ballName: string;
  manufacturer: string;
  matchPercentage: number;
  reason: string;
}

export interface SeasonalPick {
  ballId: string;
  ballName: string;
  manufacturer: string;
  reason: string;
}

export interface RecommendationResponse {
  confidenceLevel: ConfidenceLevel;
  confidenceMessage: string;
  recommendations: Recommendation[];
  tradeOffCallout: string | null;
  alternatives: {
    stepDown: AlternativeRecommendation | null;
    stepUp: AlternativeRecommendation | null;
    bestValue: AlternativeRecommendation | null;
    moneyNoObject: AlternativeRecommendation | null;
  };
  seasonalPicks: {
    warmWeather: SeasonalPick | null;
    coldWeather: SeasonalPick | null;
  } | null;
}
