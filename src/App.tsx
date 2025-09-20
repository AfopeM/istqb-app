import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  QuizPage,
  ExamPage,
  ExamReviewPage,
  QuizReviewPage,
  QuizQuestionsPage,
  MindVaultPage,
  MindVaultQuestionsPage,
  MindVaultReviewPage,
  PerformancePage,
} from "./pages";

export default function App() {
  return (
    <main>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<HomePage />} />

        {/* MINDVAULT */}
        <Route path="/MindVault" element={<MindVaultPage />} />
        <Route
          path="/mindvault/mindvaultquiz/:chapterId"
          element={<MindVaultQuestionsPage />}
        />
        <Route
          path="/mindvault/mindvaultreview/:chapterId"
          element={<MindVaultReviewPage />}
        />

        {/* QUIZ */}
        <Route path="/quiz/:chapterId" element={<QuizPage />} />
        <Route
          path="/quizquestions/:chapterId"
          element={<QuizQuestionsPage />}
        />
        <Route path="/performance/:chapterId" element={<PerformancePage />} />
        <Route path="/review/:chapterId" element={<QuizReviewPage />} />

        {/* EXAM */}
        <Route path="/exam/:examId" element={<ExamPage />} />
        <Route path="/exam-review/:examId" element={<ExamReviewPage />} />
      </Routes>
    </main>
  );
}
