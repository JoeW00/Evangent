import { useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

const TABS = [
  { key: "zh", label: "中文" },
  { key: "en", label: "English" },
  { key: "bilingual", label: "對照" },
];

export default function MobileReader({ zhContent, enContent, fontSize }) {
  const [activeTab, setActiveTab] = useState("zh");

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Tab bar */}
      <div className="flex border-b border-[--color-border] dark:border-[--color-dark-text-muted] bg-[--color-bg-content] dark:bg-[--color-dark-bg-content] sticky top-14 z-30">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 text-sm font-[--font-sans-ui] transition-colors ${
              activeTab === tab.key
                ? "text-[--color-primary] dark:text-[--color-dark-primary] border-b-2 border-[--color-primary] dark:border-[--color-dark-primary] font-medium"
                : "text-[--color-text-secondary] dark:text-[--color-dark-text-secondary]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {activeTab === "zh" && (
          <MarkdownRenderer content={zhContent} lang="zh" fontSize={fontSize} />
        )}
        {activeTab === "en" && (
          <MarkdownRenderer content={enContent} lang="en" fontSize={fontSize} />
        )}
        {activeTab === "bilingual" && (
          <BilingualInterleaved zhContent={zhContent} enContent={enContent} fontSize={fontSize} />
        )}
      </div>
    </div>
  );
}

function BilingualInterleaved({ zhContent, enContent, fontSize }) {
  const zhParagraphs = splitParagraphs(zhContent);
  const enParagraphs = splitParagraphs(enContent);
  const maxLen = Math.max(zhParagraphs.length, enParagraphs.length);

  return (
    <div className="space-y-6">
      {Array.from({ length: maxLen }, (_, i) => (
        <div key={i}>
          {zhParagraphs[i] && (
            <div className="mb-3">
              <div className="text-xs font-[--font-sans-ui] text-[--color-text-muted] dark:text-[--color-dark-text-muted] mb-1">── 中文 ──</div>
              <MarkdownRenderer content={zhParagraphs[i]} lang="zh" fontSize={fontSize} />
            </div>
          )}
          {enParagraphs[i] && (
            <div className="mb-3">
              <div className="text-xs font-[--font-sans-ui] text-[--color-text-muted] dark:text-[--color-dark-text-muted] mb-1">── English ──</div>
              <MarkdownRenderer content={enParagraphs[i]} lang="en" fontSize={fontSize} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function splitParagraphs(markdown) {
  return markdown
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}
