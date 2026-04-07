import { useState, useEffect } from "react";
import { getChapter } from "../data/chapters";
import { loadMarkdown } from "../utils/markdownLoader";

export function useChapterContent(chapterId) {
  const [content, setContent] = useState({ zh: null, en: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const chapter = getChapter(chapterId);
    if (!chapter) {
      setError("Chapter not found");
      setLoading(false);
      return;
    }

    Promise.all([
      loadMarkdown("zh", chapter.zh.file),
      loadMarkdown("en", chapter.en.file),
    ])
      .then(([zh, en]) => {
        if (!cancelled) {
          setContent({ zh, en });
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [chapterId]);

  return { content, loading, error };
}
