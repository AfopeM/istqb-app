import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p>No review data found. Please complete a session first.</p>
          <Button to="/">Go Home</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentResult = results.find(
    (r) => r.questionId === currentQuestion.id
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* BACK BUTTON */}
      <div className="w-full max-w-3xl mx-auto p-4">
        <Button
          variant="ghost"
          to={`/session/${chapterId}`}
          className="space-x-2 group"
        >
          <ArrowLeft
            aria-hidden="true"
            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
          />
          <span>Back</span>
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 flex-grow">
        {/* Numbered buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {questions.map((_, idx) => {
            const res = results[idx];
            const colorClass = res?.isCorrect ? "bg-green-500" : "bg-red-500";
            return (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`w-8 h-8 rounded-full text-white text-sm font-medium flex items-center justify-center ${colorClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  idx === currentIndex
                    ? "ring-2 ring-offset-2 ring-blue-400"
                    : ""
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        <div className="max-w-3xl mx-auto">
          <QuestionCard
            question={currentQuestion}
            onAnswerSelect={() => {}}
            selectedAnswer={selectedAnswer}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between max-w-3xl mx-auto mt-6">
          <Button disabled={currentIndex === 0} onClick={handlePrev}>
            Back
          </Button>
          <Button
            disabled={currentIndex === questions.length - 1}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
