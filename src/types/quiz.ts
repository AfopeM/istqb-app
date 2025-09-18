export interface Question {
  id: string;
  chapterSection: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  title: string;
  questions: Question[];
}

export interface QuizData {
  chapters: Chapter[];
}

export interface MindVaultItem {
  chapterId: string;
  questionId: string;
}

export interface QuizResult {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface QuizState {
  questions: Question[];
  results: QuizResult[];
}
