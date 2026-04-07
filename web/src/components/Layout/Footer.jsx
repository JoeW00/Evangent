export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] dark:border-[var(--color-dark-text-muted)] py-6 px-4 text-center text-sm text-[var(--color-text-secondary)] dark:text-[var(--color-dark-text-secondary)] font-[var(--font-sans-ui)] bg-[var(--color-bg-page)] dark:bg-[var(--color-dark-bg-page)]">
      <p>
        <em>Raising Spirit-Led Kids</em> &copy; Seth Dahl.
        中文譯本《孩子的屬靈覺醒》經授權使用。
      </p>
      <p className="mt-1">本站內容僅供閱讀，未經許可不得轉載或商業使用。</p>
    </footer>
  );
}
