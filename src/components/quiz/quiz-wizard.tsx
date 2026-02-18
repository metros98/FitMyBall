"use client";

import { QuizProvider, useQuiz } from "./quiz-context";
import { QuizProgress } from "./quiz-progress";
import { QuizNavigation } from "./quiz-navigation";
import {
  StepBackground,
  StepFlightSpin,
  StepFeelPreferences,
  StepConditions,
  StepReview,
} from "./steps";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const STEP_COMPONENTS: Record<number, React.ComponentType> = {
  1: StepBackground,
  2: StepFlightSpin,
  3: StepFeelPreferences,
  4: StepConditions,
  5: StepReview,
};

function QuizWizardInner() {
  const { form, state } = useQuiz();

  const StepComponent = STEP_COMPONENTS[state.currentStep];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-4 sm:py-8">
        <QuizProgress />

        <Form {...form}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8"
          >
            <div
              key={state.currentStep}
              className={cn(
                "animate-in fade-in duration-200",
                state.direction === "forward"
                  ? "slide-in-from-right-4"
                  : "slide-in-from-left-4",
              )}
            >
              {StepComponent && <StepComponent />}
            </div>

            <QuizNavigation className="mt-8 pb-8" />
          </form>
        </Form>
      </div>
    </div>
  );
}

export function QuizWizard() {
  return (
    <QuizProvider>
      <QuizWizardInner />
    </QuizProvider>
  );
}
