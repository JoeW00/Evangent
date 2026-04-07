import { useSyncScroll } from "../../hooks/useSyncScroll";
import MarkdownRenderer from "./MarkdownRenderer";

export default function BilingualPane({ zhContent, enContent, fontSize }) {
  const { leftRef, rightRef } = useSyncScroll();

  return (
    <div className="flex flex-1 min-h-0">
      {/* Chinese column */}
      <div
        ref={leftRef}
        role="region"
        aria-label="中文內容"
        tabIndex={0}
        className="w-1/2 overflow-y-auto px-6 lg:px-8 py-6 bg-[--color-bg-content] dark:bg-[--color-dark-bg-content] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[--color-primary] dark:focus-visible:outline-[--color-dark-primary]"
      >
        <MarkdownRenderer content={zhContent} lang="zh" fontSize={fontSize} />
      </div>

      {/* Divider */}
      <div className="w-px bg-[--color-border] dark:bg-[--color-dark-text-muted] flex-shrink-0" aria-hidden="true" />

      {/* English column */}
      <div
        ref={rightRef}
        role="region"
        aria-label="English content"
        tabIndex={0}
        className="w-1/2 overflow-y-auto px-6 lg:px-8 py-6 bg-[--color-bg-en] dark:bg-[--color-dark-bg-en] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[--color-primary] dark:focus-visible:outline-[--color-dark-primary]"
      >
        <MarkdownRenderer content={enContent} lang="en" fontSize={fontSize} />
      </div>
    </div>
  );
}
