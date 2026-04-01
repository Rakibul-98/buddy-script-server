import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";

const toggleLike = async (userId: string, payload: any) => {
  const { targetId, targetType } = payload;

  let postId: string | null = null;
  let commentId: string | null = null;

  if (targetType === "POST") {
    const post = await prisma.post.findUnique({
      where: { id: targetId },
    });
    if (!post) throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
    postId = targetId;
  } else if (targetType === "COMMENT") {
    const comment = await prisma.comment.findUnique({
      where: { id: targetId },
    });
    if (!comment) throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
    commentId = targetId;
  }

  const existingLike = await prisma.like.findFirst({
    where: {
      userId,
      postId,
      commentId,
      targetType,
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
    return { liked: false, message: "Unliked successfully" };
  }

  const like = await prisma.like.create({
    data: {
      userId,
      postId,
      commentId,
      targetType,
    },
  });

  return {
    liked: true,
    message: "Liked successfully",
    data: like,
  };
};

export const LikeService = {
  toggleLike,
};
