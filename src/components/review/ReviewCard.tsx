import { Button, Tagline } from "../ui";
import type { Question } from "../../types/quiz";

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
  const currentQuestion = questions[currentIndex];
  const currentResult = results.find(
    (r) => r.questionId === currentQuestion.id,
  );
  const selectedAnswer = currentResult?.selectedIndex;

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
        {/* NUMBERED BUTTONS */}
        <div className="mb-6 flex flex-wrap justify-center gap-2 md:justify-start">
          {questions.map((_, idx) => {
            const res = results[idx];
            const colorClass = res?.isCorrect ? "bg-green-200" : "bg-red-200";
            const ringClass =
              res?.isCorrect === true && idx === currentIndex
                ? "bg-green-500"
                : res?.isCorrect === false && idx === currentIndex
                  ? "bg-red-500"
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

        {/* SECTION TITLE */}
        <Tagline>section {currentQuestion.chapterSection}</Tagline>

        {/* QUESTION TEXT */}
        <div className="mb-6 font-bold whitespace-pre-line">
          {currentQuestion.questionText
            .split(".")
            .filter(Boolean)
            .map((line, index, arr) => (
              <p key={index} className="mb-4 text-lg leading-6 md:text-xl">
                {line.trim()}
                {index < arr.length - 1 ? "." : ""}
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
