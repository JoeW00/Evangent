# Software Design Document (SDD)

## 福音大翻譯計劃 — Evangent Bilingual Reader

---

## 1. 專案概述 (Project Overview)

### 1.1 目的

建立一個中英對照的線上閱讀平台，將《孩子的屬靈覺醒》(*Raising Spirit-Led Kids*) 一書以雙語並排的方式呈現，讓讀者可以同時閱讀中文譯本與英文原文。

### 1.2 目標受眾

- 華人教會社群中對兒童屬靈教育有興趣的父母與事工領袖
- 中英文學習者，可透過對照閱讀提升語言能力
- 翻譯團隊，用於校對與審閱譯稿

### 1.3 專案範疇 (POC)

本階段為 Proof of Concept，聚焦於：

- 全書 13 章 + 序 + 引言共 15 個章節的中英對照閱讀（不含封面與獻詞）
- 同步滾動的雙欄排版（桌機）
- 響應式設計切換為上下交錯排版（手機）
- 全書關鍵字搜尋（含高亮跳轉）
- 深色模式
- 字型大小調整、��讀進度記憶
- 部署至 GitHub Pages

### 1.4 版權聲明 (Copyright)

本書內容已取得作者授權，網站頁尾須標示以下版權資訊：

> *Raising Spirit-Led Kids* © Seth Dahl. 中文譯本《孩子的屬靈覺醒》經授權使用。  
> 本站內容僅供閱讀，未經許可不得轉載或商業使用。

### 1.5 已知限制 (Known Limitations)

- **英文原文段落缺失**：部分英文章節（如 Ch01、Ch04、Ch07、Ch10、Ch12 等）因原始 docx 檔的 running header 格式問題，開頭段落不完整（缺字）。此為來源檔案的既有問題，POC 階段先標記，後續可對照原書手動補齊。

---

## 2. 技術選型 (Tech Stack)

| 類別 | 技術 | 選用理由 |
|------|------|---------|
| UI 框架 | **React 19** | 元件化、生態成熟，支援 concurrent rendering |
| 建置工具 | **Vite 8** | 快速 HMR、原生支援 React、與 Tailwind v4 整合 |
| 樣式 | **Tailwind CSS v4** | CSS-first 設定、零設定檔、`@tailwindcss/vite` 原生整合 |
| Markdown 渲染 | **react-markdown v10 + remark-gfm** | 直接渲染 `.md` 為 React 元件，相容 React 19 |
| 路由 | **React Router v7** | 統一套件 `react-router`、章節導航、URL 分享 |
| 搜尋 | **Fuse.js** | 輕量模糊搜尋，無後端依賴 |
| 部署 | **GitHub Pages + gh-pages** | 零成本、適合 POC |

---

## 3. 資訊架構 (Information Architecture)

### 3.1 書籍結構

```
書籍
├── 序 / Foreword (Bill Johnson)
├── 引言 / Introduction (Seth Dahl)
├── 第一部：與神一同建造 / Part 1: Building with God
│   ├── Ch01 神所建造的殿 / The House That God Builds
│   ├── Ch02 孩子們所當行的路 / The Way They Should Go
│   └── Ch03 保有初心 / Stay a Novice
├── 第二部：跟隨聖靈引導的父母 / Part 2: The Spirit-Guided Parent
│   ├── Ch04 興起兒女 / Raising Sons and Daughters
│   ├── Ch05 與神一同築夢 / Dreaming with God
│   └── Ch06 不要（一直）講真理 / Do Not (Always) Tell the Truth
├── 第三部：被聖靈充滿的孩子 / Part 3: Spirit-Filled Children
│   ├── Ch07 學習神怎麼拼字 / Learning God's Alphabet
│   ├── Ch08 當孩子們看見 / When Children See
│   ├── Ch09 操練我們的感官 / Training Our Senses
│   ├── Ch10 道成肉身 / The Word Became Flesh
│   └── Ch11 他們有跟過耶穌 / They Have Been with Jesus
└── 第四部：結論 / Part 4: Conclusion
    ├── Ch12 保持渴慕 / Staying Hungry
    └── Ch13 爭戰與建造 / Fighting and Building
```

### 3.2 章節對照映射表

中英文檔案一對一精確對應（各 15 檔，封面與獻詞不顯示）：

```js
// src/data/chapters.js
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
```

---

## 4. 頁面設計 (Page Design)

### 4.1 頁面結構

```
┌─────────────────────────────────────────────────────┐
│  Header: 書名 + 導航                                  │
├─────────────────────────────────────────────────────┤
│        首頁 (/) — 書名 + 目錄                          │
│        章節頁 (/chapter/:id) — 雙欄閱讀               │
│        搜尋頁 (/search) — 關鍵字搜尋結果               │
├─────────────────────────────────────────────────────┤
│  Footer: 版權資訊                                     │
└─────────────────────────────────────────────────────┘
```

### 4.2 首頁 (Home Page)

```
┌──────────────────────────────────────┐
│          🕊️ 福音大翻譯計劃            │
│     《孩子的屬靈覺醒》中英對照         │
│       Raising Spirit-Led Kids         │
│     [ 🔍 搜尋全書 ]  [🌙/☀️]         │
├──────────────────────────────────────┤
│  ┌──────────────────────────────┐   │
│  │ 序 / Foreword                 │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │ 引言 / Introduction           │   │
│  └──────────────────────────────┘   │
│                                      │
│  第一部：與神一同建造                   │
│  Part 1: Building with God           │
│  ┌──────────────────────────────┐   │
│  │ Ch01 神所建造的殿              │   │
│  │      The House That God Builds│   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │ Ch02 孩子們所當行的路          │   │
│  │      The Way They Should Go   │   │
│  └──────────────────────────────┘   │
│  ...                                 │
└──────────────────────────────────────┘
```

### 4.3 章節閱讀頁 — 桌機版 (≥ 1024px)

```
┌──────────────────────────────────────────────────────┐
│ ☰ 目錄    《孩子的屬靈覺醒》 Ch01   A± 🔍 🌙        │
├─────────────────────────┬────────────────────────────┤
│                         │                            │
│   # 神所建造的殿         │  # The House That God      │
│                         │    Builds                  │
│   ## 真實的文化          │                            │
│                         │  ## Creating Culture       │
│   在教會工作的期間，我花  │                            │
│   了很多時間去探索⋯⋯     │  congregation learns what  │
│                         │  is available, and if...   │
│   〔同步滾動〕           │  〔同步滾動〕               │
│                         │                            │
├─────────────────────────┴────────────────────────────┤
│            ← 上一章  ·  目錄  ·  下一章 →              │
└──────────────────────────────────────────────────────┘
```

**關鍵互動：**
- 左右兩欄同步滾動（滾動任一側，另一側等比例跟隨）
- 中間分隔線可拖拉調整比例（選配，POC 可先固定 50/50）

### 4.4 章節閱讀頁 — 手機版 (< 1024px)

```
┌──────────────────────────┐
│ ☰     Ch01      🔍      │
├──────────────────────────┤
│  [中文] [English] [對照]  │  ← 切換 Tab
├──────────────────────────┤
│                          │
│  # 神所建造的殿           │
│  # The House That God    │
│    Builds                │
│                          │
│  ── 中文 ──              │
│  在教會工作的期間⋯⋯      │
│                          │
│  ── English ──           │
│  congregation learns...  │
│                          │
│  ── 中文 ──              │
│  教會裡的文化非常重要⋯⋯  │
│                          │
│  ── English ──           │
│  Church culture is very  │
│  important...            │
│                          │
├──────────────────────────┤
│     ← 上一章 · 下一章 →  │
└──────────────────────────┘
```

**手機模式三種 Tab：**
- **中文**：只顯示中文
- **English**：只顯示英文
- **對照**：上下交錯（段落級中英交替）

---

## 5. 元件架構 (Component Architecture)

```
src/
├── App.jsx                    # 路由定義
├── main.jsx                   # 進入點
├── data/
│   ├── chapters.js            # 章節映射配置
│   └── searchIndex.js         # 預建搜尋索引（段落級）
├── hooks/
│   ├── useSyncScroll.js       # 同步滾動 Hook
│   ├── useChapterContent.js   # 載入與解析 Markdown
│   ├── useDarkMode.js         # 深色模式切換 + localStorage
│   ├── useFontSize.js         # 字型大小偏好
│   ├── useReadingProgress.js  # 閱讀進度記憶
│   └── useKeyboardNav.js     # 鍵盤快捷鍵
├── components/
│   ├── Layout/
│   │   ├── Header.jsx         # 頂部導航列（含搜尋、深色模式、字型切換）
│   │   ├── Footer.jsx         # 頁尾版權聲明
│   │   ├── MobileSidebar.jsx  # 手機版側邊目錄（左側滑入）
│   │   └── NotFound.jsx       # 404 頁面
│   ├── Home/
│   │   ├── HeroBanner.jsx     # 首頁標題區
│   │   ├── ContinueReading.jsx # 「繼續閱讀」卡片
│   │   └── TableOfContents.jsx # 目錄列表（含已讀標記）
│   ├── Reader/
│   │   ├── ChapterReader.jsx  # 章節頁主容器
│   │   ├── BilingualPane.jsx  # 桌機雙欄容器（含同步滾動）
│   │   ├── MobileReader.jsx   # 手機版切換容器
│   │   ├── MarkdownRenderer.jsx # Markdown → React（支援高亮）
│   │   ├── ReadingProgressBar.jsx # 頂部閱讀進度條
│   │   └── ChapterNav.jsx     # 上/下一章導航
│   └── Search/
│       ├── SearchBar.jsx      # 搜尋輸入框（Ctrl+K 開啟）
│       └── SearchResults.jsx  # 搜尋結果列表（含摘要高亮）
├── styles/
│   └── tailwind.css           # @import "tailwindcss" + @variant dark + 自訂樣式
└── utils/
    └── markdownLoader.js      # Markdown 檔案載入工具
```

### 5.1 關鍵元件說明

#### `BilingualPane` — 桌機同步滾動雙欄

```jsx
/**
 * 核心互動邏輯：
 * 1. 左右兩欄各自有獨立的 scrollable container
 * 2. 監聽任一側的 scroll 事件
 * 3. 計算 scrollTop / scrollHeight 比例
 * 4. 將相同比例套用到另一側
 * 5. 使用 ref flag 防止無限迴圈觸發
 */
```

#### `MobileReader` — 手機版三模式切換

```jsx
/**
 * 三種顯示模式：
 * - "zh": 只渲染中文 Markdown
 * - "en": 只渲染英文 Markdown
 * - "bilingual": 將段落交錯排列（中→英→中→英）
 */
```

---

## 6. 資料流 (Data Flow)

### 6.1 Markdown 載入流程

```
                  Build 階段
docs/zh/*.md ──┐
               ├──> Vite raw import ──> 字串存入 JS bundle
docs/en/*.md ──┘

                  Runtime
JS bundle ──> useChapterContent(chapterId)
          ──> { zh: "# 神所建造的殿\n...", en: "# The House...\n..." }
          ──> react-markdown 渲染
```

使用 Vite 的 dynamic import + `?raw` 搭配 `React.lazy`，按章節懶載入 Markdown 內容。只有使用者進入該章節時才載入對應的 `.md` 檔案，避免初始 bundle 過大（15 章全載會超過 500KB 文字量）。搜尋索引則在首次開啟搜尋時才建立。

### 6.2 搜尋流程

```
Build 階段:
  所有 Markdown 文字 ──> 預建 Fuse.js 索引（按章節+語言分段）

Runtime:
  使用者輸入關鍵字
    ──> Fuse.js 模糊搜尋
    ──> 回傳匹配結果 [{ chapter, lang, excerpt, score }]
    ──> 點擊結果 → 跳轉至對應章節
```

---

## 7. 視覺設計 (Visual Design)

### 7.1 設計原則

- **簡約大方**：大量留白，閱讀為核心
- **軟色調**：不刺眼，長時間閱讀舒適
- **雙語區分**：透過微妙的背景色差區分中英文欄

### 7.2 色彩系統

```
主色調 (Primary):
  靛藍  #4F6D7A     — Header、連結、按鈕

背景色:
  米白  #FAFAF7     — 頁面底色
  暖白  #FFFFFF     — 內容區
  淺灰  #F5F3EF     — 英文欄微底色（區分左右）

文字色:
  深灰  #2D2D2D     — 正文
  中灰  #6B7280     — 次要文字、章節標籤
  淺灰  #9CA3AF     — 引用文字

強調色:
  暖橘  #D4956A     — 部名標籤、hover 狀態
  淺金  #F0E6D3     — 搜尋高亮背景
```

### 7.3 字型

```css
/* 中文 */
font-family: "Noto Serif TC", "Source Han Serif TC", serif;

/* 英文 */
font-family: "Lora", "Georgia", serif;

/* UI 元素 */
font-family: "Inter", "Noto Sans TC", sans-serif;
```

正文字級：中文 `17px`、英文 `16px`、行高 `1.85`。偏大的字級與寬鬆的行高確保長文閱讀舒適度。

### 7.4 間距與排版

- 段落間距：`1.5em`
- 雙欄分隔：`1px solid #E5E2DC` + 左右各 `2rem` padding
- 章節標題：`2rem` 上方留白
- 引用區塊：左側 `3px` 色條 + 淺背景

---

## 8. 同步滾動機制 (Synchronized Scrolling)

### 8.1 技術方案

採用**比例式同步滾動**：

```
scrollRatio = scrollTop / (scrollHeight - clientHeight)
```

當使用者滾動左欄時：
1. 計算左欄的 `scrollRatio`
2. 將右欄的 `scrollTop` 設為 `scrollRatio × (右欄 scrollHeight - clientHeight)`
3. 使用 `isScrolling` ref flag 防止反向觸發形成無限迴圈

### 8.2 限制與取捨

- 比例式同步無法做到「段落級精確對齊」（需要段落 ID 映射，複雜度高）
- POC 階段先以比例式實作，後續可升級為段落錨點同步

---

## 9. 響應式設計 (Responsive Design)

| 斷點 | 佈局 | 說明 |
|------|------|------|
| `≥ 1024px` | 左右雙欄 50/50 | 桌機，同步滾動 |
| `768px – 1023px` | 左右雙欄 55/45 | 平板，中文欄略寬 |
| `< 768px` | 單欄 + Tab 切換 | 手機，中文/英文/對照三模式 |

---

## 10. 路由設計 (Routing)

```
/                       → 首頁（目錄）
/chapter/:chapterId     → 章節閱讀（如 /chapter/ch01）
/search?q=關鍵字         → 搜尋結果頁
```

使用 React Router v7 的 `HashRouter`（從 `react-router` 統一套件匯入）以相容 GitHub Pages（不需 server-side redirect）。

```js
// React Router v7 匯入方式
import { HashRouter, Routes, Route } from "react-router";
```

---

## 11. 部署方案 (Deployment)

```
GitHub Actions workflow:
  on push to main:
    1. npm install
    2. npm run build
    3. Deploy dist/ to gh-pages branch
```

使用 `gh-pages` npm package 或 GitHub Actions 自動部署。

---

## 12. 無障礙設計 (Accessibility)

### 12.1 鍵盤導航

| 快捷鍵 | 功能 |
|--------|------|
| `←` / `→` | 上一章 / 下一章 |
| `Ctrl + K` 或 `/` | 開啟搜尋框 |
| `Esc` | 關閉搜尋框 / 收合側邊目錄 |
| `Home` | 回到章節頂部 |

### 12.2 螢幕閱讀器

- 所有互動元素加上 `aria-label`
- 章節切換時以 `aria-live="polite"` 通知
- 中英文欄以 `lang="zh-TW"` 和 `lang="en"` 標記
- 圖片（若有）提供 `alt` 文字

### 12.3 色彩對比

- 正文文字與背景的對比度 ≥ 4.5:1（符合 WCAG AA）
- 深色模式同樣需通過對比度檢查

---

## 13. 深色模式 (Dark Mode)

### 13.1 實作方式

Tailwind CSS v4 預設使用 `prefers-color-scheme` 媒體查詢來啟用 `dark:` 變體。為支援手動切換，需在 CSS 中覆寫為 class-based 策略：

```css
/* tailwind.css */
@import "tailwindcss";
@variant dark (&:where(.dark, .dark *));
```

- 透過 Header 上的切換按鈕 (🌙/☀️) 切換 `<html class="dark">`
- 使用者偏好儲存在 `localStorage`，下次造訪自動套用
- 首次造訪時，偵測系統偏好 `prefers-color-scheme` 作為預設值

### 13.2 深色模式色彩

```
背景色:
  深底  #1A1A2E     — 頁面底色
  深卡  #232340     — 內容區
  深灰  #2A2A45     — 英文欄微底色

文字色:
  淺白  #E8E8ED     — 正文
  灰白  #9CA3AF     — 次要文字
  暗灰  #6B7280     — 引用文字

主色調:
  柔藍  #7BA7BC     — 連結、按鈕（亮色版 #4F6D7A 的明亮變體）
  暖橘  #E0A87C     — 強調色
```

---

## 14. 閱讀體驗增強 (Reading Experience)

### 14.1 字型大小調整

- Header 提供 `A-` / `A+` 按鈕，三段字級可切：
  - 小：中文 15px / 英文 14px
  - 中（預設）：中文 17px / 英文 16px
  - 大：中文 20px / 英文 19px
- 偏好儲存在 `localStorage`

### 14.2 閱讀進度記憶

- 使用 `localStorage` 記錄：
  - 最後閱讀的章節 ID
  - 該章節的滾動位置（scrollRatio）
- 首頁顯示「繼續閱讀」卡片，一鍵回到上次位置
- 結構：`{ lastChapter: "ch03", scrollRatio: 0.42 }`

### 14.3 閱讀進度指示

- 章節閱讀頁頂部顯示細進度條（sticky，隨滾動填充）
- 首頁目錄中已讀章節顯示淡色勾號 ✓

---

## 15. 搜尋功能細節 (Search UX)

### 15.1 搜尋範圍

- **全書搜尋**：同時搜尋中文和英文內容
- 支援中英文混合關鍵字

### 15.2 搜尋結果呈現

```
┌──────────────────────────────────────┐
│ 🔍 [          聖靈        ] [搜尋]   │
├──────────────────────────────────────┤
│ 找到 12 筆結果                        │
│                                      │
│ ┌──────────────────────────────┐    │
│ │ Ch01 神所建造的殿              │    │
│ │ ...我們深信【聖靈】沒有大小    │    │
│ │ 之分，因此如果遇到...          │    │
│ └──────────────────────────────┘    │
│ ┌──────────────────────────────┐    │
│ │ Ch07 學習神怎麼拼字            │    │
│ │ ...【聖靈】運行在家裡，但祂    │    │
│ │ 在等待有人將神的話語...         │    │
│ └──────────────────────────────┘    │
│ ...                                  │
└──────────────────────────────────────┘
```

### 15.3 高亮跳轉行為

1. 使用者點擊搜尋結果
2. 跳轉至對應章節頁
3. 自動滾動到首個匹配段落
4. 匹配關鍵字以 `<mark>` 標籤高亮（背景色 `#F0E6D3`，深色模式 `#5C4A2E`）
5. 高亮在 5 秒後漸淡消失，或使用者手動滾動時移除

### 15.4 搜尋技術細節

- 使用 Fuse.js 建立索引，索引粒度為**段落級**（非整章）
- 每個索引項：`{ chapterId, lang, paragraphIndex, text }`
- 搜尋結果擷取匹配段落前後各 30 字作為摘要
- 結果依相關度排序，最多顯示 50 筆

---

## 16. 錯誤狀態處理 (Error States)

| 場景 | 處理方式 |
|------|---------|
| 無效章節 ID (404) | 顯示友善的 404 頁面，附帶「回到目錄」按鈕 |
| 章節內容載入中 | Skeleton 載入動畫（模擬段落形狀的灰色區塊） |
| 搜尋無結果 | 顯示「沒有找到符合的結果，試試其他關鍵字？」+ 搜尋建議 |
| Markdown 渲染失敗 | 顯示原始文字 fallback + 錯誤通知 |

---

## 17. 手機版側邊目錄 (Mobile Sidebar)

### 互動行為

- 點擊 ☰ 漢堡按鈕，側邊目錄從**左側滑入**
- 背景顯示半透明 overlay (`bg-black/50`)
- 點擊 overlay 或選擇章節後，自動收合
- 側邊目錄寬度 `80vw`，最大 `320px`
- 滑入/滑出使用 `transform: translateX` + `transition 300ms ease`
- 目錄中標示目前章節（高亮 + 圖標）

---

## 18. 目錄結構 (Project Structure)

```
Evangent/
├── docs/                      # 原始 Markdown 內容
│   ├── zh/                    # 中文版 (15 files)
│   ├── en/                    # 英文版 (16 files, 網站使用 15 files)
│   └── SDD.md                 # 本文件
├── web/                       # ⭐ 前端應用（新建）
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── styles/
│   │   └── utils/
│   ├── index.html
│   ├── vite.config.js         # 含 @tailwindcss/vite 插件
│   └── package.json           # Tailwind v4 不需 tailwind.config.js / postcss.config.js
├── convert_docx.py            # Markdown 轉換腳本
└── README.md
```

---

## 19. 驗收標準 (Acceptance Criteria)

### 功能面
- [ ] 首頁顯示完整目錄（含序、引言），按部分組排列
- [ ] 首頁顯示「繼續閱讀」卡片（若有閱讀紀錄）
- [ ] 點擊章節可進入雙欄閱讀頁
- [ ] 桌機版左右同步滾動正常運作
- [ ] 手機版三種模式（中文/英文/對照）可切換
- [ ] 手機版側邊目錄可正常開啟/收合
- [ ] 搜尋框可搜尋中英文關鍵字，顯示摘要結果
- [ ] 點擊搜尋結果可跳轉至章節並高亮關鍵字
- [ ] 上一章/下一章導航正常
- [ ] 鍵盤快捷鍵正常運作（←/→/Ctrl+K/Esc）
- [ ] 深色模式可切換，偏好可記憶
- [ ] 字型大小三段可切換，偏好可記憶
- [ ] 閱讀進度可記憶，下次造訪可恢復
- [ ] 成功部署至 GitHub Pages 並可存取

### 視覺面
- [ ] 亮色/深色模式配色皆舒適，長時間閱讀不刺眼
- [ ] 中英文字型正確載入
- [ ] 響應式在 320px ~ 1920px 間正常顯示
- [ ] 404 頁面、載入狀態、空搜尋結果皆有友善提示

### 效能面
- [ ] 首頁載入 < 2 秒（Lighthouse Performance > 90）
- [ ] 章節內容懶載入，切換章節無明顯延遲
- [ ] 搜尋索引延遲建立，不影響初始載入

### 無障礙
- [ ] 正文文字對比度 ≥ 4.5:1（WCAG AA）
- [ ] 所有互動元素可透過鍵盤操作
- [ ] 中英文欄正確標記 `lang` 屬性

---

## 20. 實作順序 (Implementation Phases)

### Phase 1: 基礎建設
1. 初始化 Vite 8 + React 19 + Tailwind CSS v4 專案（含 `@tailwindcss/vite` 插件 + `@variant dark` 設定）
2. 建立章節映射配置 (`chapters.js`)
3. 實作 Markdown 懶載入機制（dynamic import + `?raw`）
4. 建立色彩系統（亮色 + 深色 token）與字型載入

### Phase 2: 核心閱讀體驗
5. 實作首頁 + 目錄元件 + HeroBanner
6. 實作桌機版雙欄同步滾動閱讀頁 (`BilingualPane`)
7. 實作手機版 Tab 切換閱讀頁 (`MobileReader`)
8. 實作手機版側邊目錄 (`MobileSidebar`)

### Phase 3: 導航與搜尋
9. 實作 Header 導航 + 上下章切換 + 鍵盤快捷鍵
10. 實作 Fuse.js 段落級搜尋索引
11. 實作搜尋結果頁 + 高亮跳轉

### Phase 4: 體驗增強
12. 深色模式切換 + localStorage 記憶
13. 字型大小切換 (A-/A+)
14. 閱讀進度記憶 + 「繼續閱讀」卡片
15. 閱讀進度條

### Phase 5: 收尾與部署
16. 錯誤狀態處理（404、Skeleton、空結果）
17. 無障礙檢查（對比度、ARIA、lang 屬性）
18. 響應式測試（320px ~ 1920px）
19. 視覺調校（間距、動畫、過渡效果）
20. GitHub Pages 部署設定 + GitHub Actions CI
