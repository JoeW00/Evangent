const zhModules = import.meta.glob("../../../docs/zh/*.md", { query: "?raw", import: "default" });
const enModules = import.meta.glob("../../../docs/en/*.md", { query: "?raw", import: "default" });

export async function loadMarkdown(lang, filename) {
  const modules = lang === "zh" ? zhModules : enModules;
  const key = `../../../docs/${lang}/${filename}`;
  const loader = modules[key];
  if (!loader) throw new Error(`Markdown not found: ${key}`);
  return loader();
}
