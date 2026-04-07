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
