import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FollowButton from "@/components/profile/FollowButton";

const mockApiFetch = vi.fn();
vi.mock("@/lib/api-client", () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

describe("FollowButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing for self", () => {
    const { container } = render(
      <FollowButton userId="1" initialStatus="self" />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders Follow button for none status", () => {
    render(<FollowButton userId="2" initialStatus="none" />);
    expect(screen.getByRole("button", { name: "Follow" })).toBeDefined();
  });

  it("renders Following button for following status", () => {
    render(<FollowButton userId="2" initialStatus="following" />);
    expect(screen.getByRole("button", { name: "Following" })).toBeDefined();
  });

  it("renders Requested button for pending status", () => {
    render(<FollowButton userId="2" initialStatus="pending" />);
    expect(screen.getByRole("button", { name: "Requested" })).toBeDefined();
  });

  it("calls follow API and updates to following", async () => {
    mockApiFetch.mockResolvedValueOnce({ status: "following" });
    const onStatusChange = vi.fn();

    render(
      <FollowButton
        userId="2"
        initialStatus="none"
        onStatusChange={onStatusChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Follow" }));

    await waitFor(() => {
      expect(mockApiFetch).toHaveBeenCalledWith("/users/2/follow", {
        method: "POST",
      });
      expect(screen.getByRole("button", { name: "Following" })).toBeDefined();
      expect(onStatusChange).toHaveBeenCalledWith("following");
    });
  });

  it("calls follow API and updates to pending for private accounts", async () => {
    mockApiFetch.mockResolvedValueOnce({ status: "pending" });
    const onStatusChange = vi.fn();

    render(
      <FollowButton
        userId="2"
        initialStatus="none"
        onStatusChange={onStatusChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Follow" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Requested" })).toBeDefined();
      expect(onStatusChange).toHaveBeenCalledWith("pending");
    });
  });

  it("calls unfollow API and updates to none", async () => {
    mockApiFetch.mockResolvedValueOnce({});
    const onStatusChange = vi.fn();

    render(
      <FollowButton
        userId="2"
        initialStatus="following"
        onStatusChange={onStatusChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Following" }));

    await waitFor(() => {
      expect(mockApiFetch).toHaveBeenCalledWith("/users/2/unfollow", {
        method: "DELETE",
      });
      expect(screen.getByRole("button", { name: "Follow" })).toBeDefined();
      expect(onStatusChange).toHaveBeenCalledWith("none");
    });
  });

  it("cancels pending request", async () => {
    mockApiFetch.mockResolvedValueOnce({});
    const onStatusChange = vi.fn();

    render(
      <FollowButton
        userId="2"
        initialStatus="pending"
        onStatusChange={onStatusChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Requested" }));

    await waitFor(() => {
      expect(mockApiFetch).toHaveBeenCalledWith("/users/2/unfollow", {
        method: "DELETE",
      });
      expect(screen.getByRole("button", { name: "Follow" })).toBeDefined();
      expect(onStatusChange).toHaveBeenCalledWith("none");
    });
  });

  it("reverts on API error", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Network error"));
    const onStatusChange = vi.fn();

    render(
      <FollowButton
        userId="2"
        initialStatus="none"
        onStatusChange={onStatusChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Follow" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Follow" })).toBeDefined();
      expect(onStatusChange).not.toHaveBeenCalled();
    });
  });
});
