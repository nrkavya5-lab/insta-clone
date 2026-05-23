import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { createElement, FunctionComponent } from "react";

describe("useInfiniteScroll", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls onLoadMore when sentinel intersects", () => {
    const onLoadMore = vi.fn();
    let observerCallback: (
      entries: IntersectionObserverEntry[],
      _observer?: IntersectionObserver,
    ) => void = () => {};

    class MockObserver {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        observerCallback = callback;
      }
      observe = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal("IntersectionObserver", MockObserver);

    const TestComp: FunctionComponent = () => {
      const { sentinelRef } = useInfiniteScroll({
        onLoadMore,
        hasNextPage: true,
        isFetchingNextPage: false,
      });
      return createElement("div", { ref: sentinelRef });
    };

    render(createElement(TestComp));
    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      null!,
    );
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("does not call onLoadMore when hasNextPage is false", () => {
    const onLoadMore = vi.fn();
    let observerCallback: (
      entries: IntersectionObserverEntry[],
      _observer?: IntersectionObserver,
    ) => void = () => {};

    class MockObserver {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        observerCallback = callback;
      }
      observe = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal("IntersectionObserver", MockObserver);

    const TestComp: FunctionComponent = () => {
      const { sentinelRef } = useInfiniteScroll({
        onLoadMore,
        hasNextPage: false,
        isFetchingNextPage: false,
      });
      return createElement("div", { ref: sentinelRef });
    };

    render(createElement(TestComp));
    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      null!,
    );
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("does not call onLoadMore when isFetchingNextPage is true", () => {
    const onLoadMore = vi.fn();
    let observerCallback: (
      entries: IntersectionObserverEntry[],
      _observer?: IntersectionObserver,
    ) => void = () => {};

    class MockObserver {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        observerCallback = callback;
      }
      observe = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal("IntersectionObserver", MockObserver);

    const TestComp: FunctionComponent = () => {
      const { sentinelRef } = useInfiniteScroll({
        onLoadMore,
        hasNextPage: true,
        isFetchingNextPage: true,
      });
      return createElement("div", { ref: sentinelRef });
    };

    render(createElement(TestComp));
    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      null!,
    );
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("disconnects observer on unmount", () => {
    const onLoadMore = vi.fn();
    const disconnect = vi.fn();

    class MockObserver {
      observe = vi.fn();
      disconnect = disconnect;
    }

    vi.stubGlobal("IntersectionObserver", MockObserver);

    const TestComp: FunctionComponent = () => {
      const { sentinelRef } = useInfiniteScroll({
        onLoadMore,
        hasNextPage: true,
        isFetchingNextPage: false,
      });
      return createElement("div", { ref: sentinelRef });
    };

    const { unmount } = render(createElement(TestComp));
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
