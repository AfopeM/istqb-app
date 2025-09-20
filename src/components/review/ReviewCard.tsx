import { Button, Tagline, MindVaultButton } from "../ui";
import type { Question } from "../../types/quiz";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewCardProps {
  questions: Question[];
  results: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
  currentIndex: number;
  goTo: (index: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
}

export default function ReviewCard({
  questions,
  results,
  currentIndex,
  goTo,
  handlePrev,
  handleNext,
}: ReviewCardProps) {
  const location = useLocation();
  const isExamReview = location.pathname.includes("/exam-review/");

  const currentQuestion = questions[currentIndex];
  const currentResult = results.find(
    (r) => r.questionId === currentQuestion.id,
  );
  const selectedAnswer = currentResult?.selectedIndex;

  // Get exam ID from URL if it's an exam review
  const getExamId = () => {
    if (!isExamReview) return undefined;
    const matches = location.pathname.match(/\/exam-review\/(exam-\d+)/);
    const examId = matches ? matches[1] : undefined;
    console.log("EXAM DEBUG - ReviewCard getExamId:", {
      pathname: location.pathname,
      matches,
      examId,
      isExamReview,
    });
    return examId;
  };

  //  get option styles
  const getOptionStyles = (index: number) => {
    const isSelected = selectedAnswer === index;
    const isCorrect = index === currentQuestion.correctAnswerIndex;
    const answeredIncorrectly =
      selectedAnswer !== null &&
      selectedAnswer !== currentQuestion.correctAnswerIndex;

    if (isCorrect) {
      return {
        container: `bg-green-100 border-2 border-green-200 font-bold`,
        text: "text-base text-green-900",
        opacity: "opacity-100",
      };
    }

    if (isSelected && !isCorrect) {
      return {
        container: "bg-red-100 border-2 border-red-200",
        text: answeredIncorrectly ? "line-through text-red-900" : "",
        opacity: "opacity-100",
      };
    }

    return {
      container: "border-transparent border-2",
      text: "text-base",
      opacity: "opacity-50",
    };
  };

  return (
    <main className="relative z-10 mx-auto mb-8 flex min-h-[calc(100vh-8rem)] w-full max-w-4xl items-center justify-center px-6 md:mb-0">
      <div className="w-full rounded-xl bg-white px-6 py-8 shadow-lg md:px-8 md:py-10">
        {/* Navigation Container */}
        <div className="mb-6 flex h-12 items-stretch gap-2">
          {/* Left Scroll Button */}
          <button
            onClick={() => {
              document.getElementById("review-question-slider")?.scrollBy({
                left: -200,
                behavior: "smooth",
              });
            }}
            className="flex w-10 cursor-pointer items-center justify-center rounded bg-gray-200 transition-colors hover:bg-gray-300"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-6 text-gray-700" />
          </button>

          {/* Question Buttons Slider */}
          <div
            id="review-question-slider"
            className="hide-scrollbar flex flex-1 gap-2 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {questions.map((_, idx) => {
              const res = results[idx];
              return (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`size-12 shrink-0 cursor-pointer rounded-lg border font-medium transition-colors ${
                    currentIndex === idx
                      ? res?.isCorrect
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-red-500 bg-red-500 text-white"
                      : res?.isCorrect
                        ? "border-green-300 bg-green-100 text-green-600 hover:bg-green-200"
                        : res !== undefined
                          ? "border-red-300 bg-red-100 text-red-600 hover:bg-red-200"
                          : "border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  aria-label={`Question ${idx + 1}${
                    res !== undefined ? " (Answered)" : ""
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => {
              document.getElementById("review-question-slider")?.scrollBy({
                left: 200,
                behavior: "smooth",
              });
            }}
            className="flex w-10 cursor-pointer items-center justify-center rounded bg-gray-200 transition-colors hover:bg-gray-300"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-6 text-gray-700" />
          </button>
        </div>

        {/* SECTION TITLE */}
        <div className="flex items-center gap-2">
          <Tagline>section {currentQuestion.chapterSection}</Tagline>
          {isExamReview ? (
            <MindVaultButton
              questionId={currentQuestion.id}
              examId={getExamId()}
              source="exam"
              className="-mt-3"
            />
          ) : (
            <MindVaultButton
              questionId={currentQuestion.id}
              chapterId={`chapter-${currentQuestion.chapterSection.split(".")[0]}`}
              source="chapter"
              className="-mt-3"
            />
          )}
        </div>

        {/* QUESTION TEXT */}
        <div className="mb-6 font-bold whitespace-pre-line">
          {currentQuestion.questionText
            .split(/(?<=[.:])\s+/)
            .filter(Boolean)
            .map((line, index) => (
              <p key={index} className="mb-4 text-lg leading-6 md:text-xl">
                {line.trim()}
              </p>
            ))}
        </div>

        {/* OPTIONS */}
        <ul role="list" className="space-y-2">
          {currentQuestion.options.map((option, index) => {
            const styles = getOptionStyles(index);

            return (
              <li key={index}>
                <div
                  className={`flex w-full flex-col items-start rounded-lg border-2 px-4 py-2 transition-all duration-300 md:py-4 ${styles.container} ${styles.opacity}`}
                >
                  <div className="flex w-full items-start justify-between gap-4">
                    <span className={`flex-grow text-left ${styles.text}`}>
                      {option}
                    </span>
                  </div>

                  {index === currentQuestion.correctAnswerIndex && (
                    <p
                      role="note"
                      className="text-left text-sm font-normal text-green-800 transition-all duration-300 md:text-base"
                    >
                      {currentQuestion.explanation}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* NAVIGATION BUTTONS */}
        <nav className="mx-auto mt-6 flex w-full max-w-3xl justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-1/3 font-bold tracking-wider"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="w-1/3 font-bold tracking-wider"
            disabled={currentIndex === questions.length - 1}
          >
            Next
          </Button>
        </nav>
      </div>
    </main>
  );
}
