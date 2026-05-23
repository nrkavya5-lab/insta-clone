import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FeedPost from "@/components/feed/FeedPost";

const baseProps = {
  id: "1",
  username: "janedoe",
  avatarUrl: "/avatar.jpg",
  location: "Paris",
  mediaUrls: ["/image1.jpg"],
  caption: "Beautiful day!",
  likeCount: 42,
  commentCount: 3,
  liked: false,
  createdAt: new Date().toISOString(),
};

describe("FeedPost", () => {
  it("renders username in header and caption", () => {
    render(<FeedPost {...baseProps} />);
    const elements = screen.getAllByText("janedoe");
    expect(elements.length).toBe(2);
  });

  it("renders caption text", () => {
    render(<FeedPost {...baseProps} />);
    expect(screen.getByText("Beautiful day!")).toBeDefined();
  });

  it("renders location when provided", () => {
    render(<FeedPost {...baseProps} />);
    expect(screen.getByText("Paris")).toBeDefined();
  });

  it("renders comment preview", () => {
    render(<FeedPost {...baseProps} />);
    expect(screen.getByText("View all 3 comments")).toBeDefined();
  });

  it("renders like button with correct label", () => {
    render(<FeedPost {...baseProps} liked={false} />);
    expect(screen.getByLabelText("Like")).toBeDefined();
  });

  it("renders unlike button when liked", () => {
    render(<FeedPost {...baseProps} liked={true} />);
    expect(screen.getByLabelText("Unlike")).toBeDefined();
  });

  it("renders date", () => {
    render(<FeedPost {...baseProps} />);
    const article = screen.getByRole("article");
    expect(article.querySelector("time")).toBeDefined();
  });
});
