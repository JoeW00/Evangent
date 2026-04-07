import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { search } from "../../data/searchIndex";

export default function SearchBar({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const resultRefs = useRef([]);
  const navigate = useNavigate();

  // Capture the element that triggered the modal
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery("");
      setResults([]);
      setActiveIndex(-1);
      // Return focus to trigger element
      if (triggerRef.current) {
        triggerRef.current.focus();
        triggerRef.current = null;
      }
    }
  }, [isOpen]);

  // Keyboard: Escape, focus trap, arrow keys for results
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Arrow key navigation for search results
      if (e.key === "ArrowDown" && results.length > 0) {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev < results.length - 1 ? prev + 1 : 0;
          resultRefs.current[next]?.focus();
          return next;
        });
        return;
      }
      if (e.key === "ArrowUp" && results.length > 0) {
        e.preventDefault();
        setActiveIndex((prev) => {
          const next = prev > 0 ? prev - 1 : results.length - 1;
          resultRefs.current[next]?.focus();
          return next;
        });
        return;
      }

      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'input, button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose, results.length]);

  // Debounced search
  const debounceRef = useRef(null);
  const handleSearch = useCallback((value) => {
    setQuery(value);
    setActiveIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(async () => {
        const r = await search(value.trim());
        setResults(r);
      }, 250);
    } else {
      setResults([]);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSelect = (result) => {
    onClose();
    navigate(`/chapter/${result.chapterId}?q=${encodeURIComponent(query)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="搜尋"
        className="relative w-full max-w-lg mx-4 sm:mx-auto bg-[--color-bg-content] dark:bg-[--color-dark-bg-content] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center px-4 border-b border-[--color-border] dark:border-[--color-dark-text-muted]">
          <svg className="w-5 h-5 text-[--color-text-muted] dark:text-[--color-dark-text-muted] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜尋全書..."
            aria-label="輸入搜尋關鍵字"
            aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
            className="flex-1 px-3 py-4 bg-transparent outline-none font-[--font-sans-ui] text-[--color-text-primary] dark:text-[--color-dark-text-primary] placeholder:text-[--color-text-muted] dark:placeholder:text-[--color-dark-text-muted]"
          />
          <kbd className="text-xs text-[--color-text-muted] dark:text-[--color-dark-text-muted] border border-[--color-border] dark:border-[--color-dark-text-muted] rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Results with live region */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {query.length >= 2 && (results.length > 0
            ? `找到 ${results.length} 筆結果，使用上下方向鍵瀏覽`
            : "沒有找到結果")}
        </div>

        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto p-2" role="listbox" aria-label="搜尋結果">
            {results.map((r, i) => (
              <button
                key={i}
                ref={(el) => (resultRefs.current[i] = el)}
                id={`search-result-${i}`}
                role="option"
                aria-selected={activeIndex === i}
                onClick={() => handleSelect(r)}
                className={`w-full text-left px-3 py-3 rounded-lg hover:bg-[--color-bg-en] dark:hover:bg-[--color-dark-bg-en] focus-visible:outline-2 focus-visible:outline-[--color-primary] dark:focus-visible:outline-[--color-dark-primary] transition-colors ${
                  activeIndex === i ? "bg-[--color-bg-en] dark:bg-[--color-dark-bg-en]" : ""
                }`}
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
