import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  QuizPage,
  MindVaultPage,
  SessionPage,
  PerformancePage,
  ReviewPage,
} from "./pages";

export default function App() {
  return (
    <main className="bg-gray-50 min-h-screen font-sans">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/MindVault" element={<MindVaultPage />} />
        <Route path="/quiz/:chapterId" element={<QuizPage />} />
        <Route path="/session/:chapterId" element={<SessionPage />} />
        <Route path="/performance/:chapterId" element={<PerformancePage />} />
        <Route path="/review/:chapterId" element={<ReviewPage />} />
        {/* We will add /exam and /results routes later */}
      </Routes>
    </main>
  );
}
