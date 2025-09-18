import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Question } from "../types/quiz";
import type { MindVaultItem, QuizResult } from "../types/quiz";

interface UseQuestionStateProps {
  chapterId: string;
  questions: Question[];
  isPersistent?: boolean;
  onComplete?: (results: QuizResult[]) => void;
}

export function useQuestionState({
  chapterId,
  questions,
  isPersistent = false,
  onComplete,
}: UseQuestionStateProps) {
  // Always call hooks, but only use the persistent values when isPersistent is true
  const [persistentQuestionIndex, setPersistentQuestionIndex] =
    useLocalStorage<number>(`currentQuestionIndex-${chapterId}`, 0);
  const [localQuestionIndex, setLocalQuestionIndex] = useState<number>(0);
  const currentQuestionIndex = isPersistent
    ? persistentQuestionIndex
    : localQuestionIndex;
  const setCurrentQuestionIndex = isPersistent
    ? setPersistentQuestionIndex
    : setLocalQuestionIndex;

  const [persistentSelectedAnswer, setPersistentSelectedAnswer] =
    useLocalStorage<number | null>(`selectedAnswer-${chapterId}`, null);
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<number | null>(
    null,
  );
  const selectedAnswer = isPersistent
    ? persistentSelectedAnswer
    : localSelectedAnswer;
  const setSelectedAnswer = isPersistent
    ? setPersistentSelectedAnswer
    : setLocalSelectedAnswer;

  const [persistentResults, setPersistentResults] = useLocalStorage<
    QuizResult[]
  >(`quizResults-${chapterId}`, []);
  const [localResults, setLocalResults] = useState<QuizResult[]>([]);
  const results = isPersistent ? persistentResults : localResults;
  const setResults = isPersistent ? setPersistentResults : setLocalResults;

  const [mindVault, setMindVault] = useLocalStorage<MindVaultItem[]>(
    "MindVault",
    [],
  );

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (selectedIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(selectedIndex);
    const isCorrect = selectedIndex === currentQuestion.correctAnswerIndex;

    // Store result
    const newResult = {
      questionId: currentQuestion.id,
      selectedIndex,
      isCorrect,
    };
    setResults((prev) => [...prev, newResult]);

    // Handle MindVault
    if (!isCorrect) {
      const isInMindVault = mindVault.some(
        (item) => item.questionId === currentQuestion.id,
      );
      if (!isInMindVault) {
        setMindVault([
          ...mindVault,
          { chapterId, questionId: currentQuestion.id },
        ]);
      }
    } else {
      // Remove from MindVault if answered correctly
      setMindVault((prev) =>
        prev.filter((item) => item.questionId !== currentQuestion.id),
      );
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz complete
      onComplete?.(results);
    }
  };

  const clearState = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setResults([]);
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    results,
    handleAnswerSelect,
    handleNext,
    clearState,
  };
}
