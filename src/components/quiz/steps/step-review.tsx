"use client";

import { useQuiz } from "@/components/quiz/quiz-context";
import { ReviewSectionCard } from "@/components/quiz/review-section-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LABEL_MAPS, BALL_BRANDS } from "@/lib/quiz/constants";
import type { QuizFormData } from "@/lib/validations/quiz";
import { CircleCheck, CircleAlert, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

function lookupLabel(
  map: Record<string, string>,
  value: string | undefined,
): string | undefined {
  if (!value) return undefined;
  return map[value] ?? value;
}

function getConfidencePreview(data: Partial<QuizFormData>) {
  const hasSpeed = !!data.driverBallSpeed && !data.ballSpeedUnknown;
  const hasIron = !!data.ironDistance8;
  const hasTrajectory = !!data.approachTrajectory;
  const hasSpin = !!data.currentBallSpin;
  const hasBall =
    data.currentBall?.brand != null &&
    data.currentBall.brand !== "" &&
    data.currentBall.brand !== "dont_know";

  if (hasSpeed && hasBall && hasTrajectory && hasSpin) {
    return {
      level: "high" as const,
      message: "We have strong data to match you accurately",
      icon: CircleCheck,
      color: "text-green-500",
    };
  }
  if (!hasSpeed && !hasIron) {
    return {
      level: "low" as const,
      message:
        "Directional results — provide swing data for more accurate recommendations",
      icon: CircleAlert,
      color: "text-amber-500",
    };
  }
  return {
    level: "medium" as const,
    message: "Good confidence — a few more details would sharpen results",
    icon: Circle,
    color: "text-blue-500",
  };
}

export function StepReview() {
  const { form, goToStep, state } = useQuiz();
  const values = form.getValues();
  const confidence = getConfidencePreview(values);
  const ConfidenceIcon = confidence.icon;

  const brandLabel = values.currentBall?.brand
    ? BALL_BRANDS.find((b) => b.value === values.currentBall?.brand)?.label
    : undefined;
  const currentBallDisplay =
    brandLabel && values.currentBall?.model
      ? `${brandLabel} ${values.currentBall.model}`
      : brandLabel || undefined;

  const improvementLabels = values.improvementAreas
    ?.map((area: string) => LABEL_MAPS.improvementAreas[area as keyof typeof LABEL_MAPS.improvementAreas])
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold text-slate-100">Review Your Answers</h2>
        <p className="text-slate-400 mt-1">
          Make sure everything looks correct before we find your perfect ball.
        </p>
      </div>

      {/* Confidence Preview */}
      <div
        className={cn(
          "flex items-start gap-3 rounded-lg border p-4",
          confidence.level === "high" && "border-green-500/20 bg-green-950",
          confidence.level === "medium" && "border-blue-500/20 bg-sky-950",
          confidence.level === "low" && "border-amber-500/20 bg-amber-950",
        )}
      >
        <ConfidenceIcon className={cn("h-5 w-5 mt-0.5 shrink-0", confidence.color)} />
        <div>
          <p className="text-sm font-medium capitalize text-slate-100">
            {confidence.level} confidence
          </p>
          <p className="text-sm text-slate-400">{confidence.message}</p>
        </div>
      </div>

      {state.submitError && (
        <Alert variant="destructive">
          <AlertDescription>{state.submitError}</AlertDescription>
        </Alert>
      )}

      {/* Section 1: Golf Background */}
      <ReviewSectionCard
        title="Your Golf Background"
        stepNumber={1}
        onEdit={goToStep}
        items={[
          { label: "Current Ball", value: currentBallDisplay },
          {
            label: "Handicap",
            value: lookupLabel(LABEL_MAPS.handicap, values.handicap),
          },
          {
            label: "Rounds / Year",
            value: lookupLabel(LABEL_MAPS.roundsPerYear, values.roundsPerYear),
          },
          {
            label: "Priority",
            value: lookupLabel(LABEL_MAPS.priorityType, values.priorityType),
          },
          {
            label: "Most Important",
            value: lookupLabel(LABEL_MAPS.mostImportant, values.mostImportant),
          },
        ]}
      />

      {/* Section 2: Ball Flight & Spin */}
      <ReviewSectionCard
        title="Ball Flight & Spin"
        stepNumber={2}
        onEdit={goToStep}
        items={[
          {
            label: "Trajectory",
            value: lookupLabel(
              LABEL_MAPS.approachTrajectory,
              values.approachTrajectory,
            ),
          },
          {
            label: "Current Spin",
            value: lookupLabel(
              LABEL_MAPS.currentBallSpin,
              values.currentBallSpin,
            ),
          },
          {
            label: "Short Game Spin",
            value: lookupLabel(
              LABEL_MAPS.needShortGameSpin,
              values.needShortGameSpin,
            ),
          },
        ]}
      />

      {/* Section 3: Feel & Preferences */}
      <ReviewSectionCard
        title="Feel & Preferences"
        stepNumber={3}
        onEdit={goToStep}
        items={[
          {
            label: "Feel",
            value: lookupLabel(LABEL_MAPS.preferredFeel, values.preferredFeel),
          },
          {
            label: "Color",
            value: lookupLabel(
              LABEL_MAPS.colorPreference,
              values.colorPreference,
            ),
          },
          {
            label: "Budget",
            value: lookupLabel(LABEL_MAPS.budgetRange, values.budgetRange),
          },
          {
            label: "Durability",
            value: lookupLabel(
              LABEL_MAPS.durabilityPriority,
              values.durabilityPriority,
            ),
          },
        ]}
      />

      {/* Section 4: Playing Conditions */}
      <ReviewSectionCard
        title="Playing Conditions"
        stepNumber={4}
        onEdit={goToStep}
        items={[
          {
            label: "Temperature",
            value: lookupLabel(
              LABEL_MAPS.typicalTemperature,
              values.typicalTemperature,
            ),
          },
          {
            label: "Improve",
            value: improvementLabels || undefined,
          },
          {
            label: "Ball Speed",
            value: values.ballSpeedUnknown
              ? "Unknown"
              : values.driverBallSpeed
                ? `${values.driverBallSpeed} mph`
                : undefined,
          },
          {
            label: "8-Iron Distance",
            value: values.ironDistance8
              ? `${values.ironDistance8} yards`
              : undefined,
          },
        ]}
      />
    </div>
  );
}
