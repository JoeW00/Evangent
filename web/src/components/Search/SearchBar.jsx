import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { search } from "../../data/searchIndex";

export default function SearchBar({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      setResults(search(value.trim()));
    } else {
      setResults([]);
    }
  };

  const handleSelect = (result) => {
    onClose();
    navigate(`/chapter/${result.chapterId}?q=${encodeURIComponent(query)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-lg mx-4 bg-[--color-bg-content] dark:bg-[--color-dark-bg-content] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center px-4 border-b border-[--color-border] dark:border-[--color-dark-text-muted]">
          <svg className="w-5 h-5 text-[--color-text-muted] dark:text-[--color-dark-text-muted] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜尋全書..."
            className="flex-1 px-3 py-4 bg-transparent outline-none font-[--font-sans-ui] text-[--color-text-primary] dark:text-[--color-dark-text-primary] placeholder:text-[--color-text-muted] dark:placeholder:text-[--color-dark-text-muted]"
          />
          <kbd className="text-xs text-[--color-text-muted] dark:text-[--color-dark-text-muted] border border-[--color-border] dark:border-[--color-dark-text-muted] rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto p-2">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => handleSelect(r)}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[--color-bg-en] dark:hover:bg-[--color-dark-bg-en] transition-colors"
              >
                <p className="text-sm font-medium font-[--font-sans-ui] text-[--color-primary] dark:text-[--color-dark-primary]">
                  {r.chapterTitle}
                </p>
                <p className="text-xs text-[--color-text-secondary] dark:text-[--color-dark-text-secondary] mt-0.5 line-clamp-2">
                  {r.excerpt}
                </p>
              </button>
            ))}
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="p-6 text-center text-sm text-[--color-text-muted] dark:text-[--color-dark-text-muted] font-[--font-sans-ui]">
            沒有找到符合的結果，試試其他關鍵字？
          </div>
        )}
      </div>
    </div>
  );
}
