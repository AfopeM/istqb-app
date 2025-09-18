import { useState, useEffect } from "react";
import type { Question } from "../types/quiz";
import { BackButton, ProgressBar, Button } from "../components/ui";
import { Timer } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

interface ExamState {
  currentQuestionIndex: number;
  answers: number[];
  timeRemaining: number;
  isCompleted: boolean;
  score?: number;
}

export default function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examState, setExamState] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: [],
    timeRemaining: 60 * 60,
    isCompleted: false,
  });

  useEffect(() => {
    // Load exam questions
    const loadExam = async () => {
      try {
        const examData = await import(`../data/${examId}.json`);
        setQuestions(examData.question);
      } catch (error) {
        console.error("Failed to load exam:", error);
        navigate("/");
      }
    };
    loadExam();
  }, [examId, navigate]);

  useEffect(() => {
    // Timer countdown
    if (!examState.isCompleted && examState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setExamState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examState.isCompleted, examState.timeRemaining]);

  const handleAnswerSelect = (answerIndex: number) => {
    setExamState((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentQuestionIndex] = answerIndex;
      return { ...prev, answers: newAnswers };
    });
  };

  const handleNextQuestion = () => {
    if (examState.currentQuestionIndex < questions.length - 1) {
      setExamState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (examState.currentQuestionIndex > 0) {
      setExamState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const handleSubmitExam = () => {
    const score = examState.answers.reduce((total, answer, index) => {
      return total + (answer === questions[index].correctAnswerIndex ? 1 : 0);
    }, 0);

    setExamState((prev) => ({
      ...prev,
      isCompleted: true,
      score: score,
    }));

    // TODO: Save exam results
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <BackButton to="/" text="Back to Home" />
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-lg font-medium shadow-sm">
            <Timer className="size-5 text-blue-500" />
            <span
              className={examState.timeRemaining < 300 ? "text-red-600" : ""}
            >
              {formatTime(examState.timeRemaining)}
            </span>
          </div>
        </div>

        {/* QUESTION CARD*/}
        <main className="rounded-xl bg-white p-8 shadow-sm">
          {/* PROGRESS BAR */}
          <div className="mb-6">
            <ProgressBar
              total={questions.length}
              current={examState.currentQuestionIndex}
            />
          </div>

          {/* QUESTIONS */}
          <div className="mb-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              {currentQuestion.questionText}
            </h2>

            {/* OPTIONS */}
            <ul className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full cursor-pointer rounded-lg border-2 p-4 text-left transition-colors ${
                      examState.answers[examState.currentQuestionIndex] ===
                      index
                        ? "border-blue-300 bg-blue-100 text-blue-600"
                        : "border-transparent bg-gray-50 hover:border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* NAVIGATION BUTTONS */}
          <nav className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={examState.currentQuestionIndex === 0}
              className="font-medium tracking-wider capitalize"
            >
              Previous
            </Button>
            {examState.currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmitExam}
                className="font-medium tracking-wider capitalize"
              >
                Submit Exam
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="font-medium tracking-wider capitalize"
              >
                Next Question
              </Button>
            )}
          </nav>
        </main>
      </div>
    </div>
  );
}
