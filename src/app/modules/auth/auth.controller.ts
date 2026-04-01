import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import { verifyGoogleToken } from "../../helper/google";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Registration successful.",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;

  const googleUser = await verifyGoogleToken(token);
  const result = await AuthService.googleLoginUser(googleUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Google login successful",
    data: result,
  });
});

export const AuthController = {
  register,
  login,
  googleLogin,
};
