import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PostService } from "./post.service";

const createPost = catchAsync(async (req: any, res: Response) => {
  const result = await PostService.createPost(req.user.id, req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Post created successfully",
    data: result,
  });
});

const getAllPosts = catchAsync(async (_req: Request, res: Response) => {
  const result = await PostService.getAllPosts();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts retrieved successfully",
    data: result,
  });
});

export const PostController = {
  createPost,
  getAllPosts,
};
