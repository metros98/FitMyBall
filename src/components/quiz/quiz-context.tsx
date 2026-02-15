"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  quizSchema,
  type QuizFormData,
  STEP_FIELDS,
} from "@/lib/validations/quiz";

const STORAGE_KEY = "fitmyball_quiz_data";
const STORAGE_STEP_KEY = "fitmyball_quiz_step";
const DEBOUNCE_MS = 500;
const TOTAL_STEPS = 5;

interface QuizState {
  currentStep: number;
  direction: "forward" | "backward";
  isSubmitting: boolean;
  submitError: string | null;
}

interface QuizContextValue {
  form: UseFormReturn<QuizFormData>;
  state: QuizState;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitQuiz: () => void;
  isPreferencesOnly: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;
}

const QuizContext = createContext<QuizContextValue | null>(null);

const defaultValues: QuizFormData = {
  currentBall: undefined,
  handicap: undefined as unknown as QuizFormData["handicap"],
  roundsPerYear: undefined as unknown as QuizFormData["roundsPerYear"],
  priorityType: undefined as unknown as QuizFormData["priorityType"],
  mostImportant: undefined as unknown as QuizFormData["mostImportant"],
  approachTrajectory: undefined,
  currentBallSpin: undefined,
  needShortGameSpin: undefined,
  preferredFeel: undefined as unknown as QuizFormData["preferredFeel"],
  colorPreference: undefined as unknown as QuizFormData["colorPreference"],
  budgetRange: undefined as unknown as QuizFormData["budgetRange"],
  durabilityPriority: undefined as unknown as QuizFormData["durabilityPriority"],
  typicalTemperature: undefined as unknown as QuizFormData["typicalTemperature"],
  improvementAreas: [],
  driverBallSpeed: undefined,
  ballSpeedUnknown: false,
  ironDistance8: undefined,
};

function loadSavedData(): { data: QuizFormData; step: number } {
  if (typeof window === "undefined") {
    return { data: defaultValues, step: 1 };
  }
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STORAGE_STEP_KEY);
    return {
      data: savedData ? { ...defaultValues, ...JSON.parse(savedData) } : defaultValues,
      step: savedStep ? Number(savedStep) : 1,
    };
  } catch {
    return { data: defaultValues, step: 1 };
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [initial] = useState(loadSavedData);

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: initial.data,
    mode: "onTouched",
  });

  const [state, setState] = useState<QuizState>({
    currentStep: initial.step,
    direction: "forward",
    isSubmitting: false,
    submitError: null,
  });

  // --- Auto-save (debounced) ---
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
          localStorage.setItem(STORAGE_STEP_KEY, String(state.currentStep));
        } catch {
          // localStorage might be full or unavailable
        }
      }, DEBOUNCE_MS);
    });
    return () => {
      subscription.unsubscribe();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [form, state.currentStep]);

  // --- Custom per-step validation ---
  const validateStep = useCallback(
    async (step: number): Promise<boolean> => {
      const fields = STEP_FIELDS[step];
      if (!fields || fields.length === 0) return true;

      // Trigger base schema validation for this step's fields
      const baseValid = await form.trigger(
        fields as (keyof QuizFormData)[],
      );
      if (!baseValid) return false;

      const values = form.getValues();

      // Step 1: model required if brand selected and not "dont_know"
      if (step === 1) {
        const { currentBall } = values;
        if (
          currentBall?.brand &&
          currentBall.brand !== "" &&
          currentBall.brand !== "dont_know" &&
          !currentBall.model
        ) {
          form.setError("currentBall.model" as keyof QuizFormData, {
            message: "Please select a ball model",
          });
          return false;
        }
      }

      // Step 2: required unless preferences_only
      if (step === 2 && values.priorityType !== "preferences_only") {
        let valid = true;
        if (!values.approachTrajectory) {
          form.setError("approachTrajectory", { message: "Please select your approach trajectory" });
          valid = false;
        }
        if (!values.currentBallSpin) {
          form.setError("currentBallSpin", { message: "Please describe your current ball spin" });
          valid = false;
        }
        if (!values.needShortGameSpin) {
          form.setError("needShortGameSpin", { message: "Please indicate your short game spin needs" });
          valid = false;
        }
        return valid;
      }

      // Step 4: ball speed required unless preferences_only or "I don't know"
      if (step === 4 && values.priorityType !== "preferences_only") {
        if (!values.ballSpeedUnknown && !values.driverBallSpeed) {
          form.setError("driverBallSpeed", {
            message: "Please enter your ball speed or check 'I don't know'",
          });
          return false;
        }
      }

      return true;
    },
    [form],
  );

  // --- Navigation ---
  const nextStep = useCallback(async () => {
    const valid = await validateStep(state.currentStep);
    if (!valid) return;
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS),
      direction: "forward",
    }));
  }, [state.currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
      direction: "backward",
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, TOTAL_STEPS)),
      direction: step < prev.currentStep ? "backward" : "forward",
    }));
  }, []);

  // --- Submit ---
  const submitQuiz = useCallback(async () => {
    // Trigger validation on all fields
    const isValid = await form.trigger();
    
    if (!isValid) {
      setState((prev) => ({
        ...prev,
        submitError: "Please complete all required fields correctly.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true, submitError: null }));
    
    try {
      const data = form.getValues();
      
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizData: data }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(err.error || "Submission failed");
      }

      const result = await res.json();
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_STEP_KEY);
      router.push(`/results/${result.sessionId}`);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        submitError: err instanceof Error ? err.message : "Something went wrong",
      }));
    }
  }, [form, router]);

  // --- Derived ---
  const priorityType = form.watch("priorityType");
  const isPreferencesOnly = priorityType === "preferences_only";

  const contextValue: QuizContextValue = {
    form,
    state,
    nextStep,
    prevStep,
    goToStep,
    submitQuiz,
    isPreferencesOnly,
    isFirstStep: state.currentStep === 1,
    isLastStep: state.currentStep === TOTAL_STEPS,
    totalSteps: TOTAL_STEPS,
  };

  return (
    <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
