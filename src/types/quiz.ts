// Quiz data types
export interface QuizData {
  // Step 1: Background
  currentBall?: {
    brand: string;
    model: string;
  };
  handicap: string;
  roundsPerYear: string;

  // Step 2: Priorities
  priorityType: "performance_only" | "performance_and_preferences" | "preferences_only";
  mostImportant: "short_game" | "approach" | "trajectory" | "all";

  // Step 3: Flight/Spin
  approachTrajectory: "low" | "mid" | "high";
  currentBallSpin: "too_much_release" | "just_right" | "too_much_spin";
  needShortGameSpin: "yes" | "no" | "not_sure";

  // Step 4: Feel/Preferences
  preferredFeel: "very_soft" | "soft" | "medium_firm" | "dont_care";
  colorPreference: "white_only" | "open_to_color" | "open_to_graphics" | "color_required";
  budgetRange: "budget" | "value" | "premium" | "tour_level" | "no_limit";
  durabilityPriority: "single_round" | "multiple_rounds" | "cost_per_round";

  // Step 5: Conditions
  typicalTemperature: "warm" | "moderate" | "cold" | "mixed";
  improvementAreas: string[];

  // Step 6: Metrics
  driverBallSpeed: number;
  ballSpeedUnknown?: boolean;
  ironDistance8: number;
}
