import { useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button, CircularProgress } from "../components/ui";
import { useLocalStorage } from "../hooks/useLocalStorage";
import chaptersData from "../data/chapters.json";

import type { Question } from "../types/quiz";

interface PerformanceState {
  questions: Question[];
  results: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
}

export default function PerformancePage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { state } = useLocation();
  const performance = (state || {}) as PerformanceState;

  // Ensure stable array identities so that downstream hooks don't
  // re-compute on every render when data is absent.
  const questions = useMemo(
    () => performance.questions ?? [],
    [performance.questions]
  );
  const results = useMemo(
    () => performance.results ?? [],
    [performance.results]
  );

  // Memoize expensive/computed state to avoid recalculations on re-render
  const { totalQuestions, correctCount, percentage } = useMemo(() => {
    const total = questions.length;
    const correct = results.filter((r) => r.isCorrect).length;
    return {
      totalQuestions: total,
      correctCount: correct,
      percentage: total ? Math.round((correct / total) * 100) : 0,
    };
    // Depend on raw arrays only length and correctness influences result
  }, [questions, results]);

  // Incorrectly answered questions are stored in MindVault
  const [MindVault] = useLocalStorage<string[]>("MindVault", []);
  const weakAreasCount = MindVault.length;

  // Generate suggestion text
  const suggestions = useMemo(() => {
    if (percentage >= 80)
      return "Excellent work! Keep practicing to maintain your mastery.";
    if (percentage >= 60)
      return "Good job! Focus on the questions saved in your Challenge Bank to improve further.";
    return "Consider revisiting the study material and practising the questions you missed.";
  }, [percentage]);

  const chapter = chaptersData.chapters.find((c) => c.id === chapterId);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p>No performance data available. Please complete a session first.</p>
          <Button to="/">Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[100%] bg-gradient-to-br from-blue-100/20 via-indigo-200/20 to-purple-300/20 animate-gradient-slow" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 py-12 flex-grow relative">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
            Performance Summary
          </h1>
          {chapter && (
            <div className="inline-flex items-center px-4 py-1 mt-4 rounded-full bg-gradient-to-r from-blue-100/80 to-purple-100/80 backdrop-blur-sm border border-white/20 shadow-sm">
              <span className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
                {chapter.title}
              </span>
            </div>
          )}
        </header>

        {/* Statistics */}
        <section className="max-w-2xl mx-auto rounded-2xl p-8 transition-all duration-500 transform hover:scale-[1.02] backdrop-blur-xl bg-white/30 border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 to-purple-100/10 pointer-events-none" />

          <div className="flex flex-col items-center sm:flex-row sm:items-center gap-10 relative">
            {/* Circular Progress */}
            <CircularProgress
              value={percentage}
              className="flex-shrink-0 w-32 h-32 animate-fade-in"
              primaryColor="#4f46e5"
              secondaryColor="#7c3aed"
            />

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Numeric Stats */}
              <div className="backdrop-blur-md bg-white/20 rounded-xl p-6 border border-white/30 shadow-inner animate-slide-up">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📊</span>
                  <p className="text-sm font-medium text-blue-900/70">Score</p>
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {correctCount} / {totalQuestions}
                </p>
              </div>

              {/* Weak Areas Count */}
              <div
                className="backdrop-blur-md bg-white/20 rounded-xl p-6 border border-white/30 shadow-inner animate-slide-up"
                style={{ animationDelay: "100ms" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎯</span>
                  <p className="text-sm font-medium text-blue-900/70">
                    Areas to Focus
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {weakAreasCount}
                  </p>
                  <span className="px-2 py-1 text-sm rounded-full bg-purple-100/50 text-purple-700 font-medium border border-purple-200/50">
                    In Mind Vault
                  </span>
                </div>
              </div>

              {/* Suggestions */}
              <div
                className="sm:col-span-2 relative animate-slide-up"
                style={{ animationDelay: "200ms" }}
              >
                <div className="absolute -left-4 top-1/2 w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 transform rotate-45 -translate-y-1/2" />
                <div className="backdrop-blur-md bg-gradient-to-r from-blue-100/80 to-purple-100/80 rounded-2xl p-6 border border-white/30 shadow-lg relative">
                  <h2 className="text-xl font-semibold flex items-center gap-2 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    <span className="text-2xl">💡</span> Suggestions
                  </h2>
                  <p className="text-blue-900/80 leading-relaxed">
                    {suggestions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BUTTONS */}
        <section
          className="max-w-2xl mx-auto mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
          style={{ animationDelay: "300ms" }}
        >
          <Button
            size="lg"
            variant="filled"
            to={`/session/${chapterId}`}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-xl">🎯</span>
            Start New Session
          </Button>
          <Button
            size="lg"
            to={`/review/${chapterId}`}
            state={{ questions, results }}
            className="flex items-center gap-2 bg-white/80 hover:bg-white/90 text-blue-900 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            <span className="text-xl">📝</span>
            Review Questions
          </Button>
        </section>
      </div>
    </div>
  );
}
