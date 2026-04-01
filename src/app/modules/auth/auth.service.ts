import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt, { SignOptions } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import config from "../../config";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, config.jwt_secret, {
    expiresIn: config.jwt_expires_in as SignOptions["expiresIn"],
  });
};

const registerUser = async (payload: any) => {
  const { firstName, lastName, email, password } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash: hashedPassword,
    },
  });

  const token = generateToken(user.id);

  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
};

const loginUser = async (payload: any) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid credentials");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const token = generateToken(user.id);

  return {
    user: {
      email: user.email,
    },
    token,
  };
};

const googleLoginUser = async (googleUser: any) => {
  const { email, given_name, family_name } = googleUser;

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        firstName: given_name,
        lastName: family_name,
        passwordHash: "",
      },
    });
  }

  const token = generateToken(user.id);

  return {
    user: {
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
  googleLoginUser,
};
