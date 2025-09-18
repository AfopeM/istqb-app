import { useEffect } from "react";
import { QuestionCard } from "../components/quiz";
import { useQuestionState } from "../hooks/useQuestionState";
import { SectionWrapper, BackButton } from "../components/ui";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function MindVaultQuestionsPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { questions = [] } = state || {};

  // Redirect if no questions provided
  useEffect(() => {
    if (questions.length === 0) {
      navigate("/mindvault");
    }
  }, [questions, navigate]);

  const {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    results,
    handleAnswerSelect,
    handleNext: handleQuizNext,
  } = useQuestionState({
    chapterId: chapterId!,
    questions,
    isPersistent: false,
    onComplete: () => {
      navigate(`/mindvault/mindvaultreview/${chapterId}`, {
        state: {
          results,
          questions,
        },
      });
    },
  });

  if (!currentQuestion) {
    return null;
  }

  return (
    <SectionWrapper>
      {/* BACK BUTTON */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-8">
        <BackButton to="/mindvault" text="Back to MindVault" />
      </div>

      {/* QUESTION CONTENT */}
      <QuestionCard
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        questionsLength={questions.length}
        selectedAnswer={selectedAnswer}
        chapterId={chapterId!}
        handleAnswerSelect={handleAnswerSelect}
        handleNext={handleQuizNext}
      />
    </SectionWrapper>
  );
}
