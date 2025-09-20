import { Timer } from "lucide-react";
import { formatTime } from "../../utils/exam";
import "../../styles/exam.css";

interface ExamTimerProps {
  timeRemaining: number;
}

export function ExamTimer({ timeRemaining }: ExamTimerProps) {
  return (
    <div
      className={`exam-timer ${timeRemaining < 300 ? "exam-timer--warning" : ""}`}
    >
      <Timer className="size-5 text-blue-500" />
      <span>{formatTime(timeRemaining)}</span>
    </div>
  );
}
