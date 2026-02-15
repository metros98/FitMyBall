// API request and response types
import type { Ball } from "./ball";
import type { QuizData } from "./quiz";
import type { RecommendationResponse } from "./recommendation";

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

/**
 * API error response
 */
export interface ApiError {
  error: string;
  details?: unknown;
  status: number;
}

/**
 * Pagination parameters for list endpoints
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Pagination metadata in responses
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Ball query filters for GET /api/balls
 */
export interface BallQueryFilters {
  manufacturer?: string;
  minPrice?: number;
  maxPrice?: number;
  compression?: number;
  construction?: string;
  color?: string;
  sortBy?: "price" | "compression" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

/**
 * Ball list response (GET /api/balls)
 */
export interface BallListResponse {
  balls: Ball[];
  pagination: PaginationMeta;
}

/**
 * Ball detail response (GET /api/balls/[id])
 */
export interface BallDetailResponse {
  ball: Ball;
}

/**
 * Ball search response (GET /api/balls/search)
 */
export interface BallSearchResponse {
  results: Ball[];
  query: string;
}

/**
 * Quiz submission request (POST /api/quiz/submit)
 */
export interface QuizSubmitRequest {
  quizData: QuizData;
  userId?: string;
  saveToAccount?: boolean;
}

/**
 * Quiz submission response (POST /api/quiz/submit)
 */
export interface QuizSubmitResponse {
  sessionId: string;
  recommendation: RecommendationResponse;
  timestamp: string;
}

/**
 * Recommendation detail response (GET /api/recommendations/[sessionId])
 */
export interface RecommendationDetailResponse {
  sessionId: string;
  quizData: QuizData;
  recommendation: RecommendationResponse;
  createdAt: string;
}

/**
 * Save recommendation request (POST /api/users/[id]/recommendations)
 */
export interface SaveRecommendationRequest {
  sessionId: string;
}

/**
 * Save recommendation response
 */
export interface SaveRecommendationResponse {
  saved: boolean;
  recommendationId: string;
}

/**
 * Recommendation history item
 */
export interface RecommendationHistoryItem {
  id: string;
  createdAt: string;
  topBallName: string;
  sessionId: string;
}

/**
 * User recommendation history response (GET /api/users/[id]/history)
 */
export interface RecommendationHistoryResponse {
  history: RecommendationHistoryItem[];
  pagination: PaginationMeta;
}
