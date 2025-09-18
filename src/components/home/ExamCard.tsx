import { Link } from "react-router-dom";
import type { Exam } from "../../types/exam";
import { Clock, BookOpen, ArrowRight } from "lucide-react";

export default function ExamCard({ exam }: { exam: Exam }) {
  return (
    <Link
      to={`/exam/${exam.id}`}
      className="block rounded-xl bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <h3 className="mb-1 text-2xl font-black text-gray-900 uppercase">
        {exam.title}
      </h3>

      <p className="mb-4 text-gray-600">{exam.description}</p>

      <div className="flex items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Clock className="size-4" />
          <span>{exam.duration} mins</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="size-4" />
          <span>{exam.numberOfQuestions} questions</span>
        </div>
      </div>

      <div className="mt-6 flex items-center font-medium text-blue-500">
        Start Exam
        <ArrowRight className="ml-2 size-4" />
      </div>
    </Link>
  );
}
