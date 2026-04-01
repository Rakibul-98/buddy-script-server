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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const google_1 = require("../../helper/google");
exports.AuthController = {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield auth_service_1.AuthService.register(req.body);
            res.json(result);
        });
    },
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield auth_service_1.AuthService.login(req.body);
            res.json(result);
        });
    },
    googleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.body;
            const googleUser = yield (0, google_1.verifyGoogleToken)(token);
            const result = yield auth_service_1.AuthService.googleLogin(googleUser);
            res.json(result);
        });
    },
};
