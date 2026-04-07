import { Link } from "react-router";
import { chapters } from "../../data/chapters";

export default function TableOfContents() {
  let currentPart = null;

  return (
    <nav className="max-w-2xl mx-auto px-4 pb-16" aria-label="目錄">
      <h2 className="sr-only">目錄</h2>
      <div className="space-y-2">
        {chapters.map((ch) => {
          const showPart = ch.part && ch.part.zh !== currentPart;
          if (ch.part) currentPart = ch.part.zh;

          return (
            <div key={ch.id}>
              {showPart && (
                <div className="mt-8 mb-3 pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-text-muted)]">
                  <h3 className="text-sm font-semibold text-[var(--color-accent)] dark:text-[var(--color-dark-accent)] font-[var(--font-sans-ui)]">
                    {ch.part.zh}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-muted)] font-[var(--font-sans-ui)]">
                    {ch.part.en}
                  </p>
                </div>
              )}
              <Link
                to={`/chapter/${ch.id}`}
                className="block rounded-lg px-4 py-3 hover:bg-[var(--color-bg-en)] dark:hover:bg-[var(--color-dark-bg-en)] transition-colors"
              >
                <p className="font-[var(--font-serif-zh)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)]">
                  {ch.zh.title}
                </p>
                <p className="text-sm font-[var(--font-serif-en)] text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
                  {ch.en.title}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
