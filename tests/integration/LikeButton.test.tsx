import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LikeButton from "@/components/feed/LikeButton";

describe("LikeButton", () => {
  it("renders with initial liked state", () => {
    render(<LikeButton initialLiked={true} initialCount={5} />);
    expect(screen.getByLabelText("Unlike")).toBeDefined();
  });

  it("renders with initial unliked state", () => {
    render(<LikeButton initialLiked={false} initialCount={3} />);
    expect(screen.getByLabelText("Like")).toBeDefined();
  });

  it("toggles to liked on click", () => {
    const onLike = vi.fn();
    render(<LikeButton initialLiked={false} onLike={onLike} />);
    fireEvent.click(screen.getByLabelText("Like"));
    expect(screen.getByLabelText("Unlike")).toBeDefined();
    expect(onLike).toHaveBeenCalledTimes(1);
  });

  it("toggles to unliked on click", () => {
    const onUnlike = vi.fn();
    render(<LikeButton initialLiked={true} onUnlike={onUnlike} />);
    fireEvent.click(screen.getByLabelText("Unlike"));
    expect(screen.getByLabelText("Like")).toBeDefined();
    expect(onUnlike).toHaveBeenCalledTimes(1);
  });

  it("calls onLike when liking", () => {
    const onLike = vi.fn();
    render(<LikeButton initialLiked={false} onLike={onLike} />);
    fireEvent.click(screen.getByLabelText("Like"));
    expect(onLike).toHaveBeenCalled();
  });

  it("calls onUnlike when unliking", () => {
    const onUnlike = vi.fn();
    render(<LikeButton initialLiked={true} onUnlike={onUnlike} />);
    fireEvent.click(screen.getByLabelText("Unlike"));
    expect(onUnlike).toHaveBeenCalled();
  });
});
