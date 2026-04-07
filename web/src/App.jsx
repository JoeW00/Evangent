import { HashRouter, Routes, Route } from "react-router";
import { useState } from "react";
import Header from "./components/Layout/Header";
import { useDarkMode } from "./hooks/useDarkMode";
import { useFontSize } from "./hooks/useFontSize";
import Footer from "./components/Layout/Footer";
import MobileSidebar from "./components/Layout/MobileSidebar";
import HeroBanner from "./components/Home/HeroBanner";
import TableOfContents from "./components/Home/TableOfContents";
import ChapterReader from "./components/Reader/ChapterReader";

function HomePage() {
  return (
    <>
      <HeroBanner />
      <TableOfContents />
    </>
  );
}


export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { fontSize, changeFontSize } = useFontSize();

  return (
    <HashRouter>
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
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chapter/:chapterId" element={<ChapterReader fontSize={fontSize} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
