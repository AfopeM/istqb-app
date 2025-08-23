import { Tagline } from "../ui";
import { Check, X } from "lucide-react";
import type { Question } from "../../types/quiz";

interface Props {
  question: Question;
  selectedAnswer: number | null;
  onAnswerSelect: (selectedOptionIndex: number) => void;
}

export default function QuestionCard({
  question,
  onAnswerSelect,
  selectedAnswer,
}: Props) {
  const hasAnswered = selectedAnswer !== null;

  const getOptionStyles = (index: number) => {
    if (!hasAnswered) {
      return {
        container: "hover:bg-gray-100 cursor-pointer hover:-translate-y-0.5",
        circle: "bg-white border-gray-300",
        text: "",
        opacity: "opacity-100",
      };
    }

    const isSelected = selectedAnswer === index;
    const isCorrect = index === question.correctAnswerIndex;

    if (isCorrect) {
      return {
        container: `bg-green-100 border-green-200 font-bold ${
          isSelected ? "animateglow-success" : ""
        }`,
        circle: isSelected
          ? "bg-green-500 border-green-500 shadow-lg shadow-green-200"
          : "bg-white border-gray-300",
        text: isSelected ? "text-lg" : "",
        opacity: "opacity-100",
      };
    }

    if (isSelected) {
      return {
        container: "bg-red-100 border-red-200 animate-shake",
        circle: "bg-red-500 border-red-500 shadow-lg shadow-red-200",
        text: "line-through ",
        opacity: "opacity-100",
      };
    }

    return {
      container: "",
      circle: "bg-white border-gray-300",
      text: "",
      opacity: "opacity-50",
    };
  };

  const renderIcon = (index: number) => {
    if (!hasAnswered) return null;

    const isSelected = selectedAnswer === index;
    const isCorrect = index === question.correctAnswerIndex;

    if (isSelected && isCorrect) {
      return <Check className="size-5 text-white" />;
    }

    if (isSelected && !isCorrect) {
      return <X className="size-5 text-white" />;
    }

    return null;
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      <Tagline>section {question.chapterSection}</Tagline>

      <p className="mb-4 text-3xl leading-tight font-bold">
        {question.questionText}
      </p>

      <ul role="list" className="space-y-2">
        {question.options.map((option, index) => {
          const styles = getOptionStyles(index);

          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => onAnswerSelect(index)}
                disabled={hasAnswered}
                className={`w-full transform rounded-lg border-2 border-transparent px-4 py-5 transition-all duration-300 ease-in-out md:py-6 ${styles.container} ${styles.opacity} ${
                  hasAnswered ? "cursor-default" : ""
                }`}
                aria-pressed={
                  hasAnswered && index === question.correctAnswerIndex
                }
              >
                <span className="flex items-center space-x-4 text-left">
                  <span
                    className={`flex size-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${styles.circle}`}
                    aria-hidden="true"
                  >
                    {renderIcon(index)}
                  </span>

                  <span className={`flex-grow ${styles.text}`}>{option}</span>
                </span>

                {hasAnswered && index === question.correctAnswerIndex && (
                  <p
                    role="note"
                    className="mt-1 ml-11 text-left text-base font-normal text-green-800 transition-all duration-300"
                  >
                    {question.explanation}
                  </p>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
