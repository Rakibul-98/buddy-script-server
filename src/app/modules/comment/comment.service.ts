import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";

const createComment = async (userId: string, payload: any) => {
  const { postId, content, parentId } = payload;

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  if (parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parent) {
      throw new ApiError(httpStatus.NOT_FOUND, "Parent comment not found");
    }
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      content,
      parentId: parentId || null,
      authorId: userId,
    },
  });

  return comment;
};

export const CommentService = {
  createComment,
};
