import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { irregularVerbs, irregularPlurals, IrregularVerb } from "../data/irregulars";
import { GrammarExercise } from "../data/grammar";
import { saveGrammarResult, markIrregularLearned } from "../data/storage";
import GrammarExerciseCard from "../components/GrammarExerciseCard";

type Tab = "verbs" | "practice" | "write" | "plurals";
type PracticeView = "setup" | "playing" | "results";

const WRITE_SESSION = 10;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, "");
}

// Принимаем полную строку или любой вариант через слэш (напр. "was/were").
function matches(input: string, correct: string): boolean {
  const inp = normalize(input);
  if (!inp) return false;
  if (inp === normalize(correct)) return true;
  return correct.split("/").map((v) => normalize(v)).some((v) => v === inp);
}

// Собираем вопросы с выбором из вариантов по неправильным глаголам.
function buildQuestions(n: number): GrammarExercise[] {
  const verbs = shuffle(irregularVerbs).slice(0, n);
  return verbs.map((v, idx) => {
    const askParticiple = Math.random() > 0.5;
    const correct = askParticiple ? v.participle : v.past;
    const field = askParticiple ? "participle" : "past";

    const distractors: string[] = [];
    const seen = new Set<string>([correct]);
    for (const other of shuffle(irregularVerbs)) {
      const val = other[field as "past" | "participle"];
      if (!seen.has(val)) {
        seen.add(val);
        distractors.push(val);
      }
      if (distractors.length >= 3) break;
    }

    const options = shuffle([correct, ...distractors]);
    return {
      id: idx + 1,
      tenseId: "irregulars",
      sentence: `${v.base} → ___`,
      hint: `${v.ru} · ${askParticiple ? "Past Participle (V3)" : "Past Simple (V2)"}`,
      options,
      answer: options.indexOf(correct),
      explanation: `${v.base} – ${v.past} – ${v.participle}`,
    };
  });
}

export default function IrregularsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState<Tab>(
    location.pathname.includes("exceptions") ? "plurals" : "verbs"
  );

  // Тест (выбор вариантов)
  const [pv, setPv] = useState<PracticeView>("setup");
  const [count, setCount] = useState(10);
  const [items, setItems] = useState<GrammarExercise[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  // Впиши формы (ввод руками)
  const [wDeck, setWDeck] = useState<IrregularVerb[]>([]);
  const [wIndex, setWIndex] = useState(0);
  const [wPast, setWPast] = useState("");
  const [wPart, setWPart] = useState("");
  const [wChecked, setWChecked] = useState(false);
  const [wCorrect, setWCorrect] = useState(0);
  const [wFinished, setWFinished] = useState(false);

  const start = () => {
    setItems(buildQuestions(count));
    setCurrent(0);
    setScore(0);
    setPv("playing");
  };

  const handleAnswer = (correct: boolean) => {
    const finalScore = correct ? score + 1 : score;
    if (correct) setScore(finalScore);
    const next = current + 1;
    if (next >= items.length) {
      saveGrammarResult(finalScore, items.length, "irregulars");
      setPv("results");
    } else {
      setCurrent(next);
    }
  };

  const percent = items.length ? Math.round((score / items.length) * 100) : 0;

  // --- Впиши формы ---
  const startWrite = () => {
    setWDeck(shuffle(irregularVerbs).slice(0, WRITE_SESSION));
    setWIndex(0);
    setWPast("");
    setWPart("");
    setWChecked(false);
    setWCorrect(0);
    setWFinished(false);
  };

  const openWriteTab = () => {
    setTab("write");
    if (wDeck.length === 0 || wFinished) startWrite();
  };

  const wVerb = wDeck[wIndex];
  const wPastOk = wVerb ? matches(wPast, wVerb.past) : false;
  const wPartOk = wVerb ? matches(wPart, wVerb.participle) : false;
  const wBothOk = wPastOk && wPartOk;

  const wCheck = () => {
    if (wChecked) return;
    setWChecked(true);
    if (wBothOk) {
      setWCorrect((c) => c + 1);
      markIrregularLearned(wVerb.id);
    }
  };

  const wNext = () => {
    if (wIndex + 1 >= wDeck.length) {
      saveGrammarResult(wCorrect, wDeck.length, "verb-forms");
      setWFinished(true);
      return;
    }
    setWIndex((i) => i + 1);
    setWPast("");
    setWPart("");
    setWChecked(false);
  };
  const wPct = wDeck.length ? Math.round((wCorrect / wDeck.length) * 100) : 0;

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
        <div>
          <h1 className="text-xl font-display font-bold text-white">
            Неправильные глаголы
          </h1>
          <p className="text-xs text-slate-400">список · тест · впиши формы · исключения</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {([
          ["verbs", "Список"],
          ["practice", "Тест"],
          ["write", "Формы"],
          ["plurals", "Множ."],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              if (key === "practice") {
                setTab("practice");
                setPv("setup");
              } else if (key === "write") {
                openWriteTab();
              } else {
                setTab(key);
              }
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
              tab === key
                ? "bg-brand-500 text-white"
                : "bg-slate-800 text-slate-400 border border-slate-700/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Verbs table */}
      {tab === "verbs" && (
        <div className="rounded-2xl overflow-hidden border border-slate-700/40">
          <div className="grid grid-cols-[1fr_1fr_1fr] bg-slate-800 text-xs font-semibold text-slate-300 px-3 py-2.5">
            <span>Infinitive</span>
            <span>Past (V2)</span>
            <span>V3 / перевод</span>
          </div>
          <div className="divide-y divide-slate-800">
            {irregularVerbs.map((v) => (
              <div
                key={v.id}
                className="grid grid-cols-[1fr_1fr_1fr] px-3 py-2.5 text-sm bg-slate-900/30"
              >
                <span className="text-white font-medium">{v.base}</span>
                <span className="text-brand-300">{v.past}</span>
                <span className="text-slate-300">
                  {v.participle}
                  <span className="block text-[11px] text-slate-500">{v.ru}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plurals / exceptions table */}
      {tab === "plurals" && (
        <div>
          <p className="text-sm text-slate-400 mb-3">
            Существительные с особым множественным числом — их нужно запомнить.
          </p>
          <div className="rounded-2xl overflow-hidden border border-slate-700/40">
            <div className="grid grid-cols-[1fr_1fr_1.2fr] bg-slate-800 text-xs font-semibold text-slate-300 px-3 py-2.5">
              <span>Singular</span>
              <span>Plural</span>
              <span>Перевод</span>
            </div>
            <div className="divide-y divide-slate-800">
              {irregularPlurals.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[1fr_1fr_1.2fr] px-3 py-2.5 text-sm bg-slate-900/30"
                >
                  <span className="text-white font-medium">{p.singular}</span>
                  <span className="text-brand-300">{p.plural}</span>
                  <span className="text-slate-400 text-[12px]">{p.ru}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Practice (multiple choice) */}
      {tab === "practice" && pv === "setup" && (
        <div>
          <p className="text-sm text-slate-400 mb-4">
            Выбери правильную форму глагола (Past / V3).
          </p>
          <label className="text-sm font-medium text-slate-300 mb-3 block">
            Количество вопросов
          </label>
          <div className="flex gap-2 mb-8">
            {[5, 10, 15, 20].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  count === n
                    ? "bg-brand-500 text-white"
                    : "bg-slate-800 text-slate-400 border border-slate-700/50"
                }`}
              >
                {n}
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

      {tab === "practice" && pv === "playing" && items[current] && (
        <GrammarExerciseCard
          exercise={items[current]}
          questionNum={current + 1}
          totalQuestions={items.length}
          onAnswer={handleAnswer}
        />
      )}

      {tab === "practice" && pv === "results" && (
        <div className="animate-slide-up flex flex-col items-center">
          <div className="w-full max-w-sm text-center">
            <div className="text-7xl mb-4">
              {percent >= 90 ? "🏆" : percent >= 70 ? "🎉" : percent >= 50 ? "👍" : "💪"}
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">
              {percent >= 70 ? "Молодец!" : "Тренируйся ещё!"}
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

      {/* Write forms (typing) */}
      {tab === "write" && !wFinished && wVerb && (
        <div className="flex flex-col">
          <p className="text-sm text-slate-400 mb-3">
            Впиши формы V2 и V3 · {wIndex + 1}/{wDeck.length}
          </p>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden mb-6">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${Math.round((wIndex / wDeck.length) * 100)}%` }}
            />
          </div>

          <div className="rounded-3xl bg-slate-800/60 p-6 mb-4 text-center">
            <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2">Инфинитив (V1)</p>
            <h2 className="text-3xl font-display font-bold text-white mb-1">{wVerb.base}</h2>
            <p className="text-sm text-slate-400">{wVerb.ru}</p>
          </div>

          <label className="text-xs text-slate-400 mb-1 block">Прошедшее (V2 — Past Simple)</label>
          <input
            value={wPast}
            onChange={(e) => setWPast(e.target.value)}
            disabled={wChecked}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="например, went"
            className={
              "w-full mb-3 px-4 py-3 rounded-xl bg-slate-800 border text-white text-lg outline-none transition-all " +
              (wChecked ? (wPastOk ? "border-emerald-500" : "border-red-500") : "border-slate-700/50 focus:border-emerald-500")
            }
          />

          <label className="text-xs text-slate-400 mb-1 block">Причастие (V3 — Past Participle)</label>
          <input
            value={wPart}
            onChange={(e) => setWPart(e.target.value)}
            disabled={wChecked}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="например, gone"
            className={
              "w-full mb-4 px-4 py-3 rounded-xl bg-slate-800 border text-white text-lg outline-none transition-all " +
              (wChecked ? (wPartOk ? "border-emerald-500" : "border-red-500") : "border-slate-700/50 focus:border-emerald-500")
            }
          />

          {wChecked && !wBothOk && (
            <div className="mb-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/40 text-sm">
              <p className="text-slate-300">
                Правильно:{" "}
                <span className="text-emerald-400 font-semibold">
                  {wVerb.base} — {wVerb.past} — {wVerb.participle}
                </span>
              </p>
            </div>
          )}
          {wChecked && wBothOk && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-300">
              Верно! 🎉
            </div>
          )}

          {!wChecked ? (
            <button
              onClick={wCheck}
              disabled={!wPast && !wPart}
              className="w-full py-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold text-lg active:scale-[0.97] transition-all shadow-soft disabled:opacity-40"
            >
              Проверить
            </button>
          ) : (
            <button
              onClick={wNext}
              className="w-full py-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold text-lg active:scale-[0.97] transition-all shadow-soft"
            >
              {wIndex + 1 >= wDeck.length ? "Завершить" : "Дальше"}
            </button>
          )}
        </div>
      )}

      {tab === "write" && wFinished && (
        <div className="animate-slide-up flex flex-col items-center">
          <div className="w-full max-w-sm text-center">
            <div className="text-7xl mb-4">{wPct >= 80 ? "🎉" : "💪"}</div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Готово!</h2>
            <div className="text-5xl font-display font-bold text-emerald-400 my-4">
              {wCorrect}/{wDeck.length}
            </div>
            <p className="text-slate-400 text-sm mb-8">Правильных форм глаголов</p>
            <button
              onClick={startWrite}
              className="w-full py-3.5 rounded-2xl bg-brand-500 text-white font-medium transition-all active:scale-95"
            >
              Ещё раз 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
