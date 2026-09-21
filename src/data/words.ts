import type { Word, Category } from "./types";
import { categories } from "./categories";
import { myWords } from "./words-my";
import { baseWords } from "./baseWords";

export type { Word, Category };
export { categories };

const USER_WORDS_KEY = "lingua_mini_user_words_v1";
const PERSONAL_OFFSET = 10_000;
const USER_OFFSET = 1_000_000;

function normalizeWord(value: Partial<Word>, id: number): Word {
  const level = ["A1", "A2", "B1", "B2", "C1", "C2"].includes(value.level || "")
    ? (value.level as Word["level"])
    : "A1";
  const category = categories.some((item) => item.id === value.category)
    ? value.category!
    : "basics";
  return {
    id,
    en: String(value.en || "").trim(),
    ru: String(value.ru || "").trim(),
    transcription: String(value.transcription || "").trim(),
    example: String(value.example || "").trim(),
    category,
    level,
    note: String(value.note || "").trim() || undefined,
  };
}

export function getUserWords(): Word[] {
  try {
    const raw = localStorage.getItem(USER_WORDS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item, index) => normalizeWord(item, Number(item.id) || USER_OFFSET + index + 1))
      .filter((item) => item.en && item.ru);
  } catch {
    return [];
  }
}

function saveUserWords(items: Word[]) {
  localStorage.setItem(USER_WORDS_KEY, JSON.stringify(items));
}

function buildWords(): Word[] {
  const personal = myWords.map((item) => ({ ...item, id: PERSONAL_OFFSET + item.id }));
  return [...baseWords, ...personal, ...getUserWords()];
}

export let words: Word[] = buildWords();

export function refreshWords(): Word[] {
  words = buildWords();
  return words;
}

export function isUserWord(id: number): boolean {
  return id >= USER_OFFSET;
}

export function addUserWord(value: Omit<Word, "id">): Word {
  const current = getUserWords();
  const nextId = Math.max(USER_OFFSET, ...current.map((item) => item.id)) + 1;
  const word = normalizeWord(value, nextId);
  if (!word.en || !word.ru) throw new Error("Заполни слово и перевод");
  if (words.some((item) => item.en.toLowerCase() === word.en.toLowerCase())) {
    throw new Error("Такое слово уже есть в словаре");
  }
  saveUserWords([...current, word]);
  refreshWords();
  window.dispatchEvent(new CustomEvent("lingua:words-changed"));
  return word;
}

export function updateUserWord(id: number, value: Omit<Word, "id">): Word {
  if (!isUserWord(id)) throw new Error("Можно изменять только свои слова");
  const current = getUserWords();
  const word = normalizeWord(value, id);
  if (!word.en || !word.ru) throw new Error("Заполни слово и перевод");
  if (words.some((item) => item.id !== id && item.en.toLowerCase() === word.en.toLowerCase())) {
    throw new Error("Такое слово уже есть в словаре");
  }
  saveUserWords(current.map((item) => (item.id === id ? word : item)));
  refreshWords();
  window.dispatchEvent(new CustomEvent("lingua:words-changed"));
  return word;
}

export function deleteUserWord(id: number): void {
  if (!isUserWord(id)) return;
  saveUserWords(getUserWords().filter((item) => item.id !== id));
  refreshWords();
  window.dispatchEvent(new CustomEvent("lingua:words-changed"));
}

export function exportUserWords(): string {
  return JSON.stringify(getUserWords(), null, 2);
}

export function importUserWords(raw: string): number {
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("Ожидается JSON-массив слов");
  const imported = parsed
    .map((item, index) => normalizeWord(item, USER_OFFSET + index + 1))
    .filter((item) => item.en && item.ru);
  const unique = imported.filter(
    (item, index, all) =>
      all.findIndex((other) => other.en.toLowerCase() === item.en.toLowerCase()) === index
  );
  saveUserWords(unique);
  refreshWords();
  window.dispatchEvent(new CustomEvent("lingua:words-changed"));
  return unique.length;
}
