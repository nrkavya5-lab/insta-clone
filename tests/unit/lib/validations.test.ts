import { describe, it, expect } from "vitest";
import { loginSchema, signupSchema, postSchema } from "@/lib/validations";

describe("loginSchema", () => {
  it("accepts valid input", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty email", () => {
    const result = loginSchema.safeParse({ email: "", password: "123456" });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  it("accepts valid input", () => {
    const result = signupSchema.safeParse({
      email: "test@example.com",
      username: "testuser",
      name: "Test User",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short username", () => {
    const result = signupSchema.safeParse({
      email: "test@example.com",
      username: "ab",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("rejects username with special characters", () => {
    const result = signupSchema.safeParse({
      email: "test@example.com",
      username: "user name!",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("accepts username with underscore", () => {
    const result = signupSchema.safeParse({
      email: "test@example.com",
      username: "test_user",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("name is optional", () => {
    const result = signupSchema.safeParse({
      email: "test@example.com",
      username: "testuser",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });
});

describe("postSchema", () => {
  it("accepts valid input", () => {
    const result = postSchema.safeParse({
      caption: "Nice photo!",
      mediaUrls: ["https://example.com/image.jpg"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty mediaUrls", () => {
    const result = postSchema.safeParse({ caption: "", mediaUrls: [] });
    expect(result.success).toBe(false);
  });

  it("rejects too many media (more than 10)", () => {
    const result = postSchema.safeParse({
      caption: "",
      mediaUrls: Array(11).fill("https://example.com/image.jpg"),
    });
    expect(result.success).toBe(false);
  });

  it("rejects caption exceeding 2200 chars", () => {
    const result = postSchema.safeParse({
      caption: "x".repeat(2201),
      mediaUrls: ["https://example.com/image.jpg"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid media URL", () => {
    const result = postSchema.safeParse({
      caption: "",
      mediaUrls: ["not-a-url"],
    });
    expect(result.success).toBe(false);
  });
});
