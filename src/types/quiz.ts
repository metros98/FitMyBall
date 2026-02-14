// Quiz data types — matches PRD v1.1 5-step wizard

export type PriorityType =
  | "performance_only"
  | "performance_and_preferences"
  | "preferences_only";

export type MostImportant = "short_game" | "approach" | "trajectory" | "all";

export type TrajectoryLevel = "low" | "mid" | "high";

export type SpinFeedback = "too_much_release" | "just_right" | "too_much_spin";

export type ShortGameSpinNeed = "yes" | "no" | "not_sure";

export type FeelPreference = "very_soft" | "soft" | "medium_firm" | "dont_care";

export type ColorPreference =
  | "white_only"
  | "open_to_color"
  | "open_to_graphics"
  | "color_required";

export type BudgetRange =
  | "budget"
  | "value"
  | "premium"
  | "tour_level"
  | "no_limit";

export type DurabilityPriority =
  | "single_round"
  | "multiple_rounds"
  | "cost_per_round";

export type TemperaturePreference = "warm" | "moderate" | "cold" | "mixed";

export type HandicapRange =
  | "0-5"
  | "6-10"
  | "11-15"
  | "16-20"
  | "21-30"
  | "30+"
  | "dont_know";

export type ImprovementArea =
  | "tee_distance"
  | "tee_accuracy"
  | "approach"
  | "short_game"
  | "putting";

export interface QuizData {
  // Step 1: Background & Priorities
  currentBall?: {
    brand: string;
    model: string;
  };
  handicap: HandicapRange;
  roundsPerYear: string;
  priorityType: PriorityType;
  mostImportant: MostImportant;

  // Step 2: Flight & Spin (optional for "Preferences Only")
  approachTrajectory?: TrajectoryLevel;
  currentBallSpin?: SpinFeedback;
  needShortGameSpin?: ShortGameSpinNeed;

  // Step 3: Feel & Preferences
  preferredFeel: FeelPreference;
  colorPreference: ColorPreference;
  budgetRange: BudgetRange;
  durabilityPriority: DurabilityPriority;

  // Step 4: Playing Conditions & Performance Metrics
  typicalTemperature: TemperaturePreference;
  improvementAreas: ImprovementArea[];
  // Ball speed and 8-iron distance optional for "Preferences Only"
  driverBallSpeed?: number;
  ballSpeedUnknown?: boolean;
  ironDistance8?: number;
}
