import { useParams } from "react-router-dom";
import ReviewPage from "../components/review/ReviewPage";

export default function QuizReviewPage() {
  const { chapterId } = useParams<{ chapterId: string }>();

  if (!chapterId) {
    return null; // Or handle this case appropriately
  }

  return (
    <ReviewPage backTo={`/quiz/${chapterId}`} backText="Back to Difficulty" />
  );
}
