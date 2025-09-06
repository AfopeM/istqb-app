import { Brain, Trash2, ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Question } from "../types/quiz";
import chaptersData from "../data/chapters.json";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Button, SectionWrapper } from "../components/ui";
import { ChapterCard } from "../components/mindvault";

interface ChapterQuestions {
  chapterId: string;
  chapterTitle: string;
  questions: Question[];
}

interface MindVaultItem {
  chapterId: string;
  questionId: string;
}

// UTILITY FUNCTIONS
const isValidQuestionId = (id: string): boolean => /^q\d{3}$/.test(id);
const isValidChapterId = (id: string): boolean => /^chapter-\d+$/.test(id);

const isValidMindVaultItem = (item: unknown): item is MindVaultItem => {
  if (!item || typeof item !== "object") return false;
  const record = item as Record<string, unknown>;
  return (
    "questionId" in record &&
    "chapterId" in record &&
    typeof record.questionId === "string" &&
    typeof record.chapterId === "string" &&
    isValidQuestionId(record.questionId) &&
    isValidChapterId(record.chapterId)
  );
};

const migrateOldFormatItem = (
  item: string | MindVaultItem,
  allQuestions: Question[],
): MindVaultItem | null => {
  if (typeof item === "string" && isValidQuestionId(item)) {
    const question = allQuestions.find((q) => q.id === item);
    if (question) {
      const chapterNum = question.chapterSection.split(".")[0];
      return {
        chapterId: `chapter-${chapterNum}`,
        questionId: item,
      };
    }
  }
  return null;
};

export default function MindVaultPage() {
  const [mindVault, setMindVault] = useLocalStorage<MindVaultItem[]>(
    "MindVault",
    [],
  );
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  console.log(mindVault);

  // LOAD ALL QUESTIONS FROM AVAILABLE CHAPTERS
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Only load questions for chapters that are not marked as coming soon
        const availableChapters = chaptersData.chapters.filter(
          (chapter) => !chapter.isComingSoon,
        );

        const questionPromises = availableChapters.map(async (chapter) => {
          try {
            const module = await import(`../data/questions-${chapter.id}.json`);
            return module.default.questions;
          } catch (err: unknown) {
            console.error(
              `Failed to load questions for ${chapter.id}. This chapter might not be available yet.`,
              err,
            );
            return [];
          }
        });

        const questionArrays = await Promise.all(questionPromises);
        setAllQuestions(questionArrays.flat());
      } catch (error) {
        console.error("Error loading questions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // CLEAN AND MIGRATE MINDVAULT DATA
  const cleanAndMigrateMindVault = useCallback(() => {
    if (mindVault.length === 0 || loading) return;

    const cleanedItems: MindVaultItem[] = [];

    for (const item of mindVault) {
      // Handle valid new format
      if (isValidMindVaultItem(item)) {
        cleanedItems.push(item);
        continue;
      }

      // Try to migrate old format
      const migratedItem = migrateOldFormatItem(item, allQuestions);
      if (migratedItem) {
        cleanedItems.push(migratedItem);
      }
    }

    // Remove duplicates
    const uniqueItems = cleanedItems.filter(
      (item, index, arr) =>
        arr.findIndex((i) => i.questionId === item.questionId) === index,
    );

    if (uniqueItems.length !== mindVault.length) {
      setMindVault(uniqueItems);
      console.log("Cleaned and migrated MindVault:", uniqueItems);
    }
  }, [mindVault, allQuestions, setMindVault, loading]);

  useEffect(() => {
    cleanAndMigrateMindVault();
  }, [cleanAndMigrateMindVault]);

  // COMPUTED VALUES
  const mindVaultQuestions = useMemo(() => {
    return allQuestions.filter((question) =>
      mindVault.some((item) => {
        const chapterNum = question.chapterSection.split(".")[0];
        const questionChapterId = `chapter-${chapterNum}`;
        return (
          item.questionId === question.id &&
          item.chapterId === questionChapterId
        );
      }),
    );
  }, [allQuestions, mindVault]);

  const chapterQuestions = useMemo((): ChapterQuestions[] => {
    // Debug logging
    console.log("MindVault items:", mindVault);
    console.log("All questions:", allQuestions);
    console.log("MindVault questions:", mindVaultQuestions);

    return chaptersData.chapters
      .map((chapter) => {
        // Get questions for this chapter from mindVault
        const chapterQs = mindVaultQuestions.filter((question) => {
          // Find the corresponding MindVaultItem
          const mindVaultItem = mindVault.find(
            (item) => item.questionId === question.id,
          );
          return mindVaultItem?.chapterId === chapter.id;
        });

        return {
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          questions: chapterQs,
        };
      })
      .filter((chapter) => chapter.questions.length > 0);
  }, [mindVaultQuestions, mindVault, allQuestions]);

  // EVENT HANDLERS
  const handleReset = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your MindVault?")) {
      setMindVault([]);
    }
  }, [setMindVault]);

  const handleGoHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

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
            Go to Home
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
            <h1 className="text-2xl font-bold text-gray-900">MindVault</h1>
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleReset}
              className="border-red-600 bg-red-600 font-semibold text-red-500 capitalize hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="mr-2 size-4" />
              clear vault
            </Button>
            <Button to="/" className="capitalize">
              <ArrowLeft className="mr-2 size-4" />
              back
            </Button>
          </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="space-y-8">
          {/* CHAPTER GRID VIEW */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {chapterQuestions.map((chapter) => (
              <ChapterCard
                key={chapter.chapterId}
                chapterId={chapter.chapterId}
                questions={chapter.questions}
                chapterTitle={chapter.chapterTitle}
                isLoading={loading}
                isComingSoon={
                  chaptersData.chapters.find((c) => c.id === chapter.chapterId)
                    ?.isComingSoon
                }
              />
            ))}
          </div>
        </main>
      </div>
    </SectionWrapper>
  );
}
