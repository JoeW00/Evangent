import { Link, useParams } from "react-router";
import { chapters } from "../../data/chapters";

export default function MobileSidebar({ isOpen, onClose }) {
  const { chapterId } = useParams();
  let currentPart = null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[80vw] max-w-[320px] z-50 bg-[--color-bg-content] dark:bg-[--color-dark-bg-content] shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-[--color-border] dark:border-[--color-dark-text-muted]">
          <h2 className="font-semibold font-[--font-sans-ui] text-[--color-primary] dark:text-[--color-dark-primary]">
            目錄
          </h2>
        </div>
        <nav className="p-2">
          {chapters.map((ch) => {
            const showPart = ch.part && ch.part.zh !== currentPart;
            if (ch.part) currentPart = ch.part.zh;
            const isActive = ch.id === chapterId;

            return (
              <div key={ch.id}>
                {showPart && (
                  <p className="px-3 pt-4 pb-1 text-xs font-semibold text-[--color-accent] dark:text-[--color-dark-accent] font-[--font-sans-ui]">
                    {ch.part.zh}
                  </p>
                )}
                <Link
                  to={`/chapter/${ch.id}`}
                  onClick={onClose}
                  className={`block px-3 py-2 rounded-md text-sm font-[--font-sans-ui] transition-colors ${
                    isActive
                      ? "bg-[--color-bg-en] dark:bg-[--color-dark-bg-en] text-[--color-primary] dark:text-[--color-dark-primary] font-medium"
                      : "text-[--color-text-primary] dark:text-[--color-dark-text-primary] hover:bg-[--color-bg-en] dark:hover:bg-[--color-dark-bg-en]"
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
