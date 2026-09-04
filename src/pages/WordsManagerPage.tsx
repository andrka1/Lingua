import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  words,
  categories,
  addUserWord,
  updateUserWord,
  deleteUserWord,
  exportUserWords,
  importUserWords,
  isUserWord,
  type Word,
} from "../data/words";
import { addCategory, removeCategory, isUserCategory } from "../data/categories";
import { getExcludedIds, toggleWordExcluded } from "../data/storage";

type Draft = Omit<Word, "id">;
const emptyDraft: Draft = {
  en: "",
  ru: "",
  transcription: "",
  example: "",
  category: "basics",
  level: "A1",
  note: "",
};

export default function WordsManagerPage() {
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const [query, setQuery] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [showRemoved, setShowRemoved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState("");
  const [backup, setBackup] = useState("");
  const [catName, setCatName] = useState("");
  const [catEmoji, setCatEmoji] = useState("");
  const [catError, setCatError] = useState("");
  const excluded = useMemo(() => new Set(getExcludedIds()), [version]);

  const saveCategory = (event: FormEvent) => {
    event.preventDefault();
    try {
      addCategory({ name: catName, emoji: catEmoji });
      setCatName("");
      setCatEmoji("");
      setCatError("");
      setVersion((value) => value + 1);
    } catch (reason) {
      setCatError(reason instanceof Error ? reason.message : "Не удалось добавить категорию");
    }
  };

  const removeCat = (id: string, name: string) => {
    const mine = isUserCategory(id);
    const message = mine
      ? `Удалить категорию «${name}»?`
      : `Скрыть категорию «${name}»? Слова из неё останутся в словаре.`;
    if (!window.confirm(message)) return;
    removeCategory(id);
    setVersion((value) => value + 1);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return words.filter((word) => {
      if (onlyMine && !isUserWord(word.id)) return false;
      if (showRemoved !== excluded.has(word.id)) return false;
      return !q || word.en.toLowerCase().includes(q) || word.ru.toLowerCase().includes(q);
    });
  }, [query, onlyMine, showRemoved, version, excluded]);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setError("");
    setShowForm(true);
  };

  const openEdit = (word: Word) => {
    setEditingId(word.id);
    setDraft({
      en: word.en,
      ru: word.ru,
      transcription: word.transcription,
      example: word.example,
      category: word.category,
      level: word.level,
      note: word.note || "",
    });
    setError("");
    setShowForm(true);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    try {
      editingId ? updateUserWord(editingId, draft) : addUserWord(draft);
      setShowForm(false);
      setDraft(emptyDraft);
      setEditingId(null);
      setVersion((value) => value + 1);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось сохранить слово");
    }
  };

  const remove = (word: Word) => {
    if (!window.confirm(`Удалить «${word.en}»?`)) return;
    deleteUserWord(word.id);
    setVersion((value) => value + 1);
  };

  const importBackup = () => {
    try {
      const count = importUserWords(backup);
      setBackup("");
      setVersion((value) => value + 1);
      window.alert(`Импортировано слов: ${count}`);
    } catch (reason) {
      window.alert(reason instanceof Error ? reason.message : "Неверный JSON");
    }
  };

  return (
    <div className="px-5 pt-6 pb-8 animate-fade-in">
      <header className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} aria-label="Назад" className="icon-button">←</button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-display font-bold text-white">Мой словарь</h1>
          <p className="text-xs text-slate-400">{words.length - excluded.size} слов в словаре · можно убрать любое</p>
        </div>
        <button onClick={openCreate} className="px-4 h-11 rounded-xl bg-brand-500 text-white font-semibold active:scale-95">+ Слово</button>
      </header>

      <div className="sticky top-0 z-20 -mx-5 px-5 py-3 bg-slate-950/95 backdrop-blur-xl border-y border-slate-800/60">
        <label className="sr-only" htmlFor="word-search">Поиск</label>
        <input id="word-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по слову или переводу" className="input-field" />
        <label className="mt-3 flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={onlyMine} onChange={(event) => setOnlyMine(event.target.checked)} className="w-5 h-5 accent-blue-500" />
          Только добавленные мной
          <span className="ml-auto text-slate-500">{filtered.length}</span>
        </label>
        <button onClick={() => setShowRemoved((value) => !value)} className="mt-2 text-xs text-slate-400 underline underline-offset-4">
          {showRemoved ? "Показать активные слова" : `Убранные слова (${excluded.size})`}
        </button>
      </div>

      <div className="space-y-2 mt-4">
        {filtered.map((word) => {
          const mine = isUserWord(word.id);
          const hidden = excluded.has(word.id);
          return (
            <article key={word.id} className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <div className="flex gap-3 items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-white break-words">{word.en}</h2>
                    <span className="tag">{word.level}</span>
                    {mine && <span className="tag tag-blue">моё</span>}
                  </div>
                  <p className="text-sm text-slate-300 mt-1">{word.ru}</p>
                  {word.example && <p className="text-xs text-slate-500 mt-2">{word.example}</p>}
                </div>
                <button onClick={() => { toggleWordExcluded(word.id); setVersion((value) => value + 1); }} className="text-xs px-3 min-h-11 rounded-xl bg-slate-800 text-slate-300">
                  {hidden ? "Вернуть" : "Убрать"}
                </button>
              </div>
              {mine && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-800">
                  <button onClick={() => openEdit(word)} className="flex-1 min-h-11 rounded-xl bg-slate-800 text-slate-200 text-sm">Изменить</button>
                  <button onClick={() => remove(word)} className="flex-1 min-h-11 rounded-xl bg-red-500/10 text-red-300 text-sm">Удалить</button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <details className="mt-6 rounded-2xl bg-slate-900 border border-slate-800 p-4">
        <summary className="font-semibold text-white cursor-pointer">Категории ({categories.length})</summary>
        <p className="text-xs text-slate-400 mt-2">Добавляй свои категории или убирай ненужные. При удалении встроенной категории слова из неё остаются в словаре.</p>
        <form onSubmit={saveCategory} className="flex gap-2 mt-3">
          <input value={catEmoji} onChange={(event) => setCatEmoji(event.target.value)} placeholder="🏷️" maxLength={2} aria-label="Эмодзи" className="input-field w-14 text-center" />
          <input value={catName} onChange={(event) => setCatName(event.target.value)} placeholder="Название категории" aria-label="Название категории" className="input-field flex-1" />
          <button type="submit" disabled={!catName.trim()} className="px-4 rounded-xl bg-brand-500 text-white font-semibold disabled:opacity-40">Добавить</button>
        </form>
        {catError && <p role="alert" className="text-sm text-red-300 bg-red-500/10 rounded-xl p-3 mt-2">{catError}</p>}
        <div className="flex flex-wrap gap-2 mt-3">
          {categories.map((category) => (
            <span key={category.id} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 text-slate-200 text-sm">
              <span>{category.emoji} {category.name}</span>
              {isUserCategory(category.id) && <span className="tag tag-blue">моё</span>}
              <button type="button" onClick={() => removeCat(category.id, category.name)} aria-label={`Убрать ${category.name}`} className="text-slate-400 hover:text-red-300 text-base leading-none">×</button>
            </span>
          ))}
        </div>
      </details>

      <details className="mt-6 rounded-2xl bg-slate-900 border border-slate-800 p-4">
        <summary className="font-semibold text-white cursor-pointer">Импорт и экспорт своих слов</summary>
        <p className="text-xs text-slate-400 mt-2">JSON-копия не содержит встроенный словарь и прогресс.</p>
        <button onClick={async () => { const text = exportUserWords(); setBackup(text); try { await navigator.clipboard.writeText(text); } catch {} }} className="w-full min-h-11 mt-3 rounded-xl bg-slate-800 text-slate-200 text-sm">Экспортировать и скопировать</button>
        <textarea value={backup} onChange={(event) => setBackup(event.target.value)} placeholder="Вставь JSON для импорта" className="input-field h-28 mt-3 resize-none" />
        <button onClick={importBackup} disabled={!backup.trim()} className="w-full min-h-11 mt-2 rounded-xl bg-emerald-500/15 text-emerald-300 disabled:opacity-40">Импортировать</button>
      </details>

      {showForm && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}>
          <form onSubmit={save} className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-700 p-5 pb-[calc(20px+var(--safe-bottom))]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">{editingId ? "Изменить слово" : "Новое слово"}</h2>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Закрыть" className="icon-button">×</button>
            </div>
            <div className="space-y-4">
              <label className="field-label">Слово на английском *<input autoFocus required value={draft.en} onChange={(event) => setDraft({ ...draft, en: event.target.value })} className="input-field mt-1" placeholder="achievement" /></label>
              <label className="field-label">Перевод *<input required value={draft.ru} onChange={(event) => setDraft({ ...draft, ru: event.target.value })} className="input-field mt-1" placeholder="достижение" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="field-label">Уровень<select value={draft.level} onChange={(event) => setDraft({ ...draft, level: event.target.value as Word["level"] })} className="input-field mt-1"><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option><option>C2</option></select></label>
                <label className="field-label">Категория<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className="input-field mt-1">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              </div>
              <label className="field-label">Транскрипция<input value={draft.transcription} onChange={(event) => setDraft({ ...draft, transcription: event.target.value })} className="input-field ipa mt-1" placeholder="/əˈtʃiːvmənt/" /></label>
              <label className="field-label">Пример<input value={draft.example} onChange={(event) => setDraft({ ...draft, example: event.target.value })} className="input-field mt-1" placeholder="This is a great achievement." /></label>
              <label className="field-label">Заметка<textarea value={draft.note || ""} onChange={(event) => setDraft({ ...draft, note: event.target.value })} className="input-field h-20 mt-1 resize-none" /></label>
              {error && <p role="alert" className="text-sm text-red-300 bg-red-500/10 rounded-xl p-3">{error}</p>}
              <button type="submit" className="w-full min-h-12 rounded-xl bg-brand-500 text-white font-semibold">Сохранить</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
