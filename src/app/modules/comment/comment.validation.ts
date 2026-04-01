import { z } from "zod";

export const createCommentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1, "Content is required"),
  parentId: z.string().optional(), // for replies
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, "Content is required"),
});
