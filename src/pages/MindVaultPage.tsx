import { Brain, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Question } from "../types/quiz";
import chaptersData from "../data/chapters.json";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { BackButton, Button, SectionWrapper } from "../components/ui";
import { MindvaultCard } from "../components/mindvault";

// Extended Question type with source metadata
interface QuestionWithSource extends Question {
  _source: "chapter" | "exam";
  _examId?: string;
}

/**
 * TYPES AND INTERFACES
 * ------------------
 * The MindVault system supports two types of questions:
 * 1. Chapter questions - from specific chapters in the course
 * 2. Exam questions - from practice exams
 *
 * Each question is uniquely identified by its source (chapter/exam) and ID
 */

interface ChapterQuestions {
  chapterId: string;
  chapterTitle: string;
  questions: Question[];
}

interface ExamQuestions {
  examId: string;
  questions: Question[];
}

// Base interface for all MindVault items
interface BaseMindVaultItem {
  questionId: string; // Format: q001, q002, etc.
  source: "chapter" | "exam"; // Discriminator for union type
}

// Chapter-specific MindVault item
interface ChapterMindVaultItem extends BaseMindVaultItem {
  source: "chapter";
  chapterId: string; // Format: chapter-1, chapter-2, etc.
}

// Exam-specific MindVault item
interface ExamMindVaultItem extends BaseMindVaultItem {
  source: "exam";
  examId: string; // Format: exam-1, exam-2, etc.
}

// Union type for all possible MindVault items
type MindVaultItem = ChapterMindVaultItem | ExamMindVaultItem;

/**
 * UTILITY FUNCTIONS
 * ---------------
 */

// Formats chapter title for display (e.g., "chapter 1 : Introduction")
const formatChapterTitle = (chapterId: string, title: string): string =>
  `chapter ${chapterId.split("-")[1]} : ${title}`;

// Validation functions for different ID formats
const isValidQuestionId = (id: string): boolean => /^q\d{3}$/.test(id);
const isValidChapterId = (id: string): boolean => /^chapter-\d+$/.test(id);
const isValidExamId = (id: string): boolean => /^exam-\d+$/.test(id);

/**
 * Type guard to validate MindVault items
 * Ensures that items have the correct structure and valid IDs based on their source
 *
 * @param item - Unknown value to validate
 * @returns Type predicate indicating if the item is a valid MindVaultItem
 */
const isValidMindVaultItem = (item: unknown): item is MindVaultItem => {
  if (!item || typeof item !== "object") return false;
  const record = item as Record<string, unknown>;

  // Validate common fields required for all MindVault items
  if (
    !("questionId" in record) ||
    !("source" in record) ||
    typeof record.questionId !== "string" ||
    typeof record.source !== "string" ||
    !isValidQuestionId(record.questionId)
  ) {
    return false;
  }

  // Validate chapter-specific fields
  if (record.source === "chapter") {
    return (
      "chapterId" in record &&
      typeof record.chapterId === "string" &&
      isValidChapterId(record.chapterId)
    );
  }

  // Validate exam-specific fields
  if (record.source === "exam") {
    return (
      "examId" in record &&
      typeof record.examId === "string" &&
      isValidExamId(record.examId)
    );
  }

  return false;
};

// Type for legacy MindVault item format
interface LegacyMindVaultItem {
  chapterId: string;
  questionId: string;
}

export default function MindVaultPage() {
  const [mindVault, setMindVault] = useLocalStorage<MindVaultItem[]>(
    "MindVault",
    [],
  );
  const [allQuestions, setAllQuestions] = useState<QuestionWithSource[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // LOAD ALL QUESTIONS FROM AVAILABLE CHAPTERS AND EXAMS
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const allQuestionsArray: QuestionWithSource[] = [];

        // Load chapter questions
        const availableChapters = chaptersData.chapters.filter(
          (chapter) => !chapter.isComingSoon,
        );

        const chapterPromises = availableChapters.map(async (chapter) => {
          try {
            const module = await import(`../data/questions-${chapter.id}.json`);
            const questions = module.default.questions || [];
            // Add source metadata to chapter questions
            return questions.map(
              (q: unknown): QuestionWithSource => ({
                ...(q as Question),
                _source: "chapter" as const,
              }),
            );
          } catch (err: unknown) {
            console.error(
              `Failed to load questions for ${chapter.id}. This chapter might not be available yet.`,
              err,
            );
            return [];
          }
        });

        const chapterQuestionArrays = await Promise.all(chapterPromises);
        allQuestionsArray.push(...chapterQuestionArrays.flat());

        // Load exam questions
        try {
          const examModule = await import("../data/exam-1.json");
          const examQuestions = examModule.question || [];
          // Add source metadata to exam questions
          const examQuestionsWithSource: QuestionWithSource[] =
            examQuestions.map((q: unknown) => ({
              ...(q as Question),
              _source: "exam" as const,
              _examId: "exam-1",
            }));
          allQuestionsArray.push(...examQuestionsWithSource);
        } catch (err: unknown) {
          console.error("Failed to load exam questions:", err);
        }

        setAllQuestions(allQuestionsArray);
      } catch (error) {
        console.error("Error loading questions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // One-time migration flag in local storage
  const [hasMigrated, setHasMigrated] = useLocalStorage<boolean>(
    "MindVaultMigrated",
    false,
  );

  // Clean and migrate data when dependencies change
  useEffect(() => {
    if (mindVault.length === 0 || loading) return;

    const cleanedItems: MindVaultItem[] = [];
    let migratedCount = 0;
    let skippedCount = 0;

    for (const item of mindVault) {
      // Check if item needs migration (doesn't have source field)
      if (!("source" in item)) {
        // Convert old format to new format
        const legacyItem = item as LegacyMindVaultItem;
        const migratedItem: ChapterMindVaultItem = {
          source: "chapter",
          chapterId: legacyItem.chapterId,
          questionId: legacyItem.questionId,
        };

        // Validate the migrated item
        if (
          isValidQuestionId(migratedItem.questionId) &&
          isValidChapterId(migratedItem.chapterId)
        ) {
          cleanedItems.push(migratedItem);
          migratedCount++;
          continue;
        } else {
          console.warn("Invalid item found:", item);
          skippedCount++;
          continue;
        }
      }

      // Item already has source field, just validate and add
      if (isValidMindVaultItem(item)) {
        cleanedItems.push(item);
      } else {
        console.warn("Invalid item format:", item);
        skippedCount++;
      }
    }

    // Remove duplicates
    const uniqueItems = cleanedItems.filter(
      (item, index, arr) =>
        arr.findIndex(
          (i) =>
            i.questionId === item.questionId &&
            i.source === item.source &&
            (i.source === "chapter"
              ? i.chapterId === (item as ChapterMindVaultItem).chapterId
              : true),
        ) === index,
    );

    // Always update if there are migrated items
    if (migratedCount > 0 || uniqueItems.length !== mindVault.length) {
      setMindVault(uniqueItems);
    }

    // Mark migration as completed only if successful
    if (migratedCount > 0 && skippedCount === 0) {
      setHasMigrated(true);
    }
  }, [
    mindVault,
    allQuestions,
    setMindVault,
    loading,
    hasMigrated,
    setHasMigrated,
  ]);

  // COMPUTED VALUES
  const mindVaultQuestions = useMemo(() => {
    return allQuestions.filter((question) =>
      mindVault.some((item) => {
        if (item.source === "chapter") {
          const chapterNum = question.chapterSection.split(".")[0];
          const questionChapterId = `chapter-${chapterNum}`;
          return (
            item.questionId === question.id &&
            item.chapterId === questionChapterId &&
            question._source === "chapter"
          );
        }

        if (item.source === "exam") {
          return (
            item.questionId === question.id &&
            question._source === "exam" &&
            question._examId === item.examId
          );
        }

        return false;
      }),
    );
  }, [allQuestions, mindVault]);

  // Group questions by chapter
  const chapterQuestions = useMemo(
    (): ChapterQuestions[] =>
      chaptersData.chapters
        .map((chapter) => ({
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          questions: mindVaultQuestions.filter((question) =>
            mindVault.find(
              (item) =>
                item.source === "chapter" &&
                item.questionId === question.id &&
                item.chapterId === chapter.id,
            ),
          ),
        }))
        .filter((chapter) => chapter.questions.length > 0),
    [mindVaultQuestions, mindVault],
  );

  // Group questions by exam
  const examQuestions = useMemo((): ExamQuestions[] => {
    // Get unique exam IDs from mindVault
    const examIds = [
      ...new Set(
        mindVault
          .filter((item): item is ExamMindVaultItem => item.source === "exam")
          .map((item) => item.examId),
      ),
    ];

    return examIds
      .map((examId) => ({
        examId,
        questions: mindVaultQuestions.filter((question) =>
          mindVault.find(
            (item) =>
              item.source === "exam" &&
              item.questionId === question.id &&
              (item as ExamMindVaultItem).examId === examId,
          ),
        ),
      }))
      .filter((exam) => exam.questions.length > 0);
  }, [mindVaultQuestions, mindVault]);

  // EVENT HANDLERS
  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear your MindVault?")) {
      setMindVault([]);
    }
  };

  console.log(mindVault);

  const handleGoHome = () => navigate("/");

  // LOADING STATE
  if (loading) {
    return (
      <SectionWrapper>
        <div className="relative flex min-h-[60vh] items-center justify-center">
          <div className="animate-pulse text-gray-600">
            Loading questions...
          </div>
        </div>
      </SectionWrapper>
    );
  }

  // EMPTY STATE
  if (mindVaultQuestions.length === 0) {
    return (
      <SectionWrapper>
        <div className="relative flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
          <Brain className="size-16 text-blue-200" />
          <h1 className="text-2xl font-bold text-gray-900">
            Your MindVault is empty!
          </h1>
          <p className="max-w-md text-gray-600">
            Questions you want to review will appear here. Save questions while
            practicing to build your personalized review list.
          </p>
          <Button
            onClick={handleGoHome}
            className="mt-4 px-16 font-bold tracking-wide"
          >
            Home Page
          </Button>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <div className="relative mx-auto max-w-5xl p-6">
        {/* HEADER SECTION */}
        <nav className="mb-8 flex items-center justify-between">
          {/* PAGE TITLE */}
          <div className="flex items-center gap-3">
            <Brain className="size-8 text-blue-500" />
            <h1 className="hidden text-2xl font-bold text-gray-900 md:block">
              MindVault
            </h1>
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-red-300 font-semibold text-red-300 capitalize hover:border-red-600 hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="mr-2 size-4" />
              clear vault
            </Button>
            <BackButton to="/" text="Back to Home" />
          </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="space-y-8">
          {/* CHAPTER GRID VIEW */}
          {chapterQuestions.length > 0 && (
            <>
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Chapter Questions
              </h2>
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {chapterQuestions.map((chapter) => (
                  <MindvaultCard
                    key={chapter.chapterId}
                    chapterId={chapter.chapterId}
                    questions={chapter.questions}
                    chapterTitle={formatChapterTitle(
                      chapter.chapterId,
                      chapter.chapterTitle,
                    )}
                    isComingSoon={
                      chaptersData.chapters.find(
                        (c) => c.id === chapter.chapterId,
                      )?.isComingSoon
                    }
                  />
                ))}
              </div>
            </>
          )}

          {/* EXAM GRID VIEW */}
          {examQuestions.length > 0 && (
            <>
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Exam Questions
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {examQuestions.map((exam) => (
                  <MindvaultCard
                    key={exam.examId}
                    chapterId={exam.examId}
                    questions={exam.questions}
                    chapterTitle={`Exam ${exam.examId.split("-")[1]}`}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </SectionWrapper>
  );
}
