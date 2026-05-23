import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import SearchPageContent from "@/app/(main)/search/SearchPageContent";

const mockApiFetch = vi.fn();
vi.mock("@/lib/api-client", () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("SearchPageContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders search input and tabs", () => {
    render(<SearchPageContent />);
    expect(screen.getByPlaceholderText("Search")).toBeDefined();
    expect(screen.getByText("All")).toBeDefined();
    expect(screen.getByText("Users")).toBeDefined();
    expect(screen.getByText("Hashtags")).toBeDefined();
  });

  it("shows no results message when search returns empty", async () => {
    mockApiFetch.mockResolvedValueOnce({ users: [], hashtags: [] });

    render(<SearchPageContent />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Search"), {
        target: { value: "unknown" },
      });
      await new Promise((r) => setTimeout(r, 350));
    });

    await waitFor(
      () => {
        expect(screen.getByText(/No results for/)).toBeDefined();
      },
      { timeout: 2000 },
    );
  });

  it("renders user results", async () => {
    mockApiFetch.mockResolvedValueOnce({
      users: [
        {
          id: "1",
          username: "johndoe",
          name: "John",
          avatarUrl: null,
          isPrivate: false,
          isVerified: false,
          relation: "none",
        },
      ],
      hashtags: [],
    });

    render(<SearchPageContent />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Search"), {
        target: { value: "john" },
      });
      await new Promise((r) => setTimeout(r, 350));
    });

    await waitFor(
      () => {
        expect(screen.getByText("johndoe")).toBeDefined();
      },
      { timeout: 2000 },
    );
  });

  it("renders hashtag results", async () => {
    mockApiFetch.mockResolvedValueOnce({
      users: [],
      hashtags: [{ id: "1", name: "nature", postCount: 150 }],
    });

    render(<SearchPageContent />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Search"), {
        target: { value: "nature" },
      });
      await new Promise((r) => setTimeout(r, 350));
    });

    await waitFor(
      () => {
        expect(screen.getByText("#nature")).toBeDefined();
        expect(screen.getByText("150 posts")).toBeDefined();
      },
      { timeout: 2000 },
    );
  });

  it("persists recent searches", async () => {
    mockApiFetch.mockResolvedValueOnce({ users: [], hashtags: [] });

    render(<SearchPageContent />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Search"), {
        target: { value: "recentsearch" },
      });
      await new Promise((r) => setTimeout(r, 350));
    });

    await waitFor(
      () => {
        expect(
          JSON.parse(localStorage.getItem("recent-searches") ?? "[]"),
        ).toContain("recentsearch");
      },
      { timeout: 2000 },
    );
  });
});
