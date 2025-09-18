import chaptersData from "../data/chapters.json";
import { QuestionCard } from "../components/quiz";
import { useQuestionState } from "../hooks/useQuestionState";
import { SectionWrapper, BackButton, EmptyState } from "../components/ui";
import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function QuizQuestionsPage() {
  const { state } = useLocation();
  const { questions = [] } = state || {};
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const chapter = chaptersData.chapters.find((c) => c.id === chapterId);

  const {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    results,
    handleAnswerSelect,
    handleNext: handleQuizNext,
    clearState,
  } = useQuestionState({
    chapterId: chapterId || "",
    questions,
    isPersistent: true,
    onComplete: () => {
      clearState();
      navigate(`/performance/${chapterId}`, {
        state: { questions, results },
      });
    },
  });

  // Early return if no chapter ID
  if (!chapterId) {
    return (
      <EmptyState
        message="Invalid chapter. Please select a valid chapter."
        backTo="/"
        backText="Go Home"
      />
    );
  }

  // Early return if chapter not found
  if (!chapter) {
    return (
      <EmptyState
        message="Chapter not found. Please select a valid chapter."
        backTo="/"
        backText="Go Home"
      />
    );
  }

  // Early return if no questions
  if (questions.length === 0) {
    return (
      <EmptyState
        message="No questions loaded. Please start from session chooser."
        backTo={`/quiz/${chapterId}`}
        backText="Back to Difficulty"
      />
    );
  }

  return (
    <SectionWrapper className="flex flex-col items-center justify-center">
      <div className="relative z-10 w-full max-w-4xl px-4 py-8">
        <BackButton
          to={`/quiz/${chapterId}`}
          text="Back to Difficulty"
          onClick={clearState}
        />
      </div>

      <QuestionCard
        chapterId={chapterId}
        selectedAnswer={selectedAnswer}
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        questionsLength={questions.length}
        handleNext={handleQuizNext}
        handleAnswerSelect={handleAnswerSelect}
      />
    </SectionWrapper>
  );
}
