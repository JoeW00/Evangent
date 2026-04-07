import { Link } from "react-router";
import { getAdjacentChapters } from "../../data/chapters";

export default function ChapterNav({ chapterId }) {
  const { prev, next } = getAdjacentChapters(chapterId);

  return (
    <nav className="flex items-center justify-center gap-6 py-6 border-t border-[--color-border] dark:border-[--color-dark-text-muted] font-[--font-sans-ui] text-sm">
      {prev ? (
        <Link to={`/chapter/${prev.id}`} className="text-[--color-primary] dark:text-[--color-dark-primary] hover:underline">
          &larr; {prev.zh.title}
        </Link>
      ) : (
        <span />
      )}
      <Link to="/" className="text-[--color-text-secondary] dark:text-[--color-dark-text-secondary] hover:underline">
        目錄
      </Link>
      {next ? (
        <Link to={`/chapter/${next.id}`} className="text-[--color-primary] dark:text-[--color-dark-primary] hover:underline">
          {next.zh.title} &rarr;
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
