import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  QuizPage,
  ReviewPage,
  SessionPage,
  MindVaultPage,
  MindVaultQuiz,
  MindVaultReview,
  PerformancePage,
} from "./pages";

export default function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/MindVault" element={<MindVaultPage />} />
        <Route
          path="/mindvault/mindvaultquiz/:chapterId"
          element={<MindVaultQuiz />}
        />
        <Route
          path="/mindvault/mindvaultreview/:chapterId"
          element={<MindVaultReview />}
        />
        <Route path="/mindvault/review/:chapterId" element={<ReviewPage />} />
        <Route path="/quiz/:chapterId" element={<QuizPage />} />
        <Route path="/session/:chapterId" element={<SessionPage />} />
        <Route path="/performance/:chapterId" element={<PerformancePage />} />
        <Route path="/review/:chapterId" element={<ReviewPage />} />
      </Routes>
    </main>
  );
}
