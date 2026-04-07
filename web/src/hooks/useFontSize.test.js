import { renderHook, act } from "@testing-library/react";
import { useFontSize } from "./useFontSize";

beforeEach(() => {
  localStorage.clear();
});

describe("useFontSize", () => {
  it("defaults to 1 when no localStorage", () => {
    const { result } = renderHook(() => useFontSize());
    expect(result.current.fontSize).toBe(1);
  });

  it('reads saved "0" from localStorage', () => {
    localStorage.setItem("evangent-font-size", "0");
    const { result } = renderHook(() => useFontSize());
    expect(result.current.fontSize).toBe(0);
  });

  it("changeFontSize(1) increments from 1 to 2", () => {
    const { result } = renderHook(() => useFontSize());
    act(() => {
      result.current.changeFontSize(1);
    });
    expect(result.current.fontSize).toBe(2);
  });

  it("changeFontSize(-1) decrements from 1 to 0", () => {
    const { result } = renderHook(() => useFontSize());
    act(() => {
      result.current.changeFontSize(-1);
    });
    expect(result.current.fontSize).toBe(0);
  });

  it("clamps at 0 floor", () => {
    localStorage.setItem("evangent-font-size", "0");
    const { result } = renderHook(() => useFontSize());
    act(() => {
      result.current.changeFontSize(-1);
    });
    expect(result.current.fontSize).toBe(0);
  });

  it("clamps at 2 ceiling", () => {
    localStorage.setItem("evangent-font-size", "2");
    const { result } = renderHook(() => useFontSize());
    act(() => {
      result.current.changeFontSize(1);
    });
    expect(result.current.fontSize).toBe(2);
  });

  it("persists to localStorage after change", () => {
    const { result } = renderHook(() => useFontSize());
    act(() => {
      result.current.changeFontSize(1);
    });
    expect(localStorage.getItem("evangent-font-size")).toBe("2");
  });
});
