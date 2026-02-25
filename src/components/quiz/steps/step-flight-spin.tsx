"use client";

import { useQuiz } from "@/components/quiz/quiz-context";
import { RadioOptionGroup } from "@/components/quiz/radio-option-group";
import { FormField, FormItem } from "@/components/ui/form";
import {
  TRAJECTORY_OPTIONS,
  SPIN_FEEDBACK_OPTIONS,
  SHORT_GAME_SPIN_OPTIONS,
} from "@/lib/quiz/constants";

export function StepFlightSpin() {
  const { form, isPreferencesOnly } = useQuiz();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold text-slate-100">Ball Flight & Spin</h2>
        <p className="text-slate-400 mt-1">
          Tell us about your ball flight preferences.
        </p>
        {isPreferencesOnly && (
          <p className="text-sm text-slate-400 mt-2 bg-surface-active px-3 py-2 rounded-md">
            These fields are optional based on your priorities, but providing
            them will improve your recommendations.
          </p>
        )}
      </div>

      {/* Approach Trajectory */}
      <FormField
        control={form.control}
        name="approachTrajectory"
        render={({ field, fieldState }) => (
          <FormItem>
            <RadioOptionGroup
              label="Preferred trajectory for approach shots"
              name="approachTrajectory"
              options={TRAJECTORY_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              isOptional={isPreferencesOnly}
              layout="horizontal"
            />
          </FormItem>
        )}
      />

      {/* Current Ball Spin */}
      <FormField
        control={form.control}
        name="currentBallSpin"
        render={({ field, fieldState }) => (
          <FormItem>
            <RadioOptionGroup
              label="With your current ball, spin and control on approach shots"
              name="currentBallSpin"
              options={SPIN_FEEDBACK_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              isOptional={isPreferencesOnly}
            />
          </FormItem>
        )}
      />

      {/* Need Short Game Spin */}
      <FormField
        control={form.control}
        name="needShortGameSpin"
        render={({ field, fieldState }) => (
          <FormItem>
            <RadioOptionGroup
              label="Could you benefit from more short game spin?"
              name="needShortGameSpin"
              options={SHORT_GAME_SPIN_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              isOptional={isPreferencesOnly}
              layout="horizontal"
            />
          </FormItem>
        )}
      />
    </div>
  );
}
