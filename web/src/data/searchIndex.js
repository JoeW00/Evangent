import Fuse from "fuse.js";
import { chapters } from "./chapters";

const zhModules = import.meta.glob("../../../docs/zh/*.md", { query: "?raw", import: "default" });
const enModules = import.meta.glob("../../../docs/en/*.md", { query: "?raw", import: "default" });

let fuseInstance = null;
let buildPromise = null;

async function buildDocuments() {
  const docs = [];

  for (const ch of chapters) {
    const zhKey = `../../../docs/zh/${ch.zh.file}`;
    const zhLoader = zhModules[zhKey];
    if (zhLoader) {
      const zhContent = await zhLoader();
      const paragraphs = zhContent.split(/\n{2,}/).filter((p) => p.trim());
      paragraphs.forEach((text, i) => {
        docs.push({ chapterId: ch.id, lang: "zh", paragraphIndex: i, text: text.trim(), chapterTitle: ch.zh.title });
      });
    }

    const enKey = `../../../docs/en/${ch.en.file}`;
    const enLoader = enModules[enKey];
    if (enLoader) {
      const enContent = await enLoader();
      const paragraphs = enContent.split(/\n{2,}/).filter((p) => p.trim());
      paragraphs.forEach((text, i) => {
        docs.push({ chapterId: ch.id, lang: "en", paragraphIndex: i, text: text.trim(), chapterTitle: ch.en.title });
      });
    }
  }

  return docs;
}

export async function getSearchIndex() {
  if (fuseInstance) return fuseInstance;
  if (!buildPromise) {
    buildPromise = buildDocuments().then((docs) => {
      fuseInstance = new Fuse(docs, {
        keys: ["text"],
        includeMatches: true,
        threshold: 0.3,
        minMatchCharLength: 2,
      });
      return fuseInstance;
    });
  }
  return buildPromise;
}

export async function search(query, limit = 50) {
  const fuse = await getSearchIndex();
  return fuse.search(query, { limit }).map((result) => {
    const { text, chapterId, lang, chapterTitle } = result.item;
    const matchIndex = text.toLowerCase().indexOf(query.toLowerCase());
    const start = Math.max(0, matchIndex - 30);
    const end = Math.min(text.length, matchIndex + query.length + 30);
    const excerpt = (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "");

    return { chapterId, lang, chapterTitle, excerpt, score: result.score };
  });
}
