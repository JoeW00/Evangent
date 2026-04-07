# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Evangent** (福音大翻譯計劃) is a bilingual reader web app for *Raising Spirit-Led Kids* (《孩子的屬靈覺醒》). It presents Chinese translations alongside the English original in a synchronized dual-column layout, deployed to GitHub Pages. The full Software Design Document is at `docs/SDD.md`.

## Commands

```bash
# Frontend (web/)
cd web && npm ci          # install dependencies
npm run dev               # local dev server (Vite)
npm run build             # production build → web/dist/
npm run lint              # ESLint
npm run preview           # preview production build locally

# Docx → Markdown conversion (requires Python 3.14+, uses uv)
uv sync                                # install Python deps
uv run python convert_docx.py          # regenerate docs/zh/ and docs/en/ from .docx sources
```

## Architecture

### Two-part pipeline

1. **`convert_docx.py`** — Python script that converts `.docx` source files into chapter-level Markdown. Chinese chapters come from individual `.docx` files in `docs/original/`; English chapters are split from a single combined `.docx` using hardcoded paragraph index boundaries (`EN_CHAPTERS`). Output goes to `docs/zh/` and `docs/en/`.

2. **`web/`** — React 19 SPA (Vite 8 + Tailwind CSS v4) that reads the generated Markdown at build time and renders it as a bilingual reader.

### Frontend structure (`web/src/`)

- **Routing**: HashRouter (`/#/chapter/:chapterId`). Chapter IDs defined in `src/data/chapters.js` (e.g., `foreword`, `ch01`–`ch13`).
- **Markdown loading**: `src/utils/markdownLoader.js` fetches `.md` files from the public path; `useChapterContent` hook manages loading state.
- **Reader**: `BilingualPane` renders side-by-side zh/en columns on desktop with `useSyncScroll` for synchronized scrolling. `MobileReader` switches to stacked layout on mobile.
- **Search**: `src/data/searchIndex.js` + Fuse.js powers full-text search across both languages via `SearchBar` modal (Ctrl/⌘+K).
- **Hooks**: `useDarkMode`, `useFontSize`, `useReadingProgress`, `useKeyboardNav` manage user preferences (persisted to localStorage).

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds `web/` and deploys to GitHub Pages on push to `main`. Base path is `/Evangent/` (configured in `vite.config.js`).

## Key Design Decisions

- **Chinese section headings** are detected via an explicit allowlist (`ZH_KNOWN_SECTIONS` in `convert_docx.py`), not heuristics, to avoid false positives on dialogue lines
- **English chapter boundaries** are hardcoded paragraph indices in `EN_CHAPTERS` — if the source `.docx` changes, these indices must be updated manually
- **Scripture references** are auto-detected via regex and rendered as blockquotes
- Running headers and copyright boilerplate are stripped from English output via `EN_RUNNING_HEADERS` and `EN_SKIP_PATTERNS`
- The `python-docx` library is used for `.docx` parsing (imported as `docx`)
- Markdown files in `docs/zh/` and `docs/en/` are **generated artifacts** — edit `convert_docx.py` or the source `.docx` files, not the Markdown directly
