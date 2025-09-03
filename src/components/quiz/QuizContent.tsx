import { Button } from "../ui";
import type { Question } from "../../types/quiz";
import { ProgressBar, QuestionCard, MindVaultButton } from "../quiz";

interface QuizContentProps {
  currentQuestion: Question;
  currentQuestionIndex: number;
  questionsLength: number;
  selectedAnswer: number | null;
  chapterId: string;
  onAnswerSelect: (selectedIndex: number) => void;
  onNext: () => void;
}

export default function QuizContent({
  currentQuestion,
  currentQuestionIndex,
  questionsLength,
  selectedAnswer,
  chapterId,
  onAnswerSelect,
  onNext,
}: QuizContentProps) {
  return (
    <main className="relative z-10 flex flex-grow items-center justify-center">
      <div className="mx-auto w-full max-w-3xl p-6">
        {/* PROGRESS BAR AND CHALLENGE BANK BUTTON */}
        <div className="mb-4 flex items-center gap-6 rounded-xl bg-white px-6 py-2 shadow-lg">
          <ProgressBar current={currentQuestionIndex} total={questionsLength} />
          <MindVaultButton
            questionId={currentQuestion.id}
            chapterId={chapterId}
          />
        </div>

        {/* QUESTION CARD */}
        <div className="my-6">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={onAnswerSelect}
          />
        </div>

        {/* NAVIGATION BUTTON */}
        <nav className="mt-4 flex justify-center">
          {selectedAnswer !== null && (
            <Button
              size="lg"
              onClick={onNext}
              className="w-1/2 font-bold tracking-wider uppercase"
            >
              {currentQuestionIndex === questionsLength - 1 ? "Finish" : "Next"}
            </Button>
          )}
        </nav>
      </div>
    </main>
  );
}
