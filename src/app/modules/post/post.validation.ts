import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().min(1, "Content is required"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});

export const updatePostSchema = z.object({
  content: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});
