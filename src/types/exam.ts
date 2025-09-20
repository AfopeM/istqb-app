// Exam interface
export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  numberOfQuestions: number;
}

// Question interface
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Core exam state interface
export interface ExamState {
  currentQuestionIndex: number;
  answers: number[];
  timeRemaining: number;
  isCompleted: boolean;
  score?: number;
}

// MindVault type definitions
export type MindVaultSource = "chapter" | "exam";

export interface BaseMindVaultItem {
  questionId: string;
  source: MindVaultSource;
}

export interface ExamMindVaultItem extends BaseMindVaultItem {
  source: "exam";
  examId: string;
}

export interface ChapterMindVaultItem extends BaseMindVaultItem {
  source: "chapter";
  chapterId: string;
}

export type MindVaultItem = ExamMindVaultItem | ChapterMindVaultItem;

// Exam results types
export interface QuestionResult {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface ExamNavigationState {
  questions: Question[];
  results: QuestionResult[];
  isExam: boolean;
  timerExpired: boolean;
}
