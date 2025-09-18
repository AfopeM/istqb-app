import { SectionWrapper, Tagline } from "../components/ui";
import {
  ExamSection,
  ChapterSection,
  MindvaultSection,
} from "../components/home";

export default function HomePage() {
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
          <MindvaultSection />

          {/* CHAPTER SECTION */}
          <ChapterSection />

          {/* EXAM SECTION */}
          <ExamSection />
        </main>
      </div>
    </SectionWrapper>
  );
}
