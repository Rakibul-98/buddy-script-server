import jwt from "jsonwebtoken";
import config from "../config";
import { Response, NextFunction } from "express";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";
import { prisma } from "../shared/prisma";

const auth = () => {
  return async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    try {
      const verifiedUser = jwt.verify(
        token,
        config.jwt_secret as string,
      ) as any;

      // Check if user exists in database
      const user = await prisma.user.findUnique({
        where: { id: verifiedUser.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });

      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
      }

      // Attach user to request object
      req.user = user;

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Token expired");
      }
      throw error;
    }
  };
};

export default auth;
