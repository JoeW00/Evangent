import { Link } from "react-router";
import { getAdjacentChapters } from "../../data/chapters";

export default function ChapterNav({ chapterId }) {
  const { prev, next } = getAdjacentChapters(chapterId);

  return (
    <nav
      aria-label="章節導航"
      className="flex items-center justify-center gap-4 sm:gap-6 py-6 border-t border-[var(--color-border)] dark:border-[var(--color-dark-text-muted)] font-[var(--font-sans-ui)] text-sm flex-wrap"
    >
      {prev && (
        <Link to={`/chapter/${prev.id}`} className="text-[var(--color-primary)] dark:text-[var(--color-dark-primary)] hover:underline">
          &larr; {prev.zh.title}
        </Link>
      )}
      <Link to="/" className="text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] hover:underline">
        目錄
      </Link>
      {next && (
        <Link to={`/chapter/${next.id}`} className="text-[var(--color-primary)] dark:text-[var(--color-dark-primary)] hover:underline">
          {next.zh.title} &rarr;
        </Link>
      )}
    </nav>
  );
}
