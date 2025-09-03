import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Question } from "../types/quiz";
import { QuizContent } from "../components/quiz";
import { SectionWrapper } from "../components/ui";
import { Button } from "../components/ui";
import { ArrowLeft } from "lucide-react";

interface MindVaultItem {
  chapterId: string;
  questionId: string;
}

interface QuizResult {
  questionId: string;
  isCorrect: boolean;
  selectedAnswer: number;
}

export default function MindVaultQuiz() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { questions = [] } = state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [, setMindVault] = useLocalStorage<MindVaultItem[]>("MindVault", []);

  // Redirect if no questions provided
  useEffect(() => {
    if (questions.length === 0) {
      navigate("/mindvault");
    }
  }, [questions, navigate]);

  const currentQuestion: Question = questions[currentQuestionIndex];

  const handleAnswerSelect = (selectedIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(selectedIndex);

    const isCorrect = selectedIndex === currentQuestion.correctAnswerIndex;

    // Store result
    setResults((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        isCorrect,
        selectedAnswer: selectedIndex,
      },
    ]);

    // If correct, remove from MindVault
    if (isCorrect) {
      setMindVault((prev) =>
        prev.filter((item) => item.questionId !== currentQuestion.id),
      );
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      navigate(`/mindvault/mindvaultreview/${chapterId}`, {
        state: {
          results,
          questions,
        },
      });
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <SectionWrapper>
      {/* BACK BUTTON */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-8">
        <Button
          variant="ghost"
          className="group space-x-2"
          onClick={() => {
            navigate(`/mindvault`);
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
