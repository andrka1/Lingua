import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FlashcardsPage from "./pages/FlashcardsPage";
import QuizPage from "./pages/QuizPage";
import SpellingPage from "./pages/SpellingPage";
import VerbFormsPage from "./pages/VerbFormsPage";
import SentenceBuilderPage from "./pages/SentenceBuilderPage";
import GrammarPage from "./pages/GrammarPage";
import TensesPage from "./pages/TensesPage";
import IrregularsPage from "./pages/IrregularsPage";
import WordsManagerPage from "./pages/WordsManagerPage";
import SettingsPage from "./pages/SettingsPage";
import BottomNav from "./components/BottomNav";
import Onboarding from "./components/Onboarding";

const ONBOARDING_KEY = "lingua_mini_onboarding_seen_v1";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem(ONBOARDING_KEY)
  );

  if (showOnboarding) {
    return (
      <Onboarding
        onDone={() => {
          try {
            localStorage.setItem(ONBOARDING_KEY, "1");
          } catch {
            // localStorage недоступен — просто продолжаем
          }
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative">
      <main className="flex-1 pb-20 overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/flashcards/:category" element={<FlashcardsPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/spelling" element={<SpellingPage />} />
          <Route path="/grammar" element={<GrammarPage />} />
          <Route path="/grammar/tenses" element={<TensesPage />} />
          <Route path="/grammar/verb-forms" element={<VerbFormsPage />} />
          <Route path="/grammar/builder" element={<SentenceBuilderPage />} />
          <Route path="/grammar/irregulars" element={<IrregularsPage />} />
          <Route path="/grammar/exceptions" element={<IrregularsPage />} />
          <Route path="/words" element={<WordsManagerPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
