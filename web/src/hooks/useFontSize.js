import { useState } from "react";

export function useFontSize() {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("evangent-font-size");
    return saved !== null ? Number(saved) : 1;
  });

  const change = (delta) => {
    setFontSize((s) => {
      const next = Math.max(0, Math.min(2, s + delta));
      localStorage.setItem("evangent-font-size", String(next));
      return next;
    });
  };

  return { fontSize, changeFontSize: change };
}
