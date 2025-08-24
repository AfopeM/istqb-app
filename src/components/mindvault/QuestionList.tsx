import { ChevronRight } from "lucide-react";
import type { Question } from "../../types/quiz";

interface Props {
  questions: Question[];
  onRemoveFromVault: (questionId: string) => void;
}

export default function QuestionList({ questions, onRemoveFromVault }: Props) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div
          key={question.id}
          className="space-y-4 rounded-lg bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-2">
              <ChevronRight className="mt-1 size-5 flex-shrink-0 text-blue-500" />
              <p className="text-gray-800">{question.questionText}</p>
            </div>
            <button
              onClick={() => onRemoveFromVault(question.id)}
              className="text-sm text-red-500 transition-colors hover:text-red-600"
            >
              Remove
            </button>
          </div>
          <div className="pl-7">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Correct Answer:
            </p>
            <p className="rounded bg-green-50 p-2 text-sm text-gray-600">
              {question.options[question.correctAnswerIndex]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
