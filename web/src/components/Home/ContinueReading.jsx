import { Link } from "react-router";
import { getSavedProgress } from "../../hooks/useReadingProgress";
import { getChapter } from "../../data/chapters";

export default function ContinueReading() {
  const progress = getSavedProgress();
  if (!progress) return null;

  const chapter = getChapter(progress.lastChapter);
  if (!chapter) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 mb-8">
      <Link
        to={`/chapter/${chapter.id}`}
        aria-label={`繼續閱讀：${chapter.zh.title}，進度 ${Math.round(progress.scrollRatio * 100)}%`}
        className="block rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-text-muted)] p-4 hover:bg-[var(--color-bg-en)] dark:hover:bg-[var(--color-dark-bg-en)] transition-colors"
      >
        <p className="text-xs font-[var(--font-sans-ui)] text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-muted)] mb-1">
          繼續閱讀
        </p>
        <p className="font-[var(--font-serif-zh)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)]">
          {chapter.zh.title}
        </p>
        <p className="text-sm font-[var(--font-serif-en)] text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
          {chapter.en.title}
        </p>
        <div className="mt-2 h-1 bg-[var(--color-bg-en)] dark:bg-[var(--color-dark-bg-en)] rounded-full overflow-hidden" aria-hidden="true">
          <div
            className="h-full bg-[var(--color-accent)] dark:bg-[var(--color-dark-accent)] rounded-full"
            style={{ width: `${Math.round(progress.scrollRatio * 100)}%` }}
          />
        </div>
      </Link>
    </div>
  );
}
