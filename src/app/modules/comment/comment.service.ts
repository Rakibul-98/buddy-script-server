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

const getCommentsByPost = async (postId: string) => {
  return prisma.comment.findMany({
    where: {
      postId,
      parentId: null,
    },
    include: {
      author: true,
      likes: {
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
      replies: {
        include: {
          author: true,
          likes: {
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true },
              },
            },
          },
          _count: { select: { likes: true } },
          replies: true,
        },
      },
      _count: {
        select: { likes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateComment = async (userId: string, id: string, payload: any) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  }

  if (comment.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not allowed");
  }

  return prisma.comment.update({
    where: { id },
    data: {
      content: payload.content,
    },
  });
};

const deleteComment = async (userId: string, id: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  }

  if (comment.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not allowed");
  }

  await prisma.comment.delete({
    where: { id },
  });

  return null;
};

export const CommentService = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};
