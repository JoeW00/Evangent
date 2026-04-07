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
      <div
        role="tablist"
        aria-label="語言切換"
        className="flex border-b border-[var(--color-border)] dark:border-[var(--color-dark-text-muted)] bg-[var(--color-bg-content)] dark:bg-[var(--color-dark-bg-content)] sticky top-14 z-30"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={activeTab === tab.key}
            aria-controls={`tabpanel-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 text-sm font-[var(--font-sans-ui)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-primary)] dark:focus-visible:outline-[var(--color-dark-primary)] ${
              activeTab === tab.key
                ? "text-[var(--color-primary)] dark:text-[var(--color-dark-primary)] border-b-2 border-[var(--color-primary)] dark:border-[var(--color-dark-primary)] font-medium"
                : "text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
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
        <div key={i} className="border-b border-[var(--color-border)] dark:border-[var(--color-dark-bg-en)] pb-6 last:border-b-0">
          {zhParagraphs[i] && (
            <div className="mb-3">
              <MarkdownRenderer content={zhParagraphs[i]} lang="zh" fontSize={fontSize} />
            </div>
          )}
          {enParagraphs[i] && (
            <div className="mb-3">
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
