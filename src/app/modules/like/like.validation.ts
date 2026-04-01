import { z } from "zod";

export const toggleLikeSchema = z.object({
  targetId: z.string().min(1),
  targetType: z.enum(["POST", "COMMENT"]),
});
