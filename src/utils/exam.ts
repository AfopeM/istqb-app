import type { Question } from "../types/quiz";
import type {
  QuestionResult,
  MindVaultItem,
  ExamMindVaultItem,
} from "../types/exam";

/**
 * Formats time in seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

/**
 * Calculates exam results from questions and answers
 */
export const calculateExamResults = (
  questions: Question[],
  answers: number[],
): QuestionResult[] => {
  return questions.map((question, index) => {
    const selectedAnswer = answers[index] ?? -1;
    return {
      questionId: question.id,
      selectedIndex: selectedAnswer,
      isCorrect: selectedAnswer === question.correctAnswerIndex,
    };
  });
};

/**
 * Filters out duplicate MindVault items
 */
export const filterDuplicateMindVaultItems = (
  newItems: ExamMindVaultItem[],
  existingItems: MindVaultItem[],
): ExamMindVaultItem[] => {
  return newItems.filter(
    (newItem) =>
      !existingItems.some(
        (existingItem) =>
          existingItem.source === "exam" &&
          existingItem.questionId === newItem.questionId &&
          (existingItem as ExamMindVaultItem).examId === newItem.examId,
      ),
  );
};

/**
 * Gets failed questions from an exam
 */
export const getFailedQuestions = (
  questions: Question[],
  answers: number[],
): Question[] => {
  return questions.filter(
    (_, index) => answers[index] !== questions[index].correctAnswerIndex,
  );
};

/**
 * Formats question text by splitting on sentence boundaries
 */
export const formatQuestionText = (text: string): string[] => {
  return text
    .split(/(?<=[.:])\s+/)
    .filter(Boolean)
    .map((line) => line.trim());
};
