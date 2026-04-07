import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center text-center p-8">
      <div>
        <p className="text-6xl font-bold text-[--color-text-muted] dark:text-[--color-dark-text-muted]">404</p>
        <p className="mt-4 text-lg font-[--font-sans-ui] text-[--color-text-secondary] dark:text-[--color-dark-text-secondary]">
          找不到此頁面
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-2 rounded-lg bg-[--color-primary] dark:bg-[--color-dark-primary] text-[--color-bg-content] dark:text-[--color-dark-text-primary] font-[--font-sans-ui] text-sm hover:opacity-90 transition-opacity"
        >
          回到目錄
        </Link>
      </div>
    </div>
  );
}
