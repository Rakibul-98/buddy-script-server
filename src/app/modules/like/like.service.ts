import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";

const toggleLike = async (userId: string, payload: any) => {
  const { targetId, targetType } = payload;

  if (targetType === "POST") {
    const post = await prisma.post.findUnique({
      where: { id: targetId },
    });

    if (!post) {
      throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
    }
  }

  if (targetType === "COMMENT") {
    const comment = await prisma.comment.findUnique({
      where: { id: targetId },
    });

    if (!comment) {
      throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
    }
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_targetId_targetType: {
        userId,
        targetId,
        targetType,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });

    return {
      liked: false,
      message: "Unliked successfully",
    };
  }

  const like = await prisma.like.create({
    data: {
      userId,
      targetId,
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
