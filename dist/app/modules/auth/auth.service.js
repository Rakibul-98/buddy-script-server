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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../shared/prisma");
const config_1 = __importDefault(require("../../config"));
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, config_1.default.jwt_secret, {
        expiresIn: config_1.default.jwt_expires_in,
    });
};
exports.AuthService = {
    register(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password } = payload;
            const existing = yield prisma_1.prisma.user.findUnique({ where: { email } });
            if (existing)
                throw new Error("User already exists");
            const hash = yield bcrypt_1.default.hash(password, 10);
            const user = yield prisma_1.prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    passwordHash: hash,
                },
            });
            const token = generateToken(user.id);
            return { user, token };
        });
    },
    login(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
            if (!user)
                throw new Error("Invalid credentials");
            const isMatch = yield bcrypt_1.default.compare(password, user.passwordHash);
            if (!isMatch)
                throw new Error("Invalid credentials");
            const token = generateToken(user.id);
            return { user, token };
        });
    },
    googleLogin(googleUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, given_name, family_name } = googleUser;
            let user = yield prisma_1.prisma.user.findUnique({ where: { email } });
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
            return { user, token };
        });
    },
};
