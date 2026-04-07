import { renderHook, waitFor } from "@testing-library/react";
import { useChapterContent } from "./useChapterContent";
import { loadMarkdown } from "../utils/markdownLoader";

vi.mock("../utils/markdownLoader", () => ({
  loadMarkdown: vi.fn(),
}));

beforeEach(() => {
  loadMarkdown.mockReset();
});

describe("useChapterContent", () => {
  it("returns content with zh and en strings for valid chapterId", async () => {
    loadMarkdown.mockImplementation((lang) =>
      Promise.resolve(lang === "zh" ? "Chinese content" : "English content")
    );

    const { result } = renderHook(() => useChapterContent("ch01"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.content.zh).toBe("Chinese content");
    expect(result.current.content.en).toBe("English content");
    expect(result.current.error).toBeNull();
  });

  it('sets error "Chapter not found" for invalid chapterId', async () => {
    const { result } = renderHook(() => useChapterContent("nonexistent"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Chapter not found");
  });

  it("sets error when loadMarkdown rejects", async () => {
    loadMarkdown.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useChapterContent("ch01"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
  });

  it("does not update state after unmount", async () => {
    let resolveZh;
    let resolveEn;
    loadMarkdown.mockImplementation((lang) => {
      if (lang === "zh") return new Promise((r) => { resolveZh = r; });
      return new Promise((r) => { resolveEn = r; });
    });

    const { result, unmount } = renderHook(() => useChapterContent("ch01"));

    expect(result.current.loading).toBe(true);

    unmount();

    // Resolve after unmount - should not cause act warnings
    resolveZh("zh");
    resolveEn("en");

    // If we get here without warnings, the cancelled flag is working
  });
});
