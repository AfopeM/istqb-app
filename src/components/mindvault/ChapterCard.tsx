import { Book } from "lucide-react";
import type { Question } from "../../types/quiz";

interface Props {
  chapterTitle: string;
  chapterId: string;
  questions: Question[];
  onChapterClick: (chapterId: string) => void;
}

export default function ChapterCard({
  chapterTitle,
  chapterId,
  questions,
  onChapterClick,
}: Props) {
  return (
    <div
      className="cursor-pointer rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg"
      onClick={() => onChapterClick(chapterId)}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Book className="size-5 text-blue-500" />
            <h3 className="text-lg font-bold text-gray-900">{chapterTitle}</h3>
          </div>
          <p className="text-sm text-gray-500 capitalize">
            {questions.length} saved question{questions.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
