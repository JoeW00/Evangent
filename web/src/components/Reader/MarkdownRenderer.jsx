import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const FONT_SIZES = [
  { zh: "15px", en: "14px" },
  { zh: "17px", en: "16px" },
  { zh: "20px", en: "19px" },
];

const REMARK_PLUGINS = [remarkGfm];

export default memo(function MarkdownRenderer({ content, lang = "zh", fontSize = 1, highlightTerms = null }) {
  const size = FONT_SIZES[fontSize] || FONT_SIZES[1];

  const components = useMemo(() => ({
    blockquote: ({ children }) => (
      <blockquote className="border-l-[3px] border-[var(--color-accent)] dark:border-[var(--color-dark-accent)] bg-[var(--color-bg-en)] dark:bg-[var(--color-dark-bg-en)] pl-4 py-2 my-4 text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] italic">
        {children}
      </blockquote>
    ),
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mt-8 mb-4 text-[var(--color-primary)] dark:text-[var(--color-dark-primary)]">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-semibold mt-8 mb-3 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)]">
        {children}
      </h2>
    ),
    p: ({ children }) => (
      <p className="mb-[1.5em] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)]">{children}</p>
    ),
    a: ({ children, href }) => (
      <a href={href} className="text-[var(--color-primary)] dark:text-[var(--color-dark-primary)] underline hover:opacity-80">
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)]">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)]">{children}</em>
    ),
  }), []);

  return (
    <article
      lang={lang === "zh" ? "zh-TW" : "en"}
      className="prose max-w-none"
      style={{
        fontSize: lang === "zh" ? size.zh : size.en,
        lineHeight: 1.85,
        fontFamily: lang === "zh"
          ? "var(--font-serif-zh)"
          : "var(--font-serif-en)",
      }}
    >
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
});
