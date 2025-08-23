import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { Button, SectionWrapper } from "../components/ui";
import { QuestionCard } from "../components/quiz";
import type { Question } from "../types/quiz";
import { ArrowLeft } from "lucide-react";

interface ReviewState {
  questions: Question[];
  results: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
}

export default function ReviewPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { state } = useLocation();
  const { questions = [], results = [] } = (state || {}) as ReviewState;

  const [currentIndex, setCurrentIndex] = useState(0);

  if (questions.length === 0 || results.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <p>No review data found. Please complete a session first.</p>
          <Button to="/">Go Home</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentResult = results.find(
    (r) => r.questionId === currentQuestion.id,
  );
  const selectedAnswer = currentResult?.selectedIndex ?? null;

  const goTo = (index: number) => setCurrentIndex(index);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  return (
    <SectionWrapper className="flex flex-col items-center justify-center">
      {/* <div className="relative"> */}
      {/* BACK BUTTON */}
      <div className="relative mx-auto w-full max-w-3xl p-4">
        <Button
          variant="ghost"
          to={`/session/${chapterId}`}
          className="group space-x-2"
        >
          <ArrowLeft
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
          />
          <span>Back</span>
        </Button>
      </div>

      <main className="relative container mx-auto flex-grow px-4 py-6">
        {/* NUMBERED BUTTONS */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {questions.map((_, idx) => {
            const res = results[idx];
            const colorClass = res?.isCorrect ? "bg-green-500" : "bg-red-500";
            const ringClass =
              res?.isCorrect === true && idx === currentIndex
                ? "ring-green-400 ring-2 ring-offset-2"
                : res?.isCorrect === false && idx === currentIndex
                  ? "ring-red-400 ring-2 ring-offset-2"
                  : "";
            return (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-sm font-medium text-white ${colorClass} ${ringClass} focus:outline-none`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* QUESTION CARD */}
        <div className="mx-auto max-w-3xl">
          <QuestionCard
            question={currentQuestion}
            onAnswerSelect={() => {}}
            selectedAnswer={selectedAnswer}
          />
        </div>

        {/* NAVIGATION BUTTONS */}
        <nav className="mx-auto mt-6 flex w-full max-w-3xl justify-between">
          <Button
            size="lg"
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-1/3 font-bold tracking-wider"
          >
            Back
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            className="w-1/3 font-bold tracking-wider"
            disabled={currentIndex === questions.length - 1}
          >
            Next
          </Button>
        </nav>
      </main>
      {/* </div> */}
    </SectionWrapper>
  );
}
