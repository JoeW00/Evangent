import { useState, useEffect } from "react";

const STORAGE_KEY = "evangent-reading-progress";
const READ_KEY = "evangent-chapters-read";

export function useReadingProgress(chapterId) {
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    if (!chapterId) return;

    let rafId = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const el = document.documentElement;
        const maxScroll = el.scrollHeight - el.clientHeight;
        const ratio = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
        setScrollRatio(ratio);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [chapterId]);

  useEffect(() => {
    if (!chapterId) return;

    const save = () => {
      const el = document.documentElement;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const ratio = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lastChapter: chapterId, scrollRatio: ratio }));

      if (ratio > 0.8) {
        const read = JSON.parse(localStorage.getItem(READ_KEY) || "[]");
        if (!read.includes(chapterId)) {
          read.push(chapterId);
          localStorage.setItem(READ_KEY, JSON.stringify(read));
        }
      }
    };

    window.addEventListener("beforeunload", save);
    return () => {
      save();
      window.removeEventListener("beforeunload", save);
    };
  }, [chapterId]);

  return { scrollRatio };
}

export function getSavedProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function getReadChapters() {
  try {
    return JSON.parse(localStorage.getItem(READ_KEY) || "[]");
  } catch {
    return [];
  }
}
