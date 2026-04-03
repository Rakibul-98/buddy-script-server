// helpers/googleAuth.ts or wherever your verifyGoogleToken is located

import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface GoogleUserInfo {
  email: string;
  given_name: string;
  family_name: string;
}

export const verifyGoogleToken = async (
  token: string,
): Promise<GoogleUserInfo> => {
  // Try as id_token first (for original GoogleLogin component)
  try {
    const ticket = await client.verifyIdToken({
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
  } catch (error) {
    // If id_token verification fails, try as access_token (for custom button)
    console.log("Attempting to verify as access_token...");

    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.statusText}`);
      }

      const userInfo = await response.json();

      if (!userInfo.email) {
        throw new Error("No email found in access_token response");
      }

      return {
        email: userInfo.email,
        given_name: userInfo.given_name || "",
        family_name: userInfo.family_name || "",
      };
    } catch (accessTokenError) {
      console.error(
        "Both token verification methods failed:",
        accessTokenError,
      );
      throw new Error("Invalid Google token. Please try again.");
    }
  }
};
