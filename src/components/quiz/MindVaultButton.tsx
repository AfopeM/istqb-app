import { Button } from "../ui";
import { toast } from "sonner";
import { Bookmark } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface Props {
  questionId: string;
  chapterId?: string;
}

interface MindVaultItem {
  chapterId: string;
  questionId: string;
}

export default function MindVaultButton({ questionId, chapterId }: Props) {
  const [mindVault, setMindVault] = useLocalStorage<MindVaultItem[]>(
    "MindVault",
    [],
  );

  // Checks if the questionId is already in the mindVault array
  const isSelected = mindVault.some(
    (item) =>
      (typeof item === "string" && item === questionId) ||
      (typeof item === "object" && item.questionId === questionId),
  );

  const toggleChallenge = () => {
    if (isSelected) {
      // Remove from vault
      setMindVault((prev) =>
        prev.filter(
          (item) =>
            (typeof item === "string" && item !== questionId) ||
            (typeof item === "object" && item.questionId !== questionId),
        ),
      );
      // Use Sonner's toast to show a success message
      toast.info("Removed from MindVault!");
    } else {
      // Add to vault with chapter information
      if (chapterId) {
        const newItem: MindVaultItem = {
          chapterId,
          questionId,
        };
        setMindVault((prev) => [...prev, newItem]);
        // Use Sonner's toast to show a success message
        toast.success("Added to MindVault!");
      }
    }
  };

  return (
    <Button
      size="sm"
      variant="blank"
      className="group"
      onClick={toggleChallenge}
    >
      <Bookmark
        className={`size-5 transition-colors duration-200 ${
          isSelected ? "fill-blue-500 text-blue-500" : "text-blue-500"
        }`}
      />
    </Button>
  );
}
