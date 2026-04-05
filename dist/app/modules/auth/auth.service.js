"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = require("../../shared/prisma");
const config_1 = __importDefault(require("../../config"));
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, config_1.default.jwt_secret, {
        expiresIn: config_1.default.jwt_expires_in,
    });
};
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password } = payload;
    const existingUser = yield prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User already exists");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield prisma_1.prisma.user.create({
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
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Invalid credentials");
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(password, user.passwordHash);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials");
    }
    const token = generateToken(user.id);
    return {
        user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        token,
    };
});
const googleLoginUser = (googleUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, given_name, family_name } = googleUser;
    let user = yield prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        user = yield prisma_1.prisma.user.create({
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
            firstName: given_name,
            lastName: family_name,
        },
        token,
    };
});
exports.AuthService = {
    registerUser,
    loginUser,
    googleLoginUser,
};
