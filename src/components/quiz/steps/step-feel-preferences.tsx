"use client";

import { useQuiz } from "@/components/quiz/quiz-context";
import { RadioOptionGroup } from "@/components/quiz/radio-option-group";
import { FormField, FormItem } from "@/components/ui/form";
import {
  FEEL_OPTIONS,
  COLOR_OPTIONS,
  BUDGET_OPTIONS,
  DURABILITY_OPTIONS,
} from "@/lib/quiz/constants";

export function StepFeelPreferences() {
  const { form } = useQuiz();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold text-slate-100">Feel & Preferences</h2>
        <p className="text-slate-400 mt-1">
          Tell us what matters to you in a golf ball.
        </p>
      </div>

      {/* Preferred Feel */}
      <FormField
        control={form.control}
        name="preferredFeel"
        render={({ field, fieldState }) => (
          <FormItem>
            <RadioOptionGroup
              label="Preferred ball feel"
              name="preferredFeel"
              options={FEEL_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              layout="horizontal"
            />
          </FormItem>
        )}
      />

      {/* Color Preference */}
      <FormField
        control={form.control}
        name="colorPreference"
        render={({ field, fieldState }) => (
          <FormItem>
            <RadioOptionGroup
              label="Ball color preference"
              name="colorPreference"
              options={COLOR_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          </FormItem>
        )}
      />

      {/* Budget Range */}
      <FormField
        control={form.control}
        name="budgetRange"
        render={({ field, fieldState }) => (
          <FormItem>
            <RadioOptionGroup
              label="Budget range per dozen"
              name="budgetRange"
              options={BUDGET_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          </FormItem>
        )}
      />

      {/* Durability Priority */}
      <FormField
        control={form.control}
        name="durabilityPriority"
        render={({ field, fieldState }) => (
          <FormItem>
            <RadioOptionGroup
              label="Durability priority"
              name="durabilityPriority"
              options={DURABILITY_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          </FormItem>
        )}
      />
    </div>
  );
}
