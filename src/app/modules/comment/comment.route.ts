import express from "express";
import { CommentController } from "./comment.controller";
import validate from "../../middlewares/validate";
import auth from "../../middlewares/auth";
import { createCommentSchema } from "./comment.validation";

const router = express.Router();

router.post(
  "/",
  auth(),
  validate(createCommentSchema),
  CommentController.createComment,
);

export const CommentRoutes = router;
