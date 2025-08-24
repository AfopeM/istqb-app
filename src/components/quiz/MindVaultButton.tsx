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
        variant={isSelected ? "default" : "ghost"}
      >
        <Bookmark
          className={`size-5 transition-colors duration-200 ${
            isSelected ? "fill-white text-white" : "text-blue-500"
          }`}
        />
      </Button>

      {/* Toast Notification */}
      <div
        className={`fixed right-4 bottom-4 flex transform items-center space-x-2 rounded-lg bg-blue-500 px-4 py-3 text-white shadow-lg transition-all duration-300 ease-in-out ${
          showToast
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-8 opacity-0"
        } `}
      >
        <Bookmark className="size-5 fill-white" />
        <span>Added to MindVault!</span>
      </div>
    </div>
  );
}
