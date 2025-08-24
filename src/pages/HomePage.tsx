import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import chaptersData from "../data/chapters.json";
import { ExamSection, HomeCard } from "../components/home";
import { Clock, Brain, BookMarked } from "lucide-react";
import { SectionWrapper, Tagline } from "../components/ui";

export default function HomePage() {
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
      navigate(`/session/${chapterId}`);
    };
  }, [navigate]);

  return (
    <SectionWrapper className="px-8 md:px-0">
      <div className="relative">
        {/* HERO SECTION */}
        <header className="mx-auto mt-20 mb-12 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="relative mx-auto mb-4 max-w-lg text-gray-900 md:max-w-xl">
            <Tagline className="mx-auto mb-4 w-fit text-[10px] md:rounded-md md:text-xs">
              version 4.0
            </Tagline>
            <span className="block text-4xl font-black md:text-6xl">
              Certified Tester Foundation Level
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl">
            Practice with purpose. Get exam-style questions, instant feedback,
            and personalized insights to ace your certification without the
            hassle of sign-ups.
          </p>
        </header>

        {/* CHAPTER SECTION */}
        <main className="mx-auto max-w-7xl space-y-16 px-4 pb-20 sm:px-6 lg:px-8">
          {/* MINDVAULT SECTION */}
          <section className="relative">
            <div
              onClick={() => navigate("/MindVault")}
              className="cursor-pointer rounded-2xl bg-blue-100 p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Brain className="size-8 text-blue-500" />
                    <h2 className="text-2xl font-bold text-blue-500">
                      MindVault
                    </h2>
                  </div>
                  <p className="mb-6 max-w-lg text-gray-500">
                    lets you track learning progress by saving questions you
                    want to revisit or questions you failed during a quiz,
                    organized by chapter for easy review.
                  </p>
                  <div className="flex items-center gap-2 text-blue-500">
                    <BookMarked className="size-5" />
                    <span className="font-medium">
                      Access your saved questions
                    </span>
                  </div>
                </div>
                <div className="absolute top-4 right-8 hidden opacity-10 md:block">
                  <Brain className="size-32 text-blue-500" />
                </div>
              </div>
            </div>
          </section>

          {/* AVAILABLE CHAPTERS SECTION */}
          <section>
            <div className="flex flex-wrap justify-center gap-8">
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
            <h2 className="mb-8 flex items-center gap-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-2xl font-bold text-transparent capitalize">
              <Clock className="size-6 text-gray-500" />
              coming soon
            </h2>

            <div className="flex flex-wrap justify-center gap-8">
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
