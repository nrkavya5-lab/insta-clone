import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "@/store/themeStore";
import { act, renderHook } from "@testing-library/react";

describe("themeStore", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "system" });
  });

  it("starts with system theme", () => {
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.theme).toBe("system");
  });

  it("sets theme to dark", () => {
    const { result } = renderHook(() => useThemeStore());
    act(() => result.current.setTheme("dark"));
    expect(result.current.theme).toBe("dark");
  });

  it("sets theme to light", () => {
    const { result } = renderHook(() => useThemeStore());
    act(() => result.current.setTheme("light"));
    expect(result.current.theme).toBe("light");
  });

  it("sets theme back to system", () => {
    const { result } = renderHook(() => useThemeStore());
    act(() => result.current.setTheme("dark"));
    act(() => result.current.setTheme("system"));
    expect(result.current.theme).toBe("system");
  });
});
