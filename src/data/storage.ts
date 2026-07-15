// Unified progress tracking: spaced repetition + word of day (v10)
// merged with word exclusion + grammar results + app settings.
// (Audio / TTS has been fully removed from the app.)

export interface QuizResult {
  date: string;
  correct: number;
  total: number;
  category: string;
}

export interface GrammarResult {
  date: string;
  correct: number;
  total: number;
  topic: string; // "tenses" | "irregulars" | tense id
}

export type Accent = "en-US" | "en-GB";

export interface AppSettings {
  accent: Accent;
  rate: number; // kept for backward compatibility
  autoSpeak: boolean; // kept for backward compatibility
}

export interface UserProgress {
  dataVersion: number;
  learnedWords: number[];
  excludedWords: number[];
  quizResults: QuizResult[];
  grammarResults: GrammarResult[];
  irregularsLearned: string[];
  streak: number;
  lastActiveDate: string;
  totalWordsLearned: number;
  wordErrors: Record<number, number>; // wordId -> error count (spaced repetition)
  dailyGoal: number;
  wordsToday: number;
  lastWordOfDay: { id: number; date: string } | null;
  settings: AppSettings;
}

const STORAGE_KEY = "lingua_mini_progress";

const defaultSettings: AppSettings = {
  accent: "en-US",
  rate: 0.85,
  autoSpeak: false,
};

const defaultProgress: UserProgress = {
  dataVersion: 2,
  learnedWords: [],
  excludedWords: [],
  quizResults: [],
  grammarResults: [],
  irregularsLearned: [],
  streak: 0,
  lastActiveDate: "",
  totalWordsLearned: 0,
  wordErrors: {},
  dailyGoal: 10,
  wordsToday: 0,
  lastWordOfDay: null,
  settings: { ...defaultSettings },
};

export function getProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...defaultProgress, settings: { ...defaultSettings } };
    const parsed = JSON.parse(stored);
    // До версии 2 личные слова имели id 1–50 и пересекались с базовым словарём.
    if (!parsed.dataVersion || parsed.dataVersion < 2) {
      const moveId = (id: number) => (id >= 1 && id <= 50 ? id + 10_000 : id);
      parsed.learnedWords = (parsed.learnedWords || []).map(moveId);
      parsed.excludedWords = (parsed.excludedWords || []).map(moveId);
      parsed.wordErrors = Object.fromEntries(
        Object.entries(parsed.wordErrors || {}).map(([id, count]) => [moveId(Number(id)), count])
      );
      parsed.lastWordOfDay = null;
      parsed.dataVersion = 2;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return {
      ...defaultProgress,
      ...parsed,
      settings: { ...defaultSettings, ...(parsed.settings || {}) },
    };
  } catch {
    return { ...defaultProgress, settings: { ...defaultSettings } };
  }
}

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// ---- Learned words ----

export function markWordLearned(wordId: number): void {
  const progress = getProgress();
  if (!progress.learnedWords.includes(wordId)) {
    progress.learnedWords.push(wordId);
    progress.totalWordsLearned = progress.learnedWords.length;
  }
  const today = localDateKey();
  if (progress.lastActiveDate !== today) {
    progress.wordsToday = 1;
  } else {
    progress.wordsToday += 1;
  }
  updateStreak(progress);
  saveProgress(progress);
}

export function unmarkWordLearned(wordId: number): void {
  const progress = getProgress();
  progress.learnedWords = progress.learnedWords.filter((id) => id !== wordId);
  progress.totalWordsLearned = progress.learnedWords.length;
  saveProgress(progress);
}

export function isWordLearned(wordId: number): boolean {
  return getProgress().learnedWords.includes(wordId);
}

// ---- Word exclusion (hide words you already know) ----

export function isWordExcluded(wordId: number): boolean {
  return getProgress().excludedWords.includes(wordId);
}

export function excludeWord(wordId: number): void {
  const progress = getProgress();
  if (!progress.excludedWords.includes(wordId)) {
    progress.excludedWords.push(wordId);
  }
  saveProgress(progress);
}

export function includeWord(wordId: number): void {
  const progress = getProgress();
  progress.excludedWords = progress.excludedWords.filter((id) => id !== wordId);
  saveProgress(progress);
}

export function toggleWordExcluded(wordId: number): boolean {
  const progress = getProgress();
  const excluded = progress.excludedWords.includes(wordId);
  if (excluded) {
    progress.excludedWords = progress.excludedWords.filter((id) => id !== wordId);
  } else {
    progress.excludedWords.push(wordId);
  }
  saveProgress(progress);
  return !excluded;
}

export function excludeMany(wordIds: number[]): void {
  const progress = getProgress();
  const set = new Set(progress.excludedWords);
  wordIds.forEach((id) => set.add(id));
  progress.excludedWords = Array.from(set);
  saveProgress(progress);
}

export function clearExcluded(): void {
  const progress = getProgress();
  progress.excludedWords = [];
  saveProgress(progress);
}

export function getExcludedIds(): number[] {
  return getProgress().excludedWords;
}

// ---- Spaced repetition (error tracking) ----

export function recordWordError(wordId: number): void {
  const progress = getProgress();
  progress.wordErrors[wordId] = (progress.wordErrors[wordId] || 0) + 1;
  saveProgress(progress);
}

export function recordWordCorrect(wordId: number): void {
  const progress = getProgress();
  const current = progress.wordErrors[wordId];
  if (current === undefined) return;
  if (current <= 1) {
    delete progress.wordErrors[wordId];
  } else {
    progress.wordErrors[wordId] = current - 1;
  }
  saveProgress(progress);
}

export function getWordErrors(): Record<number, number> {
  return getProgress().wordErrors;
}

export function getWeakWordIds(): number[] {
  const errors = getProgress().wordErrors;
  return Object.keys(errors)
    .map(Number)
    .filter((id) => errors[id] > 0)
    .sort((a, b) => errors[b] - errors[a]);
}

// ---- Quiz & grammar results ----

export function saveQuizResult(correct: number, total: number, category: string): void {
  const progress = getProgress();
  progress.quizResults.push({
    date: localDateKey(),
    correct,
    total,
    category,
  });
  updateStreak(progress);
  saveProgress(progress);
}

export function saveGrammarResult(correct: number, total: number, topic: string): void {
  const progress = getProgress();
  progress.grammarResults.push({
    date: localDateKey(),
    correct,
    total,
    topic,
  });
  updateStreak(progress);
  saveProgress(progress);
}

export function markIrregularLearned(verbId: string): void {
  const progress = getProgress();
  if (!progress.irregularsLearned.includes(verbId)) {
    progress.irregularsLearned.push(verbId);
  }
  updateStreak(progress);
  saveProgress(progress);
}

// ---- Streak ----

function updateStreak(progress: UserProgress): void {
  const today = localDateKey();
  const yesterday = localDateKey(new Date(Date.now() - 86400000));

  if (progress.lastActiveDate === today) return;

  if (progress.lastActiveDate === yesterday) {
    progress.streak += 1;
  } else if (progress.lastActiveDate !== today) {
    progress.streak = 1;
  }

  progress.lastActiveDate = today;
}

export function getStreak(): number {
  const progress = getProgress();
  const today = localDateKey();
  const yesterday = localDateKey(new Date(Date.now() - 86400000));

  if (progress.lastActiveDate === today || progress.lastActiveDate === yesterday) {
    return progress.streak;
  }
  return 0;
}

// ---- App settings ----

export function getSettings(): AppSettings {
  return getProgress().settings;
}

export function saveSettings(partial: Partial<AppSettings>): AppSettings {
  const progress = getProgress();
  progress.settings = { ...progress.settings, ...partial };
  saveProgress(progress);
  return progress.settings;
}

export function setDailyGoal(goal: number): void {
  const progress = getProgress();
  progress.dailyGoal = goal;
  saveProgress(progress);
}

// ===================== Pronunciation =====================
export async function speak(text = "", langOverride?: string): Promise<void> {
  if (!text.trim() || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const settings = getSettings();
  utterance.lang = langOverride || settings.accent;
  utterance.rate = Math.min(1.2, Math.max(0.6, settings.rate || 0.9));
  window.speechSynthesis.speak(utterance);
}

// ---- Word of the day (skips learned and excluded) ----

export function getWordOfDay(words: { id: number }[]): number {
  if (words.length === 0) return -1;
  const progress = getProgress();
  const today = localDateKey();

  if (progress.lastWordOfDay && progress.lastWordOfDay.date === today) {
    return progress.lastWordOfDay.id;
  }

  const available = words
    .map((w) => w.id)
    .filter(
      (id) => !progress.learnedWords.includes(id) && !progress.excludedWords.includes(id)
    );

  const seed = today.split("-").reduce((a, b) => a + parseInt(b), 0);

  if (available.length === 0) {
    return words[seed % words.length].id;
  }

  const wordId = available[seed % available.length];
  progress.lastWordOfDay = { id: wordId, date: today };
  saveProgress(progress);
  return wordId;
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
