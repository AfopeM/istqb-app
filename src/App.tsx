import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  QuizPage,
  ReviewPage,
  SessionPage,
  MindVaultPage,
  PerformancePage,
} from "./pages";

export default function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/MindVault" element={<MindVaultPage />} />
        <Route path="/quiz/:chapterId" element={<QuizPage />} />
        <Route path="/session/:chapterId" element={<SessionPage />} />
        <Route path="/performance/:chapterId" element={<PerformancePage />} />
        <Route path="/review/:chapterId" element={<ReviewPage />} />
      </Routes>
    </main>
  );
}
