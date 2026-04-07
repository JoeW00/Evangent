export default function ReadingProgressBar({ ratio }) {
  const percent = Math.min(100, Math.round(ratio * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="閱讀進度"
      className="sticky top-14 z-30 h-0.5 bg-[--color-bg-en] dark:bg-[--color-dark-bg-en]"
    >
      <div
        className="h-full bg-[--color-primary] dark:bg-[--color-dark-primary] transition-[width] duration-150 will-change-[width]"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
