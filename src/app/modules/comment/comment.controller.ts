import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { CommentService } from "./comment.service";

const createComment = catchAsync(async (req: any, res: Response) => {
  const result = await CommentService.createComment(req.user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment created successfully",
    data: result,
  });
});

const getCommentsByPost = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentService.getCommentsByPost(req.params.postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comments retrieved successfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req: any, res: Response) => {
  const result = await CommentService.updateComment(
    req.user.id,
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment updated successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req: any, res: Response) => {
  await CommentService.deleteComment(req.user.id, req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment deleted successfully",
    data: null,
  });
});

export const CommentController = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};
