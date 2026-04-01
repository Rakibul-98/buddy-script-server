import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { LikeService } from "./like.service";

const toggleLike = catchAsync(async (req: any, res: Response) => {
  const result = await LikeService.toggleLike(req.user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

export const LikeController = {
  toggleLike,
};
