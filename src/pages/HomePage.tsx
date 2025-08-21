import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import chaptersData from "../data/chapters.json";
import { ExamSection, HomeCard } from "../components/home";
import { Clock, BookOpen } from "lucide-react";
import { SectionWrapper } from "../components/ui";

export default function HomePage() {
  const navigate = useNavigate();
  const { availableChapters, comingSoonChapters } = useMemo(() => {
    const available = chaptersData.chapters.filter(
      (chapter) => !chapter.isComingSoon
    );
    const comingSoon = chaptersData.chapters.filter(
      (chapter) => chapter.isComingSoon
    );
    return { availableChapters: available, comingSoonChapters: comingSoon };
  }, []);

  const handleChapterClick = useMemo(() => {
    return (chapterId: string) => {
      navigate(`/session/${chapterId}`);
    };
  }, [navigate]);

  return (
    <SectionWrapper>
      <div className="relative">
        {/* HERO SECTION */}
        <header className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 capitalize bg-white/80 backdrop-blur-sm text-blue-500 px-6 py-3 rounded-md text-sm font-medium tracking-wider mb-8 shadow-sm">
              <BookOpen className="w-4 h-4" />
              international software testing qualifications board
            </div>

            <h1 className="relative text-5xl md:text-6xl font-bold mb-6 max-w-lg md:max-w-xl mx-auto bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
              <span>
                Certified Tester <br /> Foundation Level
              </span>
              <span className="absolute top-0 right-0 text-[10px] md:text-xs px-3 py-1 rounded-sm md:rounded-md ml-2 text-white bg-blue-500/90 align-top">
                v 4.0
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
              Practice with purpose. Get exam-style questions, instant feedback,
              and personalized insights to ace your certification without the
              hassle of sign-ups.
            </p>
          </div>
        </header>

        {/* CHAPTER SECTION */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
          {/* AVAILABLE CHAPTERS SECTION */}
          <section>
            <div className="flex flex-wrap gap-8 justify-center">
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center"> */}
              {availableChapters.map((chapter) => (
                <HomeCard
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
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8 flex items-center gap-3 capitalize">
              <Clock className="size-6 text-gray-500" />
              coming soon
            </h2>

            <div className="flex flex-wrap gap-8 justify-center">
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center"> */}
              {comingSoonChapters.map((chapter) => (
                <HomeCard
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

          {/* EXAM SECTION */}
          <ExamSection />
        </main>
      </div>
    </SectionWrapper>
  );
}
