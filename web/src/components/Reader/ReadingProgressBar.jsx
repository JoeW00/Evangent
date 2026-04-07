export default function ReadingProgressBar({ ratio }) {
  return (
    <div className="sticky top-14 z-30 h-0.5 bg-[--color-bg-en] dark:bg-[--color-dark-bg-en]">
      <div
        className="h-full bg-[--color-primary] dark:bg-[--color-dark-primary] transition-[width] duration-150"
        style={{ width: `${Math.min(100, ratio * 100)}%` }}
      />
    </div>
  );
}
