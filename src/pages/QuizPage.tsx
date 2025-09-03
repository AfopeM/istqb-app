import { ArrowLeft } from "lucide-react";
import { Button, SectionWrapper } from "../components/ui";
import type { Question } from "../types/quiz";
import chaptersData from "../data/chapters.json";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { QuizContent } from "../components/quiz";

interface MindVaultItem {
  chapterId: string;
  questionId: string;
}

export default function QuizPage() {
  const { state } = useLocation();
  const { questions = [] } = state || {};
  const { chapterId } = useParams<{ chapterId: string }>();

  const chapter = chaptersData.chapters.find((c) => c.id === chapterId);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useLocalStorage<number>(`currentQuestionIndex-${chapterId}`, 0);
  const [selectedAnswer, setSelectedAnswer] = useLocalStorage<number | null>(
    `selectedAnswer-${chapterId}`,
    null,
  );
  const [mindVault, setMindVault] = useLocalStorage<MindVaultItem[]>(
    "MindVault",
    [],
  );
  const [results, setResults] = useLocalStorage<
    { questionId: string; selectedIndex: number; isCorrect: boolean }[]
  >(`quizResults-${chapterId}`, []);
  const navigate = useNavigate();
  // Track questions that the user has already answered in this chapter
  const [answeredQuestions, setAnsweredQuestions] = useLocalStorage<string[]>(
    `answeredQuestions-${chapterId}`,
    [],
  );

  if (!chapter) {
    return <div>Chapter not found.</div>;
  }

  if (questions.length === 0) {
    return <div>No questions loaded. Please start from session chooser.</div>;
  }

  const currentQuestion: Question = questions[currentQuestionIndex];

  const handleAnswerSelect = (selectedIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(selectedIndex);

    // Store result for performance summary
    const isCorrect = selectedIndex === currentQuestion.correctAnswerIndex;
    setResults((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selectedIndex, isCorrect },
    ]);

    // Record that the current question has been answered to avoid showing it in future sessions
    if (!answeredQuestions.includes(currentQuestion.id)) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
    }

    // Add to MindVault if answer is incorrect and not already in vault
    if (
      selectedIndex !== currentQuestion.correctAnswerIndex &&
      !mindVault.some(
        (item) =>
          (typeof item === "string" && item === currentQuestion.id) ||
          (typeof item === "object" && item.questionId === currentQuestion.id),
      )
    ) {
      const newItem: MindVaultItem = {
        chapterId: chapterId!,
        questionId: currentQuestion.id,
      };
      setMindVault([...mindVault, newItem]);
    }
  };

  const clearQuizState = () => {
    // Clear all quiz-related state
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setResults([]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz complete – navigate to summary page with results
      clearQuizState(); // Clear state before navigating
      navigate(`/performance/${chapterId}`, {
        state: {
          questions,
          results,
        },
      });
    }
  };

  return (
    <SectionWrapper>
      {/* BACK BUTTON */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-8">
        <Button
          variant="ghost"
          className="group space-x-2"
          onClick={() => {
            clearQuizState();
            navigate(`/session/${chapterId}`);
          }}
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          />
          <span>Back</span>
        </Button>
      </div>

      <QuizContent
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        questionsLength={questions.length}
        selectedAnswer={selectedAnswer}
        chapterId={chapterId!}
        onAnswerSelect={handleAnswerSelect}
        onNext={handleNext}
      />
    </SectionWrapper>
  );
}
