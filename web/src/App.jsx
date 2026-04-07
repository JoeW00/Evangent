import { HashRouter, Routes, Route } from "react-router";
import { useState } from "react";
import { useDarkMode } from "./hooks/useDarkMode";
import { useFontSize } from "./hooks/useFontSize";
import { useKeyboardNav } from "./hooks/useKeyboardNav";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import MobileSidebar from "./components/Layout/MobileSidebar";
import SearchBar from "./components/Search/SearchBar";
import HeroBanner from "./components/Home/HeroBanner";
import TableOfContents from "./components/Home/TableOfContents";
import ContinueReading from "./components/Home/ContinueReading";
import ChapterReader from "./components/Reader/ChapterReader";
import NotFound from "./components/Layout/NotFound";

function HomePage() {
  return (
    <>
      <HeroBanner />
      <ContinueReading />
      <TableOfContents />
    </>
  );
}

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { fontSize, changeFontSize } = useFontSize();

  useKeyboardNav({ onOpenSearch: () => setSearchOpen(true) });

  return (
    <div className="min-h-screen flex flex-col bg-[--color-bg-page] dark:bg-[--color-dark-bg-page] text-[--color-text-primary] dark:text-[--color-dark-text-primary]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:min-h-[44px] focus:flex focus:items-center focus:rounded-lg focus:bg-[--color-primary] focus:text-white focus:font-[--font-sans-ui] focus:text-sm"
      >
        跳到主要內容
      </a>
      <Header
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onToggleDarkMode={toggleDark}
        isDark={isDark}
        fontSize={fontSize}
        onFontSizeChange={changeFontSize}
        onOpenSearch={() => setSearchOpen(true)}
      />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <main id="main-content" className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chapter/:chapterId" element={<ChapterReader fontSize={fontSize} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}
