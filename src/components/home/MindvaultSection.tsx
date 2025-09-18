import { useNavigate } from "react-router-dom";
import { Brain, BookMarked } from "lucide-react";

export default function MindvaultSection() {
  const navigate = useNavigate();
  return (
    <section className="relative mx-auto max-w-lg md:max-w-2xl">
      <div
        onClick={() => navigate("/MindVault")}
        className="cursor-pointer rounded-2xl bg-blue-100 p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Brain className="size-8 text-blue-500" />
              <h2 className="text-2xl font-bold text-blue-500">MindVault</h2>
            </div>
            <p className="mb-6 text-gray-500">
              lets you track learning progress by saving questions you want to
              revisit or questions you failed during a quiz, organized by
              chapter for easy review.
            </p>
            <div className="flex items-center gap-2 text-blue-500">
              <BookMarked className="size-5" />
              <span className="font-medium">Access your saved questions</span>
            </div>
          </div>
          <div className="absolute top-8 right-8 hidden opacity-10 md:block">
            <Brain className="size-32 text-blue-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
