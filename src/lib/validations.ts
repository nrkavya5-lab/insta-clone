import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  name: z.string().max(50, "Name must be at most 50 characters").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const postSchema = z.object({
  caption: z.string().max(2200, "Caption must be at most 2200 characters"),
  location: z.string().max(100).optional(),
  mediaUrls: z
    .array(z.string().url())
    .min(1, "At least one media is required")
    .max(10),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type PostInput = z.infer<typeof postSchema>;
