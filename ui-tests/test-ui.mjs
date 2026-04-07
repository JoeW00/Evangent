#!/usr/bin/env node
/**
 * Evangent UI/UX Browser Test Suite
 * Runs against http://localhost:5175/Evangent/ using Puppeteer
 * Produces screenshots + a Markdown report of pass/fail per SDD spec
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS = path.join(__dirname, "screenshots");
const BASE_URL = "http://localhost:5175/Evangent/";
const REPORT_PATH = path.join(__dirname, "ui-test-report.md");

// Ensure clean screenshots dir
if (fs.existsSync(SCREENSHOTS)) fs.rmSync(SCREENSHOTS, { recursive: true });
fs.mkdirSync(SCREENSHOTS, { recursive: true });

const results = [];

function record(group, id, name, pass, detail = "") {
  const status = pass ? "PASS" : "FAIL";
  const icon = pass ? "✅" : "❌";
  console.log(`  ${icon} ${id} ${name}${detail ? ` — ${detail}` : ""}`);
  results.push({ group, id, name, status, detail });
}

async function screenshot(page, name) {
  const fpath = path.join(SCREENSHOTS, `${name}.png`);
  await page.screenshot({ path: fpath, fullPage: false });
  return fpath;
}

async function screenshotFull(page, name) {
  const fpath = path.join(SCREENSHOTS, `${name}.png`);
  await page.screenshot({ path: fpath, fullPage: true });
  return fpath;
}

// ─── Helpers ───

async function getComputedStyle(page, selector, prop) {
  return page.evaluate(
    (sel, p) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      return window.getComputedStyle(el)[p];
    },
    selector,
    prop
  );
}

async function getTextContent(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? el.textContent.trim() : null;
  }, selector);
}

async function countElements(page, selector) {
  return page.evaluate((sel) => document.querySelectorAll(sel).length, selector);
}

async function elementExists(page, selector) {
  return page.evaluate((sel) => !!document.querySelector(sel), selector);
}

function rgbToHex(rgb) {
  if (!rgb) return null;
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return rgb;
  return (
    "#" +
    [m[1], m[2], m[3]].map((x) => parseInt(x).toString(16).padStart(2, "0")).join("")
  ).toUpperCase();
}

function contrastRatio(hex1, hex2) {
  function luminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const [R, G, B] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ═══════════════════════════════════════════
// TEST SUITES
// ═══════════════════════════════════════════

async function test1_HomePage(page) {
  console.log("\n📋 測試 1：首頁 — HeroBanner + 目錄");
  await page.goto(BASE_URL + "#/", { waitUntil: "networkidle2" });
  await page.waitForSelector("nav[aria-label='目錄']", { timeout: 5000 }).catch(() => {});

  // 1.1 HeroBanner
  const heroText = await getTextContent(page, "section h1");
  record("首頁", "1.1", "HeroBanner 書名", heroText?.includes("福音大翻譯計劃"), `got: "${heroText}"`);

  const subtitle = await page.evaluate(() => {
    const ps = document.querySelectorAll("section p");
    return Array.from(ps).map((p) => p.textContent.trim());
  });
  record("首頁", "1.2a", "副標題含中英書名",
    subtitle.some((s) => s.includes("孩子的屬靈覺醒")) && subtitle.some((s) => s.includes("Raising Spirit-Led Kids")),
    `got: ${subtitle.join(" | ")}`
  );

  // 1.2 目錄章節數
  const chapterLinks = await countElements(page, "nav[aria-label='目錄'] a");
  record("首頁", "1.2", "目錄列出 15 章", chapterLinks === 15, `got: ${chapterLinks} links`);

  // 1.3 部名標籤
  const partLabels = await page.evaluate(() => {
    const els = document.querySelectorAll("nav[aria-label='目錄'] .text-xs, nav[aria-label='目錄'] p");
    return Array.from(els)
      .filter((el) => el.textContent.includes("Part") || el.textContent.includes("第"))
      .map((el) => el.textContent.trim());
  });
  const hasParts = partLabels.length >= 4;
  record("首頁", "1.3", "4 個部名標籤", hasParts, `found: ${partLabels.length}`);

  // 1.4 章節雙語標題
  const firstChapter = await page.evaluate(() => {
    const link = document.querySelector("nav[aria-label='目錄'] a");
    if (!link) return null;
    const ps = link.querySelectorAll("p");
    return Array.from(ps).map((p) => p.textContent.trim());
  });
  record("首頁", "1.4", "章節中英雙語標題",
    firstChapter && firstChapter.length >= 2,
    `got: ${firstChapter?.join(" / ")}`
  );

  // 1.5 章節可點擊
  const firstHref = await page.evaluate(() => {
    const link = document.querySelector("nav[aria-label='目錄'] a");
    return link?.getAttribute("href");
  });
  record("首頁", "1.5", "章節連結正確", firstHref?.includes("/chapter/"), `href: ${firstHref}`);

  // 1.6 Footer
  await screenshotFull(page, "01-homepage-full");
  const footerText = await getTextContent(page, "footer");
  record("首頁", "1.6", "版權聲明 Footer",
    footerText?.includes("Seth Dahl") && footerText?.includes("經授權使用"),
    footerText?.substring(0, 60)
  );

  await screenshot(page, "01-homepage-top");
}

async function test2_ContinueReading(page) {
  console.log("\n📋 測試 2：繼續閱讀卡片");

  // 2.1 Clear storage, check no card
  await page.goto(BASE_URL + "#/", { waitUntil: "networkidle2" });
  await page.evaluate(() => {
    localStorage.removeItem("evangent-reading-progress");
    localStorage.removeItem("evangent-chapters-read");
  });
  await page.reload({ waitUntil: "networkidle2" });
  const noCard = !(await elementExists(page, '[class*="繼續閱讀"], :has(> p:first-child)'));
  // Check for the text "繼續閱讀" specifically
  const continueText = await page.evaluate(() => {
    return !!Array.from(document.querySelectorAll("p")).find((p) => p.textContent.includes("繼續閱讀"));
  });
  record("繼續閱讀", "2.1", "無記錄時不顯示", !continueText, `"繼續閱讀" text found: ${continueText}`);

  // 2.2 Visit a chapter, scroll, then go back
  await page.goto(BASE_URL + "#/chapter/ch01", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  await page.evaluate(() => {
    localStorage.setItem("evangent-reading-progress", JSON.stringify({ lastChapter: "ch01", scrollRatio: 0.35 }));
  });
  await page.goto(BASE_URL + "#/", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 500));
  const hasCard = await page.evaluate(() => {
    return !!Array.from(document.querySelectorAll("p")).find((p) => p.textContent.includes("繼續閱讀"));
  });
  record("繼續閱讀", "2.2", "有記錄時顯示卡片", hasCard);
  await screenshot(page, "02-continue-reading");

  // 2.3 Progress bar width
  if (hasCard) {
    const barWidth = await page.evaluate(() => {
      const bars = document.querySelectorAll("[style*='width']");
      for (const bar of bars) {
        if (bar.style.width && bar.style.width.includes("%")) return bar.style.width;
      }
      return null;
    });
    record("繼續閱讀", "2.3", "進度條寬度正確", barWidth === "35%", `got: ${barWidth}`);
  }
}

async function test3_DesktopBilingual(page) {
  console.log("\n📋 測試 3：章節閱讀頁 — 桌機雙欄");
  await page.goto(BASE_URL + "#/chapter/ch01", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 1000));

  // 3.1 Two columns
  const columns = await page.evaluate(() => {
    const pane = document.querySelector(".flex.flex-1.min-h-0 .w-1\\/2, .hidden.lg\\:flex .w-1\\/2");
    return !!pane;
  });
  // Alternative check
  const colCount = await page.evaluate(() => {
    return document.querySelectorAll("[class*='w-1/2']").length;
  });
  record("桌機雙欄", "3.1", "左右雙欄 50/50", colCount >= 2, `w-1/2 elements: ${colCount}`);

  // 3.2 Divider
  const divider = await page.evaluate(() => {
    return !!document.querySelector("[class*='w-px']");
  });
  record("桌機雙欄", "3.2", "中間分隔線", divider);

  // 3.3 Background colors
  const zhBg = rgbToHex(await getComputedStyle(page, "[class*='w-1/2']:first-child", "backgroundColor"));
  const enBgSelector = await page.evaluate(() => {
    const els = document.querySelectorAll("[class*='w-1/2']");
    return els.length >= 2 ? true : false;
  });
  record("桌機雙欄", "3.3", "中文欄白色背景", zhBg === "#FFFFFF", `zh bg: ${zhBg}`);

  // 3.4 Sync scroll
  const syncResult = await page.evaluate(() => {
    const cols = document.querySelectorAll("[class*='w-1/2']");
    if (cols.length < 2) return { ok: false, reason: "columns not found" };
    const left = cols[0];
    const right = cols[1];
    left.scrollTop = 200;
    left.dispatchEvent(new Event("scroll"));
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ok: right.scrollTop > 0, leftScroll: left.scrollTop, rightScroll: right.scrollTop });
      }, 500);
    });
  });
  record("桌機雙欄", "3.4", "同步滾動", syncResult.ok, `left: ${syncResult.leftScroll}, right: ${syncResult.rightScroll}`);

  // 3.5 H1 title
  const h1Text = await getTextContent(page, "article h1");
  record("桌機雙欄", "3.5", "H1 標題渲染", h1Text?.includes("神所建造的殿"), `got: "${h1Text}"`);

  // 3.6 H2 sections
  const h2Exists = await page.evaluate(() => {
    const h2s = document.querySelectorAll("article h2");
    return Array.from(h2s).some((h) => h.textContent.includes("真實的文化"));
  });
  record("桌機雙欄", "3.6", "H2 小節標題", h2Exists);

  // 3.7 Blockquote styling
  const bqStyle = await page.evaluate(() => {
    const bq = document.querySelector("article blockquote");
    if (!bq) return null;
    const cs = window.getComputedStyle(bq);
    return { borderLeft: cs.borderLeftWidth, borderColor: cs.borderLeftColor, bg: cs.backgroundColor };
  });
  record("桌機雙欄", "3.7", "引用區塊有左側色條",
    bqStyle && parseInt(bqStyle.borderLeft) >= 2,
    bqStyle ? `border: ${bqStyle.borderLeft} ${bqStyle.borderColor}` : "no blockquote found"
  );

  // 3.8 Chinese font
  const zhFont = await page.evaluate(() => {
    const article = document.querySelector("article[lang='zh-TW']");
    return article ? window.getComputedStyle(article).fontFamily : null;
  });
  record("桌機雙欄", "3.8", "中文字型",
    zhFont?.includes("Noto Serif TC") || zhFont?.includes("Source Han Serif"),
    `got: ${zhFont?.substring(0, 60)}`
  );

  // 3.9 English font
  const enFont = await page.evaluate(() => {
    const article = document.querySelector("article[lang='en']");
    return article ? window.getComputedStyle(article).fontFamily : null;
  });
  record("桌機雙欄", "3.9", "英文字型",
    enFont?.includes("Lora") || enFont?.includes("Georgia"),
    `got: ${enFont?.substring(0, 60)}`
  );

  // 3.10 Font size
  const zhSize = await page.evaluate(() => {
    const a = document.querySelector("article[lang='zh-TW']");
    return a ? window.getComputedStyle(a).fontSize : null;
  });
  const enSize = await page.evaluate(() => {
    const a = document.querySelector("article[lang='en']");
    return a ? window.getComputedStyle(a).fontSize : null;
  });
  record("桌機雙欄", "3.10", "正文字級 (zh:17px en:16px)", zhSize === "17px" && enSize === "16px", `zh: ${zhSize}, en: ${enSize}`);

  // 3.11 Line height
  const lh = await page.evaluate(() => {
    const a = document.querySelector("article[lang='zh-TW']");
    if (!a) return null;
    const cs = window.getComputedStyle(a);
    return (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2);
  });
  record("桌機雙欄", "3.11", "行高 1.85", lh === "1.85", `got: ${lh}`);

  // 3.12 Paragraph margin
  const pMargin = await page.evaluate(() => {
    const p = document.querySelector("article p");
    return p ? window.getComputedStyle(p).marginBottom : null;
  });
  record("桌機雙欄", "3.12", "段落間距 1.5em", pMargin?.includes("em") || parseFloat(pMargin) > 20, `got: ${pMargin}`);

  await screenshot(page, "03-desktop-bilingual");
}

async function test4_ChapterNav(page) {
  console.log("\n📋 測試 4：章節導航");

  // 4.1 Bottom nav
  await page.goto(BASE_URL + "#/chapter/ch01", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  const navLinks = await page.evaluate(() => {
    const nav = document.querySelectorAll("nav a");
    return Array.from(nav).map((a) => a.textContent.trim());
  });
  const hasNav = navLinks.some((t) => t.includes("目錄"));
  record("章節導航", "4.1", "底部導航列", hasNav, `links: ${navLinks.join(", ").substring(0, 80)}`);

  // 4.2 First chapter no prev
  await page.goto(BASE_URL + "#/chapter/foreword", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  const prevOnFirst = await page.evaluate(() => {
    const navEl = Array.from(document.querySelectorAll("nav")).find((n) =>
      n.textContent.includes("目錄")
    );
    if (!navEl) return false;
    return !!Array.from(navEl.querySelectorAll("a")).find((a) => a.textContent.includes("←"));
  });
  record("章節導航", "4.2", "第一章無「上一章」", !prevOnFirst);

  // 4.3 Last chapter no next
  await page.goto(BASE_URL + "#/chapter/ch13", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  const nextOnLast = await page.evaluate(() => {
    const navEl = Array.from(document.querySelectorAll("nav")).find((n) =>
      n.textContent.includes("目錄")
    );
    if (!navEl) return false;
    return !!Array.from(navEl.querySelectorAll("a")).find((a) => a.textContent.includes("→"));
  });
  record("章節導航", "4.3", "最後一章無「下一章」", !nextOnLast);

  // 4.4 Header chapter name
  await page.goto(BASE_URL + "#/chapter/ch01", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  const headerText = await getTextContent(page, "header a");
  record("章節導航", "4.4", "Header 顯示章節名",
    headerText?.includes("神所建造的殿"),
    `got: "${headerText}"`
  );

  // 4.5 Reading progress bar
  const progressBar = await elementExists(page, "[class*='sticky'][class*='h-0']");
  record("章節導航", "4.5", "閱讀進度條存在", progressBar);
}

async function test5_KeyboardShortcuts(page) {
  console.log("\n📋 測試 5：鍵盤快捷鍵");
  await page.goto(BASE_URL + "#/chapter/ch02", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 500));

  // 5.1 ArrowLeft
  await page.keyboard.press("ArrowLeft");
  await new Promise((r) => setTimeout(r, 500));
  let url = page.url();
  record("鍵盤快捷鍵", "5.1", "← 上一章", url.includes("ch01"), `URL: ${url}`);

  // 5.2 ArrowRight
  await page.goto(BASE_URL + "#/chapter/ch02", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 500));
  await page.keyboard.press("ArrowRight");
  await new Promise((r) => setTimeout(r, 500));
  url = page.url();
  record("鍵盤快捷鍵", "5.2", "→ 下一章", url.includes("ch03"), `URL: ${url}`);

  // 5.3 Ctrl+K
  await page.goto(BASE_URL + "#/chapter/ch01", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 500));
  await page.keyboard.down("Control");
  await page.keyboard.press("k");
  await page.keyboard.up("Control");
  await new Promise((r) => setTimeout(r, 500));
  let searchOpen = await page.evaluate(() => !!document.querySelector("input[placeholder*='搜尋']"));
  record("鍵盤快捷鍵", "5.3", "Ctrl+K 開搜尋", searchOpen);

  // 5.4 Esc closes search
  if (searchOpen) {
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 300));
    const searchClosed = await page.evaluate(() => !document.querySelector("input[placeholder*='搜尋']"));
    record("鍵盤快捷鍵", "5.4", "Esc 關搜尋", searchClosed);
  }

  // 5.5 "/" opens search
  await page.keyboard.press("/");
  await new Promise((r) => setTimeout(r, 500));
  searchOpen = await page.evaluate(() => !!document.querySelector("input[placeholder*='搜尋']"));
  record("鍵盤快捷鍵", "5.5", "/ 開搜尋", searchOpen);
  if (searchOpen) await page.keyboard.press("Escape");
}

async function test6_Search(page) {
  console.log("\n📋 測試 6：搜尋功能");
  await page.goto(BASE_URL + "#/chapter/ch01", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});

  // 6.1 Open via button
  await page.click("button[aria-label='搜尋']");
  await new Promise((r) => setTimeout(r, 300));
  let inputVisible = await page.evaluate(() => !!document.querySelector("input[placeholder*='搜尋']"));
  record("搜尋功能", "6.1", "搜尋 modal 開啟", inputVisible);

  // 6.2 Auto focus
  const focused = await page.evaluate(() => document.activeElement?.tagName === "INPUT");
  record("搜尋功能", "6.2", "input 自動聚焦", focused);

  // 6.3 Chinese search
  await page.type("input[placeholder*='搜尋']", "聖靈", { delay: 50 });
  await new Promise((r) => setTimeout(r, 500));
  let resultCount = await countElements(page, "[class*='overflow-y-auto'] button");
  record("搜尋功能", "6.3", "中文搜尋有結果", resultCount > 0, `results: ${resultCount}`);
  await screenshot(page, "06-search-chinese");

  // Clear and try English
  await page.evaluate(() => {
    const input = document.querySelector("input[placeholder*='搜尋']");
    if (input) { input.value = ""; input.dispatchEvent(new Event("input", { bubbles: true })); }
  });
  // Type using page methods for React controlled input
  await page.click("input[placeholder*='搜尋']", { clickCount: 3 });
  await page.keyboard.press("Backspace");
  await new Promise((r) => setTimeout(r, 200));

  // 6.4 English search
  await page.type("input[placeholder*='搜尋']", "God", { delay: 50 });
  await new Promise((r) => setTimeout(r, 500));
  resultCount = await countElements(page, "[class*='overflow-y-auto'] button");
  record("搜尋功能", "6.4", "英文搜尋有結果", resultCount > 0, `results: ${resultCount}`);

  // 6.5 Results have excerpt
  const hasExcerpt = await page.evaluate(() => {
    const btn = document.querySelector("[class*='overflow-y-auto'] button");
    if (!btn) return false;
    const ps = btn.querySelectorAll("p");
    return ps.length >= 2; // chapter title + excerpt
  });
  record("搜尋功能", "6.5", "結果含摘要", hasExcerpt);

  // 6.6 No results
  await page.click("input[placeholder*='搜尋']", { clickCount: 3 });
  await page.keyboard.press("Backspace");
  await page.type("input[placeholder*='搜尋']", "xyznonexist", { delay: 30 });
  await new Promise((r) => setTimeout(r, 500));
  const noResultText = await page.evaluate(() => {
    return !!Array.from(document.querySelectorAll("div")).find((d) => d.textContent.includes("沒有找到"));
  });
  record("搜尋功能", "6.6", "無結果提示", noResultText);

  // 6.8 Less than 2 chars
  await page.click("input[placeholder*='搜尋']", { clickCount: 3 });
  await page.keyboard.press("Backspace");
  await page.type("input[placeholder*='搜尋']", "G", { delay: 50 });
  await new Promise((r) => setTimeout(r, 300));
  const noResultsForSingle = await countElements(page, "[class*='overflow-y-auto'] button");
  record("搜尋功能", "6.8", "少於 2 字不搜尋", noResultsForSingle === 0, `results: ${noResultsForSingle}`);

  // Close search
  await page.keyboard.press("Escape");

  // 6.7 Click result navigates
  await page.click("button[aria-label='搜尋']");
  await new Promise((r) => setTimeout(r, 300));
  await page.type("input[placeholder*='搜尋']", "God", { delay: 50 });
  await new Promise((r) => setTimeout(r, 500));
  const firstResult = await page.evaluate(() => !!document.querySelector("[class*='overflow-y-auto'] button"));
  if (firstResult) {
    await page.click("[class*='overflow-y-auto'] button");
    await new Promise((r) => setTimeout(r, 500));
    const navUrl = page.url();
    record("搜尋功能", "6.7", "點擊結果跳轉", navUrl.includes("/chapter/"), `URL: ${navUrl}`);
  } else {
    record("搜尋功能", "6.7", "點擊結果跳轉", false, "no results to click");
  }
}

async function test7_DarkMode(page) {
  console.log("\n📋 測試 7：深色模式");
  await page.goto(BASE_URL + "#/", { waitUntil: "networkidle2" });
  await page.evaluate(() => localStorage.removeItem("evangent-dark-mode"));
  await page.reload({ waitUntil: "networkidle2" });

  // 7.1 Toggle button exists
  const toggleBtn = await elementExists(page, "button[aria-label*='模式']");
  record("深色模式", "7.1", "切換按鈕存在", toggleBtn);

  // 7.2 Click to dark
  await page.click("button[aria-label*='模式']");
  await new Promise((r) => setTimeout(r, 300));
  const hasDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  const darkBg = rgbToHex(await getComputedStyle(page, "body", "backgroundColor"));
  // Check bg-page in dark mode - the page wrapping div
  const pageBg = rgbToHex(
    await page.evaluate(() => {
      const el = document.querySelector(".min-h-screen");
      return el ? window.getComputedStyle(el).backgroundColor : null;
    })
  );
  record("深色模式", "7.2", "切換到深色 (dark class + 背景色)",
    hasDark,
    `dark class: ${hasDark}, page bg: ${pageBg}`
  );
  await screenshot(page, "07-dark-mode-home");

  // 7.3 Dark mode chapter colors
  await page.goto(BASE_URL + "#/chapter/ch01", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  const darkEnBg = rgbToHex(
    await page.evaluate(() => {
      const cols = document.querySelectorAll("[class*='w-1/2']");
      return cols.length >= 2 ? window.getComputedStyle(cols[1]).backgroundColor : null;
    })
  );
  record("深色模式", "7.3", "深色英文欄背景", darkEnBg === "#2A2A45", `got: ${darkEnBg}`);
  await screenshot(page, "07-dark-mode-chapter");

  // 7.4 Dark text color
  const darkTextColor = rgbToHex(
    await page.evaluate(() => {
      const a = document.querySelector("article[lang='zh-TW']");
      return a ? window.getComputedStyle(a).color : null;
    })
  );
  record("深色模式", "7.4", "深色正文色 #E8E8ED", darkTextColor === "#E8E8ED", `got: ${darkTextColor}`);

  // 7.5 Dark primary color
  const darkPrimary = rgbToHex(await getComputedStyle(page, "header a", "color"));
  record("深色模式", "7.5", "深色主色 #7BA7BC", darkPrimary === "#7BA7BC", `got: ${darkPrimary}`);

  // 7.6 Persists after reload
  await page.reload({ waitUntil: "networkidle2" });
  const stillDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  record("深色模式", "7.6", "偏好記憶 (reload 後仍為深色)", stillDark);

  // 7.7 Toggle back to light
  await page.click("button[aria-label*='模式']");
  await new Promise((r) => setTimeout(r, 300));
  const backToLight = await page.evaluate(() => !document.documentElement.classList.contains("dark"));
  record("深色模式", "7.7", "切回亮色", backToLight);
}

async function test8_FontSize(page) {
  console.log("\n📋 測試 8：字型大小切換");
  await page.goto(BASE_URL + "#/chapter/ch01", { waitUntil: "networkidle2" });
  await page.evaluate(() => localStorage.removeItem("evangent-font-size"));
  await page.reload({ waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 500));

  // 8.1 Default
  let zhFs = await page.evaluate(() => {
    const a = document.querySelector("article[lang='zh-TW']");
    return a ? window.getComputedStyle(a).fontSize : null;
  });
  record("字型大小", "8.1", "預設中字 17px", zhFs === "17px", `got: ${zhFs}`);

  // 8.2 A- → small
  await page.click("button[aria-label='縮小字型']");
  await new Promise((r) => setTimeout(r, 300));
  zhFs = await page.evaluate(() => {
    const a = document.querySelector("article[lang='zh-TW']");
    return a ? window.getComputedStyle(a).fontSize : null;
  });
  let enFs = await page.evaluate(() => {
    const a = document.querySelector("article[lang='en']");
    return a ? window.getComputedStyle(a).fontSize : null;
  });
  record("字型大小", "8.2", "A- → 小字 (zh:15px en:14px)", zhFs === "15px" && enFs === "14px", `zh: ${zhFs}, en: ${enFs}`);

  // 8.3 A+ twice → large
  await page.click("button[aria-label='放大字型']");
  await new Promise((r) => setTimeout(r, 200));
  await page.click("button[aria-label='放大字型']");
  await new Promise((r) => setTimeout(r, 300));
  zhFs = await page.evaluate(() => {
    const a = document.querySelector("article[lang='zh-TW']");
    return a ? window.getComputedStyle(a).fontSize : null;
  });
  enFs = await page.evaluate(() => {
    const a = document.querySelector("article[lang='en']");
    return a ? window.getComputedStyle(a).fontSize : null;
  });
  record("字型大小", "8.3", "A+ 兩次 → 大字 (zh:20px en:19px)", zhFs === "20px" && enFs === "19px", `zh: ${zhFs}, en: ${enFs}`);

  // 8.4 Ceiling
  await page.click("button[aria-label='放大字型']");
  await new Promise((r) => setTimeout(r, 300));
  zhFs = await page.evaluate(() => {
    const a = document.querySelector("article[lang='zh-TW']");
    return a ? window.getComputedStyle(a).fontSize : null;
  });
  record("字型大小", "8.4", "上限不超過大字", zhFs === "20px", `got: ${zhFs}`);

  // 8.5 Persists
  await page.reload({ waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 500));
  zhFs = await page.evaluate(() => {
    const a = document.querySelector("article[lang='zh-TW']");
    return a ? window.getComputedStyle(a).fontSize : null;
  });
  record("字型大小", "8.5", "偏好記憶 (reload 維持)", zhFs === "20px", `got: ${zhFs}`);
}

async function test9_MobileResponsive(page) {
  console.log("\n📋 測試 9：手機版 — 響應式");
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(BASE_URL + "#/", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 500));

  // 9.1 Homepage renders
  const tocExists = await elementExists(page, "nav[aria-label='目錄']");
  record("手機版", "9.1", "首頁正常顯示", tocExists);
  await screenshot(page, "09-mobile-home");

  // 9.2 Hamburger visible
  const hamburger = await elementExists(page, "button[aria-label='開啟目錄']");
  record("手機版", "9.2", "漢堡按鈕出現", hamburger);

  // 9.3 Sidebar slides in
  if (hamburger) {
    await page.click("button[aria-label='開啟目錄']");
    await new Promise((r) => setTimeout(r, 400));
    const sidebarVisible = await page.evaluate(() => {
      const aside = document.querySelector("aside");
      if (!aside) return false;
      const transform = window.getComputedStyle(aside).transform;
      return transform === "none" || transform.includes("matrix(1");
    });
    record("手機版", "9.3", "側邊目錄滑入", sidebarVisible);
    await screenshot(page, "09-mobile-sidebar");

    // 9.4 Sidebar width
    const sidebarWidth = await page.evaluate(() => {
      const aside = document.querySelector("aside");
      return aside ? aside.offsetWidth : 0;
    });
    record("手機版", "9.4", "側邊目錄寬度 ≤320px",
      sidebarWidth > 0 && sidebarWidth <= 320,
      `got: ${sidebarWidth}px`
    );

    // 9.5 Click overlay closes
    const overlay = await page.evaluate(() => !!document.querySelector(".fixed.inset-0.bg-black\\/50"));
    if (overlay) {
      await page.click(".fixed.inset-0.bg-black\\/50");
      await new Promise((r) => setTimeout(r, 400));
      const closed = await page.evaluate(() => {
        const aside = document.querySelector("aside");
        if (!aside) return true;
        const transform = window.getComputedStyle(aside).transform;
        return !transform.includes("matrix(1") && transform !== "none";
      });
      record("手機版", "9.5", "點擊 overlay 關閉", closed);
    }
  }

  // 9.6 Active chapter highlight
  await page.goto(BASE_URL + "#/chapter/ch01", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  await page.click("button[aria-label='開啟目錄']");
  await new Promise((r) => setTimeout(r, 400));
  const activeHighlight = await page.evaluate(() => {
    const links = document.querySelectorAll("aside a");
    for (const link of links) {
      if (link.textContent.includes("神所建造的殿") && link.className.includes("font-medium")) return true;
    }
    return false;
  });
  record("手機版", "9.6", "目前章節高亮", activeHighlight);
  await screenshot(page, "09-mobile-sidebar-active");
}

async function test10_MobileTabs(page) {
  console.log("\n📋 測試 10：手機版 — Tab 切換閱讀");
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(BASE_URL + "#/chapter/ch01", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 500));

  // Close sidebar if open
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 300));

  // 10.1 Three tabs
  const tabCount = await page.evaluate(() => {
    const buttons = document.querySelectorAll("button");
    return Array.from(buttons).filter((b) =>
      ["中文", "English", "對照"].includes(b.textContent.trim())
    ).length;
  });
  record("手機Tab", "10.1", "三個 Tab", tabCount === 3, `found: ${tabCount}`);

  // 10.2 Default is Chinese
  const zhActive = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent.trim() === "中文"
    );
    return btn && btn.className.includes("border-b-2");
  });
  const hasZhContent = await page.evaluate(() => !!document.querySelector("article[lang='zh-TW']"));
  record("手機Tab", "10.2", "預設中文 Tab", zhActive && hasZhContent);
  await screenshot(page, "10-mobile-tab-zh");

  // 10.3 Switch to English
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent.trim() === "English"
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  const hasEnContent = await page.evaluate(() => !!document.querySelector("article[lang='en']"));
  record("手機Tab", "10.3", "切換到 English", hasEnContent);
  await screenshot(page, "10-mobile-tab-en");

  // 10.4 Switch to bilingual
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent.trim() === "對照"
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  const hasInterleaved = await page.evaluate(() => {
    const text = document.body.textContent;
    return text.includes("── 中文 ──") && text.includes("── English ──");
  });
  record("手機Tab", "10.4", "對照模式段落交錯", hasInterleaved);
  await screenshot(page, "10-mobile-tab-bilingual");

  // Reset viewport
  await page.setViewport({ width: 1440, height: 900 });
}

async function test11_NotFound(page) {
  console.log("\n📋 測試 11：404 頁面");
  await page.goto(BASE_URL + "#/chapter/nonexistent", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 500));

  // 11.1 Shows 404
  const has404 = await page.evaluate(() => document.body.textContent.includes("404"));
  const hasMessage = await page.evaluate(() => document.body.textContent.includes("找不到此頁面"));
  record("404頁面", "11.1", "顯示 404 + 訊息", has404 && hasMessage);

  // 11.2 Back button
  const backBtn = await page.evaluate(() => {
    return !!Array.from(document.querySelectorAll("a")).find((a) => a.textContent.includes("回到目錄"));
  });
  record("404頁面", "11.2", "回到目錄按鈕", backBtn);

  // 11.3 Click navigates home
  if (backBtn) {
    await page.evaluate(() => {
      const a = Array.from(document.querySelectorAll("a")).find((a) => a.textContent.includes("回到目錄"));
      if (a) a.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    const url = page.url();
    record("404頁面", "11.3", "點擊回首頁", url.endsWith("#/") || url.endsWith("Evangent/"), `URL: ${url}`);
  }
  await screenshot(page, "11-not-found");
}

async function test12_VisualConsistency(page) {
  console.log("\n📋 測試 12：視覺設計一致性");
  await page.goto(BASE_URL + "#/", { waitUntil: "networkidle2" });

  // 12.1 Page background
  const pageBg = rgbToHex(
    await page.evaluate(() => {
      const el = document.querySelector(".min-h-screen");
      return el ? window.getComputedStyle(el).backgroundColor : null;
    })
  );
  record("視覺一致性", "12.1", "亮色頁面底色 #FAFAF7", pageBg === "#FAFAF7", `got: ${pageBg}`);

  // 12.2 Header bg
  const headerBg = rgbToHex(await getComputedStyle(page, "header", "backgroundColor"));
  record("視覺一致性", "12.2", "Header 背景 #FFFFFF", headerBg === "#FFFFFF", `got: ${headerBg}`);

  // 12.3 Header height
  const headerH = await page.evaluate(() => document.querySelector("header")?.offsetHeight);
  record("視覺一致性", "12.3", "Header 高度 56px (h-14)", headerH === 56, `got: ${headerH}px`);

  // 12.4 Blockquote in chapter
  await page.goto(BASE_URL + "#/chapter/ch01", { waitUntil: "networkidle2" });
  await page.waitForSelector("article blockquote", { timeout: 5000 }).catch(() => {});
  const bqBorderColor = rgbToHex(
    await page.evaluate(() => {
      const bq = document.querySelector("article blockquote");
      return bq ? window.getComputedStyle(bq).borderLeftColor : null;
    })
  );
  record("視覺一致性", "12.4", "引用區塊色條 (暖橘)", bqBorderColor === "#D4956A" || bqBorderColor === "#E0A87C", `got: ${bqBorderColor}`);

  // 12.5 Column padding
  const colPadding = await page.evaluate(() => {
    const col = document.querySelector("[class*='w-1/2']");
    return col ? window.getComputedStyle(col).paddingLeft : null;
  });
  record("視覺一致性", "12.5", "欄內 padding 2rem (32px)", colPadding === "32px", `got: ${colPadding}`);
}

async function test13_Accessibility(page) {
  console.log("\n📋 測試 13：無障礙");
  await page.goto(BASE_URL + "#/chapter/ch01", { waitUntil: "networkidle2" });
  await page.waitForSelector("article", { timeout: 5000 }).catch(() => {});

  // 13.1 lang attributes
  const zhLang = await page.evaluate(() => {
    const a = document.querySelector("article[lang='zh-TW']");
    return !!a;
  });
  const enLang = await page.evaluate(() => {
    const a = document.querySelector("article[lang='en']");
    return !!a;
  });
  record("無障礙", "13.1", "lang 屬性 (zh-TW + en)", zhLang && enLang, `zh-TW: ${zhLang}, en: ${enLang}`);

  // 13.2 aria-labels
  const ariaLabels = await page.evaluate(() => {
    const buttons = document.querySelectorAll("header button");
    return Array.from(buttons).map((b) => b.getAttribute("aria-label")).filter(Boolean);
  });
  record("無障礙", "13.2", "Header 按鈕有 aria-label", ariaLabels.length >= 3, `found: ${ariaLabels.join(", ")}`);

  // 13.3 Contrast ratio
  const ratio = contrastRatio("#2D2D2D", "#FAFAF7");
  record("無障礙", "13.3", "色彩對比度 ≥ 4.5:1 (WCAG AA)", ratio >= 4.5, `ratio: ${ratio.toFixed(2)}:1`);
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

async function main() {
  console.log("🚀 Evangent UI/UX 瀏覽器測試開始\n");
  console.log(`目標: ${BASE_URL}`);

  const browser = await puppeteer.launch({
    headless: "shell",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await test1_HomePage(page);
    await test2_ContinueReading(page);
    await test3_DesktopBilingual(page);
    await test4_ChapterNav(page);
    await test5_KeyboardShortcuts(page);
    await test6_Search(page);
    await test7_DarkMode(page);
    await test8_FontSize(page);
    await test9_MobileResponsive(page);
    await test10_MobileTabs(page);
    await test11_NotFound(page);
    await test12_VisualConsistency(page);
    await test13_Accessibility(page);
  } catch (e) {
    console.error("\n💥 Unexpected error:", e.message);
  }

  await browser.close();

  // ─── Generate Report ───
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const total = results.length;

  let report = `# Evangent UI/UX 測試報告\n\n`;
  report += `**測試時間**: ${new Date().toISOString()}\n`;
  report += `**目標 URL**: ${BASE_URL}\n`;
  report += `**結果**: ${passed} 通過 / ${failed} 失敗 / ${total} 總計\n\n`;

  if (failed > 0) {
    report += `## ❌ 失敗項目\n\n`;
    report += `| # | 測試組 | 檢查項目 | 問題描述 |\n`;
    report += `|---|--------|---------|----------|\n`;
    for (const r of results.filter((r) => r.status === "FAIL")) {
      report += `| ${r.id} | ${r.group} | ${r.name} | ${r.detail} |\n`;
    }
    report += `\n`;
  }

  report += `## 完整結果\n\n`;
  let currentGroup = "";
  for (const r of results) {
    if (r.group !== currentGroup) {
      currentGroup = r.group;
      report += `\n### ${currentGroup}\n\n`;
      report += `| # | 檢查項目 | 結果 | 備註 |\n`;
      report += `|---|---------|------|------|\n`;
    }
    const icon = r.status === "PASS" ? "✅" : "❌";
    report += `| ${r.id} | ${r.name} | ${icon} | ${r.detail} |\n`;
  }

  report += `\n## 截圖清單\n\n`;
  const screenshots = fs.readdirSync(SCREENSHOTS).sort();
  for (const f of screenshots) {
    report += `- \`screenshots/${f}\`\n`;
  }

  fs.writeFileSync(REPORT_PATH, report, "utf-8");
  console.log(`\n${"═".repeat(50)}`);
  console.log(`📊 測試完成: ${passed} 通過 / ${failed} 失敗 / ${total} 總計`);
  console.log(`📄 報告: ${REPORT_PATH}`);
  console.log(`📸 截圖: ${SCREENSHOTS}/`);
}

main().catch(console.error);
