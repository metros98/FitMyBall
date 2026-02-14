import type { Ball } from "@/types/ball";
import type { QuizData } from "@/types/quiz";
import type {
  CategoryScores,
  ConfidenceLevel,
  Explanation,
  MatchTier,
  AlternativeRecommendation,
  SeasonalPick,
} from "@/types/recommendation";

export interface WeightConfig {
  swingSpeed: number;
  performance: number;
  preferences: number;
  conditions: number;
  currentBall: number;
}

export interface BallSpeedEstimate {
  speed: number;
  isEstimated: boolean;
  source: "actual" | "eight_iron" | "handicap" | "default";
}

export interface MatchResult {
  ball: Ball;
  matchScore: number;
  matchTier: MatchTier;
  categoryScores: CategoryScores;
  explanation: Explanation;
  headline: string;
}

export interface AlgorithmOutput {
  confidenceLevel: ConfidenceLevel;
  confidenceMessage: string;
  recommendations: MatchResult[];
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

export type { Ball, QuizData, CategoryScores, Explanation };
