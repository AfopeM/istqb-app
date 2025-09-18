import ExamCard from "./ExamCard";
import { cn } from "../../lib/utils";
import examData from "../../data/exams.json";
import { GraduationCap } from "lucide-react";
import type { Exam } from "../../types/exam";

interface Props {
  className?: string;
}

export default function ExamSection({ className = "" }: Props) {
  return (
    <section
      className={cn(
        `relative overflow-hidden rounded-xl bg-blue-500/15 p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-sm`,
        className,
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_50%_50%,rgba(147,197,253,0.1),transparent)]" />

      <div className="relative">
        <div className="mb-10 text-center">
          <GraduationCap className="mx-auto mb-2 size-14 stroke-2 text-blue-500" />
          <h2 className="mb-1 text-2xl font-bold text-blue-500 uppercase">
            Available Exams
          </h2>
          <p className="text-lg text-gray-500">
            Choose an exam to start practicing
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {examData.exams.map((exam: Exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </div>
    </section>
  );
}
