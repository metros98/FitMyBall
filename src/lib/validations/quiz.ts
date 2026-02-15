import { z } from "zod";

// --- Per-step field schemas ---

const currentBallSchema = z
  .object({
    brand: z.string().optional(),
    model: z.string().optional(),
  })
  .optional();

export const step1Schema = z.object({
  currentBall: currentBallSchema,
  handicap: z.enum(["0-5", "6-10", "11-15", "16-20", "21-30", "30+", "dont_know"], {
    message: "Please select your handicap",
  }),
  roundsPerYear: z.enum(["<10", "10-50", "50-100", "100+"], {
    message: "Please select rounds per year",
  }),
  priorityType: z.enum(
    ["performance_only", "performance_and_preferences", "preferences_only"],
    { message: "Please select your priority" },
  ),
  mostImportant: z.enum(["short_game", "approach", "trajectory", "all"], {
    message: "Please select what's most important",
  }),
});

export const step2Schema = z.object({
  approachTrajectory: z.enum(["low", "mid", "high"]).optional(),
  currentBallSpin: z
    .enum(["too_much_release", "just_right", "too_much_spin"])
    .optional(),
  needShortGameSpin: z.enum(["yes", "no", "not_sure"]).optional(),
});

export const step3Schema = z.object({
  preferredFeel: z.enum(["very_soft", "soft", "medium_firm", "dont_care"], {
    message: "Please select your feel preference",
  }),
  colorPreference: z.enum(
    ["white_only", "open_to_color", "open_to_graphics", "color_required"],
    { message: "Please select your color preference" },
  ),
  budgetRange: z.enum(["budget", "value", "premium", "tour_level", "no_limit"], {
    message: "Please select your budget range",
  }),
  durabilityPriority: z.enum(
    ["single_round", "multiple_rounds", "cost_per_round"],
    { message: "Please select your durability priority" },
  ),
});

export const step4Schema = z.object({
  typicalTemperature: z.enum(["warm", "moderate", "cold", "mixed"], {
    message: "Please select your typical playing temperature",
  }),
  improvementAreas: z
    .array(
      z.enum([
        "tee_distance",
        "tee_accuracy",
        "approach",
        "short_game",
        "putting",
      ]),
    )
    .min(1, "Select at least one area to improve"),
  driverBallSpeed: z.number().min(100).max(200).optional(),
  ballSpeedUnknown: z.boolean().optional(),
  ironDistance8: z.number().min(100).max(200).optional(),
});

// --- Combined quiz schema ---

export const quizSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

export type QuizFormData = z.infer<typeof quizSchema>;

// --- Per-step field names for validation triggering ---

export const STEP_FIELDS: Record<number, (keyof QuizFormData)[]> = {
  1: ["handicap", "roundsPerYear", "priorityType", "mostImportant"],
  2: ["approachTrajectory", "currentBallSpin", "needShortGameSpin"],
  3: ["preferredFeel", "colorPreference", "budgetRange", "durabilityPriority"],
  4: [
    "typicalTemperature",
    "improvementAreas",
    "driverBallSpeed",
    "ballSpeedUnknown",
    "ironDistance8",
  ],
  5: [],
};
