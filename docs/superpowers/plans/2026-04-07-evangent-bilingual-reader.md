# Evangent Bilingual Reader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual reader web app that presents Chinese/English translations of "Raising Spirit-Led Kids" in synchronized dual-column layout, deployed to GitHub Pages.

**Architecture:** React SPA with HashRouter for GitHub Pages compatibility. Markdown files loaded via Vite `?raw` dynamic imports with lazy loading per chapter. Fuse.js for client-side full-text search. All state persisted to localStorage (dark mode, font size, reading progress).

**Tech Stack:** React 19, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), react-markdown v10 + remark-gfm, React Router v7 (`react-router`), Fuse.js, gh-pages

---

## File Structure

```
web/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                          # React entry point
│   ├── App.jsx                           # HashRouter + Routes
│   ├── styles/
│   │   └── tailwind.css                  # @import "tailwindcss" + dark variant + custom styles
│   ├── data/
│   │   ├── chapters.js                   # Chapter metadata array
│   │   └── searchIndex.js                # Build Fuse.js index from all chapters
│   ├── utils/
│   │   └── markdownLoader.js             # Dynamic import helpers for ?raw markdown
│   ├── hooks/
│   │   ├── useChapterContent.js          # Load zh/en markdown for a chapter
│   │   ├── useSyncScroll.js              # Proportional scroll sync between two refs
│   │   ├── useDarkMode.js                # Dark mode toggle + localStorage + system pref
│   │   ├── useFontSize.js                # 3-tier font size + localStorage
│   │   ├── useReadingProgress.js         # Track last chapter + scroll ratio
│   │   └── useKeyboardNav.js             # Arrow keys, Ctrl+K, Esc shortcuts
│   └── components/
│       ├── Layout/
│       │   ├── Header.jsx                # Top nav bar
│       │   ├── Footer.jsx                # Copyright notice
│       │   ├── MobileSidebar.jsx         # Slide-in chapter list
│       │   └── NotFound.jsx              # 404 page
│       ├── Home/
│       │   ├── HeroBanner.jsx            # Title + search + dark mode toggle
│       │   ├── ContinueReading.jsx       # Resume card from localStorage
│       │   └── TableOfContents.jsx       # Grouped chapter list
│       ├── Reader/
│       │   ├── ChapterReader.jsx         # Main chapter page container
│       │   ├── BilingualPane.jsx         # Desktop dual-column with sync scroll
│       │   ├── MobileReader.jsx          # Mobile tab-switching reader
│       │   ├── MarkdownRenderer.jsx      # react-markdown wrapper with highlight support
│       │   ├── ReadingProgressBar.jsx    # Sticky top progress bar
│       │   └── ChapterNav.jsx           # Prev/next chapter links
│       └── Search/
│           ├── SearchBar.jsx             # Ctrl+K modal search input
│           └── SearchResults.jsx         # Results list with excerpt highlights
```

Markdown content lives in the existing `docs/zh/` and `docs/en/` directories. Vite will import them via relative paths from `web/src/`.

---

## Phase 1: Foundation

### Task 1: Scaffold Vite + React + Tailwind project

**Files:**
- Create: `web/package.json`
- Create: `web/index.html`
- Create: `web/vite.config.js`
- Create: `web/src/main.jsx`
- Create: `web/src/App.jsx`
- Create: `web/src/styles/tailwind.css`

- [ ] **Step 1: Initialize the project**

```bash
cd /Users/joseph/Desktop/Side_Projects/Evangent
npm create vite@latest web -- --template react
```

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/joseph/Desktop/Side_Projects/Evangent/web
npm install react-router react-markdown remark-gfm fuse.js
npm install -D @tailwindcss/vite tailwindcss
```

Remove any default CSS files Vite scaffolded (`src/App.css`, `src/index.css`).

- [ ] **Step 3: Configure Vite with Tailwind plugin**

Replace `web/vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/Evangent/",
});
```

The `base: "/Evangent/"` is needed for GitHub Pages deployment under the repo name.

- [ ] **Step 4: Set up Tailwind CSS with dark mode variant**

Replace `web/src/styles/tailwind.css`:

```css
@import "tailwindcss";
@variant dark (&:where(.dark, .dark *));

@theme {
  /* Light mode colors */
  --color-primary: #4F6D7A;
  --color-accent: #D4956A;
  --color-highlight: #F0E6D3;
  --color-bg-page: #FAFAF7;
  --color-bg-content: #FFFFFF;
  --color-bg-en: #F5F3EF;
  --color-text-primary: #2D2D2D;
  --color-text-secondary: #6B7280;
  --color-text-muted: #9CA3AF;
  --color-border: #E5E2DC;

  /* Dark mode colors */
  --color-dark-bg-page: #1A1A2E;
  --color-dark-bg-content: #232340;
  --color-dark-bg-en: #2A2A45;
  --color-dark-text-primary: #E8E8ED;
  --color-dark-text-secondary: #9CA3AF;
  --color-dark-text-muted: #6B7280;
  --color-dark-primary: #7BA7BC;
  --color-dark-accent: #E0A87C;
  --color-dark-highlight: #5C4A2E;

  /* Fonts */
  --font-serif-zh: "Noto Serif TC", "Source Han Serif TC", serif;
  --font-serif-en: "Lora", "Georgia", serif;
  --font-sans-ui: "Inter", "Noto Sans TC", sans-serif;
}
```

- [ ] **Step 5: Set up index.html with Google Fonts**

Replace `web/index.html`:

```html
<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>福音大翻譯計劃 — 孩子的屬靈覺醒</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&family=Noto+Serif+TC:wght@400;600;700&family=Noto+Sans+TC:wght@400;500&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Set up main.jsx and minimal App.jsx**

`web/src/main.jsx`:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`web/src/App.jsx`:

```jsx
import { HashRouter, Routes, Route } from "react-router";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<div className="p-8 font-[--font-sans-ui] text-[--color-text-primary] bg-[--color-bg-page] min-h-screen">Evangent - 福音大翻譯計劃</div>} />
      </Routes>
    </HashRouter>
  );
}
```

- [ ] **Step 7: Verify dev server runs**

```bash
cd /Users/joseph/Desktop/Side_Projects/Evangent/web
npm run dev
```

Open browser — should show "Evangent - 福音大翻譯計劃" on a warm white background.

- [ ] **Step 8: Commit**

```bash
git add web/
git commit -m "feat: scaffold Vite 8 + React 19 + Tailwind CSS v4 project"
```

---

### Task 2: Create chapter data and markdown loader

**Files:**
- Create: `web/src/data/chapters.js`
- Create: `web/src/utils/markdownLoader.js`
- Create: `web/src/hooks/useChapterContent.js`

- [ ] **Step 1: Create chapter metadata**

`web/src/data/chapters.js` — exact copy from SDD section 3.2:

```js
export const chapters = [
  {
    id: "foreword",
    zh: { file: "00-序.md", title: "序" },
    en: { file: "00-foreword.md", title: "Foreword" },
    part: null,
  },
  {
    id: "introduction",
    zh: { file: "00-引言.md", title: "引言" },
    en: { file: "00-introduction.md", title: "Introduction" },
    part: null,
  },
  {
    id: "ch01",
    zh: { file: "01-神所建造的殿.md", title: "神所建造的殿" },
    en: { file: "01-the-house-that-god-builds.md", title: "The House That God Builds" },
    part: { zh: "第一部：與神一同建造", en: "Part 1: Building with God" },
  },
  {
    id: "ch02",
    zh: { file: "02-孩子們所當行的路.md", title: "孩子們所當行的路" },
    en: { file: "02-the-way-they-should-go.md", title: "The Way They Should Go" },
    part: null,
  },
  {
    id: "ch03",
    zh: { file: "03-保有初心.md", title: "保有初心" },
    en: { file: "03-stay-a-novice.md", title: "Stay a Novice" },
    part: null,
  },
  {
    id: "ch04",
    zh: { file: "04-興起兒女.md", title: "興起兒女" },
    en: { file: "04-raising-sons-and-daughters.md", title: "Raising Sons and Daughters" },
    part: { zh: "第二部：跟隨聖靈引導的父母", en: "Part 2: The Spirit-Guided Parent" },
  },
  {
    id: "ch05",
    zh: { file: "05-與神一同築夢.md", title: "與神一同築夢" },
    en: { file: "05-dreaming-with-god.md", title: "Dreaming with God" },
    part: null,
  },
  {
    id: "ch06",
    zh: { file: "06-不要一直講真理.md", title: "不要（一直）講真理" },
    en: { file: "06-do-not-always-tell-the-truth.md", title: "Do Not (Always) Tell the Truth" },
    part: null,
  },
  {
    id: "ch07",
    zh: { file: "07-學習神怎麼拼字.md", title: "學習神怎麼拼字" },
    en: { file: "07-learning-gods-alphabet.md", title: "Learning God's Alphabet" },
    part: { zh: "第三部：被聖靈充滿的孩子", en: "Part 3: Spirit-Filled Children" },
  },
  {
    id: "ch08",
    zh: { file: "08-當孩子們看見.md", title: "當孩子們看見" },
    en: { file: "08-when-children-see.md", title: "When Children See" },
    part: null,
  },
  {
    id: "ch09",
    zh: { file: "09-操練我們的感官.md", title: "操練我們的感官" },
    en: { file: "09-training-our-senses.md", title: "Training Our Senses" },
    part: null,
  },
  {
    id: "ch10",
    zh: { file: "10-道成肉身.md", title: "道成肉身" },
    en: { file: "10-the-word-became-flesh.md", title: "The Word Became Flesh" },
    part: null,
  },
  {
    id: "ch11",
    zh: { file: "11-他們有跟過耶穌.md", title: "他們有跟過耶穌" },
    en: { file: "11-they-have-been-with-jesus.md", title: "They Have Been with Jesus" },
    part: null,
  },
  {
    id: "ch12",
    zh: { file: "12-保持渴慕.md", title: "保持渴慕" },
    en: { file: "12-staying-hungry.md", title: "Staying Hungry" },
    part: { zh: "第四部：結論", en: "Part 4: Conclusion" },
  },
  {
    id: "ch13",
    zh: { file: "13-爭戰與建造.md", title: "爭戰與建造" },
    en: { file: "13-fighting-and-building.md", title: "Fighting and Building" },
    part: null,
  },
];

export function getChapter(id) {
  return chapters.find((ch) => ch.id === id);
}

export function getAdjacentChapters(id) {
  const index = chapters.findIndex((ch) => ch.id === id);
  return {
    prev: index > 0 ? chapters[index - 1] : null,
    next: index < chapters.length - 1 ? chapters[index + 1] : null,
  };
}
```

- [ ] **Step 2: Create markdown loader utility**

`web/src/utils/markdownLoader.js`:

```js
const zhModules = import.meta.glob("../../docs/zh/*.md", { query: "?raw", import: "default" });
const enModules = import.meta.glob("../../docs/en/*.md", { query: "?raw", import: "default" });

export async function loadMarkdown(lang, filename) {
  const modules = lang === "zh" ? zhModules : enModules;
  const key = `../../docs/${lang}/${filename}`;
  const loader = modules[key];
  if (!loader) throw new Error(`Markdown not found: ${key}`);
  return loader();
}
```

- [ ] **Step 3: Create useChapterContent hook**

`web/src/hooks/useChapterContent.js`:

```js
import { useState, useEffect } from "react";
import { getChapter } from "../data/chapters";
import { loadMarkdown } from "../utils/markdownLoader";

export function useChapterContent(chapterId) {
  const [content, setContent] = useState({ zh: null, en: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const chapter = getChapter(chapterId);
    if (!chapter) {
      setError("Chapter not found");
      setLoading(false);
      return;
    }

    Promise.all([
      loadMarkdown("zh", chapter.zh.file),
      loadMarkdown("en", chapter.en.file),
    ])
      .then(([zh, en]) => {
        if (!cancelled) {
          setContent({ zh, en });
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [chapterId]);

  return { content, loading, error };
}
```

- [ ] **Step 4: Verify markdown loading works**

Temporarily update `App.jsx` to test loading chapter content:

```jsx
import { HashRouter, Routes, Route } from "react-router";
import { useChapterContent } from "./hooks/useChapterContent";

function TestChapter() {
  const { content, loading, error } = useChapterContent("ch01");
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="p-8">
      <h2>ZH length: {content.zh.length}</h2>
      <h2>EN length: {content.en.length}</h2>
      <pre className="whitespace-pre-wrap text-sm mt-4">{content.zh.slice(0, 200)}</pre>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<TestChapter />} />
      </Routes>
    </HashRouter>
  );
}
```

Run `npm run dev` and verify both zh/en content loads with correct length displayed.

- [ ] **Step 5: Commit**

```bash
git add web/src/data/chapters.js web/src/utils/markdownLoader.js web/src/hooks/useChapterContent.js
git commit -m "feat: add chapter data, markdown loader, and useChapterContent hook"
```

---

## Phase 2: Core Reading Experience

### Task 3: Layout components (Header, Footer)

**Files:**
- Create: `web/src/components/Layout/Header.jsx`
- Create: `web/src/components/Layout/Footer.jsx`
- Modify: `web/src/App.jsx`

- [ ] **Step 1: Create Footer**

`web/src/components/Layout/Footer.jsx`:

```jsx
export default function Footer() {
  return (
    <footer className="border-t border-[--color-border] dark:border-[--color-dark-text-muted] py-6 px-4 text-center text-sm text-[--color-text-secondary] dark:text-[--color-dark-text-secondary] font-[--font-sans-ui] bg-[--color-bg-page] dark:bg-[--color-dark-bg-page]">
      <p>
        <em>Raising Spirit-Led Kids</em> &copy; Seth Dahl.
        中文譯本《孩子的屬靈覺醒》經授權使用。
      </p>
      <p className="mt-1">本站內容僅供閱讀，未經許可不得轉載或商業使用。</p>
    </footer>
  );
}
```

- [ ] **Step 2: Create Header**

`web/src/components/Layout/Header.jsx`:

```jsx
import { Link, useParams } from "react-router";
import { getChapter } from "../../data/chapters";

export default function Header({ onToggleSidebar, onToggleDarkMode, isDark, fontSize, onFontSizeChange, onOpenSearch }) {
  const { chapterId } = useParams();
  const chapter = chapterId ? getChapter(chapterId) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-[--color-border] dark:border-[--color-dark-text-muted] bg-[--color-bg-content] dark:bg-[--color-dark-bg-content] font-[--font-sans-ui]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-[--color-bg-en] dark:hover:bg-[--color-dark-bg-en]"
            aria-label="開啟目錄"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link
            to="/"
            className="text-[--color-primary] dark:text-[--color-dark-primary] font-semibold text-sm truncate"
          >
            {chapter
              ? `《孩子的屬靈覺醒》${chapter.zh.title}`
              : "福音大翻譯計劃"}
          </Link>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-1">
          {/* Font size */}
          <button
            onClick={() => onFontSizeChange(-1)}
            className="p-2 text-sm rounded-md hover:bg-[--color-bg-en] dark:hover:bg-[--color-dark-bg-en]"
            aria-label="縮小字型"
          >
            A-
          </button>
          <button
            onClick={() => onFontSizeChange(1)}
            className="p-2 text-sm rounded-md hover:bg-[--color-bg-en] dark:hover:bg-[--color-dark-bg-en]"
            aria-label="放大字型"
          >
            A+
          </button>

          {/* Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-md hover:bg-[--color-bg-en] dark:hover:bg-[--color-dark-bg-en]"
            aria-label="搜尋"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Dark mode */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-md hover:bg-[--color-bg-en] dark:hover:bg-[--color-dark-bg-en]"
            aria-label={isDark ? "切換亮色模式" : "切換深色模式"}
          >
            {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
          </button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Wire Header and Footer into App with routes**

Update `web/src/App.jsx`:

```jsx
import { HashRouter, Routes, Route, useParams } from "react-router";
import { useState } from "react";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";

function HomePage() {
  return <div className="p-8 text-center">Home — 目錄 coming soon</div>;
}

function ChapterPage() {
  const { chapterId } = useParams();
  return <div className="p-8">Chapter: {chapterId}</div>;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [fontSize, setFontSize] = useState(1); // 0=small, 1=medium, 2=large
  const [searchOpen, setSearchOpen] = useState(false);

  const handleToggleDark = () => {
    setIsDark((d) => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  };

  const handleFontSizeChange = (delta) => {
    setFontSize((s) => Math.max(0, Math.min(2, s + delta)));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[--color-bg-page] dark:bg-[--color-dark-bg-page] text-[--color-text-primary] dark:text-[--color-dark-text-primary]">
        <Header
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          onToggleDarkMode={handleToggleDark}
          isDark={isDark}
          fontSize={fontSize}
          onFontSizeChange={handleFontSizeChange}
          onOpenSearch={() => setSearchOpen(true)}
        />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chapter/:chapterId" element={<ChapterPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
```

- [ ] **Step 4: Verify header/footer render correctly**

Run `npm run dev`. Verify: sticky header with controls, footer with copyright, warm white background, navigation between `/` and a chapter route.

- [ ] **Step 5: Commit**

```bash
git add web/src/components/Layout/ web/src/App.jsx
git commit -m "feat: add Header and Footer layout components with routing"
```

---

### Task 4: Home page (HeroBanner + TableOfContents)

**Files:**
- Create: `web/src/components/Home/HeroBanner.jsx`
- Create: `web/src/components/Home/TableOfContents.jsx`
- Modify: `web/src/App.jsx`

- [ ] **Step 1: Create HeroBanner**

`web/src/components/Home/HeroBanner.jsx`:

```jsx
export default function HeroBanner() {
  return (
    <section className="py-16 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold font-[--font-serif-zh] text-[--color-primary] dark:text-[--color-dark-primary]">
        福音大翻譯計劃
      </h1>
      <p className="mt-3 text-lg font-[--font-serif-zh] text-[--color-text-secondary] dark:text-[--color-dark-text-secondary]">
        《孩子的屬靈覺醒》中英對照
      </p>
      <p className="mt-1 text-base font-[--font-serif-en] italic text-[--color-text-muted] dark:text-[--color-dark-text-muted]">
        Raising Spirit-Led Kids
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Create TableOfContents**

`web/src/components/Home/TableOfContents.jsx`:

```jsx
import { Link } from "react-router";
import { chapters } from "../../data/chapters";

export default function TableOfContents() {
  let currentPart = null;

  return (
    <nav className="max-w-2xl mx-auto px-4 pb-16" aria-label="目錄">
      <div className="space-y-2">
        {chapters.map((ch) => {
          const showPart = ch.part && ch.part.zh !== currentPart;
          if (ch.part) currentPart = ch.part.zh;

          return (
            <div key={ch.id}>
              {showPart && (
                <div className="mt-8 mb-3 pt-4 border-t border-[--color-border] dark:border-[--color-dark-text-muted]">
                  <p className="text-sm font-semibold text-[--color-accent] dark:text-[--color-dark-accent] font-[--font-sans-ui]">
                    {ch.part.zh}
                  </p>
                  <p className="text-xs text-[--color-text-muted] dark:text-[--color-dark-text-muted] font-[--font-sans-ui]">
                    {ch.part.en}
                  </p>
                </div>
              )}
              <Link
                to={`/chapter/${ch.id}`}
                className="block rounded-lg px-4 py-3 hover:bg-[--color-bg-en] dark:hover:bg-[--color-dark-bg-en] transition-colors"
              >
                <p className="font-[--font-serif-zh] text-[--color-text-primary] dark:text-[--color-dark-text-primary]">
                  {ch.zh.title}
                </p>
                <p className="text-sm font-[--font-serif-en] text-[--color-text-secondary] dark:text-[--color-dark-text-secondary]">
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
```

- [ ] **Step 3: Wire into App**

Update the `HomePage` function in `App.jsx`:

```jsx
import HeroBanner from "./components/Home/HeroBanner";
import TableOfContents from "./components/Home/TableOfContents";

function HomePage() {
  return (
    <>
      <HeroBanner />
      <TableOfContents />
    </>
  );
}
```

- [ ] **Step 4: Verify home page displays correctly**

Run `npm run dev`. Check: hero banner with bilingual title, chapter list grouped by parts with orange part labels, chapter links clickable.

- [ ] **Step 5: Commit**

```bash
git add web/src/components/Home/ web/src/App.jsx
git commit -m "feat: add home page with HeroBanner and TableOfContents"
```

---

### Task 5: MarkdownRenderer component

**Files:**
- Create: `web/src/components/Reader/MarkdownRenderer.jsx`

- [ ] **Step 1: Create MarkdownRenderer**

`web/src/components/Reader/MarkdownRenderer.jsx`:

```jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const FONT_SIZES = [
  { zh: "15px", en: "14px" },
  { zh: "17px", en: "16px" },
  { zh: "20px", en: "19px" },
];

export default function MarkdownRenderer({ content, lang = "zh", fontSize = 1, highlightTerms = null }) {
  const size = FONT_SIZES[fontSize] || FONT_SIZES[1];

  return (
    <article
      lang={lang === "zh" ? "zh-TW" : "en"}
      className="prose prose-neutral dark:prose-invert max-w-none"
      style={{
        fontSize: lang === "zh" ? size.zh : size.en,
        lineHeight: 1.85,
        fontFamily: lang === "zh"
          ? "var(--font-serif-zh)"
          : "var(--font-serif-en)",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          blockquote: ({ children }) => (
            <blockquote className="border-l-[3px] border-[--color-accent] dark:border-[--color-dark-accent] bg-[--color-bg-en] dark:bg-[--color-dark-bg-en] pl-4 py-2 my-4 text-[--color-text-muted] dark:text-[--color-dark-text-muted] italic">
              {children}
            </blockquote>
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-8 mb-4 text-[--color-primary] dark:text-[--color-dark-primary]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mt-8 mb-3 text-[--color-text-primary] dark:text-[--color-dark-text-primary]">
              {children}
            </h2>
          ),
          p: ({ children }) => (
            <p className="mb-[1.5em]">{children}</p>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add web/src/components/Reader/MarkdownRenderer.jsx
git commit -m "feat: add MarkdownRenderer with react-markdown and custom styling"
```

---

### Task 6: Desktop BilingualPane with sync scroll

**Files:**
- Create: `web/src/hooks/useSyncScroll.js`
- Create: `web/src/components/Reader/BilingualPane.jsx`

- [ ] **Step 1: Create useSyncScroll hook**

`web/src/hooks/useSyncScroll.js`:

```js
import { useRef, useEffect, useCallback } from "react";

export function useSyncScroll() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const isSyncing = useRef(false);

  const handleScroll = useCallback((source, target) => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    const sourceEl = source.current;
    const targetEl = target.current;
    if (!sourceEl || !targetEl) {
      isSyncing.current = false;
      return;
    }

    const maxScroll = sourceEl.scrollHeight - sourceEl.clientHeight;
    const ratio = maxScroll > 0 ? sourceEl.scrollTop / maxScroll : 0;
    const targetMax = targetEl.scrollHeight - targetEl.clientHeight;
    targetEl.scrollTop = ratio * targetMax;

    requestAnimationFrame(() => {
      isSyncing.current = false;
    });
  }, []);

  useEffect(() => {
    const leftEl = leftRef.current;
    const rightEl = rightRef.current;
    if (!leftEl || !rightEl) return;

    const onLeftScroll = () => handleScroll(leftRef, rightRef);
    const onRightScroll = () => handleScroll(rightRef, leftRef);

    leftEl.addEventListener("scroll", onLeftScroll, { passive: true });
    rightEl.addEventListener("scroll", onRightScroll, { passive: true });

    return () => {
      leftEl.removeEventListener("scroll", onLeftScroll);
      rightEl.removeEventListener("scroll", onRightScroll);
    };
  }, [handleScroll]);

  return { leftRef, rightRef };
}
```

- [ ] **Step 2: Create BilingualPane**

`web/src/components/Reader/BilingualPane.jsx`:

```jsx
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
```

- [ ] **Step 3: Commit**

```bash
git add web/src/hooks/useSyncScroll.js web/src/components/Reader/BilingualPane.jsx
git commit -m "feat: add BilingualPane with synchronized scrolling"
```

---

### Task 7: Mobile reader with tab switching

**Files:**
- Create: `web/src/components/Reader/MobileReader.jsx`

- [ ] **Step 1: Create MobileReader**

`web/src/components/Reader/MobileReader.jsx`:

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add web/src/components/Reader/MobileReader.jsx
git commit -m "feat: add MobileReader with zh/en/bilingual tab switching"
```

---

### Task 8: ChapterReader + ChapterNav + wire routes

**Files:**
- Create: `web/src/components/Reader/ChapterReader.jsx`
- Create: `web/src/components/Reader/ChapterNav.jsx`
- Modify: `web/src/App.jsx`

- [ ] **Step 1: Create ChapterNav**

`web/src/components/Reader/ChapterNav.jsx`:

```jsx
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
```

- [ ] **Step 2: Create ChapterReader**

`web/src/components/Reader/ChapterReader.jsx`:

```jsx
import { useParams } from "react-router";
import { useChapterContent } from "../../hooks/useChapterContent";
import BilingualPane from "./BilingualPane";
import MobileReader from "./MobileReader";
import ChapterNav from "./ChapterNav";

export default function ChapterReader({ fontSize }) {
  const { chapterId } = useParams();
  const { content, loading, error } = useChapterContent(chapterId);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-3xl px-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-[--color-bg-en] dark:bg-[--color-dark-bg-en] rounded animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <p className="text-lg text-[--color-text-secondary] dark:text-[--color-dark-text-secondary]">無法載入章節內容</p>
          <p className="text-sm text-[--color-text-muted] dark:text-[--color-dark-text-muted] mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Desktop: bilingual pane */}
      <div className="hidden lg:flex flex-1 min-h-0">
        <BilingualPane zhContent={content.zh} enContent={content.en} fontSize={fontSize} />
      </div>

      {/* Mobile: tab reader */}
      <div className="lg:hidden flex flex-col flex-1 min-h-0">
        <MobileReader zhContent={content.zh} enContent={content.en} fontSize={fontSize} />
      </div>

      <ChapterNav chapterId={chapterId} />
    </div>
  );
}
```

- [ ] **Step 3: Update App.jsx routes**

Replace the `ChapterPage` placeholder in `App.jsx`:

```jsx
import ChapterReader from "./components/Reader/ChapterReader";

// In the Routes, replace the /chapter/:chapterId route:
<Route path="/chapter/:chapterId" element={<ChapterReader fontSize={fontSize} />} />
```

- [ ] **Step 4: Verify full reading flow**

Run `npm run dev`. Test:
1. Home page shows chapter list
2. Click a chapter -> shows bilingual pane on desktop
3. Resize window to mobile -> shows tab-switching reader
4. Sync scrolling works on desktop
5. Prev/next chapter navigation works

- [ ] **Step 5: Commit**

```bash
git add web/src/components/Reader/ChapterReader.jsx web/src/components/Reader/ChapterNav.jsx web/src/App.jsx
git commit -m "feat: add ChapterReader with responsive desktop/mobile layout"
```

---

### Task 9: MobileSidebar

**Files:**
- Create: `web/src/components/Layout/MobileSidebar.jsx`
- Modify: `web/src/App.jsx`

- [ ] **Step 1: Create MobileSidebar**

`web/src/components/Layout/MobileSidebar.jsx`:

```jsx
import { Link, useParams } from "react-router";
import { chapters } from "../../data/chapters";

export default function MobileSidebar({ isOpen, onClose }) {
  const { chapterId } = useParams();
  let currentPart = null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[80vw] max-w-[320px] z-50 bg-[--color-bg-content] dark:bg-[--color-dark-bg-content] shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-[--color-border] dark:border-[--color-dark-text-muted]">
          <h2 className="font-semibold font-[--font-sans-ui] text-[--color-primary] dark:text-[--color-dark-primary]">
            目錄
          </h2>
        </div>
        <nav className="p-2">
          {chapters.map((ch) => {
            const showPart = ch.part && ch.part.zh !== currentPart;
            if (ch.part) currentPart = ch.part.zh;
            const isActive = ch.id === chapterId;

            return (
              <div key={ch.id}>
                {showPart && (
                  <p className="px-3 pt-4 pb-1 text-xs font-semibold text-[--color-accent] dark:text-[--color-dark-accent] font-[--font-sans-ui]">
                    {ch.part.zh}
                  </p>
                )}
                <Link
                  to={`/chapter/${ch.id}`}
                  onClick={onClose}
                  className={`block px-3 py-2 rounded-md text-sm font-[--font-sans-ui] transition-colors ${
                    isActive
                      ? "bg-[--color-bg-en] dark:bg-[--color-dark-bg-en] text-[--color-primary] dark:text-[--color-dark-primary] font-medium"
                      : "text-[--color-text-primary] dark:text-[--color-dark-text-primary] hover:bg-[--color-bg-en] dark:hover:bg-[--color-dark-bg-en]"
                  }`}
                >
                  {ch.zh.title}
                </Link>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
```

- [ ] **Step 2: Wire MobileSidebar into App**

Add to `App.jsx` inside the main div, after `<Header>`:

```jsx
import MobileSidebar from "./components/Layout/MobileSidebar";

// Inside the JSX:
<MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
```

- [ ] **Step 3: Verify sidebar works**

On mobile viewport: click hamburger -> sidebar slides in. Click a chapter or the overlay -> sidebar closes.

- [ ] **Step 4: Commit**

```bash
git add web/src/components/Layout/MobileSidebar.jsx web/src/App.jsx
git commit -m "feat: add mobile sidebar with slide-in chapter navigation"
```

---

## Phase 3: Navigation & Search

### Task 10: Dark mode and font size hooks with localStorage

**Files:**
- Create: `web/src/hooks/useDarkMode.js`
- Create: `web/src/hooks/useFontSize.js`
- Modify: `web/src/App.jsx`

- [ ] **Step 1: Create useDarkMode hook**

`web/src/hooks/useDarkMode.js`:

```js
import { useState, useEffect } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("evangent-dark-mode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("evangent-dark-mode", String(isDark));
  }, [isDark]);

  const toggle = () => setIsDark((d) => !d);

  return { isDark, toggle };
}
```

- [ ] **Step 2: Create useFontSize hook**

`web/src/hooks/useFontSize.js`:

```js
import { useState } from "react";

export function useFontSize() {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("evangent-font-size");
    return saved !== null ? Number(saved) : 1;
  });

  const change = (delta) => {
    setFontSize((s) => {
      const next = Math.max(0, Math.min(2, s + delta));
      localStorage.setItem("evangent-font-size", String(next));
      return next;
    });
  };

  return { fontSize, changeFontSize: change };
}
```

- [ ] **Step 3: Refactor App.jsx to use hooks**

Replace the inline `useState` for dark/font in `App.jsx` with:

```jsx
import { useDarkMode } from "./hooks/useDarkMode";
import { useFontSize } from "./hooks/useFontSize";

// Inside App():
const { isDark, toggle: toggleDark } = useDarkMode();
const { fontSize, changeFontSize } = useFontSize();
```

Update the Header props accordingly: `onToggleDarkMode={toggleDark}`, `onFontSizeChange={changeFontSize}`.

- [ ] **Step 4: Verify persistence**

Toggle dark mode, refresh page -> should persist. Change font size, refresh -> should persist.

- [ ] **Step 5: Commit**

```bash
git add web/src/hooks/useDarkMode.js web/src/hooks/useFontSize.js web/src/App.jsx
git commit -m "feat: add dark mode and font size hooks with localStorage persistence"
```

---

### Task 11: Keyboard navigation

**Files:**
- Create: `web/src/hooks/useKeyboardNav.js`
- Modify: `web/src/App.jsx`

- [ ] **Step 1: Create useKeyboardNav hook**

`web/src/hooks/useKeyboardNav.js`:

```js
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { getAdjacentChapters } from "../data/chapters";

export function useKeyboardNav({ onOpenSearch }) {
  const navigate = useNavigate();
  const { chapterId } = useParams();

  useEffect(() => {
    const handler = (e) => {
      // Don't intercept when typing in inputs
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "ArrowLeft" && chapterId) {
        const { prev } = getAdjacentChapters(chapterId);
        if (prev) navigate(`/chapter/${prev.id}`);
      } else if (e.key === "ArrowRight" && chapterId) {
        const { next } = getAdjacentChapters(chapterId);
        if (next) navigate(`/chapter/${next.id}`);
      } else if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || e.key === "/") {
        e.preventDefault();
        onOpenSearch();
      } else if (e.key === "Home" && chapterId) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [chapterId, navigate, onOpenSearch]);
}
```

- [ ] **Step 2: Wire into App**

The hook needs to be called inside a component that is a child of `<HashRouter>` so `useParams` works. Create a wrapper:

In `App.jsx`, create an inner component:

```jsx
import { useKeyboardNav } from "./hooks/useKeyboardNav";

function AppShell({ children, isDark, toggleDark, fontSize, changeFontSize, searchOpen, setSearchOpen, sidebarOpen, setSidebarOpen }) {
  useKeyboardNav({ onOpenSearch: () => setSearchOpen(true) });

  return (
    <div className="min-h-screen flex flex-col bg-[--color-bg-page] dark:bg-[--color-dark-bg-page] text-[--color-text-primary] dark:text-[--color-dark-text-primary]">
      <Header
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onToggleDarkMode={toggleDark}
        isDark={isDark}
        fontSize={fontSize}
        onFontSizeChange={changeFontSize}
        onOpenSearch={() => setSearchOpen(true)}
      />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Verify keyboard shortcuts**

On a chapter page: press `ArrowRight` -> next chapter. Press `Ctrl+K` -> (search not built yet, but state should change).

- [ ] **Step 4: Commit**

```bash
git add web/src/hooks/useKeyboardNav.js web/src/App.jsx
git commit -m "feat: add keyboard navigation for chapters and search"
```

---

### Task 12: Search with Fuse.js

**Files:**
- Create: `web/src/data/searchIndex.js`
- Create: `web/src/components/Search/SearchBar.jsx`
- Create: `web/src/components/Search/SearchResults.jsx`
- Modify: `web/src/App.jsx`

- [ ] **Step 1: Create search index builder**

`web/src/data/searchIndex.js`:

```js
import Fuse from "fuse.js";
import { chapters } from "./chapters";

const zhModules = import.meta.glob("../../../docs/zh/*.md", { query: "?raw", import: "default", eager: true });
const enModules = import.meta.glob("../../../docs/en/*.md", { query: "?raw", import: "default", eager: true });

let fuseInstance = null;

function buildDocuments() {
  const docs = [];

  for (const ch of chapters) {
    // Chinese
    const zhKey = `../../../docs/zh/${ch.zh.file}`;
    const zhContent = zhModules[zhKey];
    if (zhContent) {
      const paragraphs = zhContent.split(/\n{2,}/).filter((p) => p.trim());
      paragraphs.forEach((text, i) => {
        docs.push({ chapterId: ch.id, lang: "zh", paragraphIndex: i, text: text.trim(), chapterTitle: ch.zh.title });
      });
    }

    // English
    const enKey = `../../../docs/en/${ch.en.file}`;
    const enContent = enModules[enKey];
    if (enContent) {
      const paragraphs = enContent.split(/\n{2,}/).filter((p) => p.trim());
      paragraphs.forEach((text, i) => {
        docs.push({ chapterId: ch.id, lang: "en", paragraphIndex: i, text: text.trim(), chapterTitle: ch.en.title });
      });
    }
  }

  return docs;
}

export function getSearchIndex() {
  if (!fuseInstance) {
    const docs = buildDocuments();
    fuseInstance = new Fuse(docs, {
      keys: ["text"],
      includeMatches: true,
      threshold: 0.3,
      minMatchCharLength: 2,
    });
  }
  return fuseInstance;
}

export function search(query, limit = 50) {
  const fuse = getSearchIndex();
  return fuse.search(query, { limit }).map((result) => {
    const { text, chapterId, lang, chapterTitle } = result.item;
    // Extract excerpt around match
    const matchIndex = text.toLowerCase().indexOf(query.toLowerCase());
    const start = Math.max(0, matchIndex - 30);
    const end = Math.min(text.length, matchIndex + query.length + 30);
    const excerpt = (start > 0 ? "..." : "") + text.slice(start, end) + (end < text.length ? "..." : "");

    return { chapterId, lang, chapterTitle, excerpt, score: result.score };
  });
}
```

- [ ] **Step 2: Create SearchBar modal**

`web/src/components/Search/SearchBar.jsx`:

```jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { search } from "../../data/searchIndex";

export default function SearchBar({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      setResults(search(value.trim()));
    } else {
      setResults([]);
    }
  };

  const handleSelect = (result) => {
    onClose();
    navigate(`/chapter/${result.chapterId}?q=${encodeURIComponent(query)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-lg mx-4 bg-[--color-bg-content] dark:bg-[--color-dark-bg-content] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center px-4 border-b border-[--color-border] dark:border-[--color-dark-text-muted]">
          <svg className="w-5 h-5 text-[--color-text-muted] dark:text-[--color-dark-text-muted] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜尋全書..."
            className="flex-1 px-3 py-4 bg-transparent outline-none font-[--font-sans-ui] text-[--color-text-primary] dark:text-[--color-dark-text-primary] placeholder:text-[--color-text-muted] dark:placeholder:text-[--color-dark-text-muted]"
          />
          <kbd className="text-xs text-[--color-text-muted] dark:text-[--color-dark-text-muted] border border-[--color-border] dark:border-[--color-dark-text-muted] rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto p-2">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => handleSelect(r)}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[--color-bg-en] dark:hover:bg-[--color-dark-bg-en] transition-colors"
              >
                <p className="text-sm font-medium font-[--font-sans-ui] text-[--color-primary] dark:text-[--color-dark-primary]">
                  {r.chapterTitle}
                </p>
                <p className="text-xs text-[--color-text-secondary] dark:text-[--color-dark-text-secondary] mt-0.5 line-clamp-2">
                  {r.excerpt}
                </p>
              </button>
            ))}
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="p-6 text-center text-sm text-[--color-text-muted] dark:text-[--color-dark-text-muted] font-[--font-sans-ui]">
            沒有找到符合的結果，試試其他關鍵字？
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Wire SearchBar into App**

In `App.jsx`, add after `<MobileSidebar>`:

```jsx
import SearchBar from "./components/Search/SearchBar";

// In JSX:
<SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
```

- [ ] **Step 4: Verify search works**

Run `npm run dev`. Press `Ctrl+K` -> search modal opens. Type "聖靈" -> results appear with chapter titles and excerpts. Click a result -> navigates to chapter.

- [ ] **Step 5: Commit**

```bash
git add web/src/data/searchIndex.js web/src/components/Search/ web/src/App.jsx
git commit -m "feat: add Fuse.js full-text search with modal UI"
```

---

## Phase 4: Experience Enhancements

### Task 13: Reading progress + ContinueReading card

**Files:**
- Create: `web/src/hooks/useReadingProgress.js`
- Create: `web/src/components/Home/ContinueReading.jsx`
- Create: `web/src/components/Reader/ReadingProgressBar.jsx`
- Modify: `web/src/components/Reader/ChapterReader.jsx`
- Modify: home page JSX

- [ ] **Step 1: Create useReadingProgress hook**

`web/src/hooks/useReadingProgress.js`:

```js
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "evangent-reading-progress";
const READ_KEY = "evangent-chapters-read";

export function useReadingProgress(chapterId) {
  const [scrollRatio, setScrollRatio] = useState(0);

  // Track scroll position for progress bar
  useEffect(() => {
    if (!chapterId) return;

    const handleScroll = () => {
      const el = document.documentElement;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const ratio = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
      setScrollRatio(ratio);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapterId]);

  // Save progress on scroll (debounced via beforeunload)
  useEffect(() => {
    if (!chapterId) return;

    const save = () => {
      const el = document.documentElement;
      const maxScroll = el.scrollHeight - el.clientHeight;
      const ratio = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lastChapter: chapterId, scrollRatio: ratio }));

      // Mark as read if scrolled > 80%
      if (ratio > 0.8) {
        const read = JSON.parse(localStorage.getItem(READ_KEY) || "[]");
        if (!read.includes(chapterId)) {
          read.push(chapterId);
          localStorage.setItem(READ_KEY, JSON.stringify(read));
        }
      }
    };

    window.addEventListener("beforeunload", save);
    return () => {
      save();
      window.removeEventListener("beforeunload", save);
    };
  }, [chapterId]);

  return { scrollRatio };
}

export function getSavedProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function getReadChapters() {
  try {
    return JSON.parse(localStorage.getItem(READ_KEY) || "[]");
  } catch {
    return [];
  }
}
```

- [ ] **Step 2: Create ReadingProgressBar**

`web/src/components/Reader/ReadingProgressBar.jsx`:

```jsx
export default function ReadingProgressBar({ ratio }) {
  return (
    <div className="sticky top-14 z-30 h-0.5 bg-[--color-bg-en] dark:bg-[--color-dark-bg-en]">
      <div
        className="h-full bg-[--color-primary] dark:bg-[--color-dark-primary] transition-[width] duration-150"
        style={{ width: `${Math.min(100, ratio * 100)}%` }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Create ContinueReading card**

`web/src/components/Home/ContinueReading.jsx`:

```jsx
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
```

- [ ] **Step 4: Wire into ChapterReader and Home**

In `ChapterReader.jsx`, add reading progress tracking:

```jsx
import { useReadingProgress } from "../../hooks/useReadingProgress";
import ReadingProgressBar from "./ReadingProgressBar";

// Inside component:
const { scrollRatio } = useReadingProgress(chapterId);

// Add before the desktop/mobile sections:
<ReadingProgressBar ratio={scrollRatio} />
```

In the `HomePage` component, add `ContinueReading`:

```jsx
import ContinueReading from "./components/Home/ContinueReading";

function HomePage() {
  return (
    <>
      <HeroBanner />
      <ContinueReading />
      <TableOfContents />
    </>
  );
}
```

- [ ] **Step 5: Verify**

Read a chapter, scroll partway, go back to home -> "繼續閱讀" card appears with progress bar. Progress bar at top of chapter page fills as you scroll.

- [ ] **Step 6: Commit**

```bash
git add web/src/hooks/useReadingProgress.js web/src/components/Reader/ReadingProgressBar.jsx web/src/components/Home/ContinueReading.jsx web/src/components/Reader/ChapterReader.jsx web/src/App.jsx
git commit -m "feat: add reading progress tracking with continue reading card"
```

---

### Task 14: 404 page

**Files:**
- Create: `web/src/components/Layout/NotFound.jsx`
- Modify: `web/src/App.jsx`

- [ ] **Step 1: Create NotFound**

`web/src/components/Layout/NotFound.jsx`:

```jsx
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center text-center p-8">
      <div>
        <p className="text-6xl font-bold text-[--color-text-muted] dark:text-[--color-dark-text-muted]">404</p>
        <p className="mt-4 text-lg font-[--font-sans-ui] text-[--color-text-secondary] dark:text-[--color-dark-text-secondary]">
          找不到此頁面
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2 rounded-lg bg-[--color-primary] dark:bg-[--color-dark-primary] text-white font-[--font-sans-ui] text-sm hover:opacity-90 transition-opacity"
        >
          回到目錄
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add catch-all route**

In `App.jsx` routes:

```jsx
import NotFound from "./components/Layout/NotFound";

// Add as last Route:
<Route path="*" element={<NotFound />} />
```

- [ ] **Step 3: Commit**

```bash
git add web/src/components/Layout/NotFound.jsx web/src/App.jsx
git commit -m "feat: add 404 page with link back to table of contents"
```

---

## Phase 5: Deployment

### Task 15: GitHub Pages deployment

**Files:**
- Create: `web/.github/workflows/deploy.yml` (or repo-level `.github/workflows/deploy.yml`)
- Modify: `web/package.json`

- [ ] **Step 1: Add build script and gh-pages**

```bash
cd /Users/joseph/Desktop/Side_Projects/Evangent/web
npm install -D gh-pages
```

Ensure `package.json` has:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  }
}
```

- [ ] **Step 2: Create GitHub Actions workflow**

Create `.github/workflows/deploy.yml` at repo root:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install and build
        working-directory: web
        run: |
          npm ci
          npm run build

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v3
        with:
          path: web/dist

      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Test build locally**

```bash
cd /Users/joseph/Desktop/Side_Projects/Evangent/web
npm run build
npm run preview
```

Verify the preview works at `http://localhost:4173/Evangent/`.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml web/package.json
git commit -m "feat: add GitHub Pages deployment with GitHub Actions"
```

---

## Summary of Tasks

| # | Task | Phase |
|---|------|-------|
| 1 | Scaffold Vite + React + Tailwind project | 1: Foundation |
| 2 | Chapter data + markdown loader + useChapterContent | 1: Foundation |
| 3 | Header + Footer layout components | 2: Core Reading |
| 4 | Home page (HeroBanner + TableOfContents) | 2: Core Reading |
| 5 | MarkdownRenderer component | 2: Core Reading |
| 6 | BilingualPane with sync scroll | 2: Core Reading |
| 7 | MobileReader with tab switching | 2: Core Reading |
| 8 | ChapterReader + ChapterNav + wire routes | 2: Core Reading |
| 9 | MobileSidebar | 2: Core Reading |
| 10 | Dark mode + font size hooks with localStorage | 3: Navigation & Search |
| 11 | Keyboard navigation | 3: Navigation & Search |
| 12 | Search with Fuse.js | 3: Navigation & Search |
| 13 | Reading progress + ContinueReading card | 4: Experience |
| 14 | 404 page | 4: Experience |
| 15 | GitHub Pages deployment | 5: Deployment |
