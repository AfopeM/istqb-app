import React, { useMemo } from "react";
import { Clock, Zap, Award } from "lucide-react";

type SessionType = "short" | "medium" | "long";

interface SessionOption {
  type: SessionType;
  label: string;
  questionCount: number;
  description: string;
  estimatedTime: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

interface Props {
  option: SessionOption;
  onClick: (type: SessionType) => void;
  isLoading?: boolean;
}

export default function SessionCard({
  option,
  onClick,
  isLoading = false,
}: Props) {
  const { type, label, questionCount, description, estimatedTime, difficulty } =
    option;

  const handleClick = useMemo(() => {
    return () => {
      if (!isLoading) {
        onClick(type);
      }
    };
  }, [type, onClick, isLoading]);

  const handleKeyDown = useMemo(() => {
    return (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    };
  }, [handleClick]);

  const getSessionIcon = (sessionType: SessionType) => {
    switch (sessionType) {
      case "short":
        return <Zap className="size-6" />;
      case "medium":
        return <Clock className="size-6" />;
      case "long":
        return <Award className="size-6" />;
      default:
        return <Clock className="size-6" />;
    }
  };

  const getSessionColors = (sessionType: SessionType) => {
    switch (sessionType) {
      case "short":
        return {
          bg: "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
          icon: "bg-green-400/20 text-green-100",
          badge: "bg-green-400/20 text-green-100",
        };
      case "medium":
        return {
          bg: "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
          icon: "bg-blue-400/20 text-blue-100",
          badge: "bg-blue-400/20 text-blue-100",
        };
      case "long":
        return {
          bg: "from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700",
          icon: "bg-purple-400/20 text-purple-100",
          badge: "bg-purple-400/20 text-purple-100",
        };
      default:
        return {
          bg: "from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
          icon: "bg-gray-400/20 text-gray-100",
          badge: "bg-gray-400/20 text-gray-100",
        };
    }
  };

  const colors = getSessionColors(type);

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isLoading}
      className={`
        w-full py-8 px-5 rounded-lg text-white text-left
        bg-gradient-to-br ${colors.bg} shadow-lg hover:shadow-xl relative
        transform transition-all duration-300 ease-out hover:scale-105 
        hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-offset-2 
        focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed 
        disabled:transform-none group cursor-pointer 
      `}
      aria-label={`Start ${label} session with ${questionCount} questions`}
    >
      {/* ICON */}
      <div className={`p-3 rounded-xl absolute top-6 right-6 ${colors.icon}`}>
        {getSessionIcon(type)}
      </div>

      {/* CONTENT */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm uppercase font-bold">{label}</h3>
          <p className="text-2xl font-bold mb-1">{questionCount} Questions</p>
          <p className="text-sm opacity-80 leading-relaxed">{description}</p>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-2">
          <div
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}
          >
            <Clock className="size-3" />
            {estimatedTime}
          </div>

          {difficulty && (
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge} capitalize`}
            >
              {difficulty}
            </div>
          )}
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}
