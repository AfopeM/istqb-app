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
