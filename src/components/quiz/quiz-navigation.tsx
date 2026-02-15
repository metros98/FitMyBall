"use client";

import { useQuiz } from "./quiz-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizNavigationProps {
  className?: string;
}

export function QuizNavigation({ className }: QuizNavigationProps) {
  const { state, nextStep, prevStep, submitQuiz, isFirstStep, isLastStep } =
    useQuiz();

  return (
    <div className={cn("flex justify-between", className)}>
      {!isFirstStep ? (
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={state.isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      ) : (
        <div />
      )}

      {isLastStep ? (
        <Button
          type="button"
          onClick={submitQuiz}
          disabled={state.isSubmitting}
          size="lg"
        >
          {state.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing your game...
            </>
          ) : (
            "Get My Recommendations"
          )}
        </Button>
      ) : (
        <Button type="button" onClick={nextStep}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
