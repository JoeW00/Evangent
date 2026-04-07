# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Evangent** (福音大翻譯計劃) is a bilingual reader web app for *Raising Spirit-Led Kids* (《孩子的屬靈覺醒》). It presents Chinese translations alongside the English original in a synchronized dual-column layout, deployed to GitHub Pages. The full Software Design Document is at `docs/SDD.md`. Design context (audience, brand personality, aesthetic direction) is in `.impeccable.md`.

## Commands

```bash
# Frontend (web/)
cd web && npm ci            # install dependencies
npm run dev                 # local dev server (Vite)
npm run build               # production build → web/dist/
npm run lint                # ESLint
npm test                    # run all JS tests (vitest)
npm run test:watch          # vitest in watch mode

# Python (project root)
uv sync                                # install Python deps
uv run python convert_docx.py          # regenerate docs/zh/ and docs/en/ from .docx sources
uv run pytest tests/ -v                # run all Python tests
uv run pytest tests/test_en_conversion.py -k "test_basic" # run a single test
```

## Architecture

### Two-part pipeline

1. **`convert_docx.py`** — Python script that converts `.docx` source files into chapter-level Markdown. Chinese chapters come from individual `.docx` files in `docs/original/`; English chapters are split from a single combined `.docx` using hardcoded paragraph index boundaries (`EN_CHAPTERS`). Output goes to `docs/zh/` and `docs/en/`.

2. **`web/`** — React 19 SPA (Vite 8 + Tailwind CSS v4) that reads the generated Markdown at build time and renders it as a bilingual reader.

### Frontend structure (`web/src/`)

- **Routing**: HashRouter (`/#/chapter/:chapterId`). Chapter IDs defined in `src/data/chapters.js` (e.g., `foreword`, `ch01`–`ch13`).
- **Markdown loading**: `src/utils/markdownLoader.js` uses `import.meta.glob` (lazy) to load `.md` files; `useChapterContent` hook manages loading state.
- **Reader**: `BilingualPane` renders side-by-side zh/en columns on desktop with `useSyncScroll` for synchronized scrolling. `MobileReader` switches to tabbed layout (中文/English/對照) on mobile.
- **Search**: `src/data/searchIndex.js` + Fuse.js powers full-text search. The search index is **lazy-loaded** — `search()` and `getSearchIndex()` are both **async** functions.
- **Hooks**: `useDarkMode`, `useFontSize`, `useReadingProgress`, `useKeyboardNav` manage user preferences (persisted to localStorage).

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds `web/` and deploys to GitHub Pages on push to `main`. Base path is `/Evangent/` (configured in `vite.config.js`). Live at `https://joew00.github.io/Evangent/`.

## Key Design Decisions

- **Chinese section headings** are detected via an explicit allowlist (`ZH_KNOWN_SECTIONS` in `convert_docx.py`), not heuristics, to avoid false positives on dialogue lines
- **English chapter boundaries** are hardcoded paragraph indices in `EN_CHAPTERS` — if the source `.docx` changes, these indices must be updated manually
- **Scripture references** are auto-detected via regex and rendered as blockquotes
- Running headers and copyright boilerplate are stripped from English output via `EN_RUNNING_HEADERS` and `EN_SKIP_PATTERNS`
- The `python-docx` library is used for `.docx` parsing (imported as `docx`)
- Markdown files in `docs/zh/` and `docs/en/` are **generated artifacts** — edit `convert_docx.py` or the source `.docx` files, not the Markdown directly

## Gotchas

- **Tailwind CSS v4 `var()` requirement**: CSS custom properties in bracket notation MUST use `var()`. Write `bg-[var(--color-bg-content)]`, NOT `bg-[--color-bg-content]`. Without `var()`, Tailwind v4 compiles to invalid CSS (`background-color: --color-bg-content` instead of `background-color: var(--color-bg-content)`), making backgrounds transparent.
- **Header is outside `<Routes>`**: `Header.jsx` cannot use `useParams()` — it uses `useLocation()` and regex to extract the chapter ID from the pathname.
- **MarkdownRenderer is memoized**: Wrapped in `React.memo` with `useMemo` on the `components` object. The `remarkPlugins` array is hoisted to module scope (`REMARK_PLUGINS`) to avoid re-creating it per render.
