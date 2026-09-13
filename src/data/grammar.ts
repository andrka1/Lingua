// Grammar data: English tenses theory + practice exercises (B2 / IELTS 5.5+)
// Для каждого времени показано, как образуются 3 типа предложений:
// утверждение (+), отрицание (−) и вопрос (?) — с формулой и примером.

export interface TenseExample {
  en: string;
  ru: string;
}

export interface TenseForm {
  label: string; // Утверждение / Отрицание / Вопрос
  icon: string; // эмодзи формы
  formula: string; // как образуется именно эта форма
  example: TenseExample;
}

export interface TenseForms {
  affirmative: TenseForm; // утверждение (+)
  negative: TenseForm; // отрицание (−)
  question: TenseForm; // вопрос (?)
}

export interface TenseTopic {
  id: string;
  name: string; // English name
  nameRu: string; // Russian name
  formula: string; // краткая общая формула
  usage: string; // when to use (RU)
  markers: string; // signal words
  forms: TenseForms; // как образуются +/−/? с примерами
  examples: TenseExample[]; // [утверждение, отрицание, вопрос] — для других экранов
}

export type ExerciseKind = "fill" | "identify";

export interface GrammarExercise {
  id: number;
  tenseId: string;
  // "fill" (default): выбрать правильную форму глагола в пропуск "___".
  // "identify": определить, какое это время (варианты — названия времён).
  kind?: ExerciseKind;
  sentence: string; // для "fill" содержит "___"; для "identify" — целое предложение
  hint?: string; // base verb / Russian hint
  options: string[];
  answer: number; // index of correct option
  explanation: string; // RU explanation
}

type TenseTopicInput = Omit<TenseTopic, "examples">;

const tenseTopics: TenseTopicInput[] = [
  {
    id: "present-simple",
    name: "Present Simple",
    nameRu: "Настоящее простое",
    formula: "V / V-s (he/she/it)",
    usage: "Факты, привычки, расписания и регулярные действия.",
    markers: "always, usually, often, every day, sometimes, never",
    forms: {
      affirmative: {
        label: "Утверждение",
        icon: "✅",
        formula: "I/you/we/they + V · he/she/it + V-s/-es",
        example: { en: "She works in a bank.", ru: "Она работает в банке." },
      },
      negative: {
        label: "Отрицание",
        icon: "❌",
        formula: "do/does + not + V (глагол без -s)",
        example: { en: "She doesn't work on Sundays.", ru: "Она не работает по воскресеньям." },
      },
      question: {
        label: "Вопрос",
        icon: "❓",
        formula: "Do/Does + подлежащее + V?",
        example: { en: "Does she work here?", ru: "Она здесь работает?" },
      },
    },
  },
  {
    id: "present-continuous",
    name: "Present Continuous",
    nameRu: "Настоящее длительное",
    formula: "am / is / are + V-ing",
    usage: "Действие происходит сейчас или в данный период; временные ситуации.",
    markers: "now, at the moment, currently, today, these days",
    forms: {
      affirmative: {
        label: "Утверждение",
        icon: "✅",
        formula: "am/is/are + V-ing",
        example: { en: "I am studying English now.", ru: "Я сейчас учу английский." },
      },
      negative: {
        label: "Отрицание",
        icon: "❌",
        formula: "am/is/are + not + V-ing",
        example: { en: "He is not working today.", ru: "Он сегодня не работает." },
      },
      question: {
        label: "Вопрос",
        icon: "❓",
        formula: "Am/Is/Are + подлежащее + V-ing?",
        example: { en: "Are you listening to me?", ru: "Ты меня слушаешь?" },
      },
    },
  },
  {
    id: "present-perfect",
    name: "Present Perfect",
    nameRu: "Настоящее совершённое",
    formula: "have / has + V3 (past participle)",
    usage: "Результат в настоящем; опыт; действие, завершённое к настоящему моменту.",
    markers: "just, already, yet, ever, never, since, for, recently",
    forms: {
      affirmative: {
        label: "Утверждение",
        icon: "✅",
        formula: "have/has + V3 (3-я форма)",
        example: { en: "I have finished my homework.", ru: "Я закончил домашнюю работу." },
      },
      negative: {
        label: "Отрицание",
        icon: "❌",
        formula: "have/has + not + V3",
        example: { en: "She hasn't called me yet.", ru: "Она мне ещё не позвонила." },
      },
      question: {
        label: "Вопрос",
        icon: "❓",
        formula: "Have/Has + подлежащее + V3?",
        example: { en: "Have you ever been to London?", ru: "Ты когда-нибудь был в Лондоне?" },
      },
    },
  },
  {
    id: "present-perfect-continuous",
    name: "Present Perfect Continuous",
    nameRu: "Настоящее совершённое длительное",
    formula: "have / has been + V-ing",
    usage: "Действие началось в прошлом, длилось и связано с настоящим (важна длительность).",
    markers: "for, since, all day, how long, lately",
    forms: {
      affirmative: {
        label: "Утверждение",
        icon: "✅",
        formula: "have/has + been + V-ing",
        example: { en: "I have been studying for three hours.", ru: "Я учусь уже три часа." },
      },
      negative: {
        label: "Отрицание",
        icon: "❌",
        formula: "have/has + not + been + V-ing",
        example: { en: "She hasn't been feeling well lately.", ru: "В последнее время она плохо себя чувствует." },
      },
      question: {
        label: "Вопрос",
        icon: "❓",
        formula: "Have/Has + подлежащее + been + V-ing?",
        example: { en: "How long have you been waiting?", ru: "Как долго ты ждёшь?" },
      },
    },
  },
  {
    id: "past-simple",
    name: "Past Simple",
    nameRu: "Прошедшее простое",
    formula: "V2 (V-ed / irregular)",
    usage: "Завершённое действие в прошлом с указанием времени.",
    markers: "yesterday, ago, last week, in 2010, when",
    forms: {
      affirmative: {
        label: "Утверждение",
        icon: "✅",
        formula: "V2 (V-ed или неправильный глагол)",
        example: { en: "We visited Rome last year.", ru: "Мы ездили в Рим в прошлом году." },
      },
      negative: {
        label: "Отрицание",
        icon: "❌",
        formula: "did + not + V (базовая форма)",
        example: { en: "I didn't see her yesterday.", ru: "Я вчера её не видел." },
      },
      question: {
        label: "Вопрос",
        icon: "❓",
        formula: "Did + подлежащее + V?",
        example: { en: "Did you call him?", ru: "Ты ему звонил?" },
      },
    },
  },
  {
    id: "past-continuous",
    name: "Past Continuous",
    nameRu: "Прошедшее длительное",
    formula: "was / were + V-ing",
    usage: "Действие длилось в определённый момент прошлого; фон для другого действия.",
    markers: "while, when, at 5 pm yesterday, as",
    forms: {
      affirmative: {
        label: "Утверждение",
        icon: "✅",
        formula: "was/were + V-ing",
        example: { en: "I was cooking when he called.", ru: "Я готовил, когда он позвонил." },
      },
      negative: {
        label: "Отрицание",
        icon: "❌",
        formula: "was/were + not + V-ing",
        example: { en: "They were not watching TV.", ru: "Они не смотрели телевизор." },
      },
      question: {
        label: "Вопрос",
        icon: "❓",
        formula: "Was/Were + подлежащее + V-ing?",
        example: { en: "What were you doing at 8 pm?", ru: "Что ты делал в 8 вечера?" },
      },
    },
  },
  {
    id: "past-perfect",
    name: "Past Perfect",
    nameRu: "Прошедшее совершённое",
    formula: "had + V3 (past participle)",
    usage: "Действие, завершённое раньше другого действия в прошлом.",
    markers: "by the time, before, after, already, when",
    forms: {
      affirmative: {
        label: "Утверждение",
        icon: "✅",
        formula: "had + V3 (3-я форма)",
        example: { en: "The train had left before we arrived.", ru: "Поезд ушёл до того, как мы приехали." },
      },
      negative: {
        label: "Отрицание",
        icon: "❌",
        formula: "had + not + V3",
        example: { en: "She hadn't finished her work by then.", ru: "К тому моменту она не закончила работу." },
      },
      question: {
        label: "Вопрос",
        icon: "❓",
        formula: "Had + подлежащее + V3?",
        example: { en: "Had they met before the party?", ru: "Они встречались до вечеринки?" },
      },
    },
  },
  {
    id: "past-perfect-continuous",
    name: "Past Perfect Continuous",
    nameRu: "Прошедшее совершённое длительное",
    formula: "had been + V-ing",
    usage: "Действие длилось до другого действия в прошлом (акцент на длительности).",
    markers: "for, since, before, until, how long",
    forms: {
      affirmative: {
        label: "Утверждение",
        icon: "✅",
        formula: "had + been + V-ing",
        example: { en: "I had been waiting for two hours before the bus came.", ru: "Я ждал два часа, прежде чем пришёл автобус." },
      },
      negative: {
        label: "Отрицание",
        icon: "❌",
        formula: "had + not + been + V-ing",
        example: { en: "He hadn't been sleeping well before the exam.", ru: "Перед экзаменом он плохо спал." },
      },
      question: {
        label: "Вопрос",
        icon: "❓",
        formula: "Had + подлежащее + been + V-ing?",
        example: { en: "How long had she been working there?", ru: "Как долго она там работала?" },
      },
    },
  },
  {
    id: "future-simple",
    name: "Future Simple (will)",
    nameRu: "Будущее простое",
    formula: "will + V",
    usage: "Спонтанные решения, прогнозы, обещания, факты о будущем.",
    markers: "tomorrow, next week, soon, I think, probably",
    forms: {
      affirmative: {
        label: "Утверждение",
        icon: "✅",
        formula: "will + V (базовая форма)",
        example: { en: "I will call you tomorrow.", ru: "Я позвоню тебе завтра." },
      },
      negative: {
        label: "Отрицание",
        icon: "❌",
        formula: "will + not (won't) + V",
        example: { en: "I won't be late.", ru: "Я не опоздаю." },
      },
      question: {
        label: "Вопрос",
        icon: "❓",
        formula: "Will + подлежащее + V?",
        example: { en: "Will you help me?", ru: "Ты мне поможешь?" },
      },
    },
  },
  {
    id: "future-going-to",
    name: "Future: going to",
    nameRu: "Будущее: be going to",
    formula: "am / is / are going to + V",
    usage: "Планы, намерения и предсказания на основе очевидных признаков.",
    markers: "tonight, this weekend, plan, intend",
    forms: {
      affirmative: {
        label: "Утверждение",
        icon: "✅",
        formula: "am/is/are + going to + V",
        example: { en: "I am going to start a new course.", ru: "Я собираюсь начать новый курс." },
      },
      negative: {
        label: "Отрицание",
        icon: "❌",
        formula: "am/is/are + not + going to + V",
        example: { en: "We aren't going to travel this summer.", ru: "Этим летом мы не собираемся путешествовать." },
      },
      question: {
        label: "Вопрос",
        icon: "❓",
        formula: "Am/Is/Are + подлежащее + going to + V?",
        example: { en: "Are you going to buy a car?", ru: "Ты собираешься покупать машину?" },
      },
    },
  },
  {
    id: "future-continuous",
    name: "Future Continuous",
    nameRu: "Будущее длительное",
    formula: "will be + V-ing",
    usage: "Действие будет длиться в определённый момент в будущем.",
    markers: "at this time tomorrow, at 8 pm, all day",
    forms: {
      affirmative: {
        label: "Утверждение",
        icon: "✅",
        formula: "will + be + V-ing",
        example: { en: "This time tomorrow I will be flying to Paris.", ru: "Завтра в это время я буду лететь в Париж." },
      },
      negative: {
        label: "Отрицание",
        icon: "❌",
        formula: "will + not + be + V-ing",
        example: { en: "I won't be working tomorrow morning.", ru: "Завтра утром я не буду работать." },
      },
      question: {
        label: "Вопрос",
        icon: "❓",
        formula: "Will + подлежащее + be + V-ing?",
        example: { en: "Will you be using the car tonight?", ru: "Ты будешь пользоваться машиной сегодня вечером?" },
      },
    },
  },
  {
    id: "future-perfect",
    name: "Future Perfect",
    nameRu: "Будущее совершённое",
    formula: "will have + V3 (past participle)",
    usage: "Действие, которое завершится к определённому моменту в будущем.",
    markers: "by, by the time, before, until, next year",
    forms: {
      affirmative: {
        label: "Утверждение",
        icon: "✅",
        formula: "will + have + V3 (3-я форма)",
        example: { en: "I will have finished the report by 5 pm.", ru: "Я закончу отчёт к 5 вечера." },
      },
      negative: {
        label: "Отрицание",
        icon: "❌",
        formula: "will + not + have + V3",
        example: { en: "She won't have finished by Monday.", ru: "К понедельнику она не закончит." },
      },
      question: {
        label: "Вопрос",
        icon: "❓",
        formula: "Will + подлежащее + have + V3?",
        example: { en: "Will you have arrived by noon?", ru: "Ты приедешь к полудню?" },
      },
    },
  },
  {
    id: "future-perfect-continuous",
    name: "Future Perfect Continuous",
    nameRu: "Будущее совершённое длительное",
    formula: "will have been + V-ing",
    usage: "Действие будет длиться вплоть до определённого момента в будущем (акцент на длительности).",
    markers: "by ... for, by then, by the time, for",
    forms: {
      affirmative: {
        label: "Утверждение",
        icon: "✅",
        formula: "will + have + been + V-ing",
        example: { en: "By next month I will have been working here for five years.", ru: "К следующему месяцу я проработаю здесь уже пять лет." },
      },
      negative: {
        label: "Отрицание",
        icon: "❌",
        formula: "will + not + have + been + V-ing",
        example: { en: "By June they won't have been living here for long.", ru: "К июню они будут жить здесь недолго." },
      },
      question: {
        label: "Вопрос",
        icon: "❓",
        formula: "Will + подлежащее + have been + V-ing?",
        example: { en: "Will you have been driving for ten hours by then?", ru: "К тому моменту ты будешь за рулём уже десять часов?" },
      },
    },
  },
];

export const tenses: TenseTopic[] = tenseTopics.map((t) => ({
  ...t,
  examples: [
    t.forms.affirmative.example,
    t.forms.negative.example,
    t.forms.question.example,
  ],
}));

export const grammarExercises: GrammarExercise[] = [
  // Present Simple
  { id: 1, tenseId: "present-simple", sentence: "She ___ to work by bus every day.", hint: "go", options: ["go", "goes", "is going", "went"], answer: 1, explanation: "Привычка + he/she/it → глагол с -s: goes." },
  { id: 2, tenseId: "present-simple", sentence: "They ___ like spicy food.", hint: "отрицание", options: ["doesn't", "don't", "aren't", "didn't"], answer: 1, explanation: "Отрицание в Present Simple для they → don't." },
  { id: 3, tenseId: "present-simple", sentence: "Water ___ at 100 degrees.", hint: "boil", options: ["boil", "boils", "is boiling", "boiled"], answer: 1, explanation: "Научный факт → Present Simple, it → boils." },
  // Present Continuous
  { id: 4, tenseId: "present-continuous", sentence: "Be quiet! The baby ___.", hint: "sleep", options: ["sleeps", "is sleeping", "slept", "sleep"], answer: 1, explanation: "Действие прямо сейчас → am/is/are + V-ing." },
  { id: 5, tenseId: "present-continuous", sentence: "Look! It ___ outside.", hint: "rain", options: ["rains", "rained", "is raining", "rain"], answer: 2, explanation: "Маркер Look! указывает на действие сейчас → is raining." },
  { id: 6, tenseId: "present-continuous", sentence: "I ___ a lot of books these days.", hint: "read", options: ["read", "am reading", "have read", "reads"], answer: 1, explanation: "these days = временной период вокруг настоящего → Present Continuous." },
  // Present Perfect
  { id: 7, tenseId: "present-perfect", sentence: "I ___ already ___ my homework.", hint: "finish", options: ["have / finished", "has / finished", "did / finish", "am / finishing"], answer: 0, explanation: "Маркер already → Present Perfect: have + V3 (finished)." },
  { id: 8, tenseId: "present-perfect", sentence: "She ___ here since 2015.", hint: "live", options: ["lives", "lived", "has lived", "is living"], answer: 2, explanation: "since 2015 → Present Perfect: has lived." },
  { id: 9, tenseId: "present-perfect", sentence: "___ you ever ___ sushi?", hint: "try", options: ["Did / try", "Have / tried", "Are / trying", "Do / try"], answer: 1, explanation: "ever (опыт) → Present Perfect: Have you ever tried." },
  // Present Perfect Continuous
  { id: 10, tenseId: "present-perfect-continuous", sentence: "I ___ for two hours and I'm tired.", hint: "study", options: ["study", "have been studying", "studied", "am studying"], answer: 1, explanation: "Длительность до настоящего (for two hours) → have been + V-ing." },
  { id: 11, tenseId: "present-perfect-continuous", sentence: "It ___ since this morning.", hint: "snow", options: ["snows", "has been snowing", "snowed", "is snowing"], answer: 1, explanation: "since this morning + акцент на длительность → has been snowing." },
  // Past Simple
  { id: 12, tenseId: "past-simple", sentence: "We ___ to Spain last summer.", hint: "go", options: ["go", "went", "have gone", "were going"], answer: 1, explanation: "last summer → завершённое прошлое: go → went (неправ.)." },
  { id: 13, tenseId: "past-simple", sentence: "He ___ the email an hour ago.", hint: "send", options: ["sends", "sent", "has sent", "was sending"], answer: 1, explanation: "ago → Past Simple: send → sent." },
  { id: 14, tenseId: "past-simple", sentence: "I ___ see the film yesterday.", hint: "отрицание", options: ["don't", "didn't", "haven't", "wasn't"], answer: 1, explanation: "Отрицание в прошлом → didn't + базовый глагол." },
  // Past Continuous
  { id: 15, tenseId: "past-continuous", sentence: "I ___ dinner when the phone rang.", hint: "cook", options: ["cooked", "was cooking", "cook", "have cooked"], answer: 1, explanation: "Длительное действие, прерванное другим → was/were + V-ing." },
  { id: 16, tenseId: "past-continuous", sentence: "While they ___, it started to rain.", hint: "walk", options: ["walked", "were walking", "walk", "had walked"], answer: 1, explanation: "While + фоновое действие → Past Continuous: were walking." },
  // Past Perfect
  { id: 17, tenseId: "past-perfect", sentence: "The film ___ before we arrived.", hint: "start", options: ["started", "had started", "starts", "was starting"], answer: 1, explanation: "Раньше другого прошлого действия → had + V3." },
  { id: 18, tenseId: "past-perfect", sentence: "By 10 pm she ___ already ___ asleep.", hint: "fall", options: ["had / fallen", "has / fallen", "was / falling", "did / fall"], answer: 0, explanation: "By + время в прошлом → Past Perfect: had fallen." },
  // Past Perfect Continuous
  { id: 31, tenseId: "past-perfect-continuous", sentence: "I ___ for two hours before the bus came.", hint: "wait", options: ["waited", "had been waiting", "was waiting", "have waited"], answer: 1, explanation: "Длительность до другого прошлого действия → had been + V-ing." },
  { id: 32, tenseId: "past-perfect-continuous", sentence: "She ___ there since 2010 before she moved.", hint: "work", options: ["worked", "had been working", "was working", "has worked"], answer: 1, explanation: "since + до другого прошлого → Past Perfect Continuous." },
  // Future Simple
  { id: 19, tenseId: "future-simple", sentence: "I think it ___ snow tomorrow.", hint: "will?", options: ["will", "is going to", "going to", "shall"], answer: 0, explanation: "Прогноз с I think → will." },
  { id: 20, tenseId: "future-simple", sentence: "Don't worry, I ___ help you.", hint: "promise", options: ["am helping", "will", "helped", "help"], answer: 1, explanation: "Спонтанное обещание → will help." },
  // Future going to
  { id: 21, tenseId: "future-going-to", sentence: "We ___ visit grandma this weekend (plan).", hint: "plan", options: ["will", "are going to", "go", "going"], answer: 1, explanation: "Заранее запланированное действие → be going to." },
  { id: 22, tenseId: "future-going-to", sentence: "Look at the sky! It ___ rain.", hint: "evidence", options: ["will", "is going to", "rains", "rained"], answer: 1, explanation: "Предсказание по очевидным признакам → is going to." },
  // Future Continuous
  { id: 23, tenseId: "future-continuous", sentence: "At 9 am tomorrow I ___ an exam.", hint: "take", options: ["will take", "will be taking", "take", "am taking"], answer: 1, explanation: "Действие в процессе в момент будущего → will be + V-ing." },
  // Future Perfect
  { id: 33, tenseId: "future-perfect", sentence: "I ___ the report by 5 pm.", hint: "finish", options: ["will finish", "will have finished", "finish", "am finishing"], answer: 1, explanation: "by 5 pm = к моменту в будущем → will have + V3." },
  { id: 34, tenseId: "future-perfect", sentence: "By next year she ___ university.", hint: "finish", options: ["will finish", "will have finished", "finishes", "is finishing"], answer: 1, explanation: "By next year → Future Perfect: will have finished." },
  // Mixed contrast
  { id: 24, tenseId: "present-perfect", sentence: "I ___ my keys. I can't find them now.", hint: "lose", options: ["lost", "have lost", "had lost", "lose"], answer: 1, explanation: "Результат важен сейчас → Present Perfect: have lost." },
  { id: 25, tenseId: "past-simple", sentence: "When ___ you ___ English?", hint: "start", options: ["have / started", "did / start", "do / start", "are / starting"], answer: 1, explanation: "Вопрос о конкретном моменте в прошлом → did + start." },
  { id: 26, tenseId: "present-simple", sentence: "The train ___ at 7:00 every morning.", hint: "leave", options: ["is leaving", "leaves", "left", "has left"], answer: 1, explanation: "Расписание → Present Simple: leaves." },
  { id: 27, tenseId: "present-continuous", sentence: "Why ___ you ___ at me like that?", hint: "look", options: ["do / look", "are / looking", "did / look", "have / looked"], answer: 1, explanation: "Действие сейчас → are you looking." },
  { id: 28, tenseId: "past-continuous", sentence: "At 8 pm yesterday we ___ dinner.", hint: "have", options: ["had", "were having", "have had", "are having"], answer: 1, explanation: "Конкретный момент в прошлом → Past Continuous: were having." },
  { id: 29, tenseId: "future-simple", sentence: "Perhaps they ___ come to the party.", hint: "will?", options: ["will", "are going to", "come", "came"], answer: 0, explanation: "Неуверенность (perhaps) → will." },
  { id: 30, tenseId: "present-perfect-continuous", sentence: "How long ___ you ___ here?", hint: "wait", options: ["did / wait", "have / been waiting", "are / waiting", "do / wait"], answer: 1, explanation: "How long + длительность к настоящему → have you been waiting." },

  // ===== Дополнительные задания: баланс по временам (>=4 на каждое время) =====
  // Present Simple (+1)
  { id: 35, tenseId: "present-simple", sentence: "My brother ___ play tennis on Sundays.", hint: "отрицание", options: ["isn't", "doesn't", "don't", "didn't"], answer: 1, explanation: "Регулярное действие, he → отрицание doesn't." },
  // Present Continuous (+1)
  { id: 36, tenseId: "present-continuous", sentence: "Listen! Someone ___ the piano.", hint: "play", options: ["is playing", "plays", "played", "play"], answer: 0, explanation: "Listen! → действие прямо сейчас → is playing." },
  // Present Perfect (+1)
  { id: 37, tenseId: "present-perfect", sentence: "We haven't seen that film ___.", hint: "маркер", options: ["ago", "yet", "now", "last week"], answer: 1, explanation: "Отрицание в Present Perfect часто с yet → haven't ... yet." },
  // Present Perfect Continuous (+2)
  { id: 38, tenseId: "present-perfect-continuous", sentence: "My hands are dirty because I ___ in the garden.", hint: "work", options: ["have been working", "work", "worked", "am working"], answer: 0, explanation: "Видимый результат сейчас + длительный процесс → have been + V-ing." },
  { id: 39, tenseId: "present-perfect-continuous", sentence: "She ___ English for five years now.", hint: "learn", options: ["learns", "is learning", "has been learning", "learned"], answer: 2, explanation: "for five years + связь с настоящим → has been learning." },
  // Past Simple (+1)
  { id: 40, tenseId: "past-simple", sentence: "They ___ the match last night.", hint: "win", options: ["win", "won", "have won", "were winning"], answer: 1, explanation: "last night → Past Simple: win → won (неправ.)." },
  // Past Continuous (+2)
  { id: 41, tenseId: "past-continuous", sentence: "What ___ you ___ at 7 pm last night?", hint: "do", options: ["did / do", "were / doing", "do / do", "have / done"], answer: 1, explanation: "Конкретный момент в прошлом → was/were + V-ing: were you doing." },
  { id: 42, tenseId: "past-continuous", sentence: "The sun ___ while we walked on the beach.", hint: "shine", options: ["shone", "was shining", "shines", "had shone"], answer: 1, explanation: "Фоновое длительное действие в прошлом → was shining." },
  // Past Perfect (+2)
  { id: 43, tenseId: "past-perfect", sentence: "When I arrived, the party ___ already ___.", hint: "finish", options: ["had / finished", "has / finished", "was / finishing", "did / finish"], answer: 0, explanation: "Действие завершилось раньше другого прошлого → had + V3." },
  { id: 44, tenseId: "past-perfect", sentence: "She couldn't pay because she ___ her wallet.", hint: "forget", options: ["forgot", "had forgotten", "forgets", "was forgetting"], answer: 1, explanation: "Причина в более раннем прошлом → Past Perfect: had forgotten." },
  // Past Perfect Continuous (+2)
  { id: 45, tenseId: "past-perfect-continuous", sentence: "He was tired because he ___ all night.", hint: "drive", options: ["drove", "was driving", "had been driving", "has been driving"], answer: 2, explanation: "Длительность до момента в прошлом → had been + V-ing." },
  { id: 46, tenseId: "past-perfect-continuous", sentence: "They ___ for an hour when it finally stopped raining.", hint: "walk", options: ["had been walking", "walked", "were walking", "have been walking"], answer: 0, explanation: "Действие длилось до другого прошлого → had been walking." },
  // Future Simple (+2)
  { id: 47, tenseId: "future-simple", sentence: "Maybe we ___ go to the beach if it's sunny.", hint: "will?", options: ["are going to", "will", "go", "are"], answer: 1, explanation: "Неуверенность (maybe) → will." },
  { id: 48, tenseId: "future-simple", sentence: "The phone is ringing — I ___ answer it.", hint: "spontaneous", options: ["am going to", "will", "answer", "am answering"], answer: 1, explanation: "Спонтанное решение в момент речи → will." },
  // Future going to (+2)
  { id: 49, tenseId: "future-going-to", sentence: "I've decided: I ___ learn Italian next year.", hint: "plan", options: ["will", "am going to", "go to", "going to"], answer: 1, explanation: "Заранее принятое решение/намерение → be going to." },
  { id: 50, tenseId: "future-going-to", sentence: "She bought paint — she ___ redecorate her room.", hint: "intention", options: ["will", "is going to", "redecorates", "is redecorating"], answer: 1, explanation: "Намерение, подтверждённое признаками → be going to." },
  // Future Continuous (+3)
  { id: 51, tenseId: "future-continuous", sentence: "Don't call at 8 — I ___ dinner then.", hint: "have", options: ["will have", "will be having", "have", "am having"], answer: 1, explanation: "Действие в процессе в момент будущего → will be + V-ing." },
  { id: 52, tenseId: "future-continuous", sentence: "This time next week we ___ on a beach in Italy.", hint: "relax", options: ["will be relaxing", "will relax", "relax", "are relaxing"], answer: 0, explanation: "Длительное действие в конкретный момент будущего → will be relaxing." },
  { id: 53, tenseId: "future-continuous", sentence: "At midnight tomorrow they ___ for the exam.", hint: "study", options: ["study", "have studied", "will be studying", "will study"], answer: 2, explanation: "Действие будет в процессе в момент будущего → will be studying." },
  // Future Perfect (+2)
  { id: 54, tenseId: "future-perfect", sentence: "By the time you arrive, I ___ cooking.", hint: "finish", options: ["will finish", "will have finished", "finish", "am finishing"], answer: 1, explanation: "Завершится к моменту в будущем → will have + V3." },
  { id: 55, tenseId: "future-perfect", sentence: "They ___ the house by December.", hint: "build", options: ["will have built", "will build", "build", "are building"], answer: 0, explanation: "Действие завершится к сроку → Future Perfect: will have built." },
  // Future Perfect Continuous (новое время, +4)
  { id: 56, tenseId: "future-perfect-continuous", sentence: "By next year I ___ here for a decade.", hint: "work", options: ["will work", "will have been working", "will be working", "have worked"], answer: 1, explanation: "Длительность к моменту в будущем → will have been + V-ing." },
  { id: 57, tenseId: "future-perfect-continuous", sentence: "By 6 pm they ___ for ten hours straight.", hint: "drive", options: ["will have been driving", "will drive", "will be driving", "have been driving"], answer: 0, explanation: "Акцент на длительности до будущего момента → will have been driving." },
  { id: 58, tenseId: "future-perfect-continuous", sentence: "In May, she ___ Italian for two years.", hint: "study", options: ["will study", "will be studying", "will have been studying", "studies"], answer: 2, explanation: "Длительность к будущему моменту → will have been studying." },
  { id: 59, tenseId: "future-perfect-continuous", sentence: "By the time the guests arrive, we ___ for hours.", hint: "cook", options: ["will have been cooking", "will cook", "cook", "will be cooking"], answer: 0, explanation: "Действие будет длиться вплоть до момента в будущем → will have been + V-ing." },

  // ===== Задания «определи время» (kind: identify) =====
  { id: 60, tenseId: "present-perfect", kind: "identify", sentence: "I have just finished my homework.", options: ["Past Simple", "Present Perfect", "Present Continuous", "Past Perfect"], answer: 1, explanation: "have + V3 (finished) + маркер just → Present Perfect." },
  { id: 61, tenseId: "past-continuous", kind: "identify", sentence: "They were watching a film at 9 pm yesterday.", options: ["Past Continuous", "Past Simple", "Present Continuous", "Past Perfect Continuous"], answer: 0, explanation: "was/were + V-ing в конкретный момент прошлого → Past Continuous." },
  { id: 62, tenseId: "future-perfect", kind: "identify", sentence: "By Friday they will have signed the contract.", options: ["Future Simple", "Future Continuous", "Future Perfect", "Future Perfect Continuous"], answer: 2, explanation: "will have + V3 + by Friday → Future Perfect." },
  { id: 63, tenseId: "present-simple", kind: "identify", sentence: "The shop opens at nine every morning.", options: ["Present Continuous", "Present Simple", "Present Perfect", "Future Simple"], answer: 1, explanation: "Расписание/регулярность + V-s → Present Simple." },
  { id: 64, tenseId: "past-perfect", kind: "identify", sentence: "She had left before the meeting started.", options: ["Past Simple", "Past Perfect", "Present Perfect", "Past Perfect Continuous"], answer: 1, explanation: "had + V3 (left), раньше другого прошлого → Past Perfect." },
  { id: 65, tenseId: "present-perfect-continuous", kind: "identify", sentence: "I have been reading this book for a week.", options: ["Present Perfect", "Present Continuous", "Present Perfect Continuous", "Past Perfect Continuous"], answer: 2, explanation: "have been + V-ing + for a week → Present Perfect Continuous." },
  { id: 66, tenseId: "future-continuous", kind: "identify", sentence: "This time tomorrow I will be flying to Rome.", options: ["Future Simple", "Future Continuous", "Future Perfect", "Future: going to"], answer: 1, explanation: "will be + V-ing в момент будущего → Future Continuous." },
  { id: 67, tenseId: "future-perfect-continuous", kind: "identify", sentence: "By June she will have been teaching for ten years.", options: ["Future Perfect", "Future Continuous", "Future Perfect Continuous", "Present Perfect Continuous"], answer: 2, explanation: "will have been + V-ing + by June → Future Perfect Continuous." },
  { id: 68, tenseId: "past-simple", kind: "identify", sentence: "We visited Rome last year.", options: ["Present Perfect", "Past Simple", "Past Continuous", "Past Perfect"], answer: 1, explanation: "V2 (visited) + last year → Past Simple." },
  // ============================================================
  // НОВЫЕ ЗАДАНИЯ (подготовка к контрольной) — больше практики по каждому времени
  // ============================================================

  // ----- Present Simple -----
  { id: 69, tenseId: "present-simple", sentence: "My sister ___ three languages.", hint: "speak", options: ["speak", "speaks", "is speaking", "spoke"], answer: 1, explanation: "he/she/it + V-s → speaks (факт/умение)." },
  { id: 70, tenseId: "present-simple", sentence: "We usually ___ dinner at seven.", hint: "have", options: ["have", "has", "are having", "had"], answer: 0, explanation: "we + базовая форма; usually → Present Simple." },
  { id: 71, tenseId: "present-simple", sentence: "Tom ___ eat meat; he is a vegetarian.", hint: "отрицание", options: ["don't", "doesn't", "isn't", "didn't"], answer: 1, explanation: "he → отрицание doesn't + базовый глагол." },
  { id: 72, tenseId: "present-simple", sentence: "___ your parents live near you?", hint: "вопрос", options: ["Do", "Does", "Are", "Did"], answer: 0, explanation: "they (parents) → вопрос с Do." },
  { id: 73, tenseId: "present-simple", sentence: "The sun ___ in the east.", hint: "rise", options: ["rise", "rises", "is rising", "rose"], answer: 1, explanation: "Научный факт, it → rises." },
  { id: 74, tenseId: "present-simple", sentence: "How often ___ she go to the gym?", hint: "вопрос", options: ["do", "does", "is", "did"], answer: 1, explanation: "she → вопрос с does + базовый глагол." },

  // ----- Present Continuous -----
  { id: 75, tenseId: "present-continuous", sentence: "Where are you? I ___ for the bus.", hint: "wait", options: ["wait", "am waiting", "waited", "have waited"], answer: 1, explanation: "Действие прямо сейчас → am + V-ing." },
  { id: 76, tenseId: "present-continuous", sentence: "He ___ working today; he is on holiday.", hint: "отрицание", options: ["isn't", "doesn't", "aren't", "wasn't"], answer: 0, explanation: "he + сейчас, отрицание → isn't + V-ing." },
  { id: 77, tenseId: "present-continuous", sentence: "Why ___ you laughing?", hint: "вопрос", options: ["do", "are", "is", "did"], answer: 1, explanation: "you + V-ing → вопрос с are." },
  { id: 78, tenseId: "present-continuous", sentence: "The company ___ a new app this year.", hint: "develop", options: ["develops", "is developing", "developed", "develop"], answer: 1, explanation: "this year (временный период) → Present Continuous." },
  { id: 79, tenseId: "present-continuous", sentence: "Look! The train ___.", hint: "come", options: ["comes", "is coming", "came", "come"], answer: 1, explanation: "Look! → действие сейчас → is coming." },
  { id: 80, tenseId: "present-continuous", sentence: "___ it raining outside now?", hint: "вопрос", options: ["Is", "Does", "Are", "Did"], answer: 0, explanation: "it + now → вопрос с Is + V-ing." },

  // ----- Present Perfect -----
  { id: 81, tenseId: "present-perfect", sentence: "I have never ___ to Japan.", hint: "be", options: ["been", "was", "gone", "go"], answer: 0, explanation: "have never + V3 (been) → опыт." },
  { id: 82, tenseId: "present-perfect", sentence: "She has just ___ the news.", hint: "hear", options: ["heard", "hear", "hearing", "hears"], answer: 0, explanation: "just → Present Perfect: has + V3 (heard)." },
  { id: 83, tenseId: "present-perfect", sentence: "They ___ finished the project yet.", hint: "отрицание", options: ["haven't", "hasn't", "didn't", "don't"], answer: 0, explanation: "they + yet → haven't + V3." },
  { id: 84, tenseId: "present-perfect", sentence: "We ___ each other since childhood.", hint: "know", options: ["know", "have known", "knew", "are knowing"], answer: 1, explanation: "since childhood → Present Perfect: have known." },
  { id: 85, tenseId: "present-perfect", sentence: "___ you finished your homework?", hint: "вопрос", options: ["Have", "Has", "Did", "Do"], answer: 0, explanation: "you + V3 → вопрос с Have." },
  { id: 86, tenseId: "present-perfect", sentence: "This is the best film I have ever ___.", hint: "see", options: ["seen", "saw", "see", "seeing"], answer: 0, explanation: "the best ... I have ever + V3 (seen) → Present Perfect." },

  // ----- Present Perfect Continuous -----
  { id: 87, tenseId: "present-perfect-continuous", sentence: "You look tired. Yes, I ___ all day.", hint: "work", options: ["worked", "have been working", "work", "am working"], answer: 1, explanation: "Результат сейчас + длительность → have been + V-ing." },
  { id: 88, tenseId: "present-perfect-continuous", sentence: "They ___ in this town since 2018.", hint: "live", options: ["live", "have been living", "lived", "are living"], answer: 1, explanation: "since 2018 + акцент на длительность → have been living." },
  { id: 89, tenseId: "present-perfect-continuous", sentence: "She ___ been sleeping well lately.", hint: "отрицание", options: ["hasn't", "haven't", "didn't", "isn't"], answer: 0, explanation: "she → отрицание hasn't been + V-ing." },
  { id: 90, tenseId: "present-perfect-continuous", sentence: "How long ___ you been learning English?", hint: "вопрос", options: ["have", "has", "did", "are"], answer: 0, explanation: "How long + you → have you been + V-ing." },
  { id: 91, tenseId: "present-perfect-continuous", sentence: "It ___ raining for hours; the streets are flooded.", hint: "rain", options: ["has been", "have been", "was", "is"], answer: 0, explanation: "it + длительность до настоящего → has been raining." },

  // ----- Past Simple -----
  { id: 92, tenseId: "past-simple", sentence: "I ___ a great film yesterday.", hint: "watch", options: ["watch", "watched", "have watched", "was watching"], answer: 1, explanation: "yesterday → Past Simple: watched." },
  { id: 93, tenseId: "past-simple", sentence: "She ___ born in 1998.", hint: "be", options: ["was", "were", "is", "has been"], answer: 0, explanation: "was born — устойчивая форма в прошлом (she → was)." },
  { id: 94, tenseId: "past-simple", sentence: "We ___ go out because it was raining.", hint: "отрицание", options: ["don't", "didn't", "weren't", "haven't"], answer: 1, explanation: "Отрицание в прошлом → didn't + базовый глагол." },
  { id: 95, tenseId: "past-simple", sentence: "___ you enjoy the concert?", hint: "вопрос", options: ["Did", "Do", "Have", "Were"], answer: 0, explanation: "Вопрос о прошлом → Did + подлежащее + V." },
  { id: 96, tenseId: "past-simple", sentence: "He ___ his leg while skiing.", hint: "break", options: ["breaks", "broke", "has broken", "was breaking"], answer: 1, explanation: "Завершённое действие → Past Simple: break → broke." },
  { id: 97, tenseId: "past-simple", sentence: "Where ___ you go last weekend?", hint: "вопрос", options: ["do", "did", "have", "were"], answer: 1, explanation: "last weekend → вопрос с did." },

  // ----- Past Continuous -----
  { id: 98, tenseId: "past-continuous", sentence: "At 6 pm yesterday I ___ home.", hint: "drive", options: ["drove", "was driving", "drive", "have driven"], answer: 1, explanation: "Конкретный момент прошлого → was + V-ing." },
  { id: 99, tenseId: "past-continuous", sentence: "They ___ TV when the lights went out.", hint: "watch", options: ["watched", "were watching", "watch", "had watched"], answer: 1, explanation: "Фоновое действие, прерванное другим → were watching." },
  { id: 100, tenseId: "past-continuous", sentence: "I ___ sleeping when you called.", hint: "отрицание", options: ["wasn't", "weren't", "didn't", "hadn't"], answer: 0, explanation: "I → отрицание wasn't + V-ing." },
  { id: 101, tenseId: "past-continuous", sentence: "What ___ they doing at midnight?", hint: "вопрос", options: ["was", "were", "did", "are"], answer: 1, explanation: "they + V-ing → вопрос с were." },
  { id: 102, tenseId: "past-continuous", sentence: "While she ___, someone knocked at the door.", hint: "cook", options: ["cooked", "was cooking", "cooks", "had cooked"], answer: 1, explanation: "While + длительный фон → Past Continuous." },

  // ----- Past Perfect -----
  { id: 103, tenseId: "past-perfect", sentence: "When we arrived, the concert had already ___.", hint: "begin", options: ["begun", "began", "begin", "beginning"], answer: 0, explanation: "had already + V3 (begun) — раньше другого прошлого." },
  { id: 104, tenseId: "past-perfect", sentence: "He couldn't get in because he ___ his keys.", hint: "lose", options: ["lost", "had lost", "loses", "was losing"], answer: 1, explanation: "Причина в более раннем прошлом → had + V3." },
  { id: 105, tenseId: "past-perfect", sentence: "She ___ seen snow before she moved to Canada.", hint: "отрицание", options: ["hadn't", "hasn't", "didn't", "wasn't"], answer: 0, explanation: "Отрицание в Past Perfect → hadn't + V3." },
  { id: 106, tenseId: "past-perfect", sentence: "By the time the film started, we ___ our seats.", hint: "find", options: ["found", "had found", "find", "were finding"], answer: 1, explanation: "By the time + раньше другого прошлого → had found." },
  { id: 107, tenseId: "past-perfect", sentence: "___ they met before the wedding?", hint: "вопрос", options: ["Had", "Have", "Did", "Were"], answer: 0, explanation: "Вопрос в Past Perfect → Had + подлежащее + V3." },

  // ----- Past Perfect Continuous -----
  { id: 108, tenseId: "past-perfect-continuous", sentence: "My eyes hurt because I ___ at the screen for hours.", hint: "look", options: ["looked", "had been looking", "was looking", "have been looking"], answer: 1, explanation: "Длительность до момента в прошлом → had been + V-ing." },
  { id: 109, tenseId: "past-perfect-continuous", sentence: "She was out of breath; she ___.", hint: "run", options: ["ran", "had been running", "was running", "has been running"], answer: 1, explanation: "Результат в прошлом от длительного действия → had been running." },
  { id: 110, tenseId: "past-perfect-continuous", sentence: "He ___ been feeling well before he collapsed.", hint: "отрицание", options: ["hadn't", "hasn't", "wasn't", "didn't"], answer: 0, explanation: "Отрицание → hadn't been + V-ing." },
  { id: 111, tenseId: "past-perfect-continuous", sentence: "How long ___ you been waiting before the taxi came?", hint: "вопрос", options: ["had", "have", "did", "were"], answer: 0, explanation: "How long + до другого прошлого → had you been + V-ing." },

  // ----- Future Simple (will) -----
  { id: 112, tenseId: "future-simple", sentence: "Don't worry, everything ___ be fine.", hint: "will", options: ["will", "is going to", "shall", "is"], answer: 0, explanation: "Прогноз/успокоение → will + V." },
  { id: 113, tenseId: "future-simple", sentence: "I ___ tell anyone your secret.", hint: "отрицание", options: ["won't", "don't", "am not", "didn't"], answer: 0, explanation: "Обещание в отрицании → won't + V." },
  { id: 114, tenseId: "future-simple", sentence: "___ you help me with this box?", hint: "вопрос", options: ["Will", "Do", "Are", "Did"], answer: 0, explanation: "Просьба/вопрос о будущем → Will + подлежащее + V." },
  { id: 115, tenseId: "future-simple", sentence: "I think our team ___ win the match.", hint: "will?", options: ["will", "is going to", "wins", "won"], answer: 0, explanation: "Мнение/прогноз с I think → will." },
  { id: 116, tenseId: "future-simple", sentence: "The meeting ___ probably start late.", hint: "will", options: ["will", "is", "does", "would"], answer: 0, explanation: "probably → прогноз с will." },

  // ----- Future: going to -----
  { id: 117, tenseId: "future-going-to", sentence: "I ___ visit my grandparents next week.", hint: "plan", options: ["will", "am going to", "go", "going"], answer: 1, explanation: "Заранее запланировано → be going to." },
  { id: 118, tenseId: "future-going-to", sentence: "Careful! You ___ drop that glass.", hint: "evidence", options: ["will", "are going to", "drop", "dropped"], answer: 1, explanation: "Предсказание по очевидным признакам → be going to." },
  { id: 119, tenseId: "future-going-to", sentence: "We ___ going to buy a new car this year.", hint: "отрицание", options: ["aren't", "don't", "won't", "isn't"], answer: 0, explanation: "we → отрицание aren't going to + V." },
  { id: 120, tenseId: "future-going-to", sentence: "___ she going to study abroad?", hint: "вопрос", options: ["Is", "Does", "Will", "Are"], answer: 0, explanation: "she → вопрос Is + подлежащее + going to + V." },

  // ----- Future Continuous -----
  { id: 121, tenseId: "future-continuous", sentence: "This time next week I ___ on a plane to Tokyo.", hint: "sit", options: ["will sit", "will be sitting", "sit", "am sitting"], answer: 1, explanation: "Действие в процессе в момент будущего → will be + V-ing." },
  { id: 122, tenseId: "future-continuous", sentence: "At this time tomorrow we ___ dinner.", hint: "have", options: ["will have", "will be having", "have", "are having"], answer: 1, explanation: "Конкретный момент будущего → will be having." },
  { id: 123, tenseId: "future-continuous", sentence: "I ___ be working tomorrow, so we can meet.", hint: "отрицание", options: ["won't", "am not", "don't", "wasn't"], answer: 0, explanation: "Отрицание → won't be + V-ing." },
  { id: 124, tenseId: "future-continuous", sentence: "___ you be using your laptop tonight?", hint: "вопрос", options: ["Will", "Are", "Do", "Shall"], answer: 0, explanation: "Вопрос → Will + подлежащее + be + V-ing." },

  // ----- Future Perfect -----
  { id: 125, tenseId: "future-perfect", sentence: "By 2030 scientists ___ a cure, I hope.", hint: "find", options: ["will find", "will have found", "find", "are finding"], answer: 1, explanation: "By 2030 → завершится к моменту → will have + V3." },
  { id: 126, tenseId: "future-perfect", sentence: "I ___ this book by Friday.", hint: "read", options: ["will read", "will have read", "read", "am reading"], answer: 1, explanation: "by Friday → Future Perfect: will have read." },
  { id: 127, tenseId: "future-perfect", sentence: "She ___ have finished by then.", hint: "отрицание", options: ["won't", "doesn't", "isn't", "didn't"], answer: 0, explanation: "Отрицание → won't have + V3." },
  { id: 128, tenseId: "future-perfect", sentence: "___ they have built the bridge by next summer?", hint: "вопрос", options: ["Will", "Are", "Do", "Have"], answer: 0, explanation: "Вопрос → Will + подлежащее + have + V3." },

  // ----- Future Perfect Continuous -----
  { id: 129, tenseId: "future-perfect-continuous", sentence: "By December I ___ here for two years.", hint: "work", options: ["will work", "will have been working", "will be working", "have worked"], answer: 1, explanation: "Длительность к моменту в будущем → will have been + V-ing." },
  { id: 130, tenseId: "future-perfect-continuous", sentence: "By the end of the trip we ___ for 12 hours.", hint: "drive", options: ["will drive", "will have been driving", "will be driving", "drove"], answer: 1, explanation: "Акцент на длительности до будущего → will have been driving." },
  { id: 131, tenseId: "future-perfect-continuous", sentence: "How long ___ you have been studying by graduation?", hint: "вопрос", options: ["will", "are", "do", "have"], answer: 0, explanation: "Вопрос → Will + подлежащее + have been + V-ing." },
  { id: 132, tenseId: "future-perfect-continuous", sentence: "Next month she ___ Spanish for a year.", hint: "learn", options: ["will learn", "will have been learning", "will be learning", "learns"], answer: 1, explanation: "Длительность к будущему моменту → will have been learning." },

  // ===== Задания «определи время» (kind: identify) =====
  { id: 133, tenseId: "present-continuous", kind: "identify", sentence: "She is cooking dinner right now.", options: ["Present Simple", "Present Continuous", "Present Perfect", "Past Continuous"], answer: 1, explanation: "am/is/are + V-ing + right now → Present Continuous." },
  { id: 134, tenseId: "past-simple", kind: "identify", sentence: "They played football yesterday.", options: ["Past Simple", "Past Continuous", "Present Perfect", "Past Perfect"], answer: 0, explanation: "V2 (played) + yesterday → Past Simple." },
  { id: 135, tenseId: "present-perfect-continuous", kind: "identify", sentence: "He has been working since morning.", options: ["Present Perfect", "Present Perfect Continuous", "Past Perfect Continuous", "Present Continuous"], answer: 1, explanation: "has been + V-ing + since → Present Perfect Continuous." },
  { id: 136, tenseId: "future-simple", kind: "identify", sentence: "I will call you later.", options: ["Future Continuous", "Future Simple", "Future: going to", "Future Perfect"], answer: 1, explanation: "will + V → Future Simple." },
  { id: 137, tenseId: "future-going-to", kind: "identify", sentence: "Look at those clouds — it is going to rain.", options: ["Future Simple", "Future Continuous", "Future: going to", "Present Continuous"], answer: 2, explanation: "is going to + V + очевидные признаки → be going to." },
  { id: 138, tenseId: "past-perfect-continuous", kind: "identify", sentence: "She had been studying for hours before the exam.", options: ["Past Perfect", "Past Perfect Continuous", "Present Perfect Continuous", "Past Continuous"], answer: 1, explanation: "had been + V-ing + before → Past Perfect Continuous." },
  { id: 139, tenseId: "present-simple", kind: "identify", sentence: "He plays the guitar every evening.", options: ["Present Continuous", "Present Simple", "Present Perfect", "Past Simple"], answer: 1, explanation: "V-s + every evening → Present Simple." },
  { id: 140, tenseId: "past-continuous", kind: "identify", sentence: "I was reading when she arrived.", options: ["Past Simple", "Past Continuous", "Past Perfect", "Present Continuous"], answer: 1, explanation: "was + V-ing (фон) → Past Continuous." },
  { id: 141, tenseId: "present-perfect", kind: "identify", sentence: "We have lived here for ten years.", options: ["Past Simple", "Present Perfect", "Present Perfect Continuous", "Past Perfect"], answer: 1, explanation: "have + V3 + for → Present Perfect." },
  { id: 142, tenseId: "future-continuous", kind: "identify", sentence: "At 8 pm I will be watching a film.", options: ["Future Simple", "Future Continuous", "Future Perfect", "Present Continuous"], answer: 1, explanation: "will be + V-ing в момент будущего → Future Continuous." },
  { id: 143, tenseId: "future-perfect", kind: "identify", sentence: "They will have left by the time you come.", options: ["Future Simple", "Future Continuous", "Future Perfect", "Future Perfect Continuous"], answer: 2, explanation: "will have + V3 + by the time → Future Perfect." },
  { id: 144, tenseId: "past-perfect", kind: "identify", sentence: "The train had already left when we got there.", options: ["Past Simple", "Past Perfect", "Present Perfect", "Past Continuous"], answer: 1, explanation: "had + V3 (left), раньше другого прошлого → Past Perfect." },
  { id: 145, tenseId: "future-perfect-continuous", kind: "identify", sentence: "By May they will have been dating for a year.", options: ["Future Perfect", "Future Perfect Continuous", "Future Continuous", "Present Perfect Continuous"], answer: 1, explanation: "will have been + V-ing + by May → Future Perfect Continuous." },

];