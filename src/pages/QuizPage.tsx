import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button, SectionWrapper } from "../components/ui";
import type { Question } from "../types/quiz";
import chaptersData from "../data/chapters.json";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ProgressBar, QuestionCard, MindVaultButton } from "../components/quiz";

export default function QuizPage() {
  const { state } = useLocation();
  const { questions = [] } = state || {};
  const { chapterId } = useParams<{ chapterId: string }>();

  const chapter = chaptersData.chapters.find((c) => c.id === chapterId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [MindVault, setMindVault] = useLocalStorage<string[]>("MindVault", []);
  const [results, setResults] = useState<
    { questionId: string; selectedIndex: number; isCorrect: boolean }[]
  >([]);
  const navigate = useNavigate();
  // Track questions that the user has already answered in this chapter
  const [answeredQuestions, setAnsweredQuestions] = useLocalStorage<string[]>(
    `answeredQuestions-${chapterId}`,
    [],
  );

  if (!chapter) {
    return <div>Chapter not found.</div>;
  }

  if (questions.length === 0) {
    return <div>No questions loaded. Please start from session chooser.</div>;
  }

  const currentQuestion: Question = questions[currentQuestionIndex];

  const handleAnswerSelect = (selectedIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(selectedIndex);

    // Store result for performance summary
    const isCorrect = selectedIndex === currentQuestion.correctAnswerIndex;
    setResults((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selectedIndex, isCorrect },
    ]);

    // Record that the current question has been answered to avoid showing it in future sessions
    if (!answeredQuestions.includes(currentQuestion.id)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
    }

    if (
      selectedIndex !== currentQuestion.correctAnswerIndex &&
      !MindVault.includes(currentQuestion.id)
    ) {
      setMindVault([...MindVault, currentQuestion.id]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz complete – navigate to summary page with results
      navigate(`/performance/${chapterId}`, {
        state: {
          questions,
          results,
        },
      });
    }
  };

  // Removed back navigation within a session – users always move forward only.

  return (
    <SectionWrapper>
      {/* BACK BUTTON */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-8">
        <Button
          to={`/session/${chapterId}`}
          variant="ghost"
          className="group space-x-2"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          />
          <span>Back</span>
        </Button>
      </div>

      {/* MAIN CONTENT */}
      <main className="relative z-10 mb-16 flex flex-grow items-center justify-center">
        <div className="mx-auto w-full max-w-3xl p-4">
          {/* PROGRESS BAR AND CHALLENGE BANK BUTTON */}
          <div className="mb-4 flex items-center gap-2">
            <ProgressBar
              current={currentQuestionIndex}
              total={questions.length}
            />
            <MindVaultButton questionId={currentQuestion.id} />
          </div>

          {/* QUESTION CARD */}
          <div className="my-6">
            <QuestionCard
              question={currentQuestion}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswer={selectedAnswer}
            />
          </div>

          {/* BUTTON */}
          <div className="mt-4 flex justify-center">
            {selectedAnswer !== null && (
              <Button
                size="lg"
                onClick={handleNext}
                className="w-1/2 font-bold tracking-wider uppercase"
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Finish"
                  : "Next"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </SectionWrapper>
  );
}
