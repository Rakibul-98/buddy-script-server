import express from "express";
import { AuthController } from "./auth.controller";
import { registerSchema, loginSchema, googleSchema } from "./auth.validation";
import validate from "../../middlewares/validate";

const router = express.Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/google", validate(googleSchema), AuthController.googleLogin);

export const AuthRoutes = router;
