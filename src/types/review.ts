import type { Question } from "./quiz";

export interface QuizResult {
  questionId: string;
  isCorrect: boolean;
  selectedIndex: number;
}

export interface ReviewState {
  questions: Question[];
  results: QuizResult[];
}

export interface ReviewQuestion extends Question {
  result: QuizResult | null;
}

export interface ReviewPageProps {
  backTo: string;
  backText: string;
  onBackClick?: () => void;
}

