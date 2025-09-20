import type { Question } from "../../types/quiz";
import { formatQuestionText } from "../../utils/exam";

interface QuestionDisplayProps {
  question: Question;
  selectedAnswer?: number;
  onAnswerSelect: (index: number) => void;
}

export function QuestionDisplay({
  question,
  selectedAnswer,
  onAnswerSelect,
}: QuestionDisplayProps) {
  return (
    <div className="mb-8">
      <h2 className="mb-6 text-xl font-bold text-gray-900">
        {formatQuestionText(question.questionText).map((line, index) => (
          <p key={index} className="question-text">
            {line}
          </p>
        ))}
      </h2>

      <ul className="space-y-4">
        {question.options.map((option, index) => (
          <li key={index}>
            <button
              onClick={() => onAnswerSelect(index)}
              className={`answer-option ${
                selectedAnswer === index
                  ? "answer-option--selected"
                  : "answer-option--unselected"
              }`}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
