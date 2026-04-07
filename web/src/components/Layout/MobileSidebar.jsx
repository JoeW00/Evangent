import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router";
import { chapters } from "../../data/chapters";

export default function MobileSidebar({ isOpen, onClose }) {
  const { chapterId } = useParams();
  const sidebarRef = useRef(null);
  const triggerRef = useRef(null);
  let currentPart = null;

  // Focus management
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      requestAnimationFrame(() => sidebarRef.current?.focus());
    } else if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

  // Focus trap + Escape
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && sidebarRef.current) {
        const focusable = sidebarRef.current.querySelectorAll(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        role="dialog"
        aria-modal={isOpen ? "true" : undefined}
        aria-label="目錄導航"
        tabIndex={-1}
        className={`fixed top-0 left-0 h-full w-[75vw] max-w-[320px] z-50 bg-[var(--color-bg-content)] dark:bg-[var(--color-dark-bg-content)] shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-[var(--color-border)] dark:border-[var(--color-dark-text-muted)]">
          <h2 className="font-semibold font-[var(--font-sans-ui)] text-[var(--color-primary)] dark:text-[var(--color-dark-primary)]">
            目錄
          </h2>
        </div>
        <nav className="p-2" aria-label="章節列表">
          {chapters.map((ch) => {
            const showPart = ch.part && ch.part.zh !== currentPart;
            if (ch.part) currentPart = ch.part.zh;
            const isActive = ch.id === chapterId;

            return (
              <div key={ch.id}>
                {showPart && (
                  <p className="px-3 pt-4 pb-1 text-xs font-semibold text-[var(--color-accent)] dark:text-[var(--color-dark-accent)] font-[var(--font-sans-ui)]">
                    {ch.part.zh}
                  </p>
                )}
                <Link
                  to={`/chapter/${ch.id}`}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`block px-3 py-2 rounded-md text-sm font-[var(--font-sans-ui)] transition-colors ${
                    isActive
                      ? "bg-[var(--color-bg-en)] dark:bg-[var(--color-dark-bg-en)] text-[var(--color-primary)] dark:text-[var(--color-dark-primary)] font-medium"
                      : "text-[var(--color-text-primary)] dark:text-[var(--color-dark-text-primary)] hover:bg-[var(--color-bg-en)] dark:hover:bg-[var(--color-dark-bg-en)]"
                  }`}
                >
                  {ch.zh.title}
                </Link>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
