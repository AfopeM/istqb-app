import { Button, Tagline } from "../ui";
import type { Question } from "../../types/quiz";
import { ProgressBar, MindVaultButton } from "../ui";

interface QuestionsWrapperProps {
  currentQuestion: Question;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  chapterId: string;
  questionsLength: number;
  handleAnswerSelect: (selectedIndex: number) => void;
  handleNext: () => void;
}

export default function QuestionsCard({
  currentQuestion,
  currentQuestionIndex,
  selectedAnswer,
  chapterId,
  questionsLength,
  handleAnswerSelect,
  handleNext,
}: QuestionsWrapperProps) {
  const hasAnswered = selectedAnswer !== null;

  const getOptionStyles = (index: number) => {
    const isSelected = selectedAnswer === index;
    const isCorrect = index === currentQuestion.correctAnswerIndex;

    if (!hasAnswered) {
      return {
        container:
          "bg-gray-50 hover:bg-gray-200 border-transparent cursor-pointer hover:-translate-y-0.5",
        text: "text-base leading-5",
        opacity: "opacity-100",
      };
    }

    if (isCorrect) {
      return {
        container:
          "text-green-900 bg-green-100 border-2 border-green-200 font-bold",
        text: "text-base leading-5",
        opacity: "opacity-100",
      };
    }

    if (isSelected && !isCorrect) {
      return {
        container: "bg-red-100 border-2 border-red-200 animate-shake",
        text: "text-base text-red-900 line-through leading-5",
        opacity: "opacity-100",
      };
    }

    return {
      container: "border-transparent",
      text: "text-base",
      opacity: "opacity-50",
    };
  };

  return (
    <main className="relative z-10 mx-auto mb-8 flex min-h-[calc(100vh-8rem)] w-full max-w-4xl items-center justify-center px-6 md:mb-0">
      {/* QUESTION CARD */}
      <div className="w-full rounded-xl bg-white p-8 shadow-lg">
        {/* HEADER*/}
        <div className="mb-3 flex items-center gap-6">
          {/* PROGRESS BAR  */}
          <ProgressBar current={currentQuestionIndex} total={questionsLength} />

          {/* CHALLENGE BANK BUTTON */}
          <MindVaultButton
            questionId={currentQuestion.id}
            chapterId={chapterId}
          />
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
                <button
                  type="button"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={hasAnswered}
                  className={`flex w-full flex-col items-start rounded-lg px-4 py-2 transition-all duration-300 md:py-4 ${styles.container} ${styles.opacity}${
                    hasAnswered ? "cursor-default" : ""
                  }`}
                  aria-pressed={
                    hasAnswered && index === currentQuestion.correctAnswerIndex
                  }
                >
                  <span className={`flex-grow text-left ${styles.text}`}>
                    {option}
                  </span>

                  {hasAnswered &&
                    index === currentQuestion.correctAnswerIndex && (
                      <p
                        role="note"
                        className="mt-1 text-left text-sm font-normal text-green-800 transition-all duration-300 md:text-base"
                      >
                        {currentQuestion.explanation}
                      </p>
                    )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* NAVIGATION BUTTON */}
        <nav className="mt-8 flex justify-center">
          {selectedAnswer !== null && (
            <Button
              onClick={handleNext}
              className="w-1/2 font-bold tracking-wider capitalize"
            >
              {currentQuestionIndex === questionsLength - 1 ? "Finish" : "Next"}
            </Button>
          )}
        </nav>
      </div>
    </main>
  );
}
