import { Button } from "../ui";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { Bookmark } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

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

interface Props {
  questionId: string;
  chapterId?: string;
  examId?: string;
  className?: string;
  source: "chapter" | "exam";
}

// Validation functions
const isValidQuestionId = (id: string): boolean => /^q\d{3}$/.test(id);
const isValidChapterId = (id: string): boolean => /^chapter-\d+$/.test(id);
const isValidExamId = (id: string): boolean => /^exam-\d+$/.test(id);

export default function MindVaultButton({
  questionId,
  chapterId,
  examId,
  className,
  source,
}: Props) {
  const [mindVault, setMindVault] = useLocalStorage<MindVaultItem[]>(
    "MindVault",
    [],
  );

  // Validate inputs based on source
  const isValidInput = (): boolean => {
    if (!isValidQuestionId(questionId)) {
      return false;
    }

    if (source === "chapter") {
      return Boolean(chapterId) && chapterId
        ? isValidChapterId(chapterId)
        : false;
    }

    if (source === "exam") {
      return Boolean(examId) && examId ? isValidExamId(examId) : false;
    }

    return false;
  };

  // Find existing item in vault (if any)
  const existingItem = mindVault.find((item) => item.questionId === questionId);
  const isSelected = Boolean(existingItem);

  const toggleChallenge = () => {
    // Debug exam questions specifically
    if (source === "exam") {
      console.log("EXAM DEBUG - MindVault Button clicked:", {
        questionId,
        examId,
        source,
        isValidInput: isValidInput(),
        isValidExamId: examId ? isValidExamId(examId) : false,
        isValidQuestionId: isValidQuestionId(questionId),
      });
    }

    if (!isValidInput()) {
      if (source === "exam") {
        console.error("EXAM DEBUG - Validation failed:", {
          questionId,
          examId,
          source,
          questionIdValid: isValidQuestionId(questionId),
          examIdValid: examId ? isValidExamId(examId) : false,
        });
      }
      toast.error("Invalid question format");
      return;
    }

    // If item exists and has same source, remove it
    if (existingItem?.source === source) {
      setMindVault((prev) => {
        const newState = prev.filter((item) => item.questionId !== questionId);
        if (source === "exam") {
          console.log("EXAM DEBUG - Removed from MindVault:", newState);
        }
        return newState;
      });
      toast.info("Removed from MindVault");
      return;
    }

    // Create new item based on source
    let newItem: MindVaultItem;
    if (source === "chapter" && chapterId) {
      newItem = {
        source: "chapter",
        questionId,
        chapterId,
      };
    } else if (source === "exam" && examId) {
      newItem = {
        source: "exam",
        questionId,
        examId,
      };
    } else {
      console.error("Invalid source or missing ID");
      return;
    }

    // If item exists but has different source, update it
    if (existingItem) {
      setMindVault((prev) => {
        const newState = prev.map((item) =>
          item.questionId === questionId ? newItem : item,
        );
        if (source === "exam") {
          console.log("EXAM DEBUG - Updated in MindVault:", newState);
        }
        return newState;
      });
      toast.success("Updated in MindVault");
      return;
    }

    // If item doesn't exist, add it
    setMindVault((prev) => {
      const newState = [...prev, newItem];
      if (source === "exam") {
        console.log("EXAM DEBUG - Added to MindVault:", newState);
        console.log("EXAM DEBUG - New item added:", newItem);
      }
      return newState;
    });
    toast.success("Added to MindVault");
  };

  // Get tooltip text based on selection state
  const tooltip = isSelected ? "Remove from MindVault" : "Add to MindVault";

  // Icon styles with blue color scheme
  const iconClassName = cn(
    "size-5 transition-colors duration-200",
    isSelected
      ? "fill-blue-500 text-blue-500"
      : "text-blue-300 hover:text-blue-500",
  );

  return (
    <Button
      size="sm"
      variant="blank"
      className={cn("group relative", className)}
      onClick={toggleChallenge}
      title={tooltip}
    >
      <Bookmark className={iconClassName} />
      {/* Tooltip */}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
        {tooltip}
      </span>
    </Button>
  );
}
