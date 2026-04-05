"use strict";
// helpers/googleAuth.ts or wherever your verifyGoogleToken is located
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
exports.verifyGoogleToken = void 0;
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const verifyGoogleToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Try as id_token first (for original GoogleLogin component)
    try {
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new Error("Invalid token payload");
        }
        return {
            email: payload.email,
            given_name: payload.given_name || "",
            family_name: payload.family_name || "",
        };
    }
    catch (error) {
        // If id_token verification fails, try as access_token (for custom button)
        console.log("Attempting to verify as access_token...");
        try {
            const response = yield fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to get user info: ${response.statusText}`);
            }
            const userInfo = yield response.json();
            if (!userInfo.email) {
                throw new Error("No email found in access_token response");
            }
            return {
                email: userInfo.email,
                given_name: userInfo.given_name || "",
                family_name: userInfo.family_name || "",
            };
        }
        catch (accessTokenError) {
            console.error("Both token verification methods failed:", accessTokenError);
            throw new Error("Invalid Google token. Please try again.");
        }
    }
});
exports.verifyGoogleToken = verifyGoogleToken;
