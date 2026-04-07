export const chapters = [
  {
    id: "foreword",
    zh: { file: "00-序.md", title: "序" },
    en: { file: "00-foreword.md", title: "Foreword" },
    part: null,
  },
  {
    id: "introduction",
    zh: { file: "00-引言.md", title: "引言" },
    en: { file: "00-introduction.md", title: "Introduction" },
    part: null,
  },
  {
    id: "ch01",
    zh: { file: "01-神所建造的殿.md", title: "神所建造的殿" },
    en: { file: "01-the-house-that-god-builds.md", title: "The House That God Builds" },
    part: { zh: "第一部：與神一同建造", en: "Part 1: Building with God" },
  },
  {
    id: "ch02",
    zh: { file: "02-孩子們所當行的路.md", title: "孩子們所當行的路" },
    en: { file: "02-the-way-they-should-go.md", title: "The Way They Should Go" },
    part: null,
  },
  {
    id: "ch03",
    zh: { file: "03-保有初心.md", title: "保有初心" },
    en: { file: "03-stay-a-novice.md", title: "Stay a Novice" },
    part: null,
  },
  {
    id: "ch04",
    zh: { file: "04-興起兒女.md", title: "興起兒女" },
    en: { file: "04-raising-sons-and-daughters.md", title: "Raising Sons and Daughters" },
    part: { zh: "第二部：跟隨聖靈引導的父母", en: "Part 2: The Spirit-Guided Parent" },
  },
  {
    id: "ch05",
    zh: { file: "05-與神一同築夢.md", title: "與神一同築夢" },
    en: { file: "05-dreaming-with-god.md", title: "Dreaming with God" },
    part: null,
  },
  {
    id: "ch06",
    zh: { file: "06-不要一直講真理.md", title: "不要（一直）講真理" },
    en: { file: "06-do-not-always-tell-the-truth.md", title: "Do Not (Always) Tell the Truth" },
    part: null,
  },
  {
    id: "ch07",
    zh: { file: "07-學習神怎麼拼字.md", title: "學習神怎麼拼字" },
    en: { file: "07-learning-gods-alphabet.md", title: "Learning God's Alphabet" },
    part: { zh: "第三部：被聖靈充滿的孩子", en: "Part 3: Spirit-Filled Children" },
  },
  {
    id: "ch08",
    zh: { file: "08-當孩子們看見.md", title: "當孩子們看見" },
    en: { file: "08-when-children-see.md", title: "When Children See" },
    part: null,
  },
  {
    id: "ch09",
    zh: { file: "09-操練我們的感官.md", title: "操練我們的感官" },
    en: { file: "09-training-our-senses.md", title: "Training Our Senses" },
    part: null,
  },
  {
    id: "ch10",
    zh: { file: "10-道成肉身.md", title: "道成肉身" },
    en: { file: "10-the-word-became-flesh.md", title: "The Word Became Flesh" },
    part: null,
  },
  {
    id: "ch11",
    zh: { file: "11-他們有跟過耶穌.md", title: "他們有跟過耶穌" },
    en: { file: "11-they-have-been-with-jesus.md", title: "They Have Been with Jesus" },
    part: null,
  },
  {
    id: "ch12",
    zh: { file: "12-保持渴慕.md", title: "保持渴慕" },
    en: { file: "12-staying-hungry.md", title: "Staying Hungry" },
    part: { zh: "第四部：結論", en: "Part 4: Conclusion" },
  },
  {
    id: "ch13",
    zh: { file: "13-爭戰與建造.md", title: "爭戰與建造" },
    en: { file: "13-fighting-and-building.md", title: "Fighting and Building" },
    part: null,
  },
];

export function getChapter(id) {
  return chapters.find((ch) => ch.id === id);
}

export function getAdjacentChapters(id) {
  const index = chapters.findIndex((ch) => ch.id === id);
  return {
    prev: index > 0 ? chapters[index - 1] : null,
    next: index < chapters.length - 1 ? chapters[index + 1] : null,
  };
}
