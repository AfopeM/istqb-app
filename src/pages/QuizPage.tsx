import { BookOpen } from "lucide-react";
import chaptersData from "../data/chapters.json";
import type { Chapter } from "../types/chapter";
import { SessionCard } from "../components/quiz";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";
import { useQuestions } from "../hooks/useQuestions";
import {
  BackButton,
  ErrorMessage,
  LoadingSpinner,
  SectionWrapper,
} from "../components/ui";

import { quizOptions, type SessionType } from "../config/quizOptions";

const formatChapterTitle = (id: string): string => {
  return id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function QuizPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  const [isStartingSession, setIsStartingSession] = useState(false);

  // Find the current chapter
  const chapter = useMemo((): Chapter | null => {
    return chaptersData.chapters.find((c) => c.id === chapterId) || null;
  }, [chapterId]);

  // Load questions using custom hook
  const {
    questions: allQuestions,
    isLoading,
    error,
  } = useQuestions(chapterId, chapter);

  // Quiz options from configuration
  const QuizOptions = useMemo(() => quizOptions, []);

  // Fisher-Yates shuffle algorithm for better randomization
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Removed old getRandomQuestions helper (no longer needed after quiz logic refactor).
  // Handle Quiz choice
  const handleQuizChoice = useCallback(
    async (type: SessionType) => {
      const option = QuizOptions.find((opt) => opt.type === type);
      if (!option || !chapterId) return;

      setIsStartingSession(true);

      try {
        // Get answered questions from local storage
        const answeredKey = `answeredQuestions-${chapterId}`;
        const answeredIds = new Set(
          JSON.parse(localStorage.getItem(answeredKey) || "[]") as string[],
        );

        // Sort questions prioritizing unseen ones
        const sortedQuestions = shuffleArray([...allQuestions]).sort((a, b) => {
          const aAnswered = answeredIds.has(a.id);
          const bAnswered = answeredIds.has(b.id);
          if (!aAnswered && bAnswered) return -1;
          if (aAnswered && !bAnswered) return 1;
          return 0;
        });

        // Take required number of questions
        const selectedQuestions = sortedQuestions.slice(
          0,
          option.questionCount,
        );

        if (selectedQuestions.length === 0) {
          throw new Error("No questions available");
        }

        console.log(
          `Starting ${type} session with ${selectedQuestions.length} questions (${
            selectedQuestions.filter((q) => !answeredIds.has(q.id)).length
          } new questions)`,
        );

        // Navigate to quiz page with selected questions
        navigate(`/quizquestions/${chapterId}`, {
          state: { questions: selectedQuestions },
        });
      } catch (err) {
        console.error("Error starting session:", err);
        navigate("/error", {
          state: { message: "Failed to start session. Please try again." },
        });
      } finally {
        setIsStartingSession(false);
      }
    },
    [QuizOptions, chapterId, navigate, allQuestions, shuffleArray],
  );

  // Handle retry
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Loading and error states
  if (isLoading || error || !chapter) {
    return (
      <SectionWrapper>
        <div className="container mx-auto px-6 py-8">
          <BackButton to="/" text="Home Page" />
          <div className="flex min-h-[60vh] items-center justify-center">
            {isLoading ? (
              <LoadingSpinner size="lg" text="Loading questions..." />
            ) : (
              <ErrorMessage
                message={error || "Chapter not found"}
                onRetry={error ? handleRetry : undefined}
              />
            )}
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <div className="relative z-10 container mx-auto flex min-h-screen flex-col px-6">
        {/* BACK BUTTON */}
        <div className="py-6">
          <BackButton to="/" text="Home Page" />
        </div>

        {/* MAIN CONTENT */}
        <main className="mx-auto flex max-w-4xl flex-1 flex-col justify-center">
          {/* HEADER */}
          <header className="mb-2 text-center">
            {/* BADGE */}
            <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-xs font-medium text-blue-500 uppercase backdrop-blur-sm md:text-sm">
              <BookOpen className="size-4" />
              {formatChapterTitle(chapter.id)}
            </div>

            {/* TITLE */}
            <h1 className="mb-2 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
              {chapter.title}
            </h1>

            {/* DESCRIPTION */}
            <p className="mx-auto mb-6 max-w-2xl leading-relaxed text-gray-600 md:text-lg">
              {chapter.description}
            </p>
          </header>

          {/* QUIZ OPTIONS */}
          <section className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4">
            {QuizOptions.map((option) => {
              const availableQuestions = Math.min(
                option.questionCount,
                allQuestions.length,
              );
              const isLimited = availableQuestions < option.questionCount;

              return (
                <div key={option.type} className="relative">
                  <SessionCard
                    option={{
                      ...option,
                      questionCount: availableQuestions,
                      description: isLimited
                        ? `Only ${availableQuestions} questions available`
                        : option.description,
                    }}
                    onClick={handleQuizChoice}
                    isLoading={isStartingSession}
                  />

                  {isLimited && (
                    <div className="absolute top-4 right-4">
                      <span className="rounded-full bg-yellow-500 px-2 py-1 text-xs font-medium text-white">
                        Limited
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* ADDITIONAL INFO */}
          <p className="mt-6 text-center text-sm text-gray-600 opacity-70">
            Questions are randomly selected from a pool of {allQuestions.length}{" "}
            available questions
          </p>
        </main>
      </div>
    </SectionWrapper>
  );
}
