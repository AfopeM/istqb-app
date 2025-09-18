import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BackButton, SectionWrapper, ErrorMessage } from "../ui";
import ReviewCard from "./ReviewCard";
import type {
  ReviewState,
  ReviewQuestion,
  ReviewPageProps,
} from "../../types/review";

export default function ReviewPage({
  backTo,
  backText,
  onBackClick,
}: ReviewPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Type-safe state access with validation
  const { questions = [], results = [] } =
    (location.state as ReviewState | null) || {};

  // Combine questions with their results for better type safety
  const reviewQuestions = useMemo<ReviewQuestion[]>(
    () =>
      questions.map((question) => ({
        ...question,
        result: results.find((r) => r.questionId === question.id) || null,
      })),
    [questions, results],
  );

  // Validate required data
  if (questions.length === 0 || results.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <ErrorMessage
            message="No review data found. Please complete a session first."
            onRetry={() => navigate(backTo)}
          />
        </div>
      </div>
    );
  }

  const goTo = (index: number) => setCurrentIndex(index);
  const handlePrev = () =>
    currentIndex > 0 && setCurrentIndex(currentIndex - 1);
  const handleNext = () =>
    currentIndex < questions.length - 1 && setCurrentIndex(currentIndex + 1);

  return (
    <SectionWrapper className="flex flex-col items-center justify-center">
      <div className="relative w-full max-w-4xl px-6 py-8">
        <BackButton text={backText} to={backTo} onClick={onBackClick} />
      </div>

      <ReviewCard
        goTo={goTo}
        results={results}
        handlePrev={handlePrev}
        handleNext={handleNext}
        currentIndex={currentIndex}
        questions={reviewQuestions}
      />
    </SectionWrapper>
  );
}
