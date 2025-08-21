import { Button } from "../ui";
import { Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface Props {
  questionId: string;
}

export default function MindVaultButton({ questionId }: Props) {
  const [MindVault, setMindVault] = useLocalStorage<string[]>("MindVault", []);
  const [showToast, setShowToast] = useState(false);

  const isSelected = MindVault.includes(questionId);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const toggleChallenge = () => {
    if (isSelected) {
      setMindVault(MindVault.filter((id) => id !== questionId));
    } else {
      setMindVault([...MindVault, questionId]);
      setShowToast(true);
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        className="group"
        onClick={toggleChallenge}
        // variant={isSelected ? "filled" : "default"}
        variant={isSelected ? "filled" : "ghost"}
      >
        <Bookmark
          className={`size-5 transition-colors duration-200 ${
            isSelected ? "text-white fill-white" : "text-blue-500"
          }`}
        />
      </Button>

      {/* Toast Notification */}
      <div
        className={`
          fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg
          transform transition-all duration-300 ease-in-out
          flex items-center space-x-2
          ${
            showToast
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0 pointer-events-none"
          }
        `}
      >
        <Bookmark className="size-5 fill-white" />
        <span>Added to MindVault!</span>
      </div>
    </div>
  );
}
