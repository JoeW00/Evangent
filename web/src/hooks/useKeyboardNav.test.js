import { renderHook } from "@testing-library/react";
import { useKeyboardNav } from "./useKeyboardNav";

const mockNavigate = vi.fn();
let mockChapterId = "ch02";

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ chapterId: mockChapterId }),
}));

beforeEach(() => {
  mockNavigate.mockClear();
  mockChapterId = "ch02";
});

function fireKey(key, options = {}) {
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    ...options,
  });
  document.dispatchEvent(event);
}

describe("useKeyboardNav", () => {
  it("ArrowLeft on ch02 navigates to ch01", () => {
    const onOpenSearch = vi.fn();
    renderHook(() => useKeyboardNav({ onOpenSearch }));

    fireKey("ArrowLeft");
    expect(mockNavigate).toHaveBeenCalledWith("/chapter/ch01");
  });

  it("ArrowRight on ch02 navigates to ch03", () => {
    const onOpenSearch = vi.fn();
    renderHook(() => useKeyboardNav({ onOpenSearch }));

    fireKey("ArrowRight");
    expect(mockNavigate).toHaveBeenCalledWith("/chapter/ch03");
  });

  it("ArrowLeft on foreword does not navigate", () => {
    mockChapterId = "foreword";
    const onOpenSearch = vi.fn();
    renderHook(() => useKeyboardNav({ onOpenSearch }));

    fireKey("ArrowLeft");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("ArrowRight on ch13 does not navigate", () => {
    mockChapterId = "ch13";
    const onOpenSearch = vi.fn();
    renderHook(() => useKeyboardNav({ onOpenSearch }));

    fireKey("ArrowRight");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("Ctrl+K calls onOpenSearch", () => {
    const onOpenSearch = vi.fn();
    renderHook(() => useKeyboardNav({ onOpenSearch }));

    fireKey("k", { ctrlKey: true });
    expect(onOpenSearch).toHaveBeenCalled();
  });

  it('"/" calls onOpenSearch', () => {
    const onOpenSearch = vi.fn();
    renderHook(() => useKeyboardNav({ onOpenSearch }));

    fireKey("/");
    expect(onOpenSearch).toHaveBeenCalled();
  });

  it("ignores key events when target is INPUT", () => {
    const onOpenSearch = vi.fn();
    renderHook(() => useKeyboardNav({ onOpenSearch }));

    const input = document.createElement("input");
    document.body.appendChild(input);
    const event = new KeyboardEvent("keydown", {
      key: "/",
      bubbles: true,
    });
    input.dispatchEvent(event);

    expect(onOpenSearch).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });
});
