import { Link, useLocation } from "react-router";
import { getChapter } from "../../data/chapters";

export default function Header({ onToggleSidebar, onToggleDarkMode, isDark, fontSize, onFontSizeChange, onOpenSearch }) {
  const location = useLocation();
  const match = location.pathname.match(/^\/chapter\/(.+)/);
  const chapterId = match ? match[1] : null;
  const chapter = chapterId ? getChapter(chapterId) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] dark:border-[var(--color-dark-text-muted)] bg-[var(--color-bg-content)] dark:bg-[var(--color-dark-bg-content)] font-[var(--font-sans-ui)]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-[var(--color-bg-en)] dark:hover:bg-[var(--color-dark-bg-en)]"
            aria-label="開啟目錄"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link
            to="/"
            className="text-[var(--color-primary)] dark:text-[var(--color-dark-primary)] font-semibold text-sm truncate"
          >
            {chapter
              ? `《孩子的屬靈覺醒》${chapter.zh.title}`
              : "福音大翻譯計劃"}
          </Link>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-0.5">
          {/* Font size */}
          <button
            onClick={() => onFontSizeChange(-1)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-sm rounded-md hover:bg-[var(--color-bg-en)] dark:hover:bg-[var(--color-dark-bg-en)]"
            aria-label="縮小字型"
          >
            A-
          </button>
          <button
            onClick={() => onFontSizeChange(1)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-sm rounded-md hover:bg-[var(--color-bg-en)] dark:hover:bg-[var(--color-dark-bg-en)]"
            aria-label="放大字型"
          >
            A+
          </button>

          {/* Search */}
          <button
            onClick={onOpenSearch}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-[var(--color-bg-en)] dark:hover:bg-[var(--color-dark-bg-en)]"
            aria-label="搜尋"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Dark mode */}
          <button
            onClick={onToggleDarkMode}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-[var(--color-bg-en)] dark:hover:bg-[var(--color-dark-bg-en)]"
            aria-label={isDark ? "切換亮色模式" : "切換深色模式"}
          >
            {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
          </button>
        </div>
      </div>
    </header>
  );
}
