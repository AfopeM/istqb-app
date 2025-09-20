import { useMemo } from "react";
import type { Question } from "../types/quiz";
import chaptersData from "../data/chapters.json";
import { ScoreGauge } from "../components/performance";
import { useParams, useLocation } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Button, SectionWrapper, Tagline } from "../components/ui";

interface PerformanceState {
  questions: Question[];
  results: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
  isExam?: boolean;
  timerExpired?: boolean;
}

export default function PerformancePage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { state } = useLocation();
  const performance = (state || {}) as PerformanceState;

  // Ensure stable array identities so that downstream hooks don't
  // re-compute on every render when data is absent.
  const questions = useMemo(
    () => performance.questions ?? [],
    [performance.questions],
  );
  const results = useMemo(
    () => performance.results ?? [],
    [performance.results],
  );

  // Memoize expensive/computed state to avoid recalculations on re-render
  const { percentage } = useMemo(() => {
    const total = questions.length;
    const correct = results.filter((r) => r.isCorrect).length;
    return {
      totalQuestions: total,
      correctCount: correct,
      percentage: total ? Math.round((correct / total) * 100) : 0,
    };
    // Depend on raw arrays only length and correctness influences result
  }, [questions, results]);

  // Generate score gauge color
  const scoreGaugeColor = useMemo(() => {
    if (percentage >= 90) return "#05df72";
    if (percentage >= 80) return "#cddc39";
    if (percentage >= 70) return "#ffeb3b";
    if (percentage >= 60) return "#ffc107";
    if (percentage >= 50) return "#f97316";
    if (percentage >= 40) return "#fb2c36";
    return "#111827";
  }, [percentage]);

  // Incorrectly answered questions are stored in MindVault
  const [MindVault] = useLocalStorage<string[]>("MindVault", []);
  const weakAreasCount = MindVault.length;

  // Generate result message and suggestions
  const { resultMessage, suggestions } = useMemo(() => {
    // Handle timer expiration first
    if (performance.isExam && performance.timerExpired) {
      return {
        resultMessage: "You ran out of time - Exam Failed",
        suggestions:
          "Time management is crucial in exams. Practice with timed sessions to improve your speed.",
      };
    }

    // Handle exam pass/fail scenarios
    if (performance.isExam) {
      if (percentage >= 80) {
        return {
          resultMessage: "Congratulations! You Passed! 🎉",
          suggestions:
            "Excellent work! You've demonstrated strong understanding of the material.",
        };
      } else {
        return {
          resultMessage: "Exam Failed",
          suggestions:
            "Review the questions you missed and try again. Focus on understanding the concepts thoroughly.",
        };
      }
    }

    // Regular practice session suggestions
    let suggestions = "";
    if (percentage >= 90)
      suggestions =
        "Outstanding! You've nearly mastered this section. Aim for 100% by refining small details.";
    else if (percentage >= 80)
      suggestions = "Excellent work! Keep practicing to maintain your mastery.";
    else if (percentage >= 70)
      suggestions =
        "Solid effort! Review the tricky areas to push yourself into the top tier.";
    else if (percentage >= 60)
      suggestions =
        "Good job! Focus on the questions saved in your Challenge Bank to improve further.";
    else if (percentage >= 50)
      suggestions =
        "You're getting there. Revisit your weaker topics and try a mixed practice session.";
    else if (percentage >= 40)
      suggestions =
        "You've made progress, but a deeper review will help. Break concepts into smaller parts.";
    else
      suggestions =
        "Consider revisiting the study material and practising the questions you missed.";

    return { resultMessage: null, suggestions };
  }, [percentage, performance.isExam, performance.timerExpired]);

  const chapter = chaptersData.chapters.find((c) => c.id === chapterId);

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 bg-lime-500 text-center">
          <p>No performance data available. Please complete a session first.</p>
          <Button to="/">Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <SectionWrapper className="flex items-center justify-center">
      <div className="relative container mx-auto flex-grow px-6 py-12">
        {/* HEADER*/}
        <header className="mb-12 text-center">
          {chapter && (
            <Tagline>
              {chapter.id.replace("-", " ")}: {chapter.title}
            </Tagline>
          )}
          <h1 className="text-4xl font-black text-gray-900 md:text-5xl">
            Performance Summary
          </h1>
        </header>

        {/* STATS */}
        <main className="mx-auto flex max-w-2xl flex-col items-center gap-2 rounded-2xl bg-white p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] sm:items-center">
          {/* SCORE GAUGE*/}
          <ScoreGauge
            width={250}
            strokeWidth={45}
            value={percentage}
            progressColor={scoreGaugeColor}
          />

          {/* EXAM RESULT MESSAGE */}
          {performance.isExam && resultMessage && (
            <section
              className={`flex w-full flex-col items-center rounded-xl p-6 text-center ${
                percentage >= 80 && !performance.timerExpired
                  ? "bg-green-500/10"
                  : "bg-red-500/10"
              }`}
            >
              <span className="text-4xl">
                {percentage >= 80 && !performance.timerExpired ? "🎉" : "❌"}
              </span>
              <h2
                className={`mt-4 mb-1 text-2xl font-black ${
                  percentage >= 80 && !performance.timerExpired
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {resultMessage}
              </h2>
            </section>
          )}

          {/* SUGGESTIONS */}
          <section className="flex w-full flex-col items-center rounded-xl bg-blue-500/10 p-6 text-center">
            <span className="text-4xl">💡</span>
            <h2 className="mt-4 mb-1 flex items-center gap-2 text-xl font-bold">
              Suggestions
            </h2>
            <p className="text-gray-900/60">{suggestions}</p>
          </section>

          {/* QUESTIONS IN MIND VAULT */}
          {!performance.isExam && (
            <p className="flex w-full flex-col items-center justify-center gap-1 rounded-lg bg-blue-500/10 p-6">
              <span className="text-sm font-bold text-gray-900 capitalize">
                questions in Mind Vault
              </span>
              <span className="text-3xl font-black text-blue-500">
                {weakAreasCount}
              </span>
            </p>
          )}
        </main>

        {/* BUTTONS */}
        <section className="mx-auto mt-12 flex max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            to={performance.isExam ? `/` : `/quiz/${chapterId}`}
            className="font-bold tracking-wider"
          >
            Start New Session
          </Button>
          <Button
            size="lg"
            variant="outline"
            to={
              performance.isExam
                ? `/exam-review/${chapterId}`
                : `/review/${chapterId}`
            }
            state={{ questions, results }}
            className="font-bold tracking-wider"
          >
            Review Questions
          </Button>
        </section>
      </div>
    </SectionWrapper>
  );
}
