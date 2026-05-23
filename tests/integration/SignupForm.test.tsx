import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "@/components/auth/SignupForm";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));

const mockSignIn = vi.fn();
vi.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("SignupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all fields and submit button", () => {
    render(<SignupForm />);
    expect(screen.getByPlaceholderText("Email")).toBeDefined();
    expect(screen.getByPlaceholderText("Username")).toBeDefined();
    expect(screen.getByPlaceholderText("Full Name")).toBeDefined();
    expect(screen.getByPlaceholderText("Password")).toBeDefined();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeDefined();
  });

  it("shows error when registration fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Email already taken" }),
    });

    render(<SignupForm />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "taken@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "takenuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByText("Email already taken")).toBeDefined();
    });
  });

  it("redirects to feed on successful signup", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: { id: "1" } }),
    });
    mockSignIn.mockResolvedValueOnce({});

    render(<SignupForm />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "new@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "New User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "new@test.com",
          username: "newuser",
          name: "New User",
          password: "123456",
        }),
      });
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  it("shows loading state while submitting", async () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));

    render(<SignupForm />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "user" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Creating account/ }),
      ).toBeDefined();
    });
  });
});
