# Evangent — 福音大翻譯計劃

<p align="center">
  <img src="web/public/favicon.svg" width="64" alt="Evangent logo" />
</p>

<p align="center">
  <strong>《孩子的屬靈覺醒》中英對照線上閱讀器</strong><br />
  <em>Raising Spirit-Led Kids</em> — Bilingual Reader
</p>

<p align="center">
  <a href="https://joew00.github.io/Evangent/">Live Site</a>
</p>

---

## About

Evangent 是一個中英對照的線上閱讀平台，將 Seth Dahl 所著 *Raising Spirit-Led Kids*（《孩子的屬靈覺醒》）以雙語並排的方式呈現，讓讀者可以同時閱讀中文譯本與英文原文。

### Target Audience

- 華人教會社群中對兒童屬靈教育有興趣的父母與事工領袖
- 中英文學習者，可透過對照閱讀提升語言能力
- 翻譯團隊，用於校對與審閱譯稿

## Features

- **Desktop** — Side-by-side bilingual columns with synchronized scrolling
- **Mobile** — Tab-based reader (中文 / English / 對照)
- **Full-text search** — Chinese and English search with Fuse.js (Ctrl/⌘+K)
- **Dark mode** — Toggle with system preference detection
- **Font size** — Three-level adjustment (small / medium / large)
- **Reading progress** — Auto-saved to localStorage with "Continue Reading" card
- **Keyboard navigation** — Arrow keys for chapters, / or Ctrl+K for search, Esc to close
- **Accessibility** — WCAG AA compliant, ARIA dialogs, focus traps, skip link, screen reader support

## Tech Stack

| Category | Technology |
|----------|-----------|
| UI | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Markdown | react-markdown + remark-gfm |
| Routing | React Router v7 (HashRouter) |
| Search | Fuse.js |
| Deployment | GitHub Pages + GitHub Actions |
| Docx Conversion | Python 3.14+ / python-docx |
| Testing | Vitest + Testing Library + pytest + Puppeteer |

## Getting Started

### Prerequisites

- **Node.js** >= 22
- **Python** >= 3.14 (only for docx conversion)
- [uv](https://docs.astral.sh/uv/) (Python package manager)

### Frontend Development

```bash
cd web
npm ci
npm run dev        # http://localhost:5173/Evangent/
```

### Run Tests

```bash
# JavaScript (from web/)
cd web
npm test           # run all tests
npm run test:watch # watch mode

# Python (from project root)
uv sync
uv run pytest tests/ -v
```

### Build for Production

```bash
cd web
npm run build      # output: web/dist/
npm run preview    # preview locally
```

### Docx to Markdown Conversion

```bash
uv sync
uv run python convert_docx.py
```

This regenerates `docs/zh/` and `docs/en/` from the source `.docx` files in `docs/original/`. The generated Markdown files are committed to the repo — do not edit them directly.

## Architecture

```
Evangent/
├── docs/                  # Generated Markdown + source .docx files
│   ├── zh/                # Chinese chapters (15 files)
│   ├── en/                # English chapters (15 files)
│   ├── original/          # Source .docx files
│   └── SDD.md             # Software Design Document
├── web/                   # React SPA (Vite + Tailwind)
│   └── src/
│       ├── components/    # Layout, Home, Reader, Search
│       ├── hooks/         # useSyncScroll, useDarkMode, etc.
│       ├── data/          # chapters.js, searchIndex.js
│       ├── styles/        # tailwind.css (design tokens)
│       └── utils/         # markdownLoader.js
├── tests/                 # Python unit tests
├── ui-tests/              # Puppeteer UI/UX tests
├── convert_docx.py        # Docx → Markdown conversion script
└── .github/workflows/     # GitHub Actions deployment
```

The app has a two-part pipeline:

1. **`convert_docx.py`** converts `.docx` source files into chapter-level Markdown
2. **`web/`** reads the Markdown at build time and renders it as a bilingual reader

## Book Structure

The book contains 15 chapters organized in 4 parts:

| Part | Chapters |
|------|----------|
| — | 序 (Foreword), 引言 (Introduction) |
| 第一部：與神一同建造 | Ch01–Ch03 |
| 第二部：跟隨聖靈引導的父母 | Ch04–Ch06 |
| 第三部：被聖靈充滿的孩子 | Ch07–Ch11 |
| 第四部：結論 | Ch12–Ch13 |

## Deployment

The site auto-deploys to GitHub Pages on every push to `main` via GitHub Actions. The workflow builds the Vite app and deploys `web/dist/` using `actions/deploy-pages@v4`.

## Copyright

> *Raising Spirit-Led Kids* &copy; Seth Dahl. 中文譯本《孩子的屬靈覺醒》經授權使用。
> 本站內容僅供閱讀，未經許可不得轉載或商業使用。
