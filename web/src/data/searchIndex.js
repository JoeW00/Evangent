import Fuse from "fuse.js";
import { chapters } from "./chapters";

const zhModules = import.meta.glob("../../../docs/zh/*.md", { query: "?raw", import: "default", eager: true });
const enModules = import.meta.glob("../../../docs/en/*.md", { query: "?raw", import: "default", eager: true });

let fuseInstance = null;

function buildDocuments() {
  const docs = [];

  for (const ch of chapters) {
    const zhKey = `../../../docs/zh/${ch.zh.file}`;
    const zhContent = zhModules[zhKey];
    if (zhContent) {
      const paragraphs = zhContent.split(/\n{2,}/).filter((p) => p.trim());
      paragraphs.forEach((text, i) => {
        docs.push({ chapterId: ch.id, lang: "zh", paragraphIndex: i, text: text.trim(), chapterTitle: ch.zh.title });
      });
    }

    const enKey = `../../../docs/en/${ch.en.file}`;
    const enContent = enModules[enKey];
    if (enContent) {
      const paragraphs = enContent.split(/\n{2,}/).filter((p) => p.trim());
      paragraphs.forEach((text, i) => {
        docs.push({ chapterId: ch.id, lang: "en", paragraphIndex: i, text: text.trim(), chapterTitle: ch.en.title });
      });
    }
  }

  return docs;
}

export function getSearchIndex() {
  if (!fuseInstance) {
    const docs = buildDocuments();
    fuseInstance = new Fuse(docs, {
      keys: ["text"],
      includeMatches: true,
      threshold: 0.3,
      minMatchCharLength: 2,
    });
  }
  return fuseInstance;
}

export function search(query, limit = 50) {
  const fuse = getSearchIndex();
  return fuse.search(query, { limit }).map((result) => {
    const { text, chapterId, lang, chapterTitle } = result.item;
    const matchIndex = text.toLowerCase().indexOf(query.toLowerCase());
    const start = Math.max(0, matchIndex - 30);
    const end = Math.min(text.length, matchIndex + query.length + 30);
    const excerpt = (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "");

    return { chapterId, lang, chapterTitle, excerpt, score: result.score };
  });
}
