import { useState, useEffect } from "react";
import type { Question } from "../types/quiz";
import type { Chapter } from "../types/chapter";

interface UseQuestionsResult {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
}

export function useQuestions(
  chapterId: string | undefined,
  chapter: Chapter | null,
): UseQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!chapterId) {
        setError("Chapter ID is missing");
        setIsLoading(false);
        return;
      }

      if (!chapter) {
        setError("Chapter not found");
        setIsLoading(false);
        return;
      }

      if (chapter.isComingSoon) {
        setError("This chapter is coming soon and not yet available");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const questionsModule = await import(
          `../data/questions-${chapterId}.json`
        );
        const loadedQuestions = Array.isArray(questionsModule.default)
          ? questionsModule.default
          : questionsModule.questions || [];

        if (loadedQuestions.length === 0) {
          throw new Error("No questions found for this chapter");
        }

        console.log(
          `Loaded ${loadedQuestions.length} questions for ${chapterId}`,
        );
        setQuestions(loadedQuestions);
      } catch (err) {
        console.error("Error loading questions:", err);
        setError(
          `Failed to load questions for ${chapterId}. Please check that the questions file exists.`,
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [chapterId, chapter]);

  return { questions, isLoading, error };
}
