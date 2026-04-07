import { useSyncScroll } from "../../hooks/useSyncScroll";
import MarkdownRenderer from "./MarkdownRenderer";

export default function BilingualPane({ zhContent, enContent, fontSize }) {
  const { leftRef, rightRef } = useSyncScroll();

  return (
    <div className="flex flex-1 min-h-0">
      {/* Chinese column */}
      <div
        ref={leftRef}
        className="w-1/2 overflow-y-auto px-8 py-6 bg-[--color-bg-content] dark:bg-[--color-dark-bg-content]"
      >
        <MarkdownRenderer content={zhContent} lang="zh" fontSize={fontSize} />
      </div>

      {/* Divider */}
      <div className="w-px bg-[--color-border] dark:bg-[--color-dark-text-muted] flex-shrink-0" />

      {/* English column */}
      <div
        ref={rightRef}
        className="w-1/2 overflow-y-auto px-8 py-6 bg-[--color-bg-en] dark:bg-[--color-dark-bg-en]"
      >
        <MarkdownRenderer content={enContent} lang="en" fontSize={fontSize} />
      </div>
    </div>
  );
}
