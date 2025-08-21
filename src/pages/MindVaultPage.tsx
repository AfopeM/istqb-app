import { Button } from "../components/ui";
import { useEffect, useState } from "react";
import type { Question } from "../types/quiz";
import chaptersData from "../data/chapters.json";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function MindVaultPage() {
  const [MindVault, setMindVault] = useLocalStorage<string[]>("MindVault", []);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all chapter questions dynamically
  useEffect(() => {
    const loadQuestions = async () => {
      const questionArrays: Question[][] = [];

      for (const chapter of chaptersData.chapters) {
        try {
          const module = await import(`../data/questions-${chapter.id}.json`);
          questionArrays.push(module.default);
        } catch (err) {
          console.error(`Failed to load questions for ${chapter.id}`, err);
        }
      }

      setAllQuestions(questionArrays.flat());
      setLoading(false);
    };

    loadQuestions();
  }, []);

  const MindVaultQuestions = allQuestions.filter((q) =>
    MindVault.includes(q.id)
  );

  const handleReset = () => {
    setMindVault([]);
    alert("MindVault has been cleared!");
  };

  if (loading) {
    return <div className="text-center p-8">Loading questions...</div>;
  }

  if (MindVaultQuestions.length === 0) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Your MindVault is empty!</h1>
        <p>Incorrectly answered questions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Challenge Bank</h1>
      <p>You have {MindVaultQuestions.length} questions to review.</p>
      <Button
        onClick={handleReset}
        className="my-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Reset Challenge Bank
      </Button>
    </div>
  );
}
