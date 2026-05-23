import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/components/auth/LoginForm";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: vi.fn() }),
}));

const mockSignIn = vi.fn();
vi.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

describe("LoginForm", () => {
  it("renders email and password inputs", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText("Email or username")).toBeDefined();
    expect(screen.getByPlaceholderText("Password")).toBeDefined();
    expect(screen.getByRole("button", { name: "Log In" })).toBeDefined();
  });

  it("shows error on failed login", async () => {
    mockSignIn.mockResolvedValue({ error: "Invalid credentials" });
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Email or username"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeDefined();
    });
  });

  it("redirects to feed on success", async () => {
    mockSignIn.mockResolvedValue({ error: null });
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Email or username"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "correct" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/feed");
    });
  });

  it("calls signIn with credentials", async () => {
    mockSignIn.mockResolvedValue({ error: null });
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Email or username"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "user@test.com",
        password: "secret123",
        redirect: false,
      });
    });
  });
});
