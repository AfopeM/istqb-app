import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionNavigationProps {
  totalQuestions: number;
  currentIndex: number;
  answeredQuestions: number[];
  onQuestionSelect: (index: number) => void;
}

export function QuestionNavigation({
  totalQuestions,
  currentIndex,
  answeredQuestions,
  onQuestionSelect,
}: QuestionNavigationProps) {
  const handleScroll = (direction: "left" | "right") => {
    const slider = document.getElementById("question-slider");
    if (slider) {
      slider.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="mb-6" aria-label="question-navigation">
      <div className="mb-4">
        <h3 className="mb-2 text-sm font-medium text-gray-600">
          Question Navigation
        </h3>

        <div className="flex h-12 items-stretch gap-2">
          <button
            onClick={() => handleScroll("left")}
            className="question-nav-button"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-6 text-gray-700" />
          </button>

          <div
            id="question-slider"
            className="hide-scrollbar flex flex-1 gap-2 overflow-x-auto scroll-smooth"
          >
            {Array.from({ length: totalQuestions }, (_, index) => (
              <button
                key={index}
                onClick={() => onQuestionSelect(index)}
                className={`question-number-button ${
                  currentIndex === index
                    ? "question-number-button--current"
                    : answeredQuestions[index] !== undefined
                      ? "question-number-button--answered"
                      : "question-number-button--unanswered"
                }`}
                aria-label={`Question ${index + 1}${
                  answeredQuestions[index] !== undefined ? " (Answered)" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleScroll("right")}
            className="question-nav-button"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
