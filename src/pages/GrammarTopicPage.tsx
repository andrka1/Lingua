import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { grammarTopics } from "../data/grammarTopics";
import { GrammarExercise } from "../data/grammar";
import { saveGrammarResult, speak } from "../data/storage";
import GrammarExerciseCard from "../components/GrammarExerciseCard";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Tab = "rules" | "practice";
type PracticeView = "setup" | "playing" | "results";

export default function GrammarTopicPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const topic = grammarTopics.find((t) => t.id === id);

  const [tab, setTab] = useState<Tab>("rules");
  const [pv, setPv] = useState<PracticeView>("setup");
  const [count, setCount] = useState(10);
  const [items, setItems] = useState<GrammarExercise[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  if (!topic) {
    return (
      <div className="px-5 pt-8 pb-4 animate-fade-in">
        <button
          onClick={() => navigate("/grammar")}
          className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-300"
        >
          ←
        </button>
        <p className="text-slate-400 mt-6">Тема не найдена.</p>
      </div>
    );
  }

  const maxQ = topic.exercises.length;
  const counts = Array.from(
    new Set([5, 10, 15, maxQ].filter((n) => n > 0 && n <= maxQ))
  );

  const start = () => {
    setItems(shuffle(topic.exercises).slice(0, count));
    setCurrent(0);
    setScore(0);
    setPv("playing");
  };

  const handleAnswer = (correct: boolean) => {
    const finalScore = correct ? score + 1 : score;
    if (correct) setScore(finalScore);
    const next = current + 1;
    if (next >= items.length) {
      saveGrammarResult(finalScore, items.length, topic.id);
      setPv("results");
    } else {
      setCurrent(next);
    }
  };

  const percent = items.length ? Math.round((score / items.length) * 100) : 0;

  return (
    <div className="px-5 pt-8 pb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate("/grammar")}
          className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-300 hover:text-white"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{topic.emoji}</span>
          <div>
            <h1 className="text-xl font-display font-bold text-white">{topic.title}</h1>
            <p className="text-xs text-slate-400">{topic.intro}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {([
          ["rules", "Правила"],
          ["practice", "Тренировка"],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              if (key === "practice") setPv("setup");
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === key
                ? "bg-brand-500 text-white"
                : "bg-slate-800 text-slate-400 border border-slate-700/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Rules */}
      {tab === "rules" && (
        <div className="space-y-3">
          {topic.rules.map((rule, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/40"
            >
              <h3 className="font-semibold text-white mb-1">{rule.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{rule.body}</p>
              {rule.examples && (
                <div className="mt-3 space-y-1.5">
                  {rule.examples.map((ex, j) => (
                    <button
                      key={j}
                      onClick={() => speak(ex.en, "en-US")}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-700/30 active:scale-[0.99]"
                    >
                      <span className="text-brand-300">🔊</span>
                      <span className="flex-1">
                        <span className="text-white font-medium">{ex.en}</span>
                        <span className="block text-[12px] text-slate-500">{ex.ru}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              setTab("practice");
              setPv("setup");
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold transition-all active:scale-[0.98] shadow-soft"
          >
            Перейти к тренировке →
          </button>
        </div>
      )}

      {/* Practice: setup */}
      {tab === "practice" && pv === "setup" && (
        <div>
          <p className="text-sm text-slate-400 mb-4">
            Выбери правильный вариант в пропуск. Всего доступно {maxQ} заданий.
          </p>
          <label className="text-sm font-medium text-slate-300 mb-3 block">
            Количество вопросов
          </label>
          <div className="flex gap-2 mb-8">
            {counts.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  count === n
                    ? "bg-brand-500 text-white"
                    : "bg-slate-800 text-slate-400 border border-slate-700/50"
                }`}
              >
                {n === maxQ ? "Все" : n}
              </button>
            ))}
          </div>
          <button
            onClick={start}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-lg transition-all active:scale-[0.98] shadow-soft"
          >
            Начать 🚀
          </button>
        </div>
      )}

      {/* Practice: playing */}
      {tab === "practice" && pv === "playing" && items[current] && (
        <GrammarExerciseCard
          exercise={items[current]}
          questionNum={current + 1}
          totalQuestions={items.length}
          onAnswer={handleAnswer}
        />
      )}

      {/* Practice: results */}
      {tab === "practice" && pv === "results" && (
        <div className="animate-slide-up flex flex-col items-center">
          <div className="w-full max-w-sm text-center">
            <div className="text-7xl mb-4">
              {percent >= 90 ? "🏆" : percent >= 70 ? "🎉" : percent >= 50 ? "👍" : "💪"}
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">
              {percent >= 70 ? "Отлично!" : "Тренируйся ещё!"}
            </h2>
            <div className="mt-6 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/40">
              <div className="text-5xl font-bold text-brand-400 mb-1">
                {score}/{items.length}
              </div>
              <p className="text-sm text-slate-400">правильных ответов</p>
              <div className="mt-4 w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    percent >= 70 ? "bg-emerald-500" : percent >= 50 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">{percent}% верно</p>
            </div>
            <button
              onClick={start}
              className="w-full mt-8 py-3.5 rounded-2xl bg-brand-500 text-white font-medium transition-all active:scale-95"
            >
              Ещё раз 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
