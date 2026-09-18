import type { GrammarExercise } from "./grammar";

// Дополнительные темы грамматики (теория + тренажёр).
// Каждое упражнение — выбор правильного варианта в пропуск "___".

export interface TopicRule {
  title: string;
  body: string;
  examples?: { en: string; ru: string }[];
}

export interface GrammarTopic {
  id: string;
  title: string;
  emoji: string;
  color: string; // tailwind gradient
  intro: string;
  rules: TopicRule[];
  exercises: GrammarExercise[];
}

// Хелпер: правильный вариант всегда первым (answer=0),
// карточка сама перемешивает варианты при показе.
let _id = 0;
function q(
  topic: string,
  sentence: string,
  correct: string,
  wrong: string[],
  explanation: string,
  hint?: string
): GrammarExercise {
  return {
    id: ++_id,
    tenseId: topic,
    kind: "fill",
    sentence,
    hint,
    options: [correct, ...wrong],
    answer: 0,
    explanation,
  };
}

export const grammarTopics: GrammarTopic[] = [
  {
    id: "articles",
    title: "Артикли",
    emoji: "🅰️",
    color: "from-cyan-500 to-blue-600",
    intro: "Когда ставить a/an, the или ничего (—).",
    rules: [
      {
        title: "a / an — неопределённый",
        body:
          "Перед исчисляемым существительным в ед. числе, когда предмет упоминается впервые или он «один из многих». a — перед согласным звуком, an — перед гласным звуком (важен звук, а не буква).",
        examples: [
          { en: "a book, a car", ru: "книга, машина" },
          { en: "an apple, an hour", ru: "яблоко, час (h немое)" },
          { en: "a university", ru: "университет (звук [j])" },
        ],
      },
      {
        title: "the — определённый",
        body:
          "Когда понятно, о каком именно предмете речь: уже упоминали, он единственный, уточнён контекстом. Также the sun/moon, реки и моря, страны с of/United, музыкальные инструменты.",
        examples: [
          { en: "The sun is bright.", ru: "Солнце — единственное." },
          { en: "the book you gave me", ru: "конкретная книга" },
          { en: "the USA, the Nile", ru: "страны/реки" },
        ],
      },
      {
        title: "Нулевой артикль (—)",
        body:
          "Не ставим артикль перед неисчисляемыми и множественными в общем смысле, именами, большинством стран, языками, приёмами пищи, видами спорта.",
        examples: [
          { en: "I like music.", ru: "музыка вообще" },
          { en: "She speaks English.", ru: "языки — без артикля" },
          { en: "We had lunch.", ru: "приёмы пищи — без артикля" },
        ],
      },
    ],
    exercises: [
      q("articles", "I saw ___ elephant at the zoo.", "an", ["a", "the", "—"], "Перед гласным звуком → an.", "первое упоминание"),
      q("articles", "She is ___ honest person.", "an", ["a", "the", "—"], "h в honest немое, звук гласный → an."),
      q("articles", "___ sun rises in the east.", "The", ["A", "An", "—"], "Солнце единственное → the."),
      q("articles", "I don't drink ___ coffee.", "—", ["a", "an", "the"], "Неисчисляемое в общем смысле → без артикля."),
      q("articles", "He is ___ university student.", "a", ["an", "the", "—"], "university начинается со звука [j] → a."),
      q("articles", "We had ___ dinner at seven.", "—", ["a", "the", "an"], "Приёмы пищи — без артикля."),
      q("articles", "Can you pass me ___ salt, please?", "the", ["a", "an", "—"], "Конкретная соль на столе → the."),
      q("articles", "She plays ___ piano every day.", "the", ["a", "an", "—"], "Музыкальные инструменты → the."),
      q("articles", "I need ___ umbrella.", "an", ["a", "the", "—"], "Гласный звук → an."),
      q("articles", "___ Nile is a very long river.", "The", ["A", "An", "—"], "Названия рек → the."),
      q("articles", "My brother is ___ engineer.", "an", ["a", "the", "—"], "Профессия + гласный звук → an."),
      q("articles", "They live in ___ United States.", "the", ["a", "an", "—"], "Страны с United/of → the."),
      q("articles", "I read ___ interesting book last week.", "an", ["a", "the", "—"], "Гласный звук + первое упоминание → an."),
      q("articles", "Do you speak ___ Chinese?", "—", ["a", "an", "the"], "Языки — без артикля."),
      q("articles", "There is ___ apple on the table.", "an", ["a", "the", "—"], "Гласный звук, первое упоминание → an."),
      q("articles", "Look at ___ moon tonight!", "the", ["a", "an", "—"], "Луна единственная → the."),
      q("articles", "She wants to be ___ doctor.", "a", ["an", "the", "—"], "Согласный звук → a."),
      q("articles", "___ dogs are loyal animals.", "—", ["A", "An", "The"], "Множественное в общем смысле → без артикля."),
    ],
  },
  {
    id: "modals",
    title: "Модальные глаголы",
    emoji: "🗝️",
    color: "from-purple-500 to-fuchsia-600",
    intro: "can, must, should, have to, may, might — возможность, необходимость, совет.",
    rules: [
      {
        title: "Форма",
        body:
          "После модального — инфинитив без to (can go, must do). Исключения: have to, ought to. Модальные не меняются по лицам: he can (не «he cans»).",
        examples: [
          { en: "She can swim.", ru: "Она умеет плавать." },
          { en: "He must go.", ru: "Он должен идти." },
        ],
      },
      {
        title: "Значения",
        body:
          "can/could — умение, возможность, просьба; must — сильная необходимость/уверенность; have to — необходимость извне; should/ought to — совет; may/might — вероятность или разрешение.",
        examples: [
          { en: "You should rest.", ru: "Тебе стоит отдохнуть (совет)." },
          { en: "It might rain.", ru: "Возможно, пойдёт дождь." },
        ],
      },
      {
        title: "Запрет и отсутствие необходимости",
        body:
          "mustn't — нельзя, запрещено; don't have to / needn't — не обязательно (можно не делать). Это разные вещи!",
        examples: [
          { en: "You mustn't smoke here.", ru: "Здесь нельзя курить." },
          { en: "You don't have to come.", ru: "Тебе не обязательно приходить." },
        ],
      },
    ],
    exercises: [
      q("modals", "You ___ smoke here, it's forbidden.", "mustn't", ["don't have to", "can", "should"], "Запрет → mustn't."),
      q("modals", "I ___ swim when I was five.", "could", ["can", "must", "should"], "Умение в прошлом → could."),
      q("modals", "It's late, you ___ go to bed.", "should", ["must", "can", "may"], "Совет → should."),
      q("modals", "She ___ speak three languages.", "can", ["must", "should", "might"], "Умение → can."),
      q("modals", "You ___ worry, everything is fine.", "don't have to", ["mustn't", "can", "should"], "Не обязательно → don't have to."),
      q("modals", "___ I use your phone?", "May", ["Must", "Should", "Would"], "Вежливое разрешение → May."),
      q("modals", "He ___ be at home, his car is outside.", "must", ["can", "should", "might"], "Уверенность (логический вывод) → must."),
      q("modals", "Students ___ wear a uniform at this school.", "have to", ["might", "could", "may"], "Необходимость по правилам → have to."),
      q("modals", "Take an umbrella, it ___ rain later.", "might", ["must", "can", "should"], "Вероятность → might."),
      q("modals", "You look pale. You ___ be tired.", "must", ["can", "might", "should"], "Уверенное предположение → must."),
      q("modals", "We have plenty of time, we ___ hurry.", "don't have to", ["mustn't", "can", "should"], "Не обязательно спешить → don't have to."),
      q("modals", "___ you help me, please?", "Could", ["Must", "Should", "May"], "Вежливая просьба → Could."),
      q("modals", "I ___ finish this report by Friday.", "have to", ["might", "could", "may"], "Обязательство извне → have to."),
      q("modals", "Children ___ play with matches.", "mustn't", ["don't have to", "can", "should"], "Строгий запрет → mustn't."),
      q("modals", "You ___ see a doctor about that cough.", "should", ["must", "can", "might"], "Совет → should."),
      q("modals", "She ___ come to the party, but she isn't sure.", "might", ["must", "can", "should"], "Неуверенная вероятность → might."),
    ],
  },
  {
    id: "prepositions",
    title: "Предлоги in / on / at",
    emoji: "📍",
    color: "from-orange-500 to-amber-600",
    intro: "in, on, at — предлоги времени и места.",
    rules: [
      {
        title: "Время",
        body:
          "at — точное время и night (at 5 o'clock, at night); on — дни и даты (on Monday, on 5 May); in — месяцы, годы, части суток (in July, in 2020, in the morning).",
        examples: [
          { en: "at 6 o'clock, at night", ru: "точное время" },
          { en: "on Friday, on 1 June", ru: "дни и даты" },
          { en: "in summer, in the evening", ru: "периоды" },
        ],
      },
      {
        title: "Место",
        body:
          "at — точка/место (at the door, at school); on — на поверхности (on the table, on the wall); in — внутри (in the box, in London).",
        examples: [
          { en: "at the bus stop", ru: "в точке" },
          { en: "on the wall", ru: "на поверхности" },
          { en: "in the room", ru: "внутри" },
        ],
      },
    ],
    exercises: [
      q("prepositions", "The meeting is ___ 3 o'clock.", "at", ["in", "on"], "Точное время → at."),
      q("prepositions", "My birthday is ___ July.", "in", ["on", "at"], "Месяцы → in."),
      q("prepositions", "See you ___ Monday.", "on", ["in", "at"], "Дни недели → on."),
      q("prepositions", "The keys are ___ the table.", "on", ["in", "at"], "На поверхности → on."),
      q("prepositions", "She lives ___ London.", "in", ["on", "at"], "Города → in."),
      q("prepositions", "We met ___ the bus stop.", "at", ["in", "on"], "Конкретная точка → at."),
      q("prepositions", "He was born ___ 1998.", "in", ["on", "at"], "Годы → in."),
      q("prepositions", "The picture is ___ the wall.", "on", ["in", "at"], "На поверхности → on."),
      q("prepositions", "I wake up early ___ the morning.", "in", ["on", "at"], "Части суток → in the morning."),
      q("prepositions", "The shop closes ___ night.", "at", ["in", "on"], "Исключение: at night."),
      q("prepositions", "There's some milk ___ the fridge.", "in", ["on", "at"], "Внутри → in."),
      q("prepositions", "The concert is ___ 25 December.", "on", ["in", "at"], "Даты → on."),
      q("prepositions", "Wait for me ___ the door.", "at", ["in", "on"], "Точка → at the door."),
      q("prepositions", "They go skiing ___ winter.", "in", ["on", "at"], "Сезоны → in."),
    ],
  },
  {
    id: "comparatives",
    title: "Степени сравнения",
    emoji: "📊",
    color: "from-teal-500 to-emerald-600",
    intro: "Сравнительная и превосходная степень прилагательных.",
    rules: [
      {
        title: "Короткие прилагательные",
        body:
          "+er / the +est: big → bigger → the biggest; nice → nicer → the nicest. После краткого гласного согласная удваивается (big → bigger).",
        examples: [
          { en: "fast → faster → the fastest", ru: "быстрый" },
          { en: "happy → happier → the happiest", ru: "y → i" },
        ],
      },
      {
        title: "Длинные (2+ слога)",
        body:
          "more / the most: expensive → more expensive → the most expensive.",
        examples: [
          { en: "important → more important", ru: "важный" },
          { en: "the most beautiful", ru: "самый красивый" },
        ],
      },
      {
        title: "Исключения и конструкции",
        body:
          "good → better → the best; bad → worse → the worst; far → further. Сравнение: ...er than; равенство: as ... as.",
        examples: [
          { en: "better than, the best", ru: "хороший" },
          { en: "as tall as me", ru: "такой же высокий" },
        ],
      },
    ],
    exercises: [
      q("comparatives", "A cheetah is ___ than a lion.", "faster", ["more fast", "fastest", "fast"], "Короткое прил. → faster.", "fast"),
      q("comparatives", "This is the ___ building in the city.", "tallest", ["most tall", "taller", "tall"], "Превосходная короткого → the tallest.", "tall"),
      q("comparatives", "Health is ___ than money.", "more important", ["importanter", "most important", "important"], "Длинное прил. → more important.", "important"),
      q("comparatives", "My grade is ___ than last time.", "better", ["gooder", "best", "more good"], "good → better.", "good"),
      q("comparatives", "This road is ___ than the other one.", "worse", ["badder", "worst", "more bad"], "bad → worse.", "bad"),
      q("comparatives", "Everest is the ___ mountain in the world.", "highest", ["most high", "higher", "high"], "Превосходная → the highest.", "high"),
      q("comparatives", "A sports car is ___ than a bicycle.", "more expensive", ["expensiver", "most expensive", "expensive"], "Длинное → more expensive.", "expensive"),
      q("comparatives", "She is ___ than her sister.", "younger", ["more young", "youngest", "young"], "Короткое → younger.", "young"),
      q("comparatives", "This is the ___ day of my life!", "happiest", ["most happy", "happier", "happy"], "y → i, превосходная → the happiest.", "happy"),
      q("comparatives", "Winter is ___ than summer.", "colder", ["more cold", "coldest", "cold"], "Короткое → colder.", "cold"),
      q("comparatives", "This book is ___ than the film.", "more interesting", ["interestinger", "most interesting", "interesting"], "Длинное → more interesting.", "interesting"),
      q("comparatives", "He is the ___ player on the team.", "best", ["goodest", "better", "most good"], "good → the best.", "good"),
      q("comparatives", "My new phone is ___ than the old one.", "lighter", ["more light", "lightest", "light"], "Короткое → lighter.", "light"),
      q("comparatives", "Gold is ___ than silver.", "more valuable", ["valuabler", "most valuable", "valuable"], "Длинное → more valuable.", "valuable"),
    ],
  },
  {
    id: "conditionals",
    title: "Условные предложения",
    emoji: "🔀",
    color: "from-rose-500 to-pink-600",
    intro: "Zero, First, Second и Third Conditional.",
    rules: [
      {
        title: "Zero — общая истина",
        body: "If + Present Simple, Present Simple. Всегда верно.",
        examples: [{ en: "If you heat ice, it melts.", ru: "Лёд тает при нагреве." }],
      },
      {
        title: "First — реальное будущее",
        body: "If + Present Simple, will + инфинитив. Реальное условие.",
        examples: [{ en: "If it rains, we will stay home.", ru: "Если пойдёт дождь..." }],
      },
      {
        title: "Second — нереальное настоящее",
        body: "If + Past Simple, would + инфинитив. Для be обычно were.",
        examples: [{ en: "If I had money, I would travel.", ru: "Если бы были деньги..." }],
      },
      {
        title: "Third — нереальное прошлое",
        body: "If + Past Perfect, would have + V3. Сожаление о прошлом.",
        examples: [{ en: "If I had known, I would have called.", ru: "Если бы знал, позвонил бы." }],
      },
    ],
    exercises: [
      q("conditionals", "If you heat water, it ___.", "boils", ["will boil", "would boil", "boiled"], "Zero: общая истина → Present Simple.", "Zero"),
      q("conditionals", "If it rains tomorrow, we ___ at home.", "will stay", ["stay", "would stay", "stayed"], "First: If + Present, will + inf.", "First"),
      q("conditionals", "If I ___ rich, I would buy a house.", "were", ["am", "will be", "had been"], "Second: If + Past (were).", "Second"),
      q("conditionals", "If she had studied, she ___ the exam.", "would have passed", ["passed", "will pass", "would pass"], "Third: would have + V3.", "Third"),
      q("conditionals", "Water freezes if the temperature ___ below zero.", "falls", ["will fall", "would fall", "fell"], "Zero: общая истина.", "Zero"),
      q("conditionals", "If I were you, I ___ apologize.", "would", ["will", "can", "must"], "Second: would + инфинитив.", "Second"),
      q("conditionals", "If they ___ earlier, they would have caught the train.", "had left", ["left", "have left", "would leave"], "Third: If + Past Perfect.", "Third"),
      q("conditionals", "I would help you if I ___ time.", "had", ["have", "will have", "would have"], "Second: If + Past Simple.", "Second"),
      q("conditionals", "If he ___ harder, he will pass.", "works", ["work", "will work", "worked"], "First: he → works (Present Simple).", "First"),
      q("conditionals", "If we had booked earlier, we ___ money.", "would have saved", ["saved", "would save", "will save"], "Third: would have + V3.", "Third"),
      q("conditionals", "If I win the lottery, I ___ around the world.", "will travel", ["travel", "would travel", "travelled"], "First: реальное будущее → will.", "First"),
      q("conditionals", "If plants don't get water, they ___.", "die", ["will die", "would die", "died"], "Zero: общая истина.", "Zero"),
      q("conditionals", "She would call you if she ___ your number.", "knew", ["knows", "had known", "know"], "Second: If + Past Simple.", "Second"),
      q("conditionals", "If you ___ me, just call.", "need", ["will need", "needed", "would need"], "First (Present + повелительное).", "First"),
    ],
  },
];
