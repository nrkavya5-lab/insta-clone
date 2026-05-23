import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FeedPostComments from "@/components/feed/FeedPostComments";

describe("FeedPostComments", () => {
  it("renders nothing when count is 0 and no preview", () => {
    const { container } = render(<FeedPostComments commentCount={0} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders comment count link", () => {
    render(<FeedPostComments commentCount={5} />);
    expect(screen.getByText("View all 5 comments")).toBeDefined();
  });

  it("renders preview comment", () => {
    render(
      <FeedPostComments
        commentCount={3}
        previewComment={{ username: "johndoe", text: "Great shot!" }}
      />,
    );
    expect(screen.getByText("johndoe")).toBeDefined();
    expect(screen.getByText("Great shot!")).toBeDefined();
  });

  it("renders both count and preview", () => {
    render(
      <FeedPostComments
        commentCount={1}
        previewComment={{ username: "alice", text: "Nice!" }}
      />,
    );
    expect(screen.getByText("View all 1 comments")).toBeDefined();
    expect(screen.getByText("alice")).toBeDefined();
    expect(screen.getByText("Nice!")).toBeDefined();
  });
});
