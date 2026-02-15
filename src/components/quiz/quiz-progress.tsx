"use client";

import { useQuiz } from "./quiz-context";
import { Progress } from "@/components/ui/progress";
import { STEP_METADATA } from "@/lib/quiz/constants";

export function QuizProgress() {
  const { state, totalSteps } = useQuiz();
  const percentage = (state.currentStep / totalSteps) * 100;
  const stepMeta = STEP_METADATA[state.currentStep - 1];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">
        Step {state.currentStep} of {totalSteps}
        <span className="mx-2">&middot;</span>
        {stepMeta.name}
      </p>
      <Progress
        value={percentage}
        className="h-2 [&>div]:bg-green-600 [&>div]:transition-all [&>div]:duration-300"
      />
    </div>
  );
}
