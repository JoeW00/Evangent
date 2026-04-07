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
        className="block rounded-xl border border-[--color-border] dark:border-[--color-dark-text-muted] p-4 hover:bg-[--color-bg-en] dark:hover:bg-[--color-dark-bg-en] transition-colors"
      >
        <p className="text-xs font-[--font-sans-ui] text-[--color-text-muted] dark:text-[--color-dark-text-muted] mb-1">
          繼續閱讀
        </p>
        <p className="font-[--font-serif-zh] text-[--color-text-primary] dark:text-[--color-dark-text-primary]">
          {chapter.zh.title}
        </p>
        <p className="text-sm font-[--font-serif-en] text-[--color-text-secondary] dark:text-[--color-dark-text-secondary]">
          {chapter.en.title}
        </p>
        <div className="mt-2 h-1 bg-[--color-bg-en] dark:bg-[--color-dark-bg-en] rounded-full overflow-hidden">
          <div
            className="h-full bg-[--color-accent] dark:bg-[--color-dark-accent] rounded-full"
            style={{ width: `${Math.round(progress.scrollRatio * 100)}%` }}
          />
        </div>
      </Link>
    </div>
  );
}
