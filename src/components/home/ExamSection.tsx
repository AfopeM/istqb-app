import { Clock } from "lucide-react";
import { cn } from "../../lib/utils";

interface Props {
  className?: string;
}

export default function ExamSection({ className = "" }: Props) {
  return (
    <section
      className={cn(
        `backdrop-blur-lg bg-gradient-to-r from-indigo-500/25 to-blue-500/25 
         rounded-lg p-10  relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)]`,
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_50%_50%,rgba(147,197,253,0.1),transparent)]" />

      <div className="relative text-center">
        <Clock className="size-14 stroke-3 text-indigo-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold uppercase bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-1">
          Full Practice Exam
        </h2>
        <p className="text-gray-600/90 mb-4 text-lg">
          Complete exam simulation coming soon
        </p>
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm text-indigo-500/70 px-6 py-3 rounded-lg text-sm font-medium shadow-sm">
          <Clock className="size-4" />
          In Development
        </div>
      </div>
    </section>
  );
}
