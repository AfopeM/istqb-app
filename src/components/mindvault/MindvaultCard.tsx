import { Clock } from "lucide-react";
import type { Question } from "../../types/quiz";
import { useNavigate } from "react-router-dom";

interface Props {
  chapterTitle: string;
  chapterId: string;
  questions: Question[];
  isComingSoon?: boolean;
}

export default function MindvaultCard({
  chapterTitle,
  chapterId,
  questions,
  isComingSoon = false,
}: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/mindvault/mindvaultquiz/${chapterId}`, {
      state: { questions },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  // Estimate time based on number of questions (2 minutes per question)
  const estimatedTime = `${Math.max(Math.ceil(questions.length * 2), 5)} min`;

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isComingSoon}
      className={`group relative w-full transform cursor-pointer rounded-lg p-6 text-left text-white shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70 ${isComingSoon ? "bg-gray-500 hover:from-gray-600" : "bg-blue-500 hover:bg-blue-600"}`}
      aria-label={
        isComingSoon
          ? `${chapterTitle} - Coming Soon`
          : `Start review for ${chapterTitle} with ${questions.length} questions`
      }
    >
      {/* CONTENT */}
      <div>
        <div className="mb-2 font-bold">
          <h3 className="text-sm uppercase">{chapterTitle}</h3>
          {isComingSoon ? (
            <p className="text-2xl md:text-3xl">Coming Soon</p>
          ) : (
            <p className="text-2xl md:text-3xl">
              {questions.length} Question{questions.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* FOOTER */}
        {!isComingSoon && (
          <div className="flex items-center justify-between pt-2">
            <div className="inline-flex items-center gap-1 rounded-sm bg-blue-400/20 px-3 py-1 text-xs font-medium text-blue-100">
              <Clock className="size-3" />
              {estimatedTime}
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
