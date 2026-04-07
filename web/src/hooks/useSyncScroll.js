import { useRef, useEffect, useCallback } from "react";

export function useSyncScroll() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const isSyncing = useRef(false);
  const rafId = useRef(null);

  const handleScroll = useCallback((source, target) => {
    if (isSyncing.current) return;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      isSyncing.current = true;

      const sourceEl = source.current;
      const targetEl = target.current;
      if (!sourceEl || !targetEl) {
        isSyncing.current = false;
        return;
      }

      const maxScroll = sourceEl.scrollHeight - sourceEl.clientHeight;
      const ratio = maxScroll > 0 ? sourceEl.scrollTop / maxScroll : 0;
      const targetMax = targetEl.scrollHeight - targetEl.clientHeight;
      targetEl.scrollTop = ratio * targetMax;

      requestAnimationFrame(() => {
        isSyncing.current = false;
      });
    });
  }, []);

  useEffect(() => {
    const leftEl = leftRef.current;
    const rightEl = rightRef.current;
    if (!leftEl || !rightEl) return;

    const onLeftScroll = () => handleScroll(leftRef, rightRef);
    const onRightScroll = () => handleScroll(rightRef, leftRef);

    leftEl.addEventListener("scroll", onLeftScroll, { passive: true });
    rightEl.addEventListener("scroll", onRightScroll, { passive: true });

    return () => {
      leftEl.removeEventListener("scroll", onLeftScroll);
      rightEl.removeEventListener("scroll", onRightScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handleScroll]);

  return { leftRef, rightRef };
}
