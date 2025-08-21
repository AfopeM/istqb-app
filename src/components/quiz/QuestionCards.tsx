import { Check, X } from "lucide-react";
import type { Question } from "../../types/quiz";

interface Props {
  question: Question;
  onAnswerSelect: (selectedOptionIndex: number) => void;
  selectedAnswer: number | null;
}

export default function QuestionCard({
  question,
  onAnswerSelect,
  selectedAnswer,
}: Props) {
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <span className="text-[10px] inline-block mb-3 tracking-wider uppercase py-1 px-3 rounded-sm bg-blue-50 text-blue-500 font-semibold">
        section {question.chapterSection}
      </span>
      <p className="text-3xl leading-tight font-bold mb-4">
        {question.questionText}
      </p>

      <div className="space-y-2">
        {question.options.map((option, index) => {
          const answerChosen = selectedAnswer !== null;
          const isSelected = selectedAnswer === index;
          const isCorrectAnswer = index === question.correctAnswerIndex;
          const isCorrectSelection = isSelected && isCorrectAnswer;
          const isIncorrectSelection = isSelected && !isCorrectAnswer;

          let cardStyle = "";
          let textStyle = "";
          let opacity = "opacity-100";
          let animation = "";

          if (answerChosen) {
            if (isCorrectAnswer) {
              cardStyle =
                "bg-green-50 border-2 font-semibold text-lg leading-tight border-green-200 shadow-green-100";
              if (isCorrectSelection) {
                animation = "animate-glow-success";
              }
            } else if (isIncorrectSelection) {
              cardStyle = "bg-red-50 border-red-200";
              textStyle = "line-through";
              animation = "animate-shake";
            } else {
              opacity = "opacity-50";
            }
          }

          return (
            <div
              key={index}
              className={`
                transition-all duration-300 ease-in-out ${cardStyle} ${textStyle} ${opacity} ${animation}
                px-4 py-5 rounded-lg w-full border-2 border-transparent transform hover:-translate-y-0.5
                ${
                  answerChosen
                    ? "hover:translate-y-0 cursor-default disabled:hover:bg-transparent"
                    : "cursor-pointer hover:bg-gray-100"
                }
              `}
            >
              <button
                onClick={() => onAnswerSelect(index)}
                disabled={answerChosen}
                className="w-full flex cursor-pointer text-left items-center space-x-4 disabled:cursor-default"
              >
                {/* RADIO CIRCLE */}
                <span
                  className={`size-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors duration-300 ${
                    isCorrectSelection
                      ? "bg-green-500 border-green-500 shadow-lg shadow-green-200"
                      : isIncorrectSelection
                      ? "bg-red-500 border-red-500 shadow-lg shadow-red-200"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {isCorrectSelection && (
                    <Check className="text-white size-5" />
                  )}
                  {isIncorrectSelection && <X className="text-white size-5" />}
                </span>

                <span
                  className={`flex-grow ${
                    isCorrectSelection ? "font-semibold text-lg" : ""
                  } `}
                >
                  {option}
                </span>
              </button>

              {/* COLLAPSIBLE EXPLANATION PANEL */}
              {answerChosen && isCorrectAnswer && (
                <p className="ml-10 mt-1 transform transition-all duration-300 ease-in-out text-green-800 text-base">
                  {question.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
