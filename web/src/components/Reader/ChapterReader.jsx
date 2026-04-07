import { useParams } from "react-router";
import { useChapterContent } from "../../hooks/useChapterContent";
import { useReadingProgress } from "../../hooks/useReadingProgress";
import BilingualPane from "./BilingualPane";
import MobileReader from "./MobileReader";
import ChapterNav from "./ChapterNav";
import ReadingProgressBar from "./ReadingProgressBar";

export default function ChapterReader({ fontSize }) {
  const { chapterId } = useParams();
  const { content, loading, error } = useChapterContent(chapterId);
  const { scrollRatio } = useReadingProgress(chapterId);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-3xl px-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-[--color-bg-en] dark:bg-[--color-dark-bg-en] rounded animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <p className="text-lg text-[--color-text-secondary] dark:text-[--color-dark-text-secondary]">無法載入章節內容</p>
          <p className="text-sm text-[--color-text-muted] dark:text-[--color-dark-text-muted] mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ReadingProgressBar ratio={scrollRatio} />
      {/* Desktop: bilingual pane */}
      <div className="hidden lg:flex flex-1 min-h-0">
        <BilingualPane zhContent={content.zh} enContent={content.en} fontSize={fontSize} />
      </div>

      {/* Mobile: tab reader */}
      <div className="lg:hidden flex flex-col flex-1 min-h-0">
        <MobileReader zhContent={content.zh} enContent={content.en} fontSize={fontSize} />
      </div>

      <ChapterNav chapterId={chapterId} />
    </div>
  );
}
