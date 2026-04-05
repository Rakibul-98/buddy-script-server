import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import uploadToCloudinary from "../../helper/uploadToCloudinary";

const createPost = async (userId: string, payload: any, file: any) => {
  let imageUrl = null;

  if (file) {
    const uploaded: any = await uploadToCloudinary(file);
    imageUrl = uploaded.secure_url;
  }

  const post = await prisma.post.create({
    data: {
      authorId: userId,
      content: payload.content,
      imageUrl,
      visibility: payload.visibility || "PUBLIC",
    },
  });

  return post;
};

const getAllPosts = async (
  currentUserId?: string,
  limit = 3,
  cursor?: string,
) => {
  const whereClause: any = {};

  if (currentUserId) {
    whereClause.OR = [
      { visibility: "PUBLIC" },
      { visibility: "PRIVATE", authorId: currentUserId },
    ];
  } else {
    whereClause.visibility = "PUBLIC";
  }

  const posts = await prisma.post.findMany({
    where: whereClause,
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: { createdAt: "desc" },

    include: {
      author: {
        select: { id: true, email: true, firstName: true, lastName: true },
      },
      likes: {
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });

  let nextCursor = null;

  if (posts.length > limit) {
    const nextItem = posts.pop();
    nextCursor = nextItem?.id;
  }

  return {
    data: posts,
    nextCursor,
  };
};

const getSinglePost = async (id: string, currentUserId?: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true },
      },
      comments: {
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true },
          },
          likes: {
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true },
              },
            },
          },
          _count: { select: { likes: true } },
        },
      },
      likes: {
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  const isAuthor = currentUserId === post.authorId;
  const isPublic = post.visibility === "PUBLIC";

  if (!isPublic && !isAuthor) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You don't have permission to view this post",
    );
  }

  return post;
};

const updatePost = async (userId: string, id: string, payload: any) => {
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  console.log("Post authorId:", post.authorId);
  console.log("Request userId:", userId);

  if (post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not allowed");
  }

  return prisma.post.update({
    where: { id },
    data: payload,
  });
};

const deletePost = async (userId: string, id: string) => {
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  if (post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not allowed");
  }

  await prisma.post.delete({ where: { id } });

  return null;
};

export const PostService = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
};
