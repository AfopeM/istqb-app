import { useMemo } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import chaptersData from "../../data/chapters.json";
import { ChapterCard } from ".";

export default function ChapterSection() {
  const navigate = useNavigate();
  const { availableChapters, comingSoonChapters } = useMemo(() => {
    const available = chaptersData.chapters.filter(
      (chapter) => !chapter.isComingSoon,
    );
    const comingSoon = chaptersData.chapters.filter(
      (chapter) => chapter.isComingSoon,
    );
    return { availableChapters: available, comingSoonChapters: comingSoon };
  }, []);

  const handleChapterClick = useMemo(() => {
    return (chapterId: string) => {
      navigate(`/quiz/${chapterId}`);
    };
  }, [navigate]);

  return (
    <>
      {/* AVAILABLE CHAPTERS SECTION */}
      <section>
        <div className="flex flex-wrap justify-center gap-8">
          {availableChapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              id={chapter.id}
              title={chapter.title}
              img={chapter.img}
              onClick={handleChapterClick}
              description={chapter.description}
              isComingSoon={chapter.isComingSoon}
            />
          ))}
        </div>
      </section>

      {/* COMING SOON SECTION */}
      <section>
        <h2 className="mx-auto mb-8 flex max-w-3xl items-center gap-3 text-2xl font-bold text-gray-700 capitalize">
          <Clock className="size-6 text-gray-500" />
          coming soon
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {comingSoonChapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              id={chapter.id}
              title={chapter.title}
              img={chapter.img}
              onClick={handleChapterClick}
              description={chapter.description}
              isComingSoon={chapter.isComingSoon}
            />
          ))}
        </div>
      </section>
    </>
  );
}
