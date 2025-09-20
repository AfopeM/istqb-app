import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Types
import type { Question } from "../types/quiz";
import type { ExamState, MindVaultItem } from "../types/exam";

// Components
import {
  BackButton,
  ProgressBar,
  Button,
  SectionWrapper,
} from "../components/ui";
import { QuestionNavigation } from "../components/exam/QuestionNavigation";
import { ExamTimer } from "../components/exam/ExamTimer";
import { QuestionDisplay } from "../components/exam/QuestionDisplay";

// Hooks and Utils
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  calculateExamResults,
  filterDuplicateMindVaultItems,
  getFailedQuestions,
} from "../utils/exam";

// Styles
import "../styles/exam.css";

export default function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examState, setExamState] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: [],
    timeRemaining: 60 * 60, // 1 hour
    isCompleted: false,
  });

  // MindVault state
  const [mindVault, setMindVault] = useLocalStorage<MindVaultItem[]>(
    "MindVault",
    [],
  );

  // Function to add failed questions to MindVault
  const addFailedQuestionsToMindVault = useCallback(
    (failedQuestions: Question[]) => {
      if (!examId || failedQuestions.length === 0) return;

      const newMindVaultItems = failedQuestions.map((question) => ({
        source: "exam" as const,
        examId,
        questionId: question.id,
      }));

      const uniqueNewItems = filterDuplicateMindVaultItems(
        newMindVaultItems,
        mindVault,
      );

      if (uniqueNewItems.length > 0) {
        setMindVault((prev) => [...prev, ...uniqueNewItems]);
        toast.success(
          `Added ${uniqueNewItems.length} failed question${
            uniqueNewItems.length > 1 ? "s" : ""
          } to your MindVault for review`,
          { duration: 4000 },
        );
      }
    },
    [examId, mindVault, setMindVault],
  );

  // Handle exam submission
  const handleSubmitExam = useCallback(
    (isTimerExpired: boolean = false) => {
      const results = calculateExamResults(questions, examState.answers);
      const score = results.filter((r) => r.isCorrect).length;
      const failedQuestions = getFailedQuestions(questions, examState.answers);

      if (failedQuestions.length > 0) {
        addFailedQuestionsToMindVault(failedQuestions);
      }

      setExamState((prev) => ({
        ...prev,
        isCompleted: true,
        score,
      }));

      navigate(`/performance/${examId}`, {
        state: {
          questions,
          results,
          isExam: true,
          timerExpired: isTimerExpired,
        },
      });
    },
    [
      examId,
      navigate,
      questions,
      examState.answers,
      addFailedQuestionsToMindVault,
    ],
  );

  // Load exam questions
  useEffect(() => {
    async function loadExam() {
      try {
        const examData = await import(`../data/${examId}.json`);
        setQuestions(examData.question);
      } catch (error) {
        console.error("Failed to load exam:", error);
        navigate("/");
      }
    }
    loadExam();
  }, [examId, navigate]);

  // Handle exam timer
  useEffect(() => {
    if (examState.isCompleted || examState.timeRemaining <= 0) {
      if (!examState.isCompleted && examState.timeRemaining <= 0) {
        handleSubmitExam(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setExamState((prev) => ({
        ...prev,
        timeRemaining: prev.timeRemaining - 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [examState.isCompleted, examState.timeRemaining, handleSubmitExam]);

  // Event handlers
  const handleAnswerSelect = (answerIndex: number) => {
    setExamState((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentQuestionIndex] = answerIndex;
      return { ...prev, answers: newAnswers };
    });
  };

  const handleQuestionSelect = (index: number) => {
    setExamState((prev) => ({
      ...prev,
      currentQuestionIndex: index,
    }));
  };

  const handleNavigation = (direction: "next" | "previous") => {
    setExamState((prev) => ({
      ...prev,
      currentQuestionIndex:
        direction === "next"
          ? prev.currentQuestionIndex + 1
          : prev.currentQuestionIndex - 1,
    }));
  };

  // Loading state
  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">Loading exam...</div>
          <div className="text-gray-600">
            Please wait while we prepare your questions
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[examState.currentQuestionIndex];

  return (
    <SectionWrapper className="min-h-screen bg-gray-50 py-8">
      <div className="relative mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <BackButton to="/" text="Back to Home" />
          <ExamTimer timeRemaining={examState.timeRemaining} />
        </div>

        {/* Main Content */}
        <main className="rounded-xl bg-white p-8 shadow-sm">
          <QuestionNavigation
            totalQuestions={questions.length}
            currentIndex={examState.currentQuestionIndex}
            answeredQuestions={examState.answers}
            onQuestionSelect={handleQuestionSelect}
          />

          {/* Progress Bar */}
          <div className="mb-6">
            <ProgressBar
              total={questions.length}
              current={examState.currentQuestionIndex}
            />
          </div>

          {/* Question Display */}
          <QuestionDisplay
            question={currentQuestion}
            selectedAnswer={examState.answers[examState.currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
          />

          {/* Navigation Buttons */}
          <nav className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => handleNavigation("previous")}
              disabled={examState.currentQuestionIndex === 0}
              className="nav-button"
            >
              Previous
            </Button>
            {examState.currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={() => {
                  const unanswered = examState.answers.filter(
                    (a) => a === undefined,
                  ).length;
                  const confirmMessage =
                    unanswered > 0
                      ? `You have ${unanswered} unanswered questions. Are you sure you want to submit the exam?`
                      : "Are you sure you want to submit the exam?";

                  if (window.confirm(confirmMessage)) {
                    handleSubmitExam(false);
                  }
                }}
                className="nav-button"
              >
                Submit Exam
              </Button>
            ) : (
              <Button
                onClick={() => handleNavigation("next")}
                className="nav-button"
              >
                Next Question
              </Button>
            )}
          </nav>
        </main>
      </div>
    </SectionWrapper>
  );
}
