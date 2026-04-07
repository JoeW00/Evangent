import { renderHook, act } from "@testing-library/react";
import { useDarkMode } from "./useDarkMode";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
  // Reset matchMedia to default (matches: false)
  window.matchMedia.mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

describe("useDarkMode", () => {
  it("defaults to false when no localStorage and matchMedia matches=false", () => {
    window.matchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(false);
  });

  it("defaults to true when no localStorage and matchMedia matches=true", () => {
    window.matchMedia.mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(true);
  });

  it('reads localStorage "true" as isDark=true', () => {
    localStorage.setItem("evangent-dark-mode", "true");
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(true);
  });

  it('reads localStorage "false" as isDark=false', () => {
    localStorage.setItem("evangent-dark-mode", "false");
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(false);
  });

  it("toggle flips state", () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDark).toBe(false);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isDark).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isDark).toBe(false);
  });

  it("updates localStorage after toggle", () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggle();
    });
    expect(localStorage.getItem("evangent-dark-mode")).toBe("true");

    act(() => {
      result.current.toggle();
    });
    expect(localStorage.getItem("evangent-dark-mode")).toBe("false");
  });

  it("toggles 'dark' class on document.documentElement", () => {
    const { result } = renderHook(() => useDarkMode());
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    act(() => {
      result.current.toggle();
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
