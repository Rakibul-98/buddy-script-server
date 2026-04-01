import express from "express";
import { LikeController } from "./like.controller";
import validate from "../../middlewares/validate";
import auth from "../../middlewares/auth";
import { toggleLikeSchema } from "./like.validation";

const router = express.Router();

router.post(
  "/toggle",
  auth(),
  validate(toggleLikeSchema),
  LikeController.toggleLike,
);

export const LikeRoutes = router;
