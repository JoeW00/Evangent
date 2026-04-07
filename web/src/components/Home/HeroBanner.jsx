export default function HeroBanner() {
  return (
    <section className="py-16 px-4 text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-serif-zh)] text-[var(--color-primary)] dark:text-[var(--color-dark-primary)]">
        福音大翻譯計劃
      </h1>
      <p className="mt-3 text-lg font-[var(--font-serif-zh)] text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)]">
        《孩子的屬靈覺醒》中英對照
      </p>
      <p className="mt-1 text-base font-[var(--font-serif-en)] italic text-[var(--color-text-muted)] dark:text-[var(--color-dark-text-muted)]">
        Raising Spirit-Led Kids
      </p>
    </section>
  );
}
