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

const getAllPosts = async () => {
  return prisma.post.findMany({
    include: {
      author: true,
      _count: {
        select: { comments: true, likes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const PostService = {
  createPost,
  getAllPosts,
};
