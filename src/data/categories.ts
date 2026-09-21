import { Category } from "./types";

// Встроенные категории. Их можно скрыть через менеджер словаря;
// пользовательские категории добавляются поверх этого списка.
export const baseCategories: Category[] = [
  { id: "basics", name: "Основы", emoji: "📝", color: "from-blue-500 to-blue-600", description: "Базовые слова и фразы" },
  { id: "verbs", name: "Глаголы", emoji: "⚡", color: "from-yellow-500 to-yellow-600", description: "Важные действия" },
  { id: "adjectives", name: "Прилагательные", emoji: "🎨", color: "from-rose-500 to-rose-600", description: "Описание и качества" },
  { id: "food", name: "Еда", emoji: "🍎", color: "from-emerald-500 to-emerald-600", description: "Еда и напитки" },
  { id: "none", name: "Без категории", emoji: "🗂️", color: "from-slate-500 to-slate-600", description: "Слова без категории" },
];

const USER_CATEGORIES_KEY = "lingua_mini_user_categories_v1";
const REMOVED_CATEGORIES_KEY = "lingua_mini_removed_categories_v1";

// Палитра градиентов для новых пользовательских категорий.
const COLOR_PALETTE = [
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600",
  "from-orange-500 to-orange-600",
  "from-violet-500 to-violet-600",
  "from-pink-500 to-pink-600",
  "from-cyan-500 to-cyan-600",
  "from-amber-500 to-amber-600",
  "from-teal-500 to-teal-600",
  "from-rose-500 to-rose-600",
  "from-indigo-500 to-indigo-600",
  "from-lime-500 to-lime-600",
  "from-fuchsia-500 to-fuchsia-600",
];

function readList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getUserCategories(): Category[] {
  return readList<Partial<Category>>(USER_CATEGORIES_KEY)
    .filter((item) => item && typeof item === "object" && item.id && item.name)
    .map((item) => ({
      id: String(item.id),
      name: String(item.name),
      emoji: String(item.emoji || "🏷️"),
      color: String(item.color || COLOR_PALETTE[0]),
      description: String(item.description || ""),
    }));
}

function saveUserCategories(items: Category[]) {
  localStorage.setItem(USER_CATEGORIES_KEY, JSON.stringify(items));
}

export function getRemovedCategoryIds(): string[] {
  return readList<string>(REMOVED_CATEGORIES_KEY).map(String);
}

function saveRemovedCategoryIds(ids: string[]) {
  localStorage.setItem(
    REMOVED_CATEGORIES_KEY,
    JSON.stringify(Array.from(new Set(ids)))
  );
}

function buildCategories(): Category[] {
  const removed = new Set(getRemovedCategoryIds());
  const base = baseCategories.filter((cat) => !removed.has(cat.id));
  const user = getUserCategories().filter((cat) => !removed.has(cat.id));
  return [...base, ...user];
}

// Живой список категорий. Пересобирается через refreshCategories().
export let categories: Category[] = buildCategories();

export function refreshCategories(): Category[] {
  categories = buildCategories();
  return categories;
}

export function isUserCategory(id: string): boolean {
  return getUserCategories().some((cat) => cat.id === id);
}

function slugify(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "cat";
}

function notifyChanged() {
  window.dispatchEvent(new CustomEvent("lingua:categories-changed"));
}

export function addCategory(input: {
  name: string;
  emoji?: string;
  description?: string;
  color?: string;
}): Category {
  const name = input.name.trim();
  if (!name) throw new Error("Введите название категории");

  const existing = [...baseCategories, ...getUserCategories()];
  if (existing.some((cat) => cat.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("Такая категория уже есть");
  }

  const usedIds = new Set(existing.map((cat) => cat.id));
  let id = slugify(name);
  if (usedIds.has(id)) {
    let n = 2;
    while (usedIds.has(`${id}-${n}`)) n += 1;
    id = `${id}-${n}`;
  }

  const user = getUserCategories();
  const color = input.color || COLOR_PALETTE[user.length % COLOR_PALETTE.length];
  const category: Category = {
    id,
    name,
    emoji: (input.emoji || "🏷️").trim() || "🏷️",
    color,
    description: (input.description || "").trim(),
  };

  saveUserCategories([...user, category]);
  // На случай, если id раньше был скрыт — снимаем пометку удаления.
  saveRemovedCategoryIds(getRemovedCategoryIds().filter((rid) => rid !== id));
  refreshCategories();
  notifyChanged();
  return category;
}

export function removeCategory(id: string): void {
  if (isUserCategory(id)) {
    // Пользовательскую категорию удаляем полностью.
    saveUserCategories(getUserCategories().filter((cat) => cat.id !== id));
  } else {
    // Встроенную — прячем (слова остаются в словаре).
    saveRemovedCategoryIds([...getRemovedCategoryIds(), id]);
  }
  refreshCategories();
  notifyChanged();
}

export function restoreCategory(id: string): void {
  saveRemovedCategoryIds(getRemovedCategoryIds().filter((rid) => rid !== id));
  refreshCategories();
  notifyChanged();
}
