import { HashRouter, Routes, Route } from "react-router";
import { useState } from "react";
import Header from "./components/Layout/Header";
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
  const [isDark, setIsDark] = useState(false);
  const [fontSize, setFontSize] = useState(1);
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
