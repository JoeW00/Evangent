import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { getAdjacentChapters } from "../data/chapters";

export function useKeyboardNav({ onOpenSearch }) {
  const navigate = useNavigate();
  const { chapterId } = useParams();

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "ArrowLeft" && chapterId) {
        const { prev } = getAdjacentChapters(chapterId);
        if (prev) navigate(`/chapter/${prev.id}`);
      } else if (e.key === "ArrowRight" && chapterId) {
        const { next } = getAdjacentChapters(chapterId);
        if (next) navigate(`/chapter/${next.id}`);
      } else if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || e.key === "/") {
        e.preventDefault();
        onOpenSearch();
      } else if (e.key === "Home" && chapterId) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [chapterId, navigate, onOpenSearch]);
}
