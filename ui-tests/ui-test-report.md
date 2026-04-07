# Evangent UI/UX 測試報告

**測試時間**: 2026-04-07T02:21:59.370Z
**目標 URL**: http://localhost:5175/Evangent/
**結果**: 60 通過 / 13 失敗 / 73 總計

## ❌ 失敗項目

| # | 測試組 | 檢查項目 | 問題描述 |
|---|--------|---------|----------|
| 3.3 | 桌機雙欄 | 中文欄白色背景 | zh bg: #000000 |
| 3.4 | 桌機雙欄 | 同步滾動 | left: 0, right: 0 |
| 5.1 | 鍵盤快捷鍵 | ← 上一章 | URL: http://localhost:5175/Evangent/#/chapter/ch02 |
| 5.2 | 鍵盤快捷鍵 | → 下一章 | URL: http://localhost:5175/Evangent/#/chapter/ch02 |
| 7.3 | 深色模式 | 深色英文欄背景 | got: #000000 |
| 7.4 | 深色模式 | 深色正文色 #E8E8ED | got: #000000 |
| 7.5 | 深色模式 | 深色主色 #7BA7BC | got: #000000 |
| 9.5 | 手機版 | 點擊 overlay 關閉 |  |
| 9.6 | 手機版 | 目前章節高亮 |  |
| 12.1 | 視覺一致性 | 亮色頁面底色 #FAFAF7 | got: #000000 |
| 12.2 | 視覺一致性 | Header 背景 #FFFFFF | got: #000000 |
| 12.3 | 視覺一致性 | Header 高度 56px (h-14) | got: 57px |
| 12.4 | 視覺一致性 | 引用區塊色條 (暖橘) | got: #000000 |

## 完整結果


### 首頁

| # | 檢查項目 | 結果 | 備註 |
|---|---------|------|------|
| 1.1 | HeroBanner 書名 | ✅ | got: "福音大翻譯計劃" |
| 1.2a | 副標題含中英書名 | ✅ | got: 《孩子的屬靈覺醒》中英對照 | Raising Spirit-Led Kids |
| 1.2 | 目錄列出 15 章 | ✅ | got: 15 links |
| 1.3 | 4 個部名標籤 | ✅ | found: 8 |
| 1.4 | 章節中英雙語標題 | ✅ | got: 序 / Foreword |
| 1.5 | 章節連結正確 | ✅ | href: #/chapter/foreword |
| 1.6 | 版權聲明 Footer | ✅ | Raising Spirit-Led Kids © Seth Dahl. 中文譯本《孩子的屬靈覺醒》經授權使用。本站內容 |

### 繼續閱讀

| # | 檢查項目 | 結果 | 備註 |
|---|---------|------|------|
| 2.1 | 無記錄時不顯示 | ✅ | "繼續閱讀" text found: false |
| 2.2 | 有記錄時顯示卡片 | ✅ |  |
| 2.3 | 進度條寬度正確 | ✅ | got: 35% |

### 桌機雙欄

| # | 檢查項目 | 結果 | 備註 |
|---|---------|------|------|
| 3.1 | 左右雙欄 50/50 | ✅ | w-1/2 elements: 2 |
| 3.2 | 中間分隔線 | ✅ |  |
| 3.3 | 中文欄白色背景 | ❌ | zh bg: #000000 |
| 3.4 | 同步滾動 | ❌ | left: 0, right: 0 |
| 3.5 | H1 標題渲染 | ✅ | got: "神所建造的殿" |
| 3.6 | H2 小節標題 | ✅ |  |
| 3.7 | 引用區塊有左側色條 | ✅ | border: 3px rgb(0, 0, 0) |
| 3.8 | 中文字型 | ✅ | got: "Noto Serif TC", "Source Han Serif TC", serif |
| 3.9 | 英文字型 | ✅ | got: Lora, Georgia, serif |
| 3.10 | 正文字級 (zh:17px en:16px) | ✅ | zh: 17px, en: 16px |
| 3.11 | 行高 1.85 | ✅ | got: 1.85 |
| 3.12 | 段落間距 1.5em | ✅ | got: 25.5px |

### 章節導航

| # | 檢查項目 | 結果 | 備註 |
|---|---------|------|------|
| 4.1 | 底部導航列 | ✅ | links: 序, 引言, 神所建造的殿, 孩子們所當行的路, 保有初心, 興起兒女, 與神一同築夢, 不要（一直）講真理, 學習神怎麼拼字, 當孩子們看見, 操練我們的感官 |
| 4.2 | 第一章無「上一章」 | ✅ |  |
| 4.3 | 最後一章無「下一章」 | ✅ |  |
| 4.4 | Header 顯示章節名 | ✅ | got: "《孩子的屬靈覺醒》神所建造的殿" |
| 4.5 | 閱讀進度條存在 | ✅ |  |

### 鍵盤快捷鍵

| # | 檢查項目 | 結果 | 備註 |
|---|---------|------|------|
| 5.1 | ← 上一章 | ❌ | URL: http://localhost:5175/Evangent/#/chapter/ch02 |
| 5.2 | → 下一章 | ❌ | URL: http://localhost:5175/Evangent/#/chapter/ch02 |
| 5.3 | Ctrl+K 開搜尋 | ✅ |  |
| 5.4 | Esc 關搜尋 | ✅ |  |
| 5.5 | / 開搜尋 | ✅ |  |

### 搜尋功能

| # | 檢查項目 | 結果 | 備註 |
|---|---------|------|------|
| 6.1 | 搜尋 modal 開啟 | ✅ |  |
| 6.2 | input 自動聚焦 | ✅ |  |
| 6.3 | 中文搜尋有結果 | ✅ | results: 7 |
| 6.4 | 英文搜尋有結果 | ✅ | results: 32 |
| 6.5 | 結果含摘要 | ✅ |  |
| 6.6 | 無結果提示 | ✅ |  |
| 6.8 | 少於 2 字不搜尋 | ✅ | results: 0 |
| 6.7 | 點擊結果跳轉 | ✅ | URL: http://localhost:5175/Evangent/#/chapter/ch07?q=God |

### 深色模式

| # | 檢查項目 | 結果 | 備註 |
|---|---------|------|------|
| 7.1 | 切換按鈕存在 | ✅ |  |
| 7.2 | 切換到深色 (dark class + 背景色) | ✅ | dark class: true, page bg: #000000 |
| 7.3 | 深色英文欄背景 | ❌ | got: #000000 |
| 7.4 | 深色正文色 #E8E8ED | ❌ | got: #000000 |
| 7.5 | 深色主色 #7BA7BC | ❌ | got: #000000 |
| 7.6 | 偏好記憶 (reload 後仍為深色) | ✅ |  |
| 7.7 | 切回亮色 | ✅ |  |

### 字型大小

| # | 檢查項目 | 結果 | 備註 |
|---|---------|------|------|
| 8.1 | 預設中字 17px | ✅ | got: 17px |
| 8.2 | A- → 小字 (zh:15px en:14px) | ✅ | zh: 15px, en: 14px |
| 8.3 | A+ 兩次 → 大字 (zh:20px en:19px) | ✅ | zh: 20px, en: 19px |
| 8.4 | 上限不超過大字 | ✅ | got: 20px |
| 8.5 | 偏好記憶 (reload 維持) | ✅ | got: 20px |

### 手機版

| # | 檢查項目 | 結果 | 備註 |
|---|---------|------|------|
| 9.1 | 首頁正常顯示 | ✅ |  |
| 9.2 | 漢堡按鈕出現 | ✅ |  |
| 9.3 | 側邊目錄滑入 | ✅ |  |
| 9.4 | 側邊目錄寬度 ≤320px | ✅ | got: 300px |
| 9.5 | 點擊 overlay 關閉 | ❌ |  |
| 9.6 | 目前章節高亮 | ❌ |  |

### 手機Tab

| # | 檢查項目 | 結果 | 備註 |
|---|---------|------|------|
| 10.1 | 三個 Tab | ✅ | found: 3 |
| 10.2 | 預設中文 Tab | ✅ |  |
| 10.3 | 切換到 English | ✅ |  |
| 10.4 | 對照模式段落交錯 | ✅ |  |

### 404頁面

| # | 檢查項目 | 結果 | 備註 |
|---|---------|------|------|
| 11.1 | 顯示 404 + 訊息 | ✅ |  |
| 11.2 | 回到目錄按鈕 | ✅ |  |
| 11.3 | 點擊回首頁 | ✅ | URL: http://localhost:5175/Evangent/#/ |

### 視覺一致性

| # | 檢查項目 | 結果 | 備註 |
|---|---------|------|------|
| 12.1 | 亮色頁面底色 #FAFAF7 | ❌ | got: #000000 |
| 12.2 | Header 背景 #FFFFFF | ❌ | got: #000000 |
| 12.3 | Header 高度 56px (h-14) | ❌ | got: 57px |
| 12.4 | 引用區塊色條 (暖橘) | ❌ | got: #000000 |
| 12.5 | 欄內 padding 2rem (32px) | ✅ | got: 32px |

### 無障礙

| # | 檢查項目 | 結果 | 備註 |
|---|---------|------|------|
| 13.1 | lang 屬性 (zh-TW + en) | ✅ | zh-TW: true, en: true |
| 13.2 | Header 按鈕有 aria-label | ✅ | found: 開啟目錄, 縮小字型, 放大字型, 搜尋, 切換深色模式 |
| 13.3 | 色彩對比度 ≥ 4.5:1 (WCAG AA) | ✅ | ratio: 13.17:1 |

## 截圖清單

- `screenshots/01-homepage-full.png`
- `screenshots/01-homepage-top.png`
- `screenshots/02-continue-reading.png`
- `screenshots/03-desktop-bilingual.png`
- `screenshots/06-search-chinese.png`
- `screenshots/07-dark-mode-chapter.png`
- `screenshots/07-dark-mode-home.png`
- `screenshots/09-mobile-home.png`
- `screenshots/09-mobile-sidebar-active.png`
- `screenshots/09-mobile-sidebar.png`
- `screenshots/10-mobile-tab-bilingual.png`
- `screenshots/10-mobile-tab-en.png`
- `screenshots/10-mobile-tab-zh.png`
- `screenshots/11-not-found.png`
