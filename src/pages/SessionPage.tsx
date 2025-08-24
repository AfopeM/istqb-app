import { BookOpen, ArrowLeft } from "lucide-react";
import chaptersData from "../data/chapters.json";
import { SessionCard } from "../components/session";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Button,
  ErrorMessage,
  LoadingSpinner,
  SectionWrapper,
} from "../components/ui";

type SessionType = "short" | "medium" | "long";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
}

interface Chapter {
  id: string;
  title: string;
  description?: string;
  img?: string;
  isComingSoon?: boolean;
}

interface SessionOption {
  type: SessionType;
  label: string;
  questionCount: number;
  description: string;
  estimatedTime: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export default function SessionPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartingSession, setIsStartingSession] = useState(false);

  const formatChapterTitle = (id: string): string => {
    return id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Find the current chapter
  const chapter = useMemo((): Chapter | null => {
    return chaptersData.chapters.find((c) => c.id === chapterId) || null;
  }, [chapterId]);

  // Session options configuration
  const sessionOptions: SessionOption[] = useMemo(
    () => [
      {
        type: "short",
        label: "Quick Practice",
        questionCount: 10,
        description: "Perfect for a quick review or when you have limited time",
        estimatedTime: "10-15 min",
        difficulty: "beginner",
      },
      {
        type: "medium",
        label: "Standard Practice",
        questionCount: 20,
        description: "Comprehensive practice session covering key concepts",
        estimatedTime: "20-30 min",
        difficulty: "intermediate",
      },
      {
        type: "long",
        label: "Intensive Practice",
        questionCount: 40,
        description: "Deep dive session for thorough preparation and mastery",
        estimatedTime: "40-60 min",
        difficulty: "advanced",
      },
    ],
    [],
  );

  // Load questions from JSON file based on chapter ID
  useEffect(() => {
    const loadQuestions = async () => {
      if (!chapterId) {
        setError("Chapter ID is missing");
        setIsLoading(false);
        return;
      }

      if (!chapter) {
        setError("Chapter not found");
        setIsLoading(false);
        return;
      }

      if (chapter.isComingSoon) {
        setError("This chapter is coming soon and not yet available");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Dynamic import of questions file based on chapter ID
        // This assumes your file is named "questions-chapter-1.json" for chapterId "chapter-1"
        const questionsModule = await import(
          `../data/questions-${chapterId}.json`
        );

        // Handle both array directly and default export
        const questions = (
          Array.isArray(questionsModule.default)
            ? questionsModule.default
            : Array.isArray(questionsModule.questions)
              ? questionsModule.questions
              : questionsModule
        ) as Question[];

        if (!questions || questions.length === 0) {
          throw new Error("No questions found for this chapter");
        }

        console.log(`Loaded ${questions.length} questions for ${chapterId}`);
        setAllQuestions(questions);
      } catch (err) {
        console.error("Error loading questions:", err);

        // Try alternative file naming patterns
        try {
          console.log(`Trying alternative import for ${chapterId}...`);

          // Try with the exact filename from your uploaded file
          if (chapterId === "chapter-1") {
            const questionsModule = await import(
              "../data/questions-chapter-1.json"
            );
            const questions = (
              Array.isArray(questionsModule.default)
                ? questionsModule.default
                : Array.isArray(questionsModule.questions)
                  ? questionsModule.questions
                  : questionsModule
            ) as Question[];

            if (questions && questions.length > 0) {
              console.log(
                `Successfully loaded ${questions.length} questions from fallback`,
              );
              setAllQuestions(questions);
              return;
            }
          }

          throw new Error("Questions file not found");
        } catch (fallbackErr) {
          console.error("Fallback import also failed:", fallbackErr);
          setError(
            `Failed to load questions for ${chapterId}. Please check that the questions file exists.`,
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [chapterId, chapter]);

  // Fisher-Yates shuffle algorithm for better randomization
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Removed old getRandomQuestions helper (no longer needed after session logic refactor).
  // Handle session choice
  const handleSessionChoice = useCallback(
    async (type: SessionType) => {
      const option = sessionOptions.find((opt) => opt.type === type);
      if (!option || !chapterId) return;

      setIsStartingSession(true);

      try {
        // Retrieve questions that the user has already answered for this chapter
        const answeredKey = `answeredQuestions-${chapterId}`;
        const answeredIdsRaw = localStorage.getItem(answeredKey);
        const answeredIds: string[] = answeredIdsRaw
          ? JSON.parse(answeredIdsRaw)
          : [];

        // Separate unseen and previously seen questions
        const unseenQuestions = allQuestions.filter(
          (q) => !answeredIds.includes(q.id),
        );
        const seenQuestions = allQuestions.filter((q) =>
          answeredIds.includes(q.id),
        );

        // Shuffle both pools
        const shuffledUnseen = shuffleArray(unseenQuestions);
        const shuffledSeen = shuffleArray(seenQuestions);

        // Assemble the session: prioritise unseen, then top-up with seen if necessary
        const selectedQuestions = [...shuffledUnseen, ...shuffledSeen].slice(
          0,
          option.questionCount,
        );

        if (selectedQuestions.length === 0) {
          throw new Error("No questions available");
        }

        console.log(
          `Starting ${type} session with ${selectedQuestions.length} questions`,
        );

        // Small delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Navigate to quiz page with selected questions
        navigate(`/quiz/${chapterId}`, {
          state: { questions: selectedQuestions },
        });
      } catch (err) {
        console.error("Error starting session:", err);
        setError("Failed to start session. Please try again.");
        setIsStartingSession(false);
      }
    },
    [sessionOptions, chapterId, navigate, allQuestions, shuffleArray],
  );

  // Handle retry
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6 py-8">
          <Button to="/">Home</Button>
          <div className="flex min-h-[60vh] items-center justify-center">
            <LoadingSpinner size="lg" text="Loading questions..." />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6 py-8">
          <Button to="/">Home</Button>
          <div className="flex min-h-[60vh] items-center justify-center">
            <ErrorMessage
              message={error || "Chapter not found"}
              onRetry={error ? handleRetry : undefined}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <SectionWrapper>
      <div className="relative z-10 container mx-auto flex min-h-screen flex-col px-6">
        {/* BACK BUTTON */}
        <div className="py-8">
          <Button to="/" variant="ghost" className="group space-x-2">
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span>Home</span>
          </Button>
        </div>

        {/* MAIN CONTENT */}
        <main className="mx-auto flex max-w-4xl flex-1 flex-col justify-center">
          {/* HEADER */}
          <header className="mb-2 text-center">
            {/* BADGE */}
            <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-xs font-medium text-blue-500 uppercase backdrop-blur-sm md:text-sm">
              <BookOpen className="size-4" />
              {formatChapterTitle(chapter.id)}
            </div>

            {/* TITLE */}
            <h1 className="mb-2 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
              {chapter.title}
            </h1>

            {/* DESCRIPTION */}
            <p className="mx-auto mb-6 max-w-2xl leading-relaxed text-gray-600 md:text-lg">
              {chapter.description}
            </p>
          </header>

          {/* SESSION OPTIONS */}
          <section className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4">
            {sessionOptions.map((option) => {
              const availableQuestions = Math.min(
                option.questionCount,
                allQuestions.length,
              );
              const isLimited = availableQuestions < option.questionCount;

              return (
                <div key={option.type} className="relative">
                  <SessionCard
                    option={{
                      ...option,
                      questionCount: availableQuestions,
                      description: isLimited
                        ? `Only ${availableQuestions} questions available`
                        : option.description,
                    }}
                    onClick={handleSessionChoice}
                    isLoading={isStartingSession}
                  />

                  {isLimited && (
                    <div className="absolute top-4 right-4">
                      <span className="rounded-full bg-yellow-500 px-2 py-1 text-xs font-medium text-white">
                        Limited
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* ADDITIONAL INFO */}
          <p className="mt-6 text-center text-sm text-gray-600 opacity-70">
            Questions are randomly selected from a pool of {allQuestions.length}{" "}
            available questions
          </p>
        </main>
      </div>
    </SectionWrapper>
  );
}
