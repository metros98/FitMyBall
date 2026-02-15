import type { Metadata } from "next";
import { QuizWizard } from "@/components/quiz/quiz-wizard";

export const metadata: Metadata = {
  title: "Find Your Perfect Golf Ball | FitMyBall",
  description:
    "Take our 5-step quiz to get personalized golf ball recommendations matched to your swing, preferences, and playing conditions.",
};

export default function QuizPage() {
  return <QuizWizard />;
}
